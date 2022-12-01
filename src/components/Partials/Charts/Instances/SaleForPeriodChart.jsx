//Style
import "../Base/BaseLineChart.css";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faChartLine, faCircle,
  faMagnifyingGlassChart,
  faShoppingBasket,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import ChartToggle from "../Base/ChartToggle";
import ChartStat from "../Base/ChartStat";
import UrlsPopup from "../Base/UrlsPopup";

//Utils
import {getAvg, getDataBetween, getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {simpleScatterDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {compressDataSet} from "../../../../ChartUtils/Utils/dataSetSizeDecreaserUtils";

//Plugins
import {initialZoom} from "../../../../ChartUtils/Plugins/initialZoomPlugin";
import {pluginTrendLineLinear} from "../../../../ChartUtils/Plugins/trendLinePlugin";
import "../../../../ChartUtils/Plugins/pointOrNearestInteractionMode";

//Images
import TrendLine from "../../../../images/trend.svg";
import {horizontalBlueGreenGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Style
import "./SaleForPeriodChart.css";

//Queries
import {anySaleInEthForPeriod, txnAndVol} from "../../../../chart_queries";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "30D": 30,
  "3M": 90,
  "ALL": Infinity
};

const scatterXAxisKey = "ts";
const scatterYAxisKey = "ev";
const averageXAxisKey = "ts";
const averageYAxisKey = "averageValue";
const idKey = "tid";
const hashKey = "th";

const SaleForPeriodChart = ({address}) => {

  const [active, setActive] = useState("7D");
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scatterData, setScatterData] = useState([]);
  const [averageData, setAverageData] = useState([]);
  const [avg, setAvg] = useState(0);
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);
  const [pannedData, setPannedData] = useState([]);
  const [tx, setTx] = useState(0); // Transactions stat
  const [init, setInit] = useState(false);
  const [dataMin, setDataMin] = useState(0); // Lower limit for the pan
  const [pricePercentage, setPricePercentage] = useState(0);
  const [trend, setTrend] = useState(false); // Should trendline be shown
  const [urls, setUrls] = useState([]); // Displayed urls
  const [zoomed, setZoomed] = useState(true); // Should chart be zoomed
  const [largerDot, setLargerDot] = useState(false); // Should larger dots be shown
  const [error, setError] = useState("");
  const countTx = (compressed) => {
    return compressed.map(a => a.originals?.length || 1).reduce((partialSum, a) => partialSum + a, 0);
  };

  useEffect(() => {
    if (init) {
      const newInitialMax = Date.now(); // Always start the x-axis at current date
      const newInitialMin = newInitialMax - dayTimestampDuration * durationMap[active];
      const avgInView = getDataBetween(averageData, averageXAxisKey, newInitialMin, newInitialMax, averageXAxisKey); // Get the average date in view
      let pannedData = getDataBetween(scatterData, scatterXAxisKey, newInitialMin, newInitialMax);
      const newTx = countTx(pannedData);
      if (avgInView.length === 0) { // If no avg data in view, set default values for the stats
        setPricePercentage(undefined);
        setAvg(NaN);
      } else {
        let newAvg = NaN;
        if (avgInView.length > 0) {
          newAvg = getAvg(avgInView, averageYAxisKey);
        }
        const newDataMin = getMin(averageData, averageXAxisKey);
        const avgInViewMin = getMin(avgInView, averageXAxisKey);
        const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey]; // Total avg change is calculated from the difference in first and last average
        let lastAvg = averageData[averageData.length - 1][averageYAxisKey];
        if (avgInViewMin < averageData[averageData.length - 1][averageXAxisKey]) {
          setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg));
        } else {
          setPricePercentage(undefined);
        }
        setAvg(newAvg);
        setLargerDot(newTx <= 500); // If more than 500 points in view, set small dots as default.
        setDataMin(newDataMin);
      }
      setIsLoading(false);
      setVersion(v => v + 1);
      setPannedData(pannedData);
      setTx(newTx);
      setInitialXMax(newInitialMax);
      setInitialXMin(newInitialMin);
    }
  }, [active, init]);

  const handleData = (newScatterData, newAverageData) => {
    setScatterData(compressDataSet(newScatterData, scatterXAxisKey, scatterYAxisKey));
    setAverageData(newAverageData);
  };

  useEffect(() => {
    async function loadPartialData() {
      try {
        const newScatterData = await anySaleInEthForPeriod(address, 31); // Load 31 days first
        const newAverageData = await txnAndVol(address, 31).then(b => b.map(a => ({
          ...a,
          averageValue: a.volume / a.txCount // Manually calculate average
        })));
        handleData(newScatterData, newAverageData);
        setInit(true);
        setActive(active);
        loadFullData(); // Then load all data
      } catch (e) {
        setError("Chart data not available.");
        setInit(false);
      }
    }

    async function loadFullData() {
      try {
        const newScatterData = await anySaleInEthForPeriod(address, 3650);
        const newAverageData = await txnAndVol(address, 3650).then(b => b.map(a => ({
          ...a,
          averageValue: a.volume / a.txCount // Manually calculate average
        })));
        handleData(newScatterData, newAverageData);
        setActive(active);
      } catch (e) {
        setError("Chart data not available.");
        setInit(false);
      }
    }

    loadPartialData();
  }, []);

  const chartRef = useRef(null);
  const scatterMax = getMax(scatterData, scatterYAxisKey);

  let chartOptions = {
    onClick: (e) => { // If clicked this might need to open a list of urls
      const newDataPoints = [];
      e.chart.tooltip.dataPoints.forEach(dataPoint => {
        if (dataPoint.raw.originals) {
          newDataPoints.push(...dataPoint.raw.originals);
        } else {
          newDataPoints.push(dataPoint.raw);
        }
      });

      const results = newDataPoints.map(dataPoint => ({
        name: `ID ${dataPoint[idKey]} sold for Ξ ${dataPoint[scatterYAxisKey].toLocaleString()}`,
        url: `https://etherscan.io/tx/${dataPoint[hashKey]}`
      }));

      if (results.length === 1) {
        setUrls([]);
        window.open(results[0].url, "_blank").focus();
      } else {
        setUrls(results);
      }
    },
    interaction: {
      intersect: false,
      mode: "pointOrNearest",
      axis: "x"
    },
    plugins: {
      toolTipLine: false,
      tooltip: {
        mode: "pointOrNearest",
        intersect: false,
        callbacks: {
          beforeBody: (toolTipItems) => {
            return `Ξ ${toolTipItems[0].raw[scatterYAxisKey].toLocaleString()}`;
          },
          label: () => {
            return false;
          }
        },
      },
      initialZoom: {
        center: avg,
        enabled: zoomed
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          onPanComplete: ({chart}) => {
          },
          onPan: ({chart}) => {
            // If panning points should be added and removed from the pannedData
            // Also new stats should be calculated
            let newScatter = getDataBetween(scatterData, scatterXAxisKey, chart.scales.xAxes.min, chart.scales.xAxes.max);
            setTx(countTx(newScatter));
            chart.config.data.datasets[0].data = newScatter;
            setPannedData(newScatter);
            const avgInView = getDataBetween(averageData, averageXAxisKey, chart.scales.xAxes.min, chart.scales.xAxes.max, averageXAxisKey);
            if (avgInView.length === 0) {
              setPricePercentage(undefined);
              setAvg(NaN);
            } else {
              const avg = getAvg(avgInView, averageYAxisKey);
              setAvg(avg);
              chart.scales.yAxes.options.modifiedLinearCenter = avg;
              const avgInViewMin = getMin(avgInView, averageXAxisKey);
              const avgInViewMax = getMax(avgInView, averageXAxisKey);
              const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey];
              const lastAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMax)[0][averageYAxisKey];
              setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg));
            }
            chart.scales.yAxes.handleZoom();
            chart.update();
          }
        },
        limits: {
          xAxes: {
            min: Math.min(dataMin, initialXMin),
            max: initialXMax,
          }
        }
      },
    },
    scales: {
      yAxes: {
        zoomMax: scatterMax,
        ticks: {
          callback: value => {
            return "Ξ " + value.toLocaleString();
          }
        },
        type: "modifiedLinear",
        modifiedLinearCenter: avg,
        max: scatterMax,
        min: getMin(scatterData, scatterYAxisKey),
        title: {
          display: true,
          text: "Price",
          color: horizontalBlueGreenGradient
        }
      },
      xAxes: {
        type: "time",
        min: initialXMin,
        max: initialXMax
      }
    },
    transitions: {
      zoom: {
        animation: {
          duration: 0
        }
      },
      pan: {
        animation: {
          duration: 0
        }
      }
    },
    animation: false,
    hover: {animationDuration: 0},
    responsiveAnimationDuration: 0,
    elements: {
      line: {
        tension: 0 // disables bezier curves
      }
    }
  };

  const whaleImage = new Image(); // This can be used for adding tags when they are finished
  whaleImage.src = "https://files.allsource.io/icons/tag-whale.svg";

  const chartData = {
    version,
    datasets: [
      {
        ...simpleScatterDataset,
        pointRadius: largerDot ? 3 : 1,
        data: pannedData,
        parsing: {
          xAxisKey: scatterXAxisKey,
          yAxisKey: scatterYAxisKey
        },
        trendLineLinear: {
          enabled: trend,
          style: horizontalBlueGreenGradient,
          width: 2,
        },
        pointStyle: (data) => {
          return "point";
        }
      }
    ]
  };

  const empty = pannedData.length === 0;
  return (
    <div className="saleforperiodchart__container">
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
                     controls={[<ChartToggle key={1}
                                             name={<img src={TrendLine} style={{height: "16px"}}/>}
                                             onToggle={a => {
                                               chartRef.current.data.datasets[0].trendLineLinear.enabled = a;
                                               chartRef.current.update();
                                               setTrend(a);
                                             }} initChecked={trend} tooltip="Enable Trend line"/>,
                       <ChartToggle key={3}
                                    name={<FontAwesomeIcon style={{color: "#b0b0b0"}} icon={faMagnifyingGlassChart}/>}
                                    initChecked={zoomed}
                                    onToggle={a => {
                                      setZoomed(a);
                                      setVersion(version + 1);
                                    }} tooltip="Zoom"/>,
                       <ChartToggle key={"4." + version.toString()}
                                    name={<div style={{
                                      backgroundColor: "#b0b0b0",
                                      width: "8px",
                                      height: "8px",
                                      marginRight: "4px",
                                      borderRadius: "50%"
                                    }}/>}
                                    afterName={<FontAwesomeIcon style={{color: "#b0b0b0"}} icon={faCircle}/>}
                                    tooltip="Dot size"
                                    initChecked={largerDot}
                                    onToggle={a => {
                                      setLargerDot(a);
                                      setVersion(version + 1);
                                    }}/>]}
                     plugins={[pluginTrendLineLinear, initialZoom]}
                     stats={[<ChartStat key={2} name="Average"
                                        value={isNaN(avg) ? "N/A" : `${(Math.round(avg * 100) / 100).toLocaleString()} Ξ`}
                                        icon={<FontAwesomeIcon icon={faChartLine}/>}
                                        percentage={pricePercentage}/>,
                       <ChartStat key={3} name="Sales" value={tx}
                                  icon={<FontAwesomeIcon icon={faShoppingBasket}/>}/>
                     ]}
                     chartOptions={chartOptions}
                     isLoading={isLoading}
                     error={error || (empty && "No sales in view, pan left.")}
                     transparentError={!error && empty}/>
      <UrlsPopup onClose={() => setUrls([])} urls={urls}/>
    </div>
  );
};

export default SaleForPeriodChart;