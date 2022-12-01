// Utils to manipulate chart data
export function filterOutliers(data, key) {
  data.sort((a, b) => Math.abs(a[key]) - Math.abs(b[key]))
  const top = Math.round(data.length * 0.8)
  const bottom = 0
  return data.slice(bottom, top + 1)
}

export function getAvg(data, key) {
  let total = 0;
  let count = 0;

  data.forEach(item => {
    total += item[key];
    count++;
  });

  return !count ? 0 : total / count;
}

export function getMax(data, key) {
  return Math.max(...data.map(a => a[key]))
}

export function getMin(data, key) {
  return Math.min(...data.map(a => a[key]))
}

export function getDataBetween(data, key, lower, upper) {
  return data.filter(a => {
    return a[key] >= lower && a[key] <= upper
  })
}

export function getSum(data, key) {
  return data.reduce((partialSum, a) => partialSum + a[key], 0);
}

export function formatDecimal(value) {
  if(value > 10000){
    return Math.round(value);
  }
  else if(value > 1000){
    return Math.round(value*10)/10;
  }
  else if(value > 100){
    return Math.round(value*100)/100;
  }
  else if (value > 10){
    return Math.round(value*1000)/1000;
  }
  return value;
}