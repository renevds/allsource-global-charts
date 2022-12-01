// This plugin shows the zoom leven on the chart
export const showZoomPlugin = {
  id: 'showZoomPlugin',
  afterDraw: (chart, args, options) => {
    const zoom = chart.scales.yAxes.getZoomLevel();
    const {ctx, chartArea} = chart;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '16px Segoe UI Symbol';
    ctx.textAlign = 'right';
    ctx.fillText(zoom.toLocaleString() + " 🔍", chartArea.right, chartArea.top + 16);
    ctx.restore();
  }
}