import { c } from "~/helpers/Configuration";

export default c({
  background: new THREE.Color(0xf2f3ee),
  light: {
    primary: {
      position: new THREE.Vector3(5, 5, 5),
      intensity: 1.3,
      color: new THREE.Color(0xf8cb5f)
    },
    secondary: {
      position: new THREE.Vector3(-5, -5, -5),
      intensity: 1,
      color: new THREE.Color(0xffffff)
    }
  },
  postprocess: {
    bloom: {
      max: 6,
      min: 0.1,
      diff: 5.7
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

});
