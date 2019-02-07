import {Howler} from 'howler'
import SoundEffectManager from './SoundEffectManager'
import config from './config'

class SoundManager {

  /**
   * @constructor
   * @property {Map} sounds
   * @property {float} volume
   * @property {Howler} howler
   * @property {SoundEffectManager} soundEffectManager 
   */
  constructor(){
    this.sounds = new Map();
    this.playingSounds = new Map();
    this._volume = 0;
    this.defaultVolume = 0;
    this.howler = null;
    this.soundEffectManager = null;

    // init on dom content loaded to get audio context
    document.addEventListener("DOMContentLoaded", this.init.bind(this));
  }
  
  /**
   * init sound effect
   */
  init() {
    this.howler = Howler;
    this.soundEffectManager = new SoundEffectManager();
    this.volume = this.defaultVolume = config.globalVolume;
  }

  get volume() {
    return this._volume;
  }

  set volume(v) {
    Howler.volume(v);
    this._volume = v
  }

  /**
   * Play sounds
   * We can pass a name or an array of names with sprite names
   * @param {Array.<string[]>|String} soundNames Array of Strings or String of sound names
   * @param {String} spriteName Sound sprite name
   */
  play(soundNames, spriteName) {
    if(Array.isArray( soundNames )) {
      soundNames.forEach(sound => {
        // if sound sprite
        if(Array.isArray(sound)) {
          this._play(sound[0], sound[1]);
        } else {
          this._play(sound);
        }
      })
    } else {
      this._play(soundNames, spriteName);
    }
  }

  /**
   * Play a sound
   * @private
   * @param {String} name main sound name
   * @param {String} spriteName sprite sound name
   */
  _play(name, spriteName) {
    var sound, id;
      
    if(spriteName) {
      sound = this.getSpriteSound(name, spriteName);
      name = this.getSpriteSoundName(name, spriteName);
      if(this.playingSounds.has(name)) return;
      id = sound.play(spriteName);
    } else {
      sound = this.getSound(name);
      if(this.playingSounds.has(name)) return;
      id = sound.play();
    }
    console.log('- A -- play', name, id, sound);
    sound.volume(sound.defaultVolume); 
    this.playingSounds.set(name, id); 

    // Remove from playing list when the sound finishes playing.
    sound.on('end', () => {
      if(this.playingSounds.has(name)) {
        this.playingSounds.delete(name); 
      }   
    });
  }

  /**
   * Stop sounds
   * Sounds can be faded before stop
   * @param {String[]|Array.<string[]>|String} soundNames Array of String or of String array for sprite id or String of sound names
   * @param {String} spriteName String of sprite name
   * @param {Boolean} fade  Stop with fade
   */
  stop(soundNames, spriteName = null, fade = false) { 
    if( Array.isArray( soundNames )) {
      soundNames.forEach(sound => {
        // if sound sprite
        if(Array.isArray(sound)) {
          this._stop(sound[0], sound[1], fade);
        } else {
          this._stop(sound, undefined, fade);
        }
      })
    } else {
      this._stop(soundNames, spriteName, fade);
    }
  }


  /**
   * Stop sounds
   * Sounds can be faded before stop
   * @private
   * @param {String} name main sound name
   * @param {String} spriteName sprite sound name
   * @param {Boolean} fade  Stop with fade
   */
  _stop (name, spriteName, fade) {
    var sound;
    var id = this.playingSounds.get(name);
    if(spriteName) {
      id = this.playingSounds.get(this.getSpriteSoundName(name, spriteName));
    }
    
    if(spriteName) {
      sound = this.getSpriteSound(name, spriteName);
      console.log('- A -- stop', name, spriteName);
    } else {
      sound = this.getSound(name);
      console.log('- A -- stop', name);
    }
    if(fade) {
      this.fade(sound, 'out', 1000, id);
      sound.once('fade', () => {
        console.log('- A -- on fade stop', id);
        sound.stop(id)
      });
    } else {
      sound.stop(id);
    }
    if(spriteName) {
      this.playingSounds.delete(this.getSpriteSoundName(name, spriteName));  
    } else {
      this.playingSounds.delete(name);
    }
  }

  /**
   *
   * @param {Howler} sound Sound object to fade 
   * @param {Number} from Volume to fade from
   * @param {Number} to Volume to fade to
   * @param {Number} duration Fade duration
   * @param {String|Number} id sprite or sound id  
   */
  fade(sound, type, duration = 1000, id = null) {
    var from,to;
    if(type === 'in') {
      from = 0;
      to = sound.volume();
    } else if(type === 'out') {
      from = sound.volume();
      to = 0;
    } else {
      console.error('define fade type "in" or "out"');
    }    
    if(id) {
      console.log('fade out', id);
      sound.fade(from, to, duration, id)
    } else {
      sound.fade(from, to, duration)
    }
  }

  /**
   * Get a sound from this.sounds[] by its name
   * @param {String} name 
   */
  getSound(name) {
    const sound = this.sounds.get(name);
    if(sound) {
      return this.sounds.get(name);
    } else {
      console.error('sound', name, 'not found');
      return null;
    }
  }

