//Queries
import {marginPerSale} from "../../../../queries/charthQueries";

//Components
import PosNegScatterLineChart from "../Types/PosNegScatterLineChart";

const ProfitPerSaleChart = ({address}) => {
  return (<PosNegScatterLineChart key={address}
                                  defaultEndpoint="7D"
                                  durationMap={{
                                    "7D": 7,
                                    "14D": 14,
                                    "31D": 31
                                  }}
                                  dataEndpoint={async () => {
                                    return marginPerSale(address); // TODO remove place holder
                                  }}
                                  xKey="timestamp"
                                  scatterYKey="percentageGain"
                                  lineYKey="ethGain"
                                  lineFormatter={() => {
                                    return ``
                                  }}
                                  scatterFormatter={toolTipItem => {
                                    return `Held for ${Math.floor(toolTipItem.raw.holdingTime)} days  |  Gain ${toolTipItem.raw.percentageGain.toLocaleString()}%`
                                  }}
                                  scatterAxesLabel="Gain %"
                                  lineAxesLabel="Price Ξ"
  />)
}

export default ProfitPerSaleChart;