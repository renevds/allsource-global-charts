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
import {
  filterOutliers,
  getAvg,
  getDataBetween,
  getMax,
  getMin,
  getSum
} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {marginPerSale} from "../../../../chart_queries";
import {simpleScatterDataset} from "../../../../ChartUtils/datasets/datasetTemplates";

//Icons
import {faChartLine, faCoins, faMagnifyingGlassChart, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import UrlsPopup from "../Base/UrlsPopup";
import ChartStat from "../Base/ChartStat";

const xKey = "timestamp";
const percentageGainKey = "percentageGain";
const ethGainKey = "ethGain";

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
  const [pannedData, setPannedData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);
  const [outliers, setOutliers] = useState(false);
  const [urls, setUrls] = useState([]);
  const [avg, setAvg] = useState(0);
  const [sum, setSum] = useState(0);
  const [amountInProfit, setAmountInProfit] = useState(0);
  const [amountInLoss, setAmountInLoss] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(data, xKey);
        const newInitialMin = Math.max(Date.now() - dayTimestampDuration * durationMap[active], getMin(data, xKey));
        const newPannedData = getDataBetween(data, xKey, newInitialMin, newInitialMax);
        setPannedData(newPannedData);
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setIsLoading(false);
        setVersion(version + 1);
      } catch (e) {
        setError(e);
        setInit(true);
      }
    }
  }, [active, init])

  useEffect(() => {
    setAvg(getAvg(pannedData, ethGainKey));
    setSum(getSum(pannedData, ethGainKey));
    setAmountInProfit(pannedData.filter(a => a[percentageGainKey] > 0).length);
    setAmountInLoss(pannedData.filter(a => a[percentageGainKey] <= 0).length);
  }, [pannedData])

  if (!init) {
    marginPerSale(address).then(a => {
      setInit(true);
      setData(a);
    }).catch(() => setError("Chart data not available."))
  }

  const chartOptions = {
    onClick: e => {
      const selected = e.chart.tooltip.dataPoints
      console.log(selected)
      const results = selected.map(dataPoint => ({
        name: `ID ${dataPoint.raw.tokenId} sold for Ξ ${dataPoint.raw.saleValue.toLocaleString()}`,
        url: `https://etherscan.io/tx/${dataPoint.raw.txHash}`
      }))

      if (results.length === 1) {
        setUrls([]);
        window.open(results[0].url, '_blank').focus();
      } else {
        setUrls(results);
      }
    },
    interaction: {
      mode: "nearest",
      intersect: "false"
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
            max: Date.now()
          }
        }
      },
      tooltip: {
        mode: "nearest",
        intersect: "false",
        callbacks: {
          beforeBody: (toolTipItems) => {
            return (toolTipItems.length > 1 ? `${toolTipItems.length} sales | ` : "") + scatterFormatter(toolTipItems[0])
          },
          label: () => {
            return false
          }
        }
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
      ` | Gain ${toolTipItem.raw[percentageGainKey].toLocaleString()}%` +
      ` | bought for ${(toolTipItem.raw.saleValue - toolTipItem.raw[ethGainKey]).toLocaleString()} Ξ` +
      ` | sold for ${(toolTipItem.raw.saleValue).toLocaleString()} Ξ`
  }

  let filteredData = pannedData;

  if (!outliers) {
    filteredData = filterOutliers(data, percentageGainKey)
  }

  const pointRadius = 2;

  const chartData = {
    version,
    datasets: [
      {
        ...simpleScatterDataset,
        data: filteredData.filter(a => a[percentageGainKey] > 0),
        pointBackgroundColor: '#ffffff',
        pointRadius: pointRadius,
        hoverRadius: pointRadius,
        parsing: {
          xAxisKey: xKey,
          yAxisKey: percentageGainKey
        }
      },
      {
        ...simpleScatterDataset,
        data: filteredData.filter(a => a[percentageGainKey] <= 0),
        pointBackgroundColor: 'rgba(255,108,82,0.5)',
        pointRadius: pointRadius,
        hoverRadius: pointRadius,
        parsing: {
          xAxisKey: xKey,
          yAxisKey: percentageGainKey
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
                     stats={[
                       <ChartStat key={1} name="Avg profit"
                                  value={avg}
                                  icon={<FontAwesomeIcon icon={faChartLine}/>}
                                  valueSign={" Ξ"}
                                  colorValue/>,
                       <ChartStat key={2} name="Total profit"
                                  value={sum}
                                  icon={<FontAwesomeIcon icon={faCoins}/>}
                                  valueSign={" Ξ"}
                                  colorValue/>,
                       <ChartStat key={3} name="Wins"
                                  value={amountInProfit}
                                  icon={<FontAwesomeIcon icon={faPlus}/>}
                                  valueClass="chartstat__positive"/>,
                       <ChartStat key={4} name="Losses"
                                  value={amountInLoss}
                                  icon={<FontAwesomeIcon icon={faMinus}/>}
                                  valueClass="chartstat__negative"/>
                     ]}
                     plugins={[]}
                     controls={[<ChartToggle
                       key={1}
                       name={<FontAwesomeIcon style={{color: "#b0b0b0"}} icon={faMagnifyingGlassChart}/>}
                       onToggle={a => {
                         setOutliers(!outliers);
                         setVersion(version + 1);
                       }} initChecked={!outliers} tooltip="Hide outliers"/>]}/>
      <UrlsPopup onClose={() => setUrls([])} urls={urls}/>
    </div>
  );
}

export default ProfitPerSaleChart;