import { c } from "~/helpers/Configuration";

export default c({
  background: new THREE.Color(0xf2f3ee), 
  postprocess: {
    bloom: {
      max: 6,
      min: 0.1,
      diff: 5.7
    }
  }
});
