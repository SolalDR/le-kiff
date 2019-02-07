import Event from "~/helpers/Event";

import Bus from "../../helpers/Bus";

class MouseCaster extends Event {
  constructor({
    root = null,
    camera = null
  } = {}){
    super();

    this.root = root; 
    this.camera = camera; 
    this.raycaster = new THREE.Raycaster();
    
    this.state = {
      position: new THREE.Vector2(),
      mouseDown: false,
      mouseDrag: false, 
      mouseClick: false,
      needIntersect: false
    }

    this.initEvents();
  }

  /**
   * Get normalized coords
   * @returns {THREE.Vector2}
   */
  get coords(){
    return this.state.position;
  }

  initEvents(){
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  intersect(){
    var intersections = this.raycaster.intersectObjects(this.root.children, true);
    var intersect = intersections.find(intersection => intersection.object.castable ? true : false);
    this.dispatch("cast", intersect);
    return intersect;
  }

  /**
   * Event callback "onmousemove"
   * @private
   * @param {{clientX: number}, {clientY: number}} event 
   */
  onMouseMove(event){
    this.state.position.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.state.position.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if( this.mouseDown ) this.mouseDrag = true;
    this.dispatch("move", this.state.position);
    this.needIntersect = true;
  }

  onMouseDown(event){
    this.mouseDown = true;
    this.needIntersect = true;
  }

  onMouseUp(event){
    if( !this.mouseDrag ) {
      this.mouseClick = true;
    }

    this.mouseDown = false;
    this.mouseDrag = false;
    this.needIntersect = true; 
  }

  render(){
    // if( this.needIntersect ){
    //   var intersect = this.intersect();
    //   if( this.mouseClick ){
    //     this.dispatch("click", intersect);
    //   }
    //   this.mouseClick = false;
    // }
  }

}

export default MouseCaster; 
