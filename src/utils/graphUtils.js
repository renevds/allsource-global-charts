import {chartDataFetch} from "../config/axiosConfig";

export function filterOutliers(data, key){
  data.sort((a,b) => a[key] - b[key])
  const top = Math.round(data.length*0.9)
  const bottom = Math.round(data.length*0.1)
  return data.slice(bottom, top + 1)
}