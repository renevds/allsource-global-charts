export const toolTipLinePlugin = {
  id: 'toolTipLinePlugin',
  beforeDraw: chart => {
    if (chart.tooltip.getActiveElements().length) {
      const ctx = chart.ctx;
      ctx.save();
      const activePoint = chart.tooltip.getActiveElements()[0];
      ctx.beginPath();
      ctx.setLineDash([5, 7]);
      ctx.moveTo(activePoint.element.x, chart.chartArea.top);
      ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'grey';
      ctx.stroke();
      ctx.restore();
    }
  }
}