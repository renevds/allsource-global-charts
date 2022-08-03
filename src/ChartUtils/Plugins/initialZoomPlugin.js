import {MODIFIED_LINEAR_ZOOM_STEP} from "../Scales/modifiedLinearScale";

const INIT_ZOOM_SCALE_FACTOR = 1.5;

export const initialZoom = {
  id: 'initialZoom',
  install: (chart) => {
    chart.config.options.plugins.initialZoom._done = false;
  },
  beforeUpdate: (chart) => {
    const scale = chart.scales.yAxes;
    if (chart.config.options.plugins.initialZoom.enabled) {
      if (!chart.config.options.plugins.initialZoom._done) {
        let newZoom = scale.options.zoomMax / (2 * INIT_ZOOM_SCALE_FACTOR * scale.options.modifiedLinearCenter);
        newZoom = Math.round(newZoom / MODIFIED_LINEAR_ZOOM_STEP) * MODIFIED_LINEAR_ZOOM_STEP;
        scale.zoom = newZoom;
        scale.handleZoom();
        chart.config.options.plugins.initialZoom._done = true;
        chart.update();
      }
    } else {
      console.log("init zoom not supported for scale")
    }
    return true;
  }
}