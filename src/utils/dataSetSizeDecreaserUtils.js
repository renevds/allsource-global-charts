import {getAvg} from "../ChartUtils/Utils/chartDataUtils";

export const ONE_HOUR = 60 * 60 * 1000;

export function compressDataSet(dataSet, xKey, yKey, xMargin, yMargin) {
  const groups = {}

  for (const i of dataSet) {
    const xVal = Math.round(i[xKey]/xMargin)
    const yVal = Math.round(i[yKey]/yMargin)
    if(!groups.hasOwnProperty(xVal)){
      groups[xVal] = {}
    }
    if(!groups[xVal].hasOwnProperty(yVal)){
      groups[xVal][yVal] = {originals: []}
    }
    groups[xVal][yVal].originals.push(i);
  }

  let newDataSet = []

  for(const xGroup of Object.values(groups)){
    for (const group of Object.values(xGroup)){
      if(group.originals.length === 1){
        newDataSet.push(group.originals[0])
      }else {
        group[xKey] = getAvg(group.originals, xKey);
        group[yKey] = getAvg(group.originals, yKey);
        newDataSet.push(group)
      }
    }
  }

  return newDataSet;
}