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
    var min = this.intensity.param.min;
    var max = this.intensity.param.max;
    var isObject = typeof this.effect[this.intensity.param.name] === 'object';
    var result = min + (max - min) * this.intensity.value;
    if(isObject) {
      this.effect[this.intensity.param.name].value = result;
    } else {
      this.effect[this.intensity.param.name] = result;
    }
  }
}
export default SoundEffectEntity;
