export function calcTotalMomentumFromArray(momentumArray){
  let sumOfPercentages = 0
  let tempArray = []
  for (let i = 0; i < momentumArray.length; i++) {

    tempArray.push(momentumArray[i] / 100)
    let multiplier = 1
    for (let k = tempArray.length - 1; k > -1; k--) {
      multiplier = multiplier * tempArray[k]
      sumOfPercentages = sumOfPercentages + multiplier
    }

  }

  return sumOfPercentages * 100;
}