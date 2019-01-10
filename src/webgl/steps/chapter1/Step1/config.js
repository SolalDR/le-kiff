import c from "~/helpers/Configuration";

import {merge, cloneDeep} from "lodash"
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

export default {

}
