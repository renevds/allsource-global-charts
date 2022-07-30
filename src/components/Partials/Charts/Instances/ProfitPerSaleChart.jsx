//Queries
import {marginPerSale} from "../../../../queries/charthQueries";

//Components
import PosNegScatterLineChart from "../Types/PosNegScatterLineChart";

const ProfitPerSaleChart = ({address}) => {
  return (<PosNegScatterLineChart defaultEndpoint="31D"
                                  durationMap={{
                                    "7D": 7,
                                    "14D": 14,
                                    "31D": 31,
                                    "3M": 90,
                                    "1Y": 365,
                                  }}
                                  dataEndpoint={async () => {
                                    return marginPerSale(address); // TODO remove place holder
                                  }}
                                  xKey="timestamp"
                                  scatterYKey="percentageGain"
                                  lineYKey="ethGain"
                                  lineFormatter={toolTipItem => {
                                    return `Price Ξ ${toolTipItem.parsed.y.toLocaleString()}`
                                  }}
                                  scatterFormatter={toolTipItem => {
                                    return `Gain ${toolTipItem.parsed.y.toLocaleString()}%`
                                  }}
                                  scatterAxesLabel="Gain %"
                                  lineAxesLabel="Price Ξ"
  />)
}

export default ProfitPerSaleChart;