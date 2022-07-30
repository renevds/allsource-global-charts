//Queries
import {holdersInProfit, uniqueHoldersOverTimeNZT} from "../../../../queries/charthQueries";

//Components
import BasicLineChart from "../Types/BasicLineChart";

const HoldersChart = ({address}) => {
  return (<BasicLineChart defaultEndpoint="31D"
                          durationMap={{
                            "7D": 7,
                            "14D": 14,
                            "31D": 31,
                            "3M": 90,
                            "1Y": 365,
                          }}
                          dataEndpoint={async () => uniqueHoldersOverTimeNZT(address).then(b => b.map(a => {
                            a.timestamp = new Date(a.day).getTime();
                            return a;
                          }))}
                          xKey="timestamp"
                          yKey="holdersNumber"
                          formatter={toolTipItem => {
                            return `Holders ${toolTipItem.parsed.y.toLocaleString()}`
                          }}/>)
}

export default HoldersChart;