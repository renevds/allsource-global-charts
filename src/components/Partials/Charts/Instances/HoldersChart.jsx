import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";
import ChartToggle from "../Base/ChartToggle";
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {holdersInProfit, uniqueHoldersOverTime, uniqueHoldersOverTimeNZT} from "../../../../chart_queries"
import {simpleLineDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartBlue, chartPurple} from "../../../../ChartUtils/Utils/chartColors";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "31D": 31,
  "3M": 90,
  "1Y": 365,
}

const HoldersChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("31D");
  const [uniqueHoldersNZTData, setUniqueHoldersNZTData] = useState([]);
  const [uniqueHoldersData, setUniqueHoldersData] = useState([]);
  const [uniqueHoldersInProfitData, setUniqueHoldersInProfitData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [logarithmic, setLogarithmic] = useState(false);
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(uniqueHoldersNZTData, "timestamp");
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
      const uniqueHoldersNZT = await uniqueHoldersOverTimeNZT(address).then(b => b.map(a => {
          a.timestamp = new Date(a.day).getTime();
          return a;
        }
      ));
      const uniqueHolders = await uniqueHoldersOverTime(address).then(b => b.map(a => {
        a.timestamp = new Date(a.day).getTime();
        return a;
      }));
      setInit(true);
      setUniqueHoldersNZTData(uniqueHoldersNZT);
      setUniqueHoldersData(uniqueHolders);
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
        ticks: {
          autoSkip: true
        },
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
        title: {
          display: true,
          text: "Holders",
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
            min: getMin(uniqueHoldersNZTData, "timestamp"),
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
        data: uniqueHoldersData,
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "holdersNumber"
        },
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Holders: ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        },
      },
      {
        ...simpleLineDataset,
        borderColor: chartPurple,
        data: uniqueHoldersNZTData,
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "holdersNumber"
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
                   }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}/>
  );
}

export default HoldersChart;