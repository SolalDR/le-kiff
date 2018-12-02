import * as THREE from "three";
import Loader from "./Loader";
import PDBLoader from "./loaders/PDBLoader";
import HDRCubeTextureLoader from "./loaders/HDRCubeTextureLoader";
import RGBELoader from "./loaders/RGBELoader";


class AssetsManager {
  
  constructor(){
    this.loader = new Loader({
      rules: [
        {
          test: /\.(?:png|jpg|jpeg)/,
          loader: new THREE.TextureLoader()
        }, 
        {
          test: /\.(?:mp3|wav)/,
          loader: null
        },
        {
          test: /\.(?:pdb)/,
          loader: new PDBLoader()
        }, 
        {
          test: /\..*?/,
          loader: new THREE.FileLoader()
        }
      ]
    });
  }

}

export default new AssetsManager();
