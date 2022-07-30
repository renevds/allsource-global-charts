//Utils
import {getAvg} from "../Utils/chartDataUtils";

export const pluginTrendLineLinear = {
  id: 'chartjs-plugin-trendline',
  afterDatasetsDraw: function (chartInstance) {
    let yScale;
    let xScale;
    for (let axis in chartInstance.scales) {
      if (axis[0] === 'x') xScale = chartInstance.scales[axis];
      else yScale = chartInstance.scales[axis];
      if (xScale && yScale) break;
    }

    const ctx = chartInstance.ctx;

    chartInstance.data.datasets.forEach(function (dataset, index) {
      if (dataset.trendLineLinear && chartInstance.isDatasetVisible(index) && dataset.data.length !== 0) {
        const {xAxisKey, yAxisKey} = dataset.parsing;
        const pointsInView = dataset.data.filter(a => a[xAxisKey] >= xScale.min).filter(a => a[xAxisKey] <= xScale.max)
        const xAvg = getAvg(pointsInView, xAxisKey);
        const yAvg = getAvg(pointsInView, yAxisKey);
        let mUpper = 0;
        let mLower = 0;
        pointsInView.forEach(point => {
          const x = point[xAxisKey];
          const y = point[yAxisKey];
          mUpper += (x-xAvg)*(y-yAvg)
          mLower += Math.pow(x - xAvg, 2)
        })
        const m = mUpper/mLower;
        const b = yAvg - (m*xAvg);
        const getPointOnTrend = (x) => m*x + b;

        const x1 = xScale.min;
        const y1 = getPointOnTrend(x1);
        const x2 = xScale.max;
        const y2 = getPointOnTrend(x2);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xScale.getPixelForValue(x1), yScale.getPixelForValue(y1));
        ctx.lineTo(xScale.getPixelForValue(x2), yScale.getPixelForValue(y2))
        ctx.setLineDash([5, 10]);
        ctx.strokeStyle = typeof dataset.trendLineLinear.style === "function" ? dataset.trendLineLinear.style(chartInstance.$context) : dataset.trendLineLinear.style;
        ctx.lineWidth = dataset.trendLineLinear.width;
        ctx.stroke();
        ctx.restore();
      }
    });
  },
};