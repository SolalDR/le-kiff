import {Howl, Howler} from 'howler'

class SoundManager {
  constructor(){
    this.sounds = new Map();
    this._volume = 0.5;
  }

  get volume() {
    return this._volume;
  }

  set volume(v) {
    Howler.volume(v);
    this._volume = v
  }

  addSound(name, sound, options){
    const soundObject = this.assignOptions(sound, options);
    this.sounds.set(name, soundObject)
  }

  addSounds(soundArray) {
    soundArray.forEach(element => {
      this.addSound(element.name, element.sound, element.options)
    });
  }

  play(sound) {
    this.sounds[sound].play();
  }

  playAll() {
    this.sounds.forEach(function(sound, key) {
      sound.play();
    });
  }

  assignOptions(sound, options) {
    Object.entries(options).forEach(([key, value]) => {
      sound[key] = value;
    })
    return sound;
  }
}

export default SoundManager;
