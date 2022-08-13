//Queries
import {
  anySaleInEthForPeriodHashV,
  averagePerDaySaleForPeriod
} from "../../../../queries/charthQueries";

//Components
import BigScatterChart from "../Types/BigScatterChart";

//TODO this chart infinite loops

const SaleForPeriodChart = ({address}) => {
  return (
    <BigScatterChart key={address}
                     defaultEndpoint="3M"
                     durationMap={{
                       "7D": 7,
                       "14D": 14,
                       "31D": 31,
                       "3M": 90,
                       "1Y": 365,
                     }}
                     radiusMap={{
                       "7D": 5,
                       "14D": 4,
                       "31D": 3,
                       "3M": 2,
                       "1Y": 1,
                     }}
                     scatterEndpoint={async (showLoans) => anySaleInEthForPeriodHashV(address, 365, showLoans)}
                     scatterXAxisKey="timestamp"
                     scatterYAxisKey="ethValue"
                     scatterFormatter={toolTipItem => {
                       return `ID ${toolTipItem.raw.id} for ${" ".repeat(5 - toolTipItem.raw.id.length)} Ξ ${toolTipItem.raw.ethValue.toLocaleString()}`
                     }}
                     averageEndpoint={async () => averagePerDaySaleForPeriod(address, 365)}
                     averageXAxisKey="timestamp"
                     averageYAxisKey="averageValue"
                     onClick={e => {
                       if (e.chart.tooltip.dataPoints.length > 0) {
                         window.open(`https://etherscan.io/tx/${e.chart.tooltip.dataPoints[0].raw.hash}`, '_blank').focus();
                       }
                     }}
                     scatterFormatterMany={many => {
                       let price = 0;
                       many.forEach(toolTipItem => {
                         price += toolTipItem.raw.ethValue;
                       })
                       price /= many.length;
                       return `${many.length} sales around Ξ ${price.toLocaleString()}`
                     }}
    />
  )
}

export default SaleForPeriodChart;