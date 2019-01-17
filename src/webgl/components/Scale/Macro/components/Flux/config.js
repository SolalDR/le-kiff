import {c} from "~/helpers/Configuration";
export default c({
  material: {
    lineWidth: 0.1,
    dashArray: 0.45, 
    dashRatio: 0.15
  },
  dashOffsetSpeed: 0.01,


  rendering: {
    light: {
      primary: {
        position: new THREE.Vector3(5, 5, 5),
        intensity: 3.5,
        color: new THREE.Color("rgb(208, 245, 255)")
      },
      secondary: {
        position: new THREE.Vector3(0, 0, -100),
        intensity: 0,
        color: new THREE.Color(0xffffff)
      }
    },
  
    toneMappingExposure: 1,
  
    bokeh: {
      focus: 500,
      aperture: 0.3*0.00001,
      maxblur: 1
    },
    
    bloom: {
      strength: 0,
      radius: 0, 
      threshold: 0
    }
  }
});
