import {horizontalBlueGreenGradient, verticalBlueDarkGradientNonTransparent} from "../Utils/chartGradientUtils";
import {hoverBackgroundGreen} from "../Utils/chartColors";

const baseDataset = { // Basic data set
  pointBackgroundColor: "rgba(255,255,255,0.1)",
  pointRadius: 4,
  pointBorderWidth: 1,
  hoverBorderWidth: 2,
  hoverRadius: 5.5,
  pointBorderColor: horizontalBlueGreenGradient,
}

export const simpleScatterDataset = { // For use with scatter plots
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

export const simpleLineDataset = { // For use with line plots
  ...baseDataset,
  pointRadius: 0,
  pointHitRadius: 5,
  type: 'line',
  borderColor: horizontalBlueGreenGradient,
  tension: 0
}

export const dashedLineDataset = { // This is a dashed line
  ...simpleLineDataset,
  borderDash: [10, 5],
}

export const simpleBarDataset = { // This is a for a bar plot
  type: 'bar',
  backgroundColor: verticalBlueDarkGradientNonTransparent,
  hoverBackgroundColor: hoverBackgroundGreen
}
