import config from "./config";
import ModelAnimationManager from "~/webgl/manager/ModelAnimation";

class Pasta {
  constructor({
    object = null,
    noise = null,
  }){
    this.object = object;
    this.object.name = "step_4_pasta";
    this.object.scene.name = this.object.name + "_scene"
    this.scene = this.object.scene;
    this.noise = noise;
    this.rocks = this.object.scene.children[0].children;
    this.delays = this.rocks.map(_ => Math.random())

    this.positions = this.rocks.map(rock => rock.position.clone());
    this.rotations = this.rocks.map(rock => rock.rotation.clone());

    this.state = {
      animated: true
    }

    this.updateFromConfig(config);
    this.modelAnimation = ModelAnimationManager.generateClips(this.object, this.config.modelAnimation.clips, this.config.modelAnimation.options);
  }

  updateFromConfig(config){
    this.config = config;
    this.scene.position.copy(this.config.position)
    this.scene.scale.copy(this.config.scale)
  }

  set animated(value){
    this.state.animated = value;
  }

  get animated(){
    return this.state.animated;
  }

  set noisePastaIntensity(value){
    this.config.noiseIntensity = value;
  }

  set noiseRocksIntensity(value){
    this.config.rocks.noiseIntensity = value;
  }

  render(time) {
    if( !this.state.animated ){
      for (let i = 0, l = this.rocks.length; i < l; i++) {
        const rock = this.rocks[i];
        const position = this.positions[i];
        const rotation = this.rotations[i];

        rock.position.x = position.x + this.noise.noise2D(position.x, time*0.2)*this.config.rocks.noiseIntensity;
        rock.position.y = position.y + this.noise.noise2D(position.y, time*0.2)*this.config.rocks.noiseIntensity;
        rock.position.z = position.z + this.noise.noise2D(position.z, time*0.2)*this.config.rocks.noiseIntensity;
        rock.rotation.x = rotation.x + this.noise.noise2D(rotation.y, time*0.05)*this.config.rocks.noiseIntensity*0.5;
        rock.rotation.y = rotation.y + this.noise.noise2D(rotation.y, time*0.05)*this.config.rocks.noiseIntensity*0.5;
      }
    }
    
    if( this.config.noiseIntensity ){
      this.scene.position.y = this.noise.noise2D(0, time*0.2)*this.config.noiseIntensity * 0.15;
      this.scene.rotation.y = this.noise.noise2D(0.2, time*0.2)*this.config.noiseIntensity * 0.5;
    }

  }
}

export default Pasta;
