# allsource global chart

This NPM library contains charts used in several nodes.   
All are written in react.

### Install

```npm i degen-charts --save```

### Help
To get started you can look at the comments in `src\components\Partials\Charts\Instances\HoldersChart.jsx`.
This is a simple chart.

### Usage

Following charts are available:

- SaleForPeriodChart
- VolumeTxChart
- FloorPriceChart
- ProfitPerSaleChart
- HoldingAmountDistributionChart
- HoldingPeriodDistributionChart
- HoldersChart
- VolatilitySpeedometer
- CompactFloorPriceChart
- Speedometer

Use like so (arguments depend on chart):
```js
import {CompactFloorPriceChart} from "degen-charts";
//...
<CompactFloorPriceChart contractAddress={addr}/>
```