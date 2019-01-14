import microConfig from "./../components/Scale/Micro/config";
import macroConfig from "./../components/Scale/Macro/config";
import humanConfig from "./../components/Scale/Human/config";
import sceneConfig from "~/webgl/rendering/config";

import { c } from "../../helpers/Configuration";

export default c({
  micro: microConfig,
  macro: macroConfig,
  human: humanConfig,
  scene: sceneConfig
});
