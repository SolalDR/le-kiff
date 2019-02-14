import { TimelineLite } from 'gsap';

export const exitChapter1 = (chapterEl) => {
  chapterEl.classList.remove('is-shown');
  chapterEl.classList.add('is-hidden');
}
