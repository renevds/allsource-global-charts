import React from 'react';
import ReactDOM from "react-dom/client";

import './index.css';
import SaleForPeriodChart from "./components/ProjectPage/SaleForPeriodChart";
import VolumeChart from "./components/ProjectPage/VolumeChart";
import FloorPriceChart from "./components/ProjectPage/FloorPriceChart";
import ProfitPerSaleChart from "./components/ProjectPage/ProfitPerSaleChart";
import HoldingAmountDistributionChart from "./components/ProjectPage/HoldingAmountDistributionChart";
import HoldingPeriodDistributionChart from "./components/ProjectPage/HoldingPeriodDistributionChart";
import HoldersChart from "./components/ProjectPage/HoldersChart";
import VolatilitySpeedometer from "./components/Partials/Charts/instances/VolatilitySpeedometer";
import CompactFloorPriceChart from "./components/Partials/Charts/instances/CompactFloorPriceChart";

const root = ReactDOM.createRoot(document.getElementById("root"));

const addr = "0x23581767a106ae21c074b2276D25e5C3e136a68b"

root.render(
  <div className="projectpage__row">
    <VolatilitySpeedometer contractAddress={addr}/>
    <div style={{width: '200px', height: '100px'}}>
      <CompactFloorPriceChart contractAddress={addr}/>
    </div>
    <div className="projectpage__col">
      <SaleForPeriodChart address={addr}/>
    </div>
    <div className="projectpage__col">
      <VolumeChart address={addr}/>
    </div>
    <div className="projectpage__col">
      <FloorPriceChart address={addr}/>
    </div>
    <div className="projectpage__col">
      <ProfitPerSaleChart address={addr}/>
    </div>
    <div className="projectpage__col__half">
      <HoldingAmountDistributionChart address={addr}/>
    </div>
    <div className="projectpage__col__half">
      <HoldingPeriodDistributionChart address={addr}/>
    </div>
    <div className="projectpage__col">
      <HoldersChart address={addr}/>
    </div>
  </div>
);
