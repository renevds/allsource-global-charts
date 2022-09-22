import {horizontalBlueGreenGradient, verticalBlueDarkGradientNonTransparent} from "../Utils/chartGradientUtils";

const baseDataset = {
  pointBackgroundColor: "rgba(255,255,255,0.1)",
  pointRadius: 4,
  pointBorderWidth: 1,
  hoverBorderWidth: 2,
  hoverRadius: 5.5,
  pointBorderColor: horizontalBlueGreenGradient,
}

export const simpleScatterDataset = {
  ...baseDataset,
  pointBackgroundColor: horizontalBlueGreenGradient,
  pointBorderColor: "rgba(255,255,255,0.5)",
  pointRadius: 1,
  pointBorderWidth: 0,
  hoverBorderWidth: 10,
  pointHitRadius: 10,
  hoverRadius: 1,
  showLine: false
}

export const simpleLineDataset = {
  ...baseDataset,
  pointRadius: 0,
  pointHitRadius: 5,
  type: 'line',
  borderColor: horizontalBlueGreenGradient,
  tension: 0
}

export const dashedLineDataset = {
  ...simpleLineDataset,
  borderDash: [10, 5],
}

export const simpleBarDataset = {
  type: 'bar',
  backgroundColor: verticalBlueDarkGradientNonTransparent,
  hoverBackgroundColor: "rgba(86,245,184,0.5)"
}
