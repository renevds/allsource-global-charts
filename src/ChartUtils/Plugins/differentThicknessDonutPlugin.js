export const differentThicknessDonutPlugin = {
  id: 'differentThicknessDonutPlugin',
  beforeDraw: function (chart) {
    const datasetMeta = chart.getDatasetMeta(0);
    const radMap = chart.data.datasets[0].radiusChange;
    const innerRadius = datasetMeta.controller.innerRadius;
    const outerRadius = datasetMeta.controller.outerRadius;
    const heightOfItem = outerRadius - innerRadius;

    const countOfData = chart.getDatasetMeta(0).data.length;

    datasetMeta.data.forEach((dataItem, index) => {
      dataItem.outerRadius = innerRadius + heightOfItem * radMap[index];
    });
  }
}