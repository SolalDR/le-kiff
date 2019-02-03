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
  constructor(params){
    super(params, ["leaf", "background"]);
    this.mixers = [];
    this.animations = [];
  }

  /** 
   * This method initialize the step and launch display method
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( isNextStep ) {
    super.init(config);
    this.display(isNextStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  /**
   * Display the initialized step and launch human scale by default
   * @param {bool} isNextStep 
   * @param {object} ressources 
   */
  display( previousStep = null, ressources ) {
    this.displayHumanScale( ressources, previousStep );
    super.display( ressources );
  }

  /**
   * Display human scale scene 
   * @param {*} ressources
   */
  displayHumanScale( ressources, previousStep ){
    this.leaf = ressources.step_1_human_leaf.result;
    var main = ressources.step_1_human_leaf.result.scene;
    
    if (previousStep.background){
      this.background = previousStep.background;
    }

    this.background.changeBackground(ressources.background2.result, 3000, 3000);

    this.createMeshAnimations();

    this.playAnimation('hang-out').then((e) => {

      var startPosition = main.position.clone();
      var startRotation = main.rotation.clone();

      AnimationManager.addAnimation(new Animation({
        duration: 3600, 
        timingFunction: "easeInOutQuad"
      }).on("progress", ( ressources ) => {
        var a = ressources.advancement;
        var lerp = THREE.Math.lerp;
        main.position.x = lerp(startPosition.x, -30, a);
        main.position.y = lerp(startPosition.y, 1.76, a);
        main.position.z = lerp(startPosition.z, 0.96, a);
        main.rotation.x = lerp(startRotation.x, 0.46, a);
        main.rotation.y = lerp(startRotation.y, 0.20, a);
        main.rotation.z = lerp(startRotation.z, -0.18, a);
      }));

      this.playAnimation('move-in-wind').then(() => {
        this.playAnimation('idle');
      });

    });
  }

  initGUI(){
    // Silence is golden
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);
    if ( toRemove.includes("leaf") ){
      this.scene.humanScale.group.remove(this.leaf.scene);
    }

    if ( toRemove.includes("background") ){
      this.scene.humanScale.group.remove(this.background.objec3D);
    }
    super.hide(newStep);
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

    this.mixer = new THREE.AnimationMixer(this.leaf.scene);
    this.mixer.timeScale = 0.0009;
    var mainClip = this.mixer.clipAction( this.leaf.animations[ 0 ] );

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
