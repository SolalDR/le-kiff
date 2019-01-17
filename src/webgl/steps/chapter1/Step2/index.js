import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import SoundManager from "~/services/soundManager/SoundManager";
import config from "./config";
import ClipAnimationUtils from "../../../helpers/ClipAnimationUtils"; 
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import { c } from "../../../../helpers/Configuration";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  /** 
   * This method initialize the step and 
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( isNextStep ) {
    super.init(config);
    this.display(isNextStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  // TODO: make generic animations in steps for main leaf
  createMeshAnimations() {
    this.mixers = [];
    this.animations = [
      {
        name: 'hang-out',
        firstFrame: 0,
        lastFrame: 171,
        animation: null
      },
      {
        name: 'move-in-wind',
        firstFrame: 78,
        lastFrame: 171,
        animation: null
      },
      {
        name: 'idle',
        firstFrame: 171,
        lastFrame: 213,
        loop: THREE.LoopRepeat,
        animation: null
      },
      {
        name: 'cut',
        firstFrame: 213,
        lastFrame: 264,
        animation: null
      },
    ];

    this.currentAction = null;
    
    this.mixer = new THREE.AnimationMixer(this.main);
    this.mixer.timeScale = 0.0009;

    var mainClip = this.mixer.clipAction( this.mainRoot.animations[ 0 ] );

    for (var i = 0; i < this.animations.length; i++) { 
      const animData = this.animations[i];
      const loopType = animData.loop !== undefined ? animData.loop : THREE.LoopOnce;
      animData.animation = this.mixer.clipAction(ClipAnimationUtils.subclip(mainClip._clip, this.animations[i].name , this.animations[i].firstFrame, this.animations[i].lastFrame ));
      animData.animation.setLoop( loopType );
      animData.animation.clampWhenFinished = true;
    }

    this.mixers.push( this.mixer );

    this.currentAction = this.animations[0].animation;
  }

  // TODO:  add to separate class to manage clip animations
  playAnimation(name, callback) {
    if(!this.currentAction.isRunning()) {
        let activeAction, mixer;
        let lastAction = this.currentAction;
        let activeAnimation = this.animations.find(u => u.name === name);

        activeAction = activeAnimation.animation;
        mixer = activeAction.getMixer();
        this.currentAction = activeAction;

        if(activeAction == lastAction) {
            activeAction.stop().play();
        } else {
            activeAction.play();
            lastAction.stop();
        }
        
        mixer.addEventListener('finished', callback);
    }
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( event ){
    this.main = event.step_1_human_leaf.result.scene;
    this.mainRoot = event.step_1_human_leaf.result;
    this.main.name = "main-step-2"

    this.createMeshAnimations();

    this.indic = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0xFF0000
      })
    );
    this.indic.name = "main-step-2"

    this.playAnimation('hang-out', () => {
      this.playAnimation('idle');
    });

    this.scene.humanScale.group.add(this.main2);
  }

  display( isNextStep = false, event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    super.hide();
  }

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
    if ( this.mixers.length > 0 ) {
      for ( var i = 0; i < this.mixers.length; i ++ ) {
          this.mixers[ i ].update( this.scene.clock.delta );
      }
    }
  }
}
