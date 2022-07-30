//Queries
import {volatilityScore} from "../../../../queries/charthQueries";

//Components
import Speedometer from "../Types/Speedometer";

const VolatilitySpeedometer= ({contractAddress, speedometerValue }) => {
  const callback = speedometerValue ? async () => speedometerValue : async () => volatilityScore(contractAddress).then(a => a.value);
  return (<Speedometer dataEndpoint={callback} range={100}/>)
}

export default VolatilitySpeedometer;