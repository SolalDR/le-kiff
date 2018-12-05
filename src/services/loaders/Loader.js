import Event from "./../../helpers/Event"

class Loader extends Event {

  /**
   * @constructor
   * @param {[{test: RegExp, loader: Object}]} rules 
   */
  constructor({
    rules = []
  } = {}){
    super();
    
    this.pendingFiles = [];
    this.loadedFiles = [];
    this.groups = [];

    this.rules = rules;
  }

  /**
   * Test if a group is loaded
   * @param {string|null} group 
   */
  isLoaded( group = null ) {

    if( group === null && this.pendingFiles.length > 0 ){
      return false;
    }

    var isLoaded = true; 
    if( group !== null ){
      this.pendingFiles.forEach(file => {
        if( file.groups.indexOf(group) >= 0 ){
          isLoaded = false;
        }
      })
    }
  
    return isLoaded; 
  }
  
  /**
   * Return the list of loaded file in a specific group
   * @param {string|null} group 
   */
  getFiles( group = null ) {
    var results = {};
    this.loadedFiles.forEach(file => {
      if( (group === null || file.groups.indexOf(group) >= 0) ){
        results[file.name] = file;
      }
    })
    return results;
  }
  
  
  /**
   * General onLoad callback
   * @private
   */
  onLoad(file, result){

    this.loadedFiles.push({
      name: file.name, 
      path: file.path, 
      result: result, 
      groups: file.groups
    });

    this.pendingFiles.splice(this.pendingFiles.indexOf(file), 1);

    file.groups.forEach(group => {
      if( this.isLoaded(group) ){
        this.dispatch("load:" + group, this.getFiles(group));
      }
    })

    if( this.isLoaded() ){
      this.dispatch("load", this.getFiles());
    }
  }

  /**
   * General onProgress callback
   * @private
   */
  onProgress(){
    var loaded = 0;
    var total = 0;
    this.pendingFiles.forEach(file => {
      if( file.loaded && file.total ){
        loaded += file.loaded;
        total += file.total;
      }
    });
    
    this.dispatch("progress", {
      loaded,
      total,
      progress: loaded/total
    });
  }


  /**
   * Load a file
   * @param {{name: string, path: string}|string}
   * @param {[string]} inheritanceGroup The list of group which scope the current group
   */
  addFile(file, inheritanceGroup = []){
    const finalFile = file.name ? file : { name: file, path: file };
    
    var finalPath = "";
    inheritanceGroup.forEach( group => finalPath += (group.base) ? group.base : "");
    finalPath += finalFile.path;

    const groups = inheritanceGroup.map((group)=>{
      return group.name;
    });

    this.pendingFiles.push({
      name: finalFile.name,
      path: finalPath,
      groups: groups, 
      status: Loader.PENDING,
      loading: {
        progress: 0, 
        total: null,
        loaded: 0
      }
    })
  }

  /**  
   * Load a group
   * @param {{name: string, base: string, files: [], groups: []}} group Represent the group data
   * @param {[group]} inheritanceGroup The list of group which scope the current group
   */
  addGroup({
    name = null,
    base = "",
    files = [],
    groups = []
  } = {}, inheritanceGroup = []){
    
    if( !name ) {
      return null;
    }
    
    files.forEach(file => {
      this.addFile(file, [...inheritanceGroup, arguments[0]])
    });

    groups.forEach(group => {
      this.addGroup(group, [...inheritanceGroup, arguments[0]])
    });
    
    if( this.groups.indexOf(name) < 0 ) {
      this.groups.push(name);
    }

  }

  /**
   * Load a group by his name
   * @param {string} name
   */
  loadGroup(name){
    this.pendingFiles.forEach( file => {
      if( file.groups.indexOf(name) >= 0 ){
        this.loadFile(file);
      }
    })
  }

  /**
   * Load a file
   * @param {{name: string, path: string, group: []}} file
   */
  loadFile(file){
    var loader = null;
    this.rules.some(rule => {
      if(file.path.match(rule.test)){
        loader = rule.loader
        return true;
      }
    })

    if( this.loader === null ) {
      console.warn(`Loader: The type "${file.type}" is not supported`);
      return null;
    }

    loader.load(
      file.path,
      (e) => {
        this.onLoad(file, e);
      },
      (xhr) => {
        file.loaded = xhr.loaded;
        file.total = xhr.total;
        this.onProgress(file);
      },
      (e) => {
        console.log("Loader:", e);
      }
    )
  }
}

Loader.LOADED = 1; 
Loader.PENDING = 2; 
Loader.ERROR = 3;

export default Loader;
