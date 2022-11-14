export const emptyBarLinePlugin = {
  id: 'emptyBarLinePlugin',
  afterDatasetsDraw: chart => {
    chart.getDatasetMeta(0).data.forEach(a => {
      if(a.height === 0){
        const ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 7]);
        ctx.moveTo(a.x, chart.chartArea.top);
        ctx.lineTo(a.x, chart.chartArea.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        ctx.restore();
      }
    })
  }
}