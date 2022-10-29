//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import ChartStat from "../Base/ChartStat";

//Hooks
import {useEffect, useRef, useState} from "react";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";

//Utils
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {simpleLineDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {
  chartBlue,
  chartPurple,
  FUDerColor,
  goldfingerColor,
  whaleColor
} from "../../../../ChartUtils/Utils/chartColors";

//Queries
import {holderOverTime, uniqueHoldersOverTimeNZT} from "../../../../chart_queries"

//Images
import WhaleLogo from '../../../../images/whale.svg';
import GoldfingerLogo from '../../../../images/goldfinger.svg';
import FUDerLogo from '../../../../images/fuder.svg';

//Style
import './HoldersTagChart.css';

const durationMap = {
  "7D": 7,
  "30D": 30,
  "ALL": Infinity,
}

const timestampKey = "ts";
const onlyNZTKey = "onlyNZT";
const whalesKey = "whales";
const goldFingersKey = "goldFingers";
const FUDersKey = "fuders";

const HolderTagsChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("7D");
  const [holdersData, setHoldersData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);
  const [whales, setWhales] = useState(0);
  const [goldfingers, setGoldfingers] = useState(0);
  const [FUDers, setFUDers] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(holdersData, timestampKey);
        const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1);
        const last = holdersData[holdersData.length - 1];
        setWhales(last[whalesKey]);
        setGoldfingers(last[goldFingersKey]);
        setFUDers(last[FUDersKey]);
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setIsLoading(false);
        setVersion(version + 1);
      } catch (e) {
        setError(e);
      }
    }
  }, [active, init])

  useEffect(() => {
    const load = async () => {
      try {
        const holders = await holderOverTime(address, 3650);
        if(holders[onlyNZTKey].length === 0){
          throw 'No holders';
        }
        setHoldersData(holders[onlyNZTKey]);
        setInit(true);
      } catch (e) {
        setError("Chart data not available.");
      }
    }
    load();
  }, [])

  const chartOptions = {
    interaction: {
      mode: "nearest",
      axis: 'x',
      intersect: false
    },
    scales: {
      xAxes: {
        type: 'time',
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: "modifiedLinear",
        title: {
          display: true,
          text: "Holders",
          color: "#FFFFFF",
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          mode: 'x',
          enabled: true
        },
        limits: {
          xAxes: {
            min: getMin(holdersData, timestampKey),
            max: initialXMax
          }
        }
      },
      tooltip: {
        mode: "index",
        intersect: false
      },
    },
    transitions: {
      pan: {
        animation: {
          duration: 0
        }
      },
    }
  }
  const chartData = {
    version,
    datasets: [
      {
        ...simpleLineDataset,
        borderColor: whaleColor,
        pointBorderColor: whaleColor,
        data: holdersData,
        parsing: {
          xAxisKey: timestampKey,
          yAxisKey: whalesKey
        },
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Whales: ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        },
      },
      {
        ...simpleLineDataset,
        borderColor: goldfingerColor,
        pointBorderColor: goldfingerColor,
        data: holdersData,
        parsing: {
          xAxisKey: timestampKey,
          yAxisKey: goldFingersKey
        },
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Goldfingers: ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        }
      },
      {
        ...simpleLineDataset,
        borderColor: FUDerColor,
        pointBorderColor: FUDerColor,
        data: holdersData,
        parsing: {
          xAxisKey: timestampKey,
          yAxisKey: FUDersKey
        },
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `FUDers: ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        }
      }
    ]
  }
  const chartRef = useRef(null);

  return (
    <BaseLineChart chartData={chartData}
                   chartRef={chartRef}
                   buttons={Object.keys(durationMap).map(endpoint => <ChartButton key={endpoint}
                                                                                  text={endpoint}
                                                                                  active={endpoint === active}
                                                                                  onClick={() => {
                                                                                    if (endpoint !== active) {
                                                                                      setIsLoading(true);
                                                                                      setActive(endpoint);
                                                                                    }
                                                                                  }}/>
                   )}
                   chartOptions={chartOptions}
                   isLoading={isLoading}
                   stats={[<ChartStat key={1} name="Whale"
                                      value={<div className="holderstagchart__stat"><img
                                        className="holderstagchart__logo" src={WhaleLogo}/>{whales}</div>}
                                      textColor="#9352FF"/>,
                     <ChartStat key={2} name="Goldfinger"
                                value={<div className="holderstagchart__stat"><img className="holderstagchart__logo"
                                                                                   src={GoldfingerLogo}/>{goldfingers}
                                </div>}
                                textColor="#FFAE40"/>,
                     <ChartStat key={3} name="FUDer"
                                value={<div className="holderstagchart__stat"><img className="holderstagchart__logo"
                                                                                   src={FUDerLogo}/>{FUDers}</div>}
                                textColor="#FF2700"/>]}
                   error={error}
                   plugins={[toolTipLinePlugin]}
                   controls={[]}/>
  );
}

export default HolderTagsChart;