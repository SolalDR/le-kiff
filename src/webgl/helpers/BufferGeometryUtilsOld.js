

/**
 * @author SolalDR http://solaldussout-revel.com
 * A little snippet to merge BufferGeometry without replacing the attributes
 */
export default {

  merge: function(geometries) {

    var attributes = {};

    geometries.forEach(geometry => {
      // First remove index
      geometry = geometry.toNonIndexed();

      // For each attribute
      for(var attr in geometry.attributes){

        // Register if not yet
        if( !attributes[attr] ) {
          attributes[attr] = {
            itemSize: geometry.attributes[attr].itemSize,
            array: []
          };
        }

        // Verify item size are the same for each attribute
        if( geometry.attributes[attr].itemSize !== attributes[attr].itemSize){
          console.warn(`THREE.BufferGeometryUtils: itemSize in attribute "${attr}" doesn't match`);
          break;
        }

        // Concat the array attributes
        attributes[attr].array = attributes[attr].array.concat(Array.from(geometry.attributes[attr].array));
      }

    })

    // Create the final geometry
    var geometry = new THREE.BufferGeometry();

    // Create buffer attributes
    for( var attribute in attributes ){
      geometry.addAttribute( attribute, new THREE.BufferAttribute(
        new Float32Array(attributes[attribute].array),
        attributes[attribute].itemSize
      ));
    }

    return geometry;
  }

}
