export function compressDataSet(dataSet, xKey, yKey) {
  const groups = {}

  for (const i of dataSet) {
    const xVal = i[xKey]
    const yVal = i[yKey]
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
        group[xKey] = group.originals[0][xKey];
        group[yKey] = group.originals[0][yKey];
        newDataSet.push(group)
      }
    }
  }

  return newDataSet;
}