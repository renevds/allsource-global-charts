//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import ChartToggle from "../Base/ChartToggle";

//Hooks
import {useEffect, useRef, useState} from "react";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";

//Utils
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {simpleLineDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartBlue, chartPurple} from "../../../../ChartUtils/Utils/chartColors";

//Queries
import {profitPerDay} from "../../../../chart_queries";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "30D": 30,
  "3M": 90,
  "1Y": 365,
}

const HoldersChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("30D");
  const [profitPerDayData, setProfitPerDayData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [logarithmic, setLogarithmic] = useState(false);
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(profitPerDayData, "day");
        const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1);
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
        const profitPerDayData = await profitPerDay(address);
        setInit(true);
        setProfitPerDayData(profitPerDayData);
      } catch (e) {
        setError("Chart data not available.");
        setInit(true);
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
        max: Date.now(),
        min: initialXMin
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
        title: {
          display: true,
          text: "Profit",
          color: chartBlue,
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          mode: "nearest",
          axis: 'x',
          enabled: true
        },
        limits: {
          xAxes: {
            min: getMin(profitPerDayData, "day"),
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
        borderColor: chartPurple,
        data: profitPerDayData,
        parsing: {
          xAxisKey: "day",
          yAxisKey: "margin"
        },
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Smart filtered holders: ${toolTipItem.parsed.y.toLocaleString()}`
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
                   stats={[]}
                   plugins={[toolTipLinePlugin]}
                   controls={[<ChartToggle key={1} name="Log" onToggle={a => {
                     setLogarithmic(a);
                     setVersion(version + 1);
                   }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}
                   error={error}/>
  );
}

export default HoldersChart;