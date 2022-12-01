//Plugins
import zoomPlugin from "chartjs-plugin-zoom";

//Scales
import {LinearScale} from "chart.js";

export const MODIFIED_LINEAR_ZOOM_STEP = 1;

// This is a custom linear scale that allows zoom and always starts at least at 0
export default class ModifiedLinearScale extends LinearScale {
  constructor(cfg) {
    super(cfg);
    this.zoom = 1;
  }

  handleZoom() {
    this.options.max = this.options.zoomMax / this.zoom;
    this.options.min = Math.max(0, this.options.modifiedLinearCenter - (this.options.max - this.options.modifiedLinearCenter))
  }

  getZoomLevel() {
    return this.zoom;
  }

  buildTicks() {
    let ret = super.buildTicks();
    if (this.zoom !== 1) {
      ret.pop();
      if(ret[0].value !== 0){
        ret.shift();
      }
    }
    return ret;
  }

}
ModifiedLinearScale.id = 'modifiedLinear';
ModifiedLinearScale.defaults = {};

zoomPlugin.zoomFunctions.modifiedLinear = (scale, zoom, center, limits) => {
  if (zoom - 1 > 0) {
    scale.zoom += MODIFIED_LINEAR_ZOOM_STEP;
  } else {
    scale.zoom -= MODIFIED_LINEAR_ZOOM_STEP;
  }
  scale.zoom = Math.max(1, scale.zoom);
  scale.handleZoom();
}