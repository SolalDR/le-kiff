import * as THREE from "three";
import Loader from "./Loader";
import PDBLoader from "./loaders/PDBLoader";
// import HDRCubeTextureLoader from "./loaders/HDRCubeTextureLoader";
import GLTFLoader from "./loaders/GLTFLoader";
import DRACOLoader from "./loaders/DRACOLoader";
import SoundLoader from "./loaders/SoundLoader";
import VideoLoader from "./loaders/VideoLoader";
import OBJLoader from "./loaders/OBJLoader";

class AssetsManager {
  
  constructor(){

    DRACOLoader.setDecoderPath( '/draco' );
    DRACOLoader.setDecoderConfig({type: 'js'}); // (Optional) Override detection of WASM support.
    var dracoLoader = new DRACOLoader();

    var gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader( dracoLoader );

    this.loader = new Loader({
      rules: [
        {
          test: /\.(?:glb|gltf)/,
          loader: gltfLoader
        },
        {
          test: /\.(?:obj)/,
          loader: new OBJLoader()
        },
        {
          test: /\.(?:drc)/,
          loader: dracoLoader
        },
        {
          test: /\.(?:png|jpg|jpeg)/,
          loader: new THREE.TextureLoader()
        }, 
        {
          test: /\.(?:mp3|wav)/,
          loader: new SoundLoader()
        },
        {
          test: /\.(?:mp4)/,
          loader: new VideoLoader()
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
