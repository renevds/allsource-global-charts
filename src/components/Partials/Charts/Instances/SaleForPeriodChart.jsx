//Style
import "../Base/BaseLineChart.css";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChartLine, faShoppingBasket, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import ChartToggle from "../Base/ChartToggle";
import ChartStat from "../Base/ChartStat";

//Utils
import {getAvg, getDataBetween, getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

//Plugins
import {initialZoom} from "../../../../ChartUtils/Plugins/initialZoomPlugin";
import {showZoomPlugin} from "../../../../ChartUtils/Plugins/showZoomPlugin";
import {compressDataSet, ONE_HOUR} from "../../../../utils/dataSetSizeDecreaserUtils";
import {pluginTrendLineLinear} from "../../../../ChartUtils/Plugins/trendLinePlugin";
import '../../../../ChartUtils/Plugins/pointOrNearestInteractionMode';

//Images
import TrendLine from '../../../../images/trend.svg'
import {horizontalBlueGreenGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Style
import './SaleForPeriodChart.css'
import {anySaleInEthForPeriod, averagePerDaySaleForPeriod} from "../../../../chart_queries";
import {chartBlue} from "../../../../ChartUtils/Utils/chartColors";
import {simpleScatterDataset} from "../../../../ChartUtils/datasets/datasetTemplates";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "31D": 31,
  "3M": 90,
  "1Y": 365,
}

const scatterXAxisKey = "timestamp"
const scatterYAxisKey = "ethValue"
const averageXAxisKey = "timestamp"
const averageYAxisKey = "averageValue"
const marketKey = "market"

const SaleForPeriodChart = ({address}) => {

  const [active, setActive] = useState('3M' || Object.keys(durationMap)[0]);
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scatterData, setScatterData] = useState([]);
  const [averageData, setAverageData] = useState([]);
  const [logarithmic, setLogarithmic] = useState(false);
  const [garbage, setGarbage] = useState(false);
  const [avg, setAvg] = useState(0);
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);
  const [pannedFilteredData, setPannedFilteredData] = useState([]);
  const [garbageData, setGarbageData] = useState([]);
  const [tx, setTx] = useState(0);
  const [init, setInit] = useState(false);
  const [dataMin, setDataMin] = useState(0);
  const [pricePercentage, setPricePercentage] = useState(0);
  const [trend, setTrend] = useState(false);
  const [urls, setUrls] = useState([]);

  const countTx = (compressed) => {
    return compressed.map(a => a.originals?.length || 1).reduce((partialSum, a) => partialSum + a, 0);
  }

  useEffect(() => {
    if (init) {
      const newInitialMax = getMax(averageData, averageXAxisKey);
      const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1);
      const avgInView = getDataBetween(averageData, averageXAxisKey, newInitialMin, newInitialMax, averageXAxisKey);
      const newAvg = getAvg(avgInView, averageYAxisKey);
      let pannedFilteredData = getDataBetween(scatterData, scatterXAxisKey, newInitialMin, newInitialMax);
      const newDataMin = getMin(averageData, averageXAxisKey);
      const avgInViewMin = getMin(avgInView, averageXAxisKey);
      const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey];
      const lastAvg = averageData.filter(a => a[averageXAxisKey] === newInitialMax)[0][averageYAxisKey];
      setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg))
      setInitialXMax(newInitialMax);
      setInitialXMin(newInitialMin);
      setAvg(newAvg);
      setPannedFilteredData(pannedFilteredData);
      setTx(countTx(pannedFilteredData));
      setDataMin(newDataMin);
      setIsLoading(false);
      setVersion(v => v + 1);
    }
  }, [active, init])

  useEffect(() => {
    async function loadData() {
      const newScatterData = await anySaleInEthForPeriod(address, 365, true);
      const newAverageData = await averagePerDaySaleForPeriod(address, 365);

      const markets = newScatterData.map(a => a[marketKey])
      console.log([...new Set(markets)])
      const nonGarbage = newScatterData.filter(a => a[marketKey] === "Sale");
      console.log(newScatterData.filter(a => a[marketKey] !== "Sale"))
      setScatterData(nonGarbage);
      setGarbageData(newScatterData.filter(a => a[marketKey] !== "Sale"));
      setAverageData(newAverageData);
      setActive(active);
      setInit(true);
    }

    loadData();
  }, [])

  const chartRef = useRef(null);
  const scatterMax = getMax(scatterData, scatterYAxisKey);

  let chartOptions = {
    onClick: (e) => {
      const newDataPoints = []
      e.chart.tooltip.dataPoints.forEach(dataPoint => {
        if (dataPoint.raw.originals) {
          newDataPoints.push(...dataPoint.raw.originals);
        } else {
          newDataPoints.push(dataPoint.raw);
        }
      })

      const results = newDataPoints.map(dataPoint => ({
        name: `ID ${dataPoint.id} sold for Ξ ${dataPoint.ethValue.toLocaleString()}`,
        url: `https://etherscan.io/tx/${dataPoint.hash}`
      }))

      if (results.length === 1) {
        setUrls([]);
        window.open(results[0].url, '_blank').focus();
      } else {
        setUrls(results);
      }
    },
    interaction: {
      intersect: false,
      mode: "pointOrNearest",
      axis: 'x'
    },
    plugins: {
      toolTipLine: false,
      tooltip: {
        mode: "pointOrNearest",
        intersect: false,
        callbacks: {
          beforeBody: (toolTipItems) => {
            if (toolTipItems.length > 5) {
              let price = 0;
              toolTipItems.forEach(toolTipItem => {
                price += toolTipItem.raw.ethValue;
              })
              price /= toolTipItems.length;
              return `${toolTipItems.length} sales around Ξ ${price.toLocaleString()}`
            } else {
              return toolTipItems
                .map(toolTipItem => `ID ${toolTipItem.raw.id} for 
                ${" ".repeat(5 - toolTipItem.raw.id.toString().length)} 
                Ξ ${toolTipItem.raw.ethValue.toLocaleString()}`)
            }
          },
          label: () => {
            return false
          }
        },
      },
      initialZoom: {
        center: avg,
        enabled: !logarithmic
      },
      zoom: {
        zoom: {
          wheel: {enabled: true},
          pinch: {enabled: true},
          mode: 'y'
        },
        pan: {
          enabled: true,
          mode: "x",
          onPanComplete: ({chart}) => {
          },
          onPan: ({chart}) => {
            let newScatter = getDataBetween(scatterData, scatterXAxisKey, chart.scales.xAxes.min, chart.scales.xAxes.max);
            setTx(countTx(newScatter));
            chart.config.data.datasets[0].data = newScatter;
            const avgInView = getDataBetween(averageData, averageXAxisKey, chart.scales.xAxes.min, chart.scales.xAxes.max, averageXAxisKey);
            const avg = getAvg(avgInView, averageYAxisKey);
            setAvg(avg);
            chart.scales.yAxes.options.modifiedLinearCenter = avg;
            const avgInViewMin = getMin(avgInView, averageXAxisKey);
            const avgInViewMax = getMax(avgInView, averageXAxisKey);
            const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey];
            const lastAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMax)[0][averageYAxisKey];
            setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg))
            chart.scales.yAxes.handleZoom();
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
        type: logarithmic ? "OffsetLogScale" : "modifiedLinear",
        modifiedLinearCenter: avg,
        max: scatterMax,
        min: getMin(scatterData, scatterYAxisKey),
        title: {
          display: trend,
          text: "Price",
          color: chartBlue
        }
      },
      xAxes: {
        type: 'time',
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
  }

  const whaleImage = new Image();
  whaleImage.src = "https://files.allsource.io/icons/tag-whale.svg";

  const chartData = {
    version,
    datasets: [
      {
        ...simpleScatterDataset,
        data: pannedFilteredData,
        parsing: {
          xAxisKey: scatterXAxisKey,
          yAxisKey: scatterYAxisKey
        },
        pointRadius: 1,
        hoverBorderWidth: 1,
        pointHitRadius: 1,
        trendLineLinear: {
          enabled: trend,
          style: horizontalBlueGreenGradient,
          width: 2,
        },
        pointStyle: (data) => {
          return "point"
        }
      },
      {
        hidden: !garbage,
        data: garbageData,
        showLine: false,
        parsing: {
          xAxisKey: scatterXAxisKey,
          yAxisKey: scatterYAxisKey
        },
        pointBorderColor: "rgba(255,0,0,0.5)",
        pointHitRadius: 1,
        pointRadius: 1,
      },
    ]
  }

  return (
    <div className='saleforperiodchart__container'>
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
                                             name={<img src={TrendLine} style={{height: '16px'}}/>}
                                             onToggle={a => {
                                               chartRef.current.data.datasets[0].trendLineLinear.enabled = a;
                                               chartRef.current.update();
                                               setTrend(a);
                                             }} initChecked={trend} tooltip="Enable Trend line"/>,
                       <ChartToggle key={2}
                                    name={<FontAwesomeIcon style={{color: "#ff6c52"}} icon={faTrash}/>}
                                    onToggle={a => {
                                      if (chartRef.current) {
                                        chartRef.current.data.datasets[1].hidden = !a;
                                        chartRef.current.update();
                                        setGarbage(a);
                                      }
                                    }} initChecked={garbage} tooltip="Show outliers"/>,
                       <ChartToggle key={3} name="Log" onToggle={a => {
                         setLogarithmic(a);
                         setVersion(version + 1);
                       }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}
                     plugins={[initialZoom, showZoomPlugin, pluginTrendLineLinear]}
                     stats={[<ChartStat key={2} name="Average"
                                        value={`Ξ ${(Math.round(avg * 100) / 100).toLocaleString()}`}
                                        icon={<FontAwesomeIcon icon={faChartLine}/>}
                                        percentage={pricePercentage}/>,
                       <ChartStat key={3} name="Sales" value={tx}
                                  icon={<FontAwesomeIcon icon={faShoppingBasket}/>}/>
                     ]}
                     chartOptions={chartOptions}
                     isLoading={isLoading}/>
      {(urls.length > 0) &&
      <div className="saleforperiodchart__urls">
        <div className="saleforperiodchart__center">
          <div className="saleforperiodchart__urls__close" onClick={() => setUrls([])}>
            <FontAwesomeIcon icon={faXmark}/>
          </div>
          <div className="saleforperiodchart__urls__bg">
            {urls.map(a => <a key={a.url + '--' + a.name} className="saleforperiodchart__urls__a" href={a.url}
                              target='_blank'>{a.name}</a>)}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default SaleForPeriodChart;