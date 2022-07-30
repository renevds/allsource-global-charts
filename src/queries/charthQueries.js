import {chartDataFetch, chartDataFetchNoLZW} from "../config/axiosConfig";

export function anySaleInEthForPeriodHashV(contractAddress, periodInDays, showLoans) {
  return chartDataFetch('/anySaleInEthForPeriodHashV', {
    params: {
      contractAddress,
      periodInDays,
      showLoans
    }
  }).then(a => a.data.data)
}

export function averagePerDaySaleForPeriod(contractAddress, periodInDays) {
  return chartDataFetch('/averagePerDaySaleForPeriod', {params: {contractAddress, periodInDays}}).then(a => a.data.data)
}

export function minMaxPerDaySaleForPeriod(contractAddress, periodInDays) {
  return chartDataFetch('/maxMinPerDaySaleForPeriod', {params: {contractAddress, periodInDays}}).then(a => a.data.data)
}

export function momentumPerDayForPeriod(contractAddress, periodInDays) {
  return chartDataFetch('/momentumPerDayForPeriod', {params: {contractAddress, periodInDays}}).then(a => a.data.data)
}

export function marginPerSale(contractAddress) {
  return chartDataFetch('/marginPerSale', {params: {contractAddress}}).then(a => a.data.data)
}

export function holdersPeriodDistribution(contractAddress) {
  return chartDataFetch('/holdersPeriodDistribution', {params: {contractAddress}}).then(a => a.data.data)
}

export function holdingAmountDistribution(contractAddress) {
  return chartDataFetch('/holdingAmountDistribution', {params: {contractAddress}}).then(a => a.data.data)
}

export function uniqueHoldersOverTimeNZT(contractAddress) {
  return chartDataFetch('/uniqueHoldersOverTimeNZT', {params: {contractAddress}}).then(a => a.data.data)
}

export function uniqueHoldersOverTime(contractAddress) {
  return chartDataFetch('/uniqueHoldersOverTime', {params: {contractAddress}}).then(a => a.data.data)
}

export function holdersInProfit(contractAddress) {
  return chartDataFetch('/holdersInProfit', {params: {contractAddress}}).then(a => a.data.data)
}

export function volatilityScore(contractAddress) {
  return chartDataFetchNoLZW('/volatilityScore', {params: {contractAddress}}).then(a => a.data)
}

export function floorAndMarketCap(contractAddress) {
  return chartDataFetchNoLZW('/floorAndMarketCap', {params: {contractAddress}}).then(a => a.data)
}