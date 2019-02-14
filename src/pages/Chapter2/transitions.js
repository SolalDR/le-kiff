import { TimelineLite } from 'gsap';

export const exitChapter2 = (chapterEl) => {
  chapterEl.classList.remove('is-shown');
}

export const enterChapter2 = (chapterEl) => {
    chapterEl.classList.add('is-shown');
}