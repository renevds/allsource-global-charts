//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ChartStat from "../Base/ChartStat";

//Utils
import {getDataBetween, getMin,} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {getMintCharts} from "../../../../chart_queries";
import {simpleScatterDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {horizontalBlueGreenGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Icons
import {
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";

const xKey = "timestamp";
const amountKey = "amount";

const durationMap = {
  "7D": 7,
  "30D": 30,
  "ALL": Infinity
}

const MintingHistoryChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("ALL");
  const [data, setData] = useState([]);
  const [pannedData, setPannedData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMin = data[0][xKey];
        const newInitialMax = Math.min(data[data.length - 1][xKey], newInitialMin + durationMap[active] * dayTimestampDuration);
        const newPannedData = getDataBetween(data, xKey, newInitialMin, newInitialMax);
        setPannedData(newPannedData);
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setIsLoading(false);
        setVersion(version + 1);
      } catch (e) {
        console.log(e);
        setError("Chart data not available.");
        setInit(true);
      }
    }
  }, [active, init])

  if (!init) {
    getMintCharts(address).then(a => {
      setData(a.mintsOverTime.map((a, i) => ({[amountKey]: i + 1, timestamp: a * 1000})));
      setInit(true);
    }).catch(e => setError("Chart data not available."));
  }

  const chartOptions = {
    onClick: e => {
    },
    interaction: {
      mode: "nearest",
      intersect: "false"
    },
    scales: {
      xAxes: {
        type: 'time',
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: "linear",
        position: 'left',
        title: {
          display: true,
          text: "Amount",
          color: horizontalBlueGreenGradient
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          onPan: ({chart}) => {
            const newPannedData = getDataBetween(data, xKey, chart.scales.xAxes.min, chart.scales.xAxes.max);
            setPannedData(newPannedData);
          },
          mode: "x",
          enabled: true
        },
        limits: {
          xAxes: {
            min: getMin(data, xKey),
            max: data[data.length - 1]?.[xKey]
          }
        }
      },
      tooltip: {
        mode: "nearest",
        intersect: "false",
        callbacks: {
          beforeBody: (toolTipItems) => {
            return `Total mints ${toolTipItems[0].raw.amount}`
          },
          label: () => {
            return false
          }
        }
      }
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
        ...simpleScatterDataset,
        data: pannedData,
        pointRadius: 1,
        parsing: {
          xAxisKey: xKey,
          yAxisKey: amountKey
        }
      }
    ]
  }
  const chartRef = useRef(null);

  return (
    <div style={{width: "100%", height: "100%", position: "relative"}}>
      <BaseLineChart chartData={chartData}
                     chartRef={chartRef}
                     error={error}
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
                     stats={[<ChartStat key={1} name="Total Mints"
                                        value={pannedData.length}
                                        icon={<FontAwesomeIcon icon={faChartColumn}/>}
                                        valueSign={""}/>]}/>
    </div>
  );
}

export default MintingHistoryChart;