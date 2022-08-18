//Queries
import {floorAndMarketCap} from "@allsource/queries.chart_queries";

//Components
import BasicCompactLineChart from "../Types/BasicCompactLineChart";


const CompactFloorPriceChart = ({contractAddress, historicalData, saveToSession}) => {
  const callback = historicalData ? async () => historicalData : async () => floorAndMarketCap(contractAddress);
  return (<BasicCompactLineChart key={contractAddress}
                                 dataEndpoint={callback}
                                 xKey="timestamp"
                                 yKey="floorPrice"
                                 saveToSessionName={saveToSession && `CompactFloorPriceChart-${contractAddress}`}/>)
}

export default CompactFloorPriceChart;