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
