import {
  ActiveListingsChart,
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
import HolderTagsChart from "./components/Partials/Charts/Instances/HolderTagsChart";
import TransactionList from "./components/Partials/Charts/Listings/TransactionList";
import FloorStrengthChart from "./components/Partials/Charts/Instances/FloorStrengthChart";

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
    {'Pixelmon': '0x32973908FaeE0Bf825A343000fE412ebE56F802A'},
    {'Murakaimi': '0x40958816c61a222BaE9B71867217322D84B21B01'},
    {'Moonbird Oddities': '0x1792a96E5668ad7C167ab804a100ce42395Ce54D'},
    {'Wave Catchers': '0x1A331c89898C37300CccE1298c62aefD3dFC016c'},
    {'Mutant Ape Yacht Club': '0x60E4d786628Fea6478F785A6d7e704777c86a7c6'},
    {'Doodles': '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e'},
    {'CandyRobbers': '0x33857Ad1031122A00A68E6Bf9Ac4475ba6c6F8be'}]


  const [address, setAddress] = useState("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D")
  const [section, setSection] = useState("main")

  return (
    <div className="charts__container">
      <button onClick={() => setSection("main")}>main</button>
      <button onClick={() => setSection("holder")}>holder</button>
      <div style={{width: "100%", height: "2px", backgroundColor: "#14F4C9"}}/>
      <div>
        {possibleAddresses.map(a => {
            const name = Object.keys(a)[0];
            const value = Object.values(a)[0];
            return (<button key={value} disabled={value === address} onClick={() => setAddress(value)}>{name}</button>)
          }
        )}
      </div>
      <div style={{width: "100%", height: "2px", backgroundColor: "#14F4C9", marginBottom: "50px"}}/>
      {section === 'main' ?
        <>
          <div className="test__row">
            <SaleForPeriodChart address={address} key={address}/>
          </div>
          <div className="test__row">
            <ActiveListingsChart address={address} key={address}/>
          </div>
          <div style={{backgroundColor: "var(--color-background-dark)", padding: "20px"}}>
            <div className="test__row"
                 style={{borderRadius: "16px", padding: "5px", backgroundColor: "var(--color-background-light)"}}>
              <FloorStrengthChart address={address} key={address}/>
            </div>
          </div>
          <div style={{width: "50%"}}>
            <VolatilitySpeedometer contractAddress={address} saveToSession={true} key={address}/>
          </div>
          <div style={{width: "99px", height: "65px"}}>
            <CompactFloorPriceChart contractAddress={address} saveToSession={true} key={address}/>
          </div>
          <div className="test__row">
            <VolumeTxChart address={address} key={address}/>
          </div>
          <div className="test__row">
            <ProfitPerSaleChart address={address} key={address}/>
          </div>
          <div className=""
               style={{backgroundColor: "#242127", paddingTop: '30px', paddingLeft: '26px', paddingRight: '26px'}}>
            <TransactionList address={address} key={address}/>
          </div>
        </>
        :
        <>
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
          <div className="test__row">
            <HolderTagsChart address={address} key={address}/>
          </div>
        </>
      }
    </div>
  );
}

export default App;
