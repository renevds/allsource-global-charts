import {CompactFloorPriceChart, SaleForPeriodChart} from "./export";

const address = "0x23581767a106ae21c074b2276D25e5C3e136a68b"

function App() {
  return (
    <div className="charts__container">
      <SaleForPeriodChart address={address}/>
      <div style={{width: "50%"}}>
        <CompactFloorPriceChart contractAddress={address} saveToSession={true}/>
      </div>
      
    </div>
  );
}

export default App;
