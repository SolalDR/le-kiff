class SoundEffectEntity {
  constructor({
    tuna,
    name,
    params
  } = {}) {
    this.name = name;
    this.tuna = tuna;
    this.effect = new this.tuna[name](params);
    this.intensity = params.intensity;

    this.setIntensity(this.intensity.value);
  }

  setIntensity(value) {
    this.intensity.value = value;
    var min = this.intensity.min;
    var max = this.intensity.max;
    var isObject = typeof this.effect[this.intensity.paramName] === 'object';
    var result = min + (max - min) * this.intensity.value;
    if(isObject) {
      this.effect[this.intensity.paramName].value = result;
    } else {
      this.effect[this.intensity.paramName] = result;
    }
  }
}
export default SoundEffectEntity;
