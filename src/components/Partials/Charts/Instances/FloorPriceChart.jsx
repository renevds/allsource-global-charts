//Queries
import {averagePerDaySaleForPeriod, floorAndMarketCap} from "@allsource/queries.chart_queries";

//Components
import ScatterTrendChart from "../Types/ScatterTrendChart";

const FloorPriceChart = ({address}) => {
  return (<ScatterTrendChart key={address}
                             defaultEndpoint="14D"
                             durationMap={{
                               "7D": 7,
                               "14D": 14
                             }}
                             dataEndpoint={async () => floorAndMarketCap(address)}
                             xKey="timestamp"
                             yKey="floorPrice"
                             lineFormatter={toolTipItem => {
                               return `Floor Ξ ${toolTipItem.parsed.y.toLocaleString()}`
                             }}/>)
}

export default FloorPriceChart;