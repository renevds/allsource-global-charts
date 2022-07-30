import moment from "moment";

//Components
import BarLineChart from "../Partials/Charts/Types/BarLineChart";

//Queries
import {averagePerDaySaleForPeriod} from "../../queries/charthQueries";

const VolumeChart = ({address}) => {
  return (<BarLineChart defaultEndpoint="31D"
                        durationMap={{
                          "7D": 7,
                          "14D": 14,
                          "31D": 31,
                          "3M": 90,
                          "1Y": 365,
                        }}
                        dataEndpoint={async () => averagePerDaySaleForPeriod(address, 365).then(b => b.map(a => {
                          a.label = moment(a.timestamp).format("LL");
                          return a;
                        }))}
                        labelKey="label"
                        barYkey="volume"
                        lineYKey="txCount"
                        barFormatter={toolTipItem => {
                          return `Vol Ξ ${toolTipItem.parsed.y.toLocaleString()}`
                        }}
                        lineFormatter={toolTipItem => {
                          return `Tx ${toolTipItem.parsed.y.toLocaleString()}`
                        }}
                        barAxesLabel="Volume Ξ"
                        lineAxesLabel="Transactions"/>)
}

export default VolumeChart;