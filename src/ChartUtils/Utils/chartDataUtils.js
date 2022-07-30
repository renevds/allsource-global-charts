export function filterOutliers(data, key) {
  data.sort((a, b) => a[key] - b[key])
  const top = Math.round(data.length * 0.9)
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