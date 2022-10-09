import {chartDataFetch, chartDataFetchNoLZW} from "@allsource/config.axios_instances";


export function anySaleInEthForPeriod(contractAddress, periodInDays, showLoans) {
  return chartDataFetch.get('/anySaleInEthForPeriodTags', {
    params: {
      contractAddress,
      periodInDays,
      showLoans
    }
  }).then(a => a.data.data)
}

export function averagePerDaySaleForPeriod(contractAddress, periodInDays) {
  return chartDataFetch.get('/averagePerDaySaleForPeriod', {params: {contractAddress, periodInDays}}).then(a => a.data.data)
}

export function minMaxPerDaySaleForPeriod(contractAddress, periodInDays) {
  return chartDataFetch.get('/maxMinPerDaySaleForPeriod', {params: {contractAddress, periodInDays}}).then(a => a.data.data)
}

export function momentumPerDayForPeriod(contractAddress, periodInDays) {
  return chartDataFetch.get('/momentumPerDayForPeriod', {params: {contractAddress, periodInDays}}).then(a => a.data.data)
}

export function marginPerSale(contractAddress) {
  return chartDataFetch.get('/marginPerSale', {params: {contractAddress}}).then(a => a.data.data)
}

export function holdersPeriodDistribution(contractAddress) {
  return chartDataFetch.get('/holdersPeriodDistribution', {params: {contractAddress}}).then(a => a.data.data)
}

export function holdingAmountDistribution(contractAddress) {
  return chartDataFetch.get('/holdingAmountDistribution', {params: {contractAddress}}).then(a => a.data.data)
}

export function uniqueHoldersOverTimeNZT(contractAddress) {
  return chartDataFetch.get('/uniqueHoldersOverTimeNZT', {params: {contractAddress}}).then(a => a.data.data)
}

export function uniqueHoldersOverTime(contractAddress) {
  return chartDataFetch.get('/uniqueHoldersOverTime', {params: {contractAddress}}).then(a => a.data.data)
}

export function holdersInProfit(contractAddress) {
  return chartDataFetch.get('/holdersInProfit', {params: {contractAddress}}).then(a => a.data.data)
}

export function volatilityScore(contractAddress) {
  return chartDataFetchNoLZW.get('/volatilityScore', {params: {contractAddress}}).then(a => a.data)
}

export function floorAndMarketCap(contractAddress, days) {
  return chartDataFetchNoLZW.get('/floorAndMarketCap', {params: {contractAddress, days}}).then(a => a.data)
}

export function profitPerDay(contractAddress) {
  return chartDataFetch.get('/profitPerDay', {params: {contractAddress}}).then(a => a.data.data)
}

export function getMintCharts(contractAddress){
  return chartDataFetchNoLZW.get('/getMintCharts', {params: {contractAddress}}).then(a => a.data)
}
