import { TimelineLite } from 'gsap';

export const enterChapter = (chapterEl) => {
  const timeline = new TimelineLite();
  const ui = {
    chapterTexts: chapterEl.querySelectorAll('.chapter__text'),
    timeline: chapterEl.querySelector('.timeline'),
    scaleMenu: chapterEl.querySelector('.scale-menu'),
    scene: chapterEl.querySelector('.scene'),
    sceneBottom: chapterEl.querySelector('.scene__bottom-right-nav')
  }

  chapterEl.classList.add('is-shown');
  ui.scene.classList.add('is-shown');

  const classTimeout = setTimeout(() => {
    ui.timeline.classList.add('is-shown');
    ui.scaleMenu.classList.add('is-shown');
    ui.sceneBottom.classList.add('is-shown');
  }, 1000);
}


export const exitChapter = (chapterEl) => {
  const ui = {
    chapterTexts: chapterEl.querySelectorAll('.chapter__text'),
    timeline: chapterEl.querySelector('.timeline'),
    scaleMenu: chapterEl.querySelector('.scale-menu'),
    scene: chapterEl.querySelector('.scene'),
    sceneBottom: chapterEl.querySelector('.scene__bottom-right-nav')
  }

  chapterEl.classList.remove('is-shown');
  ui.scene.classList.remove('is-shown');

  ui.timeline.classList.remove('is-shown');
  ui.scaleMenu.classList.remove('is-shown');
  ui.sceneBottom.classList.remove('is-shown');
}
