//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ChartToggle from "../Base/ChartToggle";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import annotationPlugin from 'chartjs-plugin-annotation';

//Utils
import {filterOutliers, getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {marginPerSale} from "../../../../chart_queries";
import {simpleScatterDataset} from "../../../../ChartUtils/datasets/datasetTemplates";

//Icons
import {faMagnifyingGlassChart} from "@fortawesome/free-solid-svg-icons";


const durationMap = {
  "24H": 1,
  "7D": 7,
  "14D": 14,
  "30D": 30,
  "3M": 90
}

const ProfitPerSaleChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("14D");
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);
  const [outliers, setOutliers] = useState(false);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(data, "timestamp");
        const newInitialMin = Math.max(Date.now() - dayTimestampDuration * durationMap[active], getMin(data, "timestamp"));
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setIsLoading(false);
        setVersion(version + 1);
      } catch (e) {
        setError(e);
      }
    }
  }, [active, init])

  if (!init) {
    marginPerSale(address).then(a => {
      setInit(true);
      setData(a);
    })
  }

  const chartOptions = {
    interaction: {
      mode: "point",
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
        type: "linear",
        position: 'left',
        title: {
          display: true,
          text: "Gain %",
          color: '#ffffff'
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          mode: "x",
          enabled: true
        },
        limits: {
          xAxes: {
            min: getMin(data, "timestamp"),
            max: Date.now()
          }
        }
      },
      tooltip: {
        mode: "point",
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            borderColor: 'rgba(255,255,255,0.5)',
            borderWidth: 3,
            scaleID: 'yAxes',
            value: 0,
            label: {
              enabled: false
            }
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

  const scatterFormatter = toolTipItem => {
    return `Held for ${Math.floor(toolTipItem.raw.holdingTime)} days` +
      ` | Gain ${toolTipItem.raw.percentageGain.toLocaleString()}%` +
      ` | bought for ${(toolTipItem.raw.saleValue - toolTipItem.raw.ethGain).toLocaleString()} Ξ` +
      ` | sold for ${(toolTipItem.raw.saleValue).toLocaleString()} Ξ`
  }

  let filteredData = data;

  if (!outliers) {
    filteredData = filterOutliers(data, "percentageGain")
  }

  const pointRadius = 2;

  const chartData = {
    version,
    datasets: [
      {
        ...simpleScatterDataset,
        data: filteredData.filter(a => a["percentageGain"] > 0),
        pointBackgroundColor: '#ffffff',
        pointRadius: pointRadius,
        hoverRadius: pointRadius,
        tooltip: {
          callbacks: {
            label: scatterFormatter,
          }
        },
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "percentageGain"
        }
      },
      {
        ...simpleScatterDataset,
        data: filteredData.filter(a => a["percentageGain"] <= 0),
        pointBackgroundColor: 'rgba(255,108,82,0.5)',
        pointRadius: pointRadius,
        hoverRadius: pointRadius,
        tooltip: {
          callbacks: {
            label: scatterFormatter,
          }
        },
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "percentageGain"
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
                   plugins={[]}
                   controls={[<ChartToggle name={<FontAwesomeIcon style={{color: "#b0b0b0"}} icon={faMagnifyingGlassChart}/>} onToggle={a => {
                     setOutliers(!outliers);
                     setVersion(version + 1);
                   }} initChecked={!outliers} tooltip="Hide outliers"/>]}/>
  );
}

export default ProfitPerSaleChart;