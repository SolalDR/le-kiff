import {Color, Vector3} from "three";

export default {
  background: new Color(0x737373),
  camera: {
    position: new Vector3(0, 0, 5),
    lookAt: new Vector3()
  },

  transitions: {
    micro: {
      duration: 2000,
      position: {
        from: new Vector3(0, 0, 0),
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
          max: 2.5,
          diff: 2.2
        }
      }
    },

    macro: {
      duration: 1000,
      position: {
        from: new Vector3(0, 10, 25),
        to: new Vector3(0, 0, 8)
      },
      target: {
        from: new Vector3(0, 10, 0),
        to: new Vector3(0, 0, 0)
      },
      postprocess: {
        duration: 500,
        bloom: {
          min: 0.1,
          max: 2.5,
          diff: 2.2
        }
      }
    }
  }

}
