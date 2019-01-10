import c from "~/helpers/Configuration";
import {merge} from "lodash"

var a = {
  a: {
    a: 1,
    b: 2
  },
  b: 3
};
merge(a, {
    a: {
      b: 1,
      c: 5
    },
    b: 3
  }
)

console.log(a);

export default {

}
