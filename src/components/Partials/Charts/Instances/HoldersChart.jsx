//Queries
import {holdersInProfit, uniqueHoldersOverTime, uniqueHoldersOverTimeNZT} from "@allsource/queries.chart_queries";

//Components
import BasicTwoLineChart from "../Types/BasicTwoLineChart";

const HoldersChart = ({address}) => {
  return (<BasicTwoLineChart key={address}
                             defaultEndpoint="31D"
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
                               return `Holders NZT ${toolTipItem.parsed.y.toLocaleString()}`
                             }}
                             secondDataEndpoint={async () => uniqueHoldersOverTime(address).then(b => b.map(a => {
                               a.timestamp = new Date(a.day).getTime();
                               return a;
                             }))}
                             secondXKey="timestamp"
                             secondYKey="holdersNumber"
                             secondFormatter={toolTipItem => {
                               return `Holders ${toolTipItem.parsed.y.toLocaleString()}`
                             }}/>)
}

export default HoldersChart;