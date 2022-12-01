// This charts gives different parts of a donut chart a different thickness and rounds their corners
// It depends on the radiusChange property in the dataset
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