import Step from "./../Step";

/**
 * @constructor
 * @param {int} id
 */
class Step1 extends Step {

  display() {
    super.display();
    this.scene.macroScale.updateFromStep(this);
  }

  hide() {
    super.hide();
  }
}

export default Step1;
