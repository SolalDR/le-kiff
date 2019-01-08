import {Howl, Howler} from 'howler'

class SoundManager {
  constructor(){
    this.sounds = new Map();
  }

  addSound(name, path, args){
    this.sounds.set(name, new Howl({
      
    }))
  }

  play(sound) {
    this.sounds[sound].play();
  }
}

export default SoundManager;
