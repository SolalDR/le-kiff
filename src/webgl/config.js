import { Color, Vector3 } from "three";


export const sceneConfig = {
  background: new Color(0xf2f3ee), 
};

export const microConfig = {
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
          min: 0.3,
          max: 10
        }
      }
    }
  }
}

export const humanConfig = {
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
          min: 0.3,
          max: 2.5,
          diff: 2.2
        }
      }
    },

    macro: {
      duration: 2000,
      position: {
        from: new Vector3(0, 30, 50),
        to: new Vector3(0, 0, 8)
      },
      target: {
        from: new Vector3(0, 25, 0),
        to: new Vector3(0, 0, 0)
      },
      postprocess: {
        duration: 1000,
        bloom: {
          min: 0.3,
          max: 2.5,
          diff: 2.2
        }
      }
    }
  }

}

export const macroConfig = {
  background: new Color(0x111111),
  camera: {
    position: new Vector3(0, 0, 5),
    lookAt: new Vector3()
  },
  earth: {
    globeRadius: 2,
    cloudRadius: 2.02
  },

  transitions: {
    all: {
      duration: 1000,
      position: {
        from: new Vector3(0, 0, 2.1),
        to: new Vector3(0, 0, 8)
      },
      target: {
        from: new Vector3(0, 0, 0),
        to: new Vector3(0, 0, 0)
      },
      postprocess: {
        duration: 500,
        bloom: {
          min: 0.3,
          max: 6,
          diff: 5.7
        }
      }
    }
  } 
}

export const postprocessConfig = {
  bloom: {
    max: 6,
    min: 0.3,
    diff: 5.7
  }
}

export default {
  scene: sceneConfig,
  micro: microConfig,
  human: humanConfig,
  macro: macroConfig,
  postprocess: postprocessConfig
};