import {
  CompactFloorPriceChart,
  FloorPriceChart, HoldersChart, HoldingAmountDistributionChart, HoldingPeriodDistributionChart, ProfitPerSaleChart,
  SaleForPeriodChart,
  VolatilitySpeedometer,
  VolumeChart
} from "./export";

const address = "0x23581767a106ae21c074b2276D25e5C3e136a68b"

function App() {
  return (
    <div className="charts__container">
      <div style={{width: "50%"}}>
        <VolatilitySpeedometer contractAddress={address} saveToSession={true}/>
      </div>
      <div style={{width: "99px", height: "65px"}}>
        <CompactFloorPriceChart contractAddress={address} saveToSession={true}/>
      </div>
      <div className="test__row">
        <SaleForPeriodChart address={address}/>
      </div>
      <div className="test__row">
        <VolumeChart address={address}/>
      </div>
      <div className="test__row">
        <FloorPriceChart address={address}/>
      </div>
      <div className="test__row">
        <ProfitPerSaleChart address={address}/>
      </div>
      <div className="test__row">
        <HoldingAmountDistributionChart address={address}/>
      </div>
      <div className="test__row">
        <HoldingPeriodDistributionChart address={address}/>
      </div>
      <div className="test__row">
        <HoldersChart address={address}/>
      </div>
    </div>
  );
}

export default App;
