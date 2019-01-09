import {Color, Vector3} from "three";

export default {
  background: new Color(0xf2f3ee),
  camera: {
    position: new Vector3(0, 0, 5),
    lookAt: new Vector3()
  },

  transitions: {
    all: {
      duration: 2000,
      position: {
        from: new Vector3(0, 0, 50),
        to: new Vector3(0, 0, 8)
      },
      target: {
        from: new Vector3(0, 0, 0),
        to: new Vector3(0, 0, 0)
      },
      postprocess: {
        duration: 1000,
        bloom: {
          min: 0.1,
          max: 10
        }
      }
    }
  }
};
