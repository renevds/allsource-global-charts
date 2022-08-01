//Plugins
import zoomPlugin from "chartjs-plugin-zoom";

//Scales
import {LinearScale} from "chart.js";

//Utils
import {updateRange} from "../Utils/zoomUtils";

export const MODIFIED_LINEAR_ZOOM_STEP = 1;

export default class ModifiedLinearScale extends LinearScale {
  constructor(cfg) {
    super(cfg);
    this.zoom = 1;
  }

  handleZoom(){
    this.options.max = this.options.zoomMax/this.zoom;
    this.options.min = Math.max(0, this.options.modifiedLinearCenter - (this.options.max - this.options.modifiedLinearCenter))
  }

  getZoomLevel(){
    return this.zoom;
  }

}
ModifiedLinearScale.id = 'modifiedLinear';
ModifiedLinearScale.defaults = {};

zoomPlugin.zoomFunctions.modifiedLinear = (scale, zoom, center, limits) => {
  if(zoom - 1 > 0){
    scale.zoom += MODIFIED_LINEAR_ZOOM_STEP;
  }
  else{
    scale.zoom -= MODIFIED_LINEAR_ZOOM_STEP;
  }
  scale.zoom = Math.max(1, scale.zoom);
  scale.handleZoom();
}