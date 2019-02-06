import Event from "~/helpers/Event";
import Animation from "./components/Animation"
import Mixer from "./components/Mixer"

class AnimationManager extends Event {
    
  constructor(){
    super();
    this.animations = new Map();
  }

  /** 
   * @param {string|Symbol} search
   */
  getAnimation(search){
    return typeof search === "symbol" ? 
      this.getAnimationById(search) :
      this.getAnimationByName(search)
  }

  /**
   * Find a animation with it name, if multiple animation has the same name, the first one will be get
   * @param {string} name 
   */
  getAnimationByName(name){
    return this.animations.find(animation => animation.name === name);
  }

  /**
   * Get an animation with it id
   * @param {Symbol} id
   */
  getAnimationById(id){
    return this.animations.find(animation => animation.id === id);
  }

  /**
   * Return the list of animation with the corresponding name
   * @param {string} name 
   */
  getAnimations(name) {
    return this.animations.filter(animation => animation.name === name)
  }

  /**
   * @param {string} name
   * @param {Animation} animation
   * @returns { name: string, animation: Animation, id: Symbol }
   */
  addAnimation(animation, name){
    var animationData = { 
      name,
      animation,
      id: Symbol("animation_id")
    }
    
    animation.once("end", ()=>{
      this.removeAnimation(animationData.id);
    });

    this.animations.set(animationData.id, animationData );
    return animationData;
  }

  /**
   * Remove an animation by is name or by id
   * @param {Animation} search 
   */
  removeAnimation(id){
    this.animations.delete( id );
  }

  /**
   * Render all the animations
   * @param {int} delta
   */
  renderAnimations(delta){
    this.animations.forEach(animationData => {
      animationData.animation.render(delta);
    })
  }

}

export { Animation, Mixer }
export default new AnimationManager();
