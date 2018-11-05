import * as dat from 'dat.gui';

const materialDefine = [
    ["clearCoat", 0, 1],
    ["clearCoatRoughness", 0, 1],
    ["aoMapIntensity", 0, 1], 
    ["lightMapIntensity", 0, 1],
    ["refractionRatio", 0, 1], 
    ["displacementScale", 0, 10], 
    ["bumpScale", 0, 1],
    ["emissiveIntensity", 0, 1], 
    ["envMapIntensity", 0, 1], 
    ["metalness", 0, 1],
    ["reflectivity", 0, 1], 
    ["roughness", 0, 1],
    ["shininess", 0, 1],
    ["color", "color"],
    ["specular", "color"],
    ["emissive", "color"]
];

if( !dat.GUI.prototype.addMaterial ) {
    
    /**
     * Add a gui controller to a material. By default, it take all the numeric's & color's attributes that are available
     * @param {string} name
     * @param {THREE.Material} material
     * @returns {GUI} Returns the folder created for the material
     */
    dat.GUI.prototype.addMaterial = function( name, material ) {
        var folder = this.addFolder( name );
        var config = {};
        materialDefine.forEach( parameter => {
            if( !material[parameter[0]] ) return;
            
            if( parameter[1] == "color" ) {
                
                config[parameter[0]] = { 
                    r: material[parameter[0]].r*255,
                    g: material[parameter[0]].g*255,
                    b: material[parameter[0]].b*255 
                }

                folder.addColor( config, parameter[0], parameter[1]).onChange( (e) => {
                    material[parameter[0]].r = e.r/255;
                    material[parameter[0]].g = e.g/255;
                    material[parameter[0]].b = e.b/255;
                    material.needsUpdate = true;
                }) 

            } else {

                folder.add( material, parameter[0], parameter[1], parameter[2]).onChange( () => {
                    material.needsUpdate = true;
                })

            }

        })

        return folder;
    }
}


if( !dat.GUI.prototype.addVector ) {

    /**
     * Add a gui controller to a vector 
     * @param {string} name
     * @param {THREE.Vector|THREE.Euler} vector
     * @param {integer} step 
     * @returns {GUI} Returns the folder created for the vector
     */
    dat.GUI.prototype.addVector = function( name, vector, step = 1 ) {
        var folder = this.addFolder( name );
        
        if( Math.abs(vector.x) >= 0 ) folder.add( vector, "x" ).step( step );
        if( Math.abs(vector.y) >= 0 ) folder.add( vector, "y" ).step( step );
        if( Math.abs(vector.z) >= 0 ) folder.add( vector, "z" ).step( step );
        if( Math.abs(vector.w) >= 0 ) folder.add( vector, "w" ).step( step );
        
        return folder;
    }
}


if( !dat.GUI.prototype.addObject3d ){

    /**
     * Add a gui controller on any object3D to manipulate matrix world
     * @param {string} name 
     * @param {THREE.Object3D} object 
     * @returns {GUI} Returns the folder created for the object3d
     */
    dat.GUI.prototype.addObject3d = function( name, object ){
        var folder = this.addFolder( name );

        folder.addVector( "position", object.position );
        folder.addVector( "rotation", object.rotation, 0.05 );
        folder.addVector( "scale", object.scale, 0.01 );
        
        return folder;
    }
}


