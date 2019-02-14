import { TimelineLite } from 'gsap';
import Bus from "~/helpers/Bus";

export const exitIntro = (introEl) => {
  const timeline = new TimelineLite();
  const ui = {
    svgFilter: introEl.querySelector('#displaceIntro'),
    svgFilterTurbulence: introEl.querySelector('#displaceIntro feTurbulence'),
    svgFilterDisplacement: introEl.querySelector('#displaceIntro feDisplacementMap')
  }
  const filters = {
    entry: {
      baseFrequency: 0,
      numOctaves: 1,
      scale: 4,
    },
    output: {
      baseFrequency: 0.05,
      numOctaves: 3,
      scale: 70,
    }
  }
  introEl.classList.add('is-hidden');

  timeline.to(filters.entry, 2.5, { baseFrequency: filters.output.baseFrequency, numOctaves: filters.output.numOctaves, scale: filters.output.scale, roundProps:"numOctaves",
  onUpdate: () => {
    ui.svgFilterTurbulence.setAttribute('numOctaves', filters.entry.numOctaves);
    ui.svgFilterTurbulence.setAttribute('baseFrequency', filters.entry.baseFrequency);
    ui.svgFilterDisplacement.setAttribute('scale', filters.entry.scale);
  },
  onComplete: () => {
    Bus.dispatch("intro:text:disappear");
  }
  });

}
