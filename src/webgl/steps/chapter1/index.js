import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'

export const init = (ressources, main) => {
  main.threeScene.add(ressources.step_4_pasta.result.scene);
  main.renderer.renderer.setTexture2D(ressources.background1.result);
  main.renderer.renderer.setTexture2D(ressources.background2.result);
  main.renderer.renderer.setTexture2D(ressources.background3.result);
  main.renderer.renderer.setTexture2D(ressources.background4.result);
  main.renderer.renderer.setTexture2D(ressources.background6.result);
  main.renderer.renderer.render(main.threeScene, main.camera);

  main.threeScene.remove(ressources.step_4_pasta.result.scene);
}

export default [
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6
]
