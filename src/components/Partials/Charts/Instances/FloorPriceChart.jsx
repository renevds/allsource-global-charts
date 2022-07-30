//Queries
import {averagePerDaySaleForPeriod} from "../../../../queries/charthQueries";

//Components
import ScatterTrendChart from "../Types/ScatterTrendChart";

const FloorPriceChart = ({address}) => {
  return (<ScatterTrendChart defaultEndpoint="31D"
                             durationMap={{
                               "7D": 7,
                               "14D": 14,
                               "31D": 31,
                               "3M": 90,
                               "1Y": 365,
                             }}
                             dataEndpoint={async () => averagePerDaySaleForPeriod(address, 365)}
                             xKey="timestamp"
                             yKey="volume"
                             lineFormatter={toolTipItem => {
                               return `Tx ${toolTipItem.parsed.y.toLocaleString()}`
                             }}/>)
}

export default FloorPriceChart;