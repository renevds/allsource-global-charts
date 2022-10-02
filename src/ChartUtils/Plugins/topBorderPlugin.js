export const topBorderPlugin = {
  id: 'topBorderPlugin',
  beforeDraw(chart, args, options) {
    const {ctx, chartArea: {left, top, width}} = chart;
    ctx.save();
    ctx.strokeStyle = "#322F36";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.stroke();
    ctx.restore();
  }
};