//Queries
import {volatilityScore} from "../../../../chart_queries";

//Components
import Speedometer from "../Types/Speedometer";

const VolatilitySpeedometer = ({contractAddress, speedometerValue, saveToSession=false}) => {
  const callback = speedometerValue ? async () => speedometerValue : async () => volatilityScore(contractAddress).then(a => a.value);
  return (
    <Speedometer key={contractAddress}
                 dataEndpoint={callback}
                 range={100}
                 saveToSessionName={saveToSession && `VolatilitySpeedometer-${contractAddress}`}/>
  )
}

export default VolatilitySpeedometer;