  /**
   * Update currently playing sounds  
   * @param {Object} soundsData soundsData to update from
   */
  updatePlayBack(soundsData) {
    // add new sounds
    //this.add(soundsData);
    // Assign new options
    soundsData.forEach(data => {
      if(data.options) {
        let sound = this.getSound(data.name);
        if(data.spriteName) {
          sound = this.getSpriteSound(data.name, data.spriteName);
        }
        sound = this.assignOptions(sound, data.options);
      }
    })

    // Stop sounds not playings
    this.playingSounds.forEach((id, name) => {
      
        if( !soundsData.find(soundData => soundData.name === name) ) {
          const soundName = this.splitSpriteName(name);
          if(soundName[1]) {
            const tmpSoundData = soundsData.find(soundData => soundData.name === soundName[0]);
            if(soundName[1] && tmpSoundData) {
              if(tmpSoundData.spriteName !== soundName[1]) {
                console.log('- A -- call stop ', soundName[0], soundName[1]);
                this.stop(soundName[0], soundName[1], true);
              }
            }
          } else { 
            this.stop(name, null, true);
          }
        }
    })

    // play added sounds
    soundsData.forEach(data => { 
      if(data.spriteName) {
        this.play(data.name, data.spriteName);
      } else {
        this.play(data.name);
      }
    })

    console.log('- A -- sounds ', this.sounds);
    console.log('- A -- playing sounds ', this.playingSounds);
  }

  /**
   * Add
   * @param {Object[]|Objet} soundsData Can be Object Array or Object of sound datas 
   * @param {string} soundsData.name Sound name
   * @param {Howl} soundsData.sound Howler sound entity
   * @param {Object} soundsData.options Howler sound options
   */
 add(soundsData){
   const add = (data) => {
    if(data.sprite) {
      this.addSpriteSound(data, data.sprite);
    } else if (!this.sounds.has(data.name)) {
      const soundObject = this.assignOptions(data.sound, data.options);
      this.sounds.set(data.name, soundObject);
    }
   }
   if( Array.isArray( soundsData )) {
    soundsData.forEach((data) => {
      add(data);
    });
   } else {
      add(soundsData);
   }
 }

 /**
  * Add sound object from sprite
  * # Sound Object name : soundName.spriteName
  * @param {Object} data Object of sound datas 
  * @param {Object} sprite Howler sprite object
  */
 addSpriteSound(data, sprite) {
   Object.keys(sprite).forEach((key,index) => {
    const name = this.getSpriteSoundName(data.name, key);
    if(!this.sounds.has(name)) {
      let soundObject = data.sound;
      if(data.options) {
        soundObject = this.assignOptions(soundObject, data.options);
      }
      soundObject._sprite[key] = sprite[key];
      this.sounds.set(name, soundObject);
    }
   });
 }

  /**
  * Add sprite to sound object
  * @param {String} name sound name
  * @param {String} spriteName sprite sound name
  */
  getSpriteSound(name, spriteName) {
    return this.getSound(this.getSpriteSoundName(name, spriteName));
  }

  splitSpriteName(name) {
    return name.split('.');
  }

  /**
   * Get sprite sound name 
   * @param {String} name main sound name
   * @param {String} spriteName sprite name in main sound 
   */
  getSpriteSoundName(name, spriteName) {
    return name + '.' + spriteName;
  }

  // TODO: unused
  /**
   * Remove a sound by is name
   * @param {string} name sound name 
   */
  removeSound(name){
    var sound = this.getSound(name);
    this.fade(sound, 'out');
    sound.once('fade', () => {
      sound.stop();
      this.sounds.delete( name );
    });
  }

  // TODO: unused
  /**
   * Update sounds
   * @param {*} sounds 
   */
  updateSounds(soundsData){
    // add sounds
    this.add(soundsData);

    // remove sounds 
    this.sounds.forEach((sound, name) => {
      if( !soundsData.find(elementTmp => elementTmp.name === name) ) {
        this.removeSound(name);
      }
    });
  }

  /**
   * Assign options to Howl Object
   * @param {Howl} sound Howl object
   * @param {Object} options
   * @return {Howl}
   */
  assignOptions(sound, options = null) {
    Object.entries(options).forEach(([key, value]) => {
      sound['_' + key] = value;
    });
    sound.defaultVolume = options.volume || 1;
    return sound;
  }

  // Effects
  // ======================================

  /**
   * @param {String} name effect name
   */
  addEffect(name) {
    this.soundEffectManager.addEffect(name);
  }

  /**
   * @param {String} name effect name 
   */
  removeEffect(name) {
    this.soundEffectManager.removeEffect(name);
  }

  removeAllEffects() {
    this.soundEffectManager.removeAllEffects(); 
  }

  /**
   * Set effect intensity 
   * @param {String} name effect name
   * @param {Number} advancement value between 0 and 1
   */
  setEffectIntensity(name, advancement) {
    this.soundEffectManager.effects[name].setIntensity(advancement);
  }

}

export default new SoundManager();
