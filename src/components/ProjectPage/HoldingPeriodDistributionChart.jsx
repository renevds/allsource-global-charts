//Queries
import {holdersPeriodDistribution, holdingAmountDistribution} from "../../queries/charthQueries";

//Components
import DonutChartWithLegend from "../Partials/Charts/Types/DonutChartWithLegend";

const HoldingPeriodDistributionChart = ({address}) => {
  return (<DonutChartWithLegend defaultEndpoint="31D"
                                durationMap={{
                        "7D": 7,
                        "14D": 14,
                        "31D": 31,
                        "3M": 90,
                        "1Y": 365,
                      }}
                                dataEndpoint={async () => holdersPeriodDistribution(address).then(a => a.reverse())}
                                valueKey="percentualHolders"
                                formatter={toolTipItem => {
                        return `${(Math.round(100 * toolTipItem.raw) / 100).toLocaleString() + "% " + toolTipItem.label}`
                      }}
                                labelKey="rangeName"/>)
}

export default HoldingPeriodDistributionChart;