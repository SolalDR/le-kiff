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
  display: {
    endPosition: new Vector3(0, 0, 8),
    startPosition: new Vector3(0, 0, 100),
    startTarget: new Vector3(0, 0, 0),
    endTarget: new Vector3(0, 0, 0),
    duration: 1000,
    durationPostprocess: 500
  },
  postprocess: {
    bloom: {
      min: 0.3,
      max: 2.5,
      diff: 2.2
    }
  }
}

export const humanConfig = {
  background: new Color(0x737373),
  camera: {
    position: new Vector3(0, 0, 5),
    lookAt: new Vector3()
  },
  display: {
    startPosition: new Vector3(0, 10, 10),
    endPosition: new Vector3(0, 0, 8),
    startTarget: new Vector3(0, 10, 0),
    endTarget: new Vector3(0, 0, 0),
    duration: 1000,
    durationPostprocess: 300
  },
  display2: {
    startPosition: new Vector3(0, 0, 8),
    endPosition: new Vector3(0, 0, 5),
    startTarget: new Vector3(0, 0, 0),
    endTarget: new Vector3(0, 0, 0),
    duration: 1000,
    durationPostprocess: 300
  },
  postprocess: {
    bloom: {
      min: 0.3,
      max: 2.5,
      diff: 2.2
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
  display: {
    startPosition: new Vector3(0, 0, 2.1),
    endPosition: new Vector3(0, 0, 8),
    startTarget: new Vector3(0, 0, 0),
    endTarget: new Vector3(0, 0, 0),
    duration: 1000,
    durationPostprocess: 500
  },
  postprocess: {
    bloom: {
      min: 0.3,
      max: 6,
      diff: 5.7
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
