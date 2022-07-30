export const initialZoom = {
  id: 'initialZoom',
  install: (chart) => {
    chart.config.options.plugins.initialZoom._done = false;
  },
  beforeRender: (chart) => {
    if (chart.config.options.plugins.initialZoom.enabled) {
      if (chart.scales.yAxes.type === "modifiedLinear") {
        if (chart.scales.yAxes.max > 1) {
          if (!chart.config.options.plugins.initialZoom._done) {
            chart.config.options.scales.yAxes._modifiedLinearMax = Math.max(chart.config.options.scales.yAxes._modifiedLinearMax || 0, chart.scales.yAxes.max);
            let newMax = 2*chart.config.options.plugins.initialZoom.center;
            newMax = Math.round(newMax*10)/10
            chart.config.options.scales.yAxes.max = newMax;
            chart.config.options.plugins.initialZoom._done = true;
            chart.update();
            return false;
          }
        }
      } else {
        console.log("init zoom not supported for scale")
      }
    }
    return true;
  }
}