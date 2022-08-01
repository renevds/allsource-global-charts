//Queries
import {
  anySaleInEthForPeriodHashV,
  averagePerDaySaleForPeriod,
  minMaxPerDaySaleForPeriod,
  momentumPerDayForPeriod
} from "../../../../queries/charthQueries";

//Components
import MinMaxScatterChart from "../Types/MinMaxScatterChart";

//TODO this chart infinite loops

const SaleForPeriodChart = ({address}) => {
  return (
    <MinMaxScatterChart key={address}
                        defaultEndpoint="3M"
                        durationMap={{
                          "7D": 7,
                          "14D": 14,
                          "31D": 31,
                          "3M": 90,
                          "1Y": 365,
                        }}
                        scatterMap={{
                          "7D": true,
                          "14D": true,
                          "31D": false,
                          "3M": false,
                          "1Y": false,
                        }}
                        scatterEndpoint={async (showLoans) => anySaleInEthForPeriodHashV(address, 365, showLoans)}
                        scatterXAxisKey="timestamp"
                        scatterYAxisKey="ethValue"
                        scatterFormatter={toolTipItem => {
                          return `Price Ξ ${toolTipItem.raw.ethValue.toLocaleString()} | ID ${toolTipItem.raw.id}`
                        }}
                        averageEndpoint={async () => averagePerDaySaleForPeriod(address, 365)}
                        averageXAxisKey="timestamp"
                        averageYAxisKey="averageValue"
                        averageFormatter={toolTipItem => {
                          return `Avg Ξ ${toolTipItem.parsed.y.toLocaleString()}`
                        }}
                        minMaxEndpoint={async () => minMaxPerDaySaleForPeriod(address, 365)}
                        minYAxisKey="minValue"
                        maxYAxisKey="maxValue"
                        minMaxXAxisKey="timestamp"
                        maxFormatter={toolTipItem => {
                          return `Max Ξ ${toolTipItem.parsed.y.toLocaleString()}`
                        }}
                        minFormatter={toolTipItem => {
                          return `Min Ξ ${toolTipItem.parsed.y.toLocaleString()}`
                        }}
                        momentumEndpoint={() => momentumPerDayForPeriod(address, 365)}
                        momentumXKey="timestamp"
                        priceMomentumYKey="priceMomentum"
    />
  )
}

export default SaleForPeriodChart;