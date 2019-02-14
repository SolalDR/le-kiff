import { TimelineLite } from 'gsap';

export const exitChapter = (chapterEl) => {
  const ui = {
    chapterTexts: chapterEl.querySelectorAll('.chapter__text'),
    timeline: chapterEl.querySelector('.timeline'),
    scaleMenu: chapterEl.querySelector('.scale-menu'),
    scene: chapterEl.querySelector('.scene'),
    sceneBottom: chapterEl.querySelector('.scene__bottom-right-nav')
  }

  chapterEl.classList.remove('is-shown');
  // ui.scene.classList.remove('is-shown');

  // ui.timeline.classList.remove('is-shown');
  // ui.scaleMenu.classList.remove('is-shown');
  // ui.sceneBottom.classList.remove('is-shown');
}
