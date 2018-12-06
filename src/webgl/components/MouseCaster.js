import "~/helpers/Event";
import * as THREE from "three";

class MouseCaster extends Event {
  constructor({
    root = null,
    camera = null,
    raycaster = null
  } = {}){
    super();

    this.root = root; 
    this.camera = camera; 
    this.raycaster = raycaster;
    
    this.state = {
      position: new THREE.Vector2(),
      mouseDown: false,
      mouseDrag: false, 
      mouseClick: false,
      needIntersect: false
    }

    this.initEvents();
  }

  initEvents(){
    window.addEventListener("mousemove", this.onMouseMove());
    window.addEventListener("mousedown", this.onMouseDown());
    window.addEventListener("mouseup", this.onMouseUp());
  }

  intersect(){
    var intersections = this.raycaster.intersectObjects(this.root.children, true);
    var intersect = intersections.find(intersection => intersection.object.castable ? true : false);
    this.dispatch("cast", intersect);
    return intersect;
  }

  /**
   * Event callback "onmousemove"
   * @private
   * @param {{clientX: number}, {clientY: number}} event 
   */
  onMouseMove(event){
    this.position.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.position.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if( this.mouseDown ) this.mouseDrag = true;
    this.needIntersect = true; 
  }

  onMouseDown(event){
    this.mouseDown = true;
    this.needIntersect = true; 
  }

  onMouseUp(event){
    if( !this.mouseDrag ) {
      this.mouseClick = true;
    }

    this.mouseDown = false;
    this.mouseDrag = false;
    this.needIntersect = true; 
  }

  render(){
    if( this.needIntersect ){
      var intersect = this.intersect();
      if( this.mouseClick ){
        this.dispatch("click", intersect);
      }
      this.mouseClick = false;
    }
  }

}

export default MouseCaster; 
