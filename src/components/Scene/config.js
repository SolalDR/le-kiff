import { Color, Vector3 } from "three";

const config = {
  scene: {
    background: new Color(0xf2f3ee), 
  },

  micro: {
    background: new Color(0xf2f3ee),
    camera: {
      position: new Vector3(0, 0, 5),
      lookAt: new Vector3()
    }
  },

  human: {
    background: new Color(0xf2f3ee),
    camera: {
      position: new Vector3(0, 0, 5),
      lookAt: new Vector3()
    }
  },

  macro: {
    background: new Color(0x111111),
    camera: {
      position: new Vector3(0, 0, 5),
      lookAt: new Vector3()
    }
  }
}

export default config;
