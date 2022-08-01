import {CompactFloorPriceChart, SaleForPeriodChart, VolatilitySpeedometer} from "./export";

const address = "0x23581767a106ae21c074b2276D25e5C3e136a68b"

function App() {
  return (
    <div className="charts__container">
      <div style={{height: "400px"}}>
        <SaleForPeriodChart address={address}/>
      </div>
      <div style={{width: "50%"}}>
        <CompactFloorPriceChart contractAddress={address} saveToSession={true}/>
      </div>
      <div style={{width: "99px", height: "65px"}}>
        <CompactFloorPriceChart contractAddress={address} saveToSession={true}/>
      </div>
      <div style={{width: "50%"}}>
        <VolatilitySpeedometer contractAddress={address} saveToSession={true}/>
      </div>
    </div>
  );
}

export default App;
