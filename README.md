# allsource global chart

This NPM library contains charts used in several nodes.   
All are written in react.

### Install

```npm i degen-charts --save```

### Usage

Following charts are available:

- SaleForPeriodChart
- VolumeChart
- FloorPriceChart
- ProfitPerSaleChart
- HoldingAmountDistributionChart
- HoldingPeriodDistributionChart
- HoldersChart
- VolatilitySpeedometer
- CompactFloorPriceChart

Use like so (arguments depend on chart):
```js
import {CompactFloorPriceChart} from "degen-charts";
//...
<CompactFloorPriceChart contractAddress={addr}/>
```