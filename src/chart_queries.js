import {chartDataFetch, chartDataFetchNoLZW} from "@allsource/config.axios_instances";


export function anySaleInEthForPeriod(contractAddress, periodInDays) {
  return chartDataFetchNoLZW.get('/v2/salesHistory', {
    params: {
      contractAddress,
      periodInDays
    }
  }).then(a => a.data)
}

export function txnAndVol(contractAddress, periodInDays) {
  return chartDataFetchNoLZW.get('/v2/txnAndVol', {params: {contractAddress, periodInDays}}).then(a => a.data)
}
export function profitPerSale(contractAddress, periodInDays) {
  return chartDataFetchNoLZW.get('/v2/profitPerSale', {params: {contractAddress, periodInDays}}).then(a => a.data)
}

export function holdersPeriodDistribution(contractAddress) {
  return chartDataFetchNoLZW.get('/v2/holdingPeriodDistribution', {params: {contractAddress}}).then(a => a.data)
}

export function holdingAmountDistribution(contractAddress) {
  return chartDataFetchNoLZW.get('/v2/holdingAmountDistribution', {params: {contractAddress}}).then(a => a.data)
}

export function holderOverTime(contractAddress, periodInDays) {
  return chartDataFetchNoLZW.get('/v2/holdersOverTime', {params: {contractAddress, periodInDays}}).then(a => a.data)
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

export function getListingsData(contractAddress){
  return chartDataFetchNoLZW.get('/v2/getListingsData', {params: {contractAddress}}).then(a => a.data)
}