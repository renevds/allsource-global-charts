//Queries
import {floorAndMarketCap, volatilityScore} from "../../../../queries/charthQueries";

//Components
import BasicCompactLineChart from "../Types/BasicCompactLineChart";

const CompactFloorPriceChart= ({contractAddress, historicalData  }) => {
  const callback = historicalData  ? async () => historicalData  : async () => floorAndMarketCap(contractAddress);
  return (<BasicCompactLineChart dataEndpoint={callback} xKey="timestamp" yKey="floorPrice"/>)
}

export default CompactFloorPriceChart;