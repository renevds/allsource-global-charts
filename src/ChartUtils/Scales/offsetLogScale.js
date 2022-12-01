// This is a custom log scale that can deal with number between 0 and 1

// Scales
import {LinearScale, Scale} from 'chart.js';

// Plugins
import zoomPlugin from 'chartjs-plugin-zoom';

const offset = 1;

export default class OffsetLogScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this._startValue = undefined;
    this._valueRange = 0;
    this.zoom = 0;
    this.maxZoom = 0;
    this.first = true; // Because with the zooming buildTicks is called twice
  }

  getZoomLevel() {
    return -this.zoom + 1
  }

  doZoom(level) {
    this.zoom += -(level - 1) * 3;
    this.zoom = Math.min(this.maxZoom, this.zoom);
  }

  parse(raw, index) {
    const value = LinearScale.prototype.parse.apply(this, [raw, index]);
    return isFinite(value) && value > 0 ? value : null;
  }

  determineDataLimits() {
    const {max, min} = this.getMinMax(true);
    this.max = isFinite(max) ? Math.max(0, max) : null;
  }

  buildTicks() {
    const ticks = [];

    let power = 0;
    let maxPower = Math.max(Math.ceil(Math.log2(this.max)), 0);

    if (this.first) {
      maxPower += Math.floor(this.zoom);

      if (maxPower < 0) {
        maxPower = 0;
        this.zoom = -Math.ceil(Math.log2(this.max))
      }
      this.first = false;
    } else {
      this.first = true; // Ugly fix because this is ran twice
    }

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
    const start = this.min;
    super.configure();
    this._startValue = Math.log2(start + offset);
    this._valueRange = Math.log2(this.max + offset) - Math.log2(start + offset);
  }

  getPixelForValue(value) {
    return this.getPixelForDecimal((Math.log2(value + offset) - this._startValue) / this._valueRange);
  }

  getValueForPixel(pixel) {
    const decimal = this.getDecimalForPixel(pixel) - offset;
    return Math.pow(2, this._startValue + decimal * this._valueRange);
  }
}

OffsetLogScale.id = 'OffsetLogScale';
OffsetLogScale.defaults = {};

zoomPlugin.zoomFunctions.OffsetLogScale = (scale, zoom, center, limits) => {
  scale.doZoom(zoom);
};

zoomPlugin.panFunctions.OffsetLogScale = (scale, delta, limits) => {};