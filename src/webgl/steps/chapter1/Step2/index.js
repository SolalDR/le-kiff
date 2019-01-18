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

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( event ){
    this.main = event.step_1_human_leaf.result.scene;
    this.mainRoot = event.step_1_human_leaf.result;
    this.main.name = "main-step-2"

    this.createMeshAnimations();

    this.playAnimation('hang-out').then((e) => {

      var startPosition = this.main.position.clone();
      var startRotation = this.main.rotation.clone();

      AnimationManager.addAnimation(new Animation({
        duration: 3600, 
        timingFunction: "easeInOutQuad"
      }).on("progress", ( event ) => {
        var a = event.advancement;
        var lerp = THREE.Math.lerp;
        this.main.position.x = lerp(startPosition.x, -30, a);
        this.main.position.y = lerp(startPosition.y, 1.76, a);
        this.main.position.z = lerp(startPosition.z, 0.96, a);
        this.main.rotation.x = lerp(startRotation.x, 0.46, a);
        this.main.rotation.y = lerp(startRotation.y, 0.20, a);
        this.main.rotation.z = lerp(startRotation.z, -0.18, a);
      }).on("end", () => {
        console.log('branch anim end');
      }));

      this.playAnimation('move-in-wind').then(() => {
        this.playAnimation('idle');
      });

    });
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

  // TODO: make generic animations in steps for main leaf
  createMeshAnimations() {
    this.mixers = [];
    // TODO: add to some anim config
    this.animations = [
      {
        name: 'hang-out',
        firstFrame: 0,
        lastFrame: 70,
        animation: null
      },
      {
        name: 'move-in-wind',
        firstFrame: 70,
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

  // TODO:  add to separate animationClip manager to handle clip animations between steps
  playAnimation(name, callback) {
    if(!this.currentAction.isRunning()) {
        var mixer;
        let activeAction;
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

        // anim chain
        return new Promise(function(resolve, reject) {
          mixer.addEventListener('finished', resolve);
        });
    }
  }
}
