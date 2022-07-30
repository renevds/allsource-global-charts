//Plugins
import zoomPlugin from "chartjs-plugin-zoom";

//Scales
import {LinearScale} from "chart.js";

//Utils
import {updateRange} from "../Utils/zoomUtils";

const zoomFactor = 1
const floorToDec = (a, precision) => Math.floor(a * (10 ** precision)) / (10 ** precision)
const ceilToDec = (a, precision) => Math.ceil(a * (10 ** precision)) / (10 ** precision)

export default class ModifiedLinearScale extends LinearScale {
  getZoomLevel() {
    return this.chart.config.options.scales.yAxes._modifiedLinearMax ? Math.round(10 * this.chart.config.options.scales.yAxes._modifiedLinearMax / this.max) / 10 : 1
  }
}
ModifiedLinearScale.id = 'modifiedLinear';
ModifiedLinearScale.defaults = {};

zoomPlugin.zoomFunctions.modifiedLinear = (scale, zoom, center, limits) => {
  zoom -= 1;
  zoom *= -zoomFactor;

  scale.options._modifiedLinearMax = Math.max(scale.options._modifiedLinearMax || 0, scale.max);
  scale.options._modifiedLinearMin = Math.min(scale.options._modifiedLinearMin || 0, scale.min);

  const width = (scale.max - scale.min)
  let newWidth = width + Math.sign(zoom) * Math.max(0.1, width * Math.abs(zoom));

  if (zoom < 0 && Math.abs(width - newWidth) < 0.2) {
    return false
  }

  const prec = 1;

  const min = floorToDec(Math.max(scale.options.modifiedLinearCenter - (newWidth / 2), 0), prec);
  const max = ceilToDec(Math.min(min + newWidth, scale.options._modifiedLinearMax), prec);


  if (zoom > 0 && scale.min < min) {
    return false;
  }

  const newRange = {min, max};
  if (updateRange(scale, newRange, limits, true)) {
    return true;
  }
}