import {
  CompactFloorPriceChart,
  HoldersChart,
  HoldingAmountDistributionChart,
  HoldingPeriodDistributionChart,
  ProfitPerSaleChart,
  SaleForPeriodChart,
  VolatilitySpeedometer,
  VolumeTxChart
} from "./export";
import {useState} from "react";
import ProfitPerDayChart from "./components/Partials/Charts/Instances/ProfitPerDayChart";
import MintingHistoryChart from "./components/Partials/Charts/Instances/MintingHistoryChart";

function App() {

  const possibleAddresses = [
    {'Kajuzu King': '0x0c2E57EFddbA8c768147D1fdF9176a0A6EBd5d83'},
    {'Moonbirds': '0x23581767a106ae21c074b2276D25e5C3e136a68b'},
    {' Zodiac Capsules': '0x35E1402Fa69C60851EA8b86f04d823ff41796a51'},
    {'Woodies': '0x134460d32fc66A6d84487C20DCD9fdcF92316017'},
    {'Axolittles': '0xf36446105fF682999a442b003f2224BcB3D82067'},
    {'Toyboogers': '0xBF662A0e4069b58dFB9bceBEBaE99A6f13e06f5a'},
    {'HashDemons': '0x032Dd2A3c6d234AA9620d65eb618FCdC72Be3dBb'},
    {'Hunnys': '0x5DFEB75aBae11b138A16583E03A2bE17740EADeD'},
    {'Bored Ape Yacht Club': '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'},
    {'Cryptoburbs': '0x3e55D389D352f4905961a6B32cA53B2F229Fed73'},
    {'CHFTY': '0xA720E16603f81CD82FaAE15AE16F1aCfE88ddF0F'},
    {'posersnft': '0x02BeeD1404c69e62b76Af6DbdaE41Bd98bcA2Eab'},
    {'DigiDaigakuSpirits': '0xa8824EeE90cA9D2e9906D377D36aE02B1aDe5973'},
    {'Broken': 'a'},
    {'Pixelmon': '0x32973908FaeE0Bf825A343000fE412ebE56F802A'}]

  const [address, setAddress] = useState("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D")


  return (
    <div className="charts__container">
      <div>
        {possibleAddresses.map(a => {
            const name = Object.keys(a)[0];
            const value = Object.values(a)[0];
            return (<button key={value} disabled={value === address} onClick={() => setAddress(value)}>{name}</button>)
          }
        )}
      </div>
      <div style={{width: "50%"}}>
        <VolatilitySpeedometer contractAddress={address} saveToSession={true} key={address}/>
      </div>
      <div style={{width: "99px", height: "65px"}}>
        <CompactFloorPriceChart contractAddress={address} saveToSession={true} key={address}/>
      </div>
      <div className="test__row">
        <SaleForPeriodChart address={address} key={address}/>
      </div>
      <div className="test__row">
        <VolumeTxChart address={address} key={address}/>
      </div>
      <div className="test__row">
        <ProfitPerSaleChart address={address} key={address}/>
      </div>
      <div style={{width: "500px", height: "300px"}}>
        <HoldingAmountDistributionChart address={address} key={address}/>
      </div>
      <div style={{width: "500px", height: "300px"}}>
        <HoldingPeriodDistributionChart address={address} key={address}/>
      </div>
      <div className="test__row">
        <HoldersChart address={address} key={address}/>
      </div>
      <div className="test__row">
        <ProfitPerDayChart address={address} key={address}/>
      </div>
      <div className="test__row">
        <MintingHistoryChart address={address} key={address}/>
      </div>
    </div>
  );
}

export default App;
