//Queries
import {holdingAmountDistribution} from "../../queries/charthQueries";

//Components
import DonutChartWithLegend from "../Partials/Charts/Types/DonutChartWithLegend";

const HoldingAmountDistributionChart = ({address}) => {
  return (<DonutChartWithLegend dataEndpoint={async () => holdingAmountDistribution(address)}
                                valueKey="percentualHolders"
                                formatter={toolTipItem => {
                        return `${(Math.round(100 * toolTipItem.raw) / 100).toLocaleString() + "% " + toolTipItem.label}`
                      }}
                                labelKey="rangeName"/>)
}

export default HoldingAmountDistributionChart;