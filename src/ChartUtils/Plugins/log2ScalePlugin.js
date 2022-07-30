//Scales
import {LinearScale, Scale} from 'chart.js';

export default class Log2ScalePlugin extends Scale {
  constructor(cfg) {
    super(cfg);
    this._startValue = undefined;
    this._valueRange = 0;
  }

  parse(raw, index) {
    const value = LinearScale.prototype.parse.apply(this, [raw, index]);
    return isFinite(value) && value > 0 ? value : null;
  }

  determineDataLimits() {
    const {max} = this.getMinMax(true);
    this.max = isFinite(max) ? Math.max(0, max) : null;
    this.min = 0;
  }

  buildTicks() {
    const ticks = [];
    let power = 0;
    let maxPower = Math.max(Math.ceil(Math.log2(this.max)), 0);
    while (power <= maxPower) {
      ticks.push({value: Math.pow(2, power)});
      power += 1;
    }
    this.min = 0;
    this.max = ticks[ticks.length - 1].value;
    return ticks;
  }

  /**
   * @protected
   */
  configure() {
    super.configure();
    this._startValue = 0;
    this._valueRange = Math.log2(this.max);
  }

  getPixelForValue(value) {
    return this.getPixelForDecimal((Math.log2(value === 0 ? 0 : value) - this._startValue) / this._valueRange);
  }

  getValueForPixel(pixel) {
    const decimal = this.getDecimalForPixel(pixel);
    return Math.pow(2, this._startValue + decimal * this._valueRange);
  }
}

Log2ScalePlugin.id = 'log2Scale';
Log2ScalePlugin.defaults = {};
