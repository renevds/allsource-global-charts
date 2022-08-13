//Style
import "../Base/BaseLineChart.css";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChartLine, faShoppingBasket, faTrash} from "@fortawesome/free-solid-svg-icons";
import ChartToggle from "../Base/ChartToggle";
import ChartStat from "../Base/ChartStat";

//Utils
import {filterOutliers, getAvg, getDataBetween, getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {initialZoom} from "../../../../ChartUtils/Plugins/initialZoomPlugin";
import {showZoomPlugin} from "../../../../ChartUtils/Plugins/showZoomPlugin";
import {compressDataSet, ONE_HOUR} from "../../../../utils/dataSetSizeDecreaserUtils";

const PERFORMANCE_SCATTER_LIMIT = 4000;

const BigScatterChart = ({
                           scatterEndpoint,
                           scatterFormatter,
                           scatterFormatterMany,
                           scatterXAxisKey,
                           scatterYAxisKey,
                           defaultEndpoint,
                           averageEndpoint,
                           averageXAxisKey,
                           averageYAxisKey,
                           durationMap,
                           onClick,
                           radiusMap
                         }) => {

    const [active, setActive] = useState(defaultEndpoint || Object.keys(durationMap)[0]);
    const [version, setVersion] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [scatterData, setScatterData] = useState([]);
    const [filterConfig, setFilteredConfig] = useState({});
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

    useEffect(() => {
      if (init) {
        const newInitialMax = getMax(averageData, averageXAxisKey);
        const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1);
        const avgInView = getDataBetween(averageData, averageXAxisKey, newInitialMin, newInitialMax, averageXAxisKey);
        const newAvg = getAvg(avgInView, averageYAxisKey);
        const newPannedFilteredData = getDataBetween(scatterData, scatterXAxisKey, newInitialMin, newInitialMax);
        let compressedPannedFilteredData = newPannedFilteredData;
        let filtered = false;
        let hours = 3;
        let yMargin = 0.01;
        while (compressedPannedFilteredData.length > PERFORMANCE_SCATTER_LIMIT) {
          compressedPannedFilteredData = compressDataSet(newPannedFilteredData, scatterXAxisKey, scatterYAxisKey, ONE_HOUR * hours, yMargin);
          hours *= 2;
          yMargin *= 10;
          filtered = true;
        }
        hours/=2;
        yMargin/=10;
        setFilteredConfig({xMargin: ONE_HOUR * hours, yMargin, filtered});
        const newDataMin = getMin(averageData, averageXAxisKey);
        const avgInViewMin = getMin(avgInView, averageXAxisKey);
        const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey];
        const lastAvg = averageData.filter(a => a[averageXAxisKey] === newInitialMax)[0][averageYAxisKey];
        setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg))
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setAvg(newAvg);
        setPannedFilteredData(compressedPannedFilteredData);
        setTx(newPannedFilteredData.length);
        setDataMin(newDataMin);
        setIsLoading(false);
        setVersion(v => v + 1);
      }
    }, [active, init])

    useEffect(() => {
      async function loadData() {
        const newScatterData = await scatterEndpoint()
        const newAverageData = await averageEndpoint()
        setScatterData(newScatterData.filter(a => a.type === "Sale"));
        setGarbageData(newScatterData.filter(a => a.type !== "Sale"))
        setAverageData(newAverageData);
        setActive(active);
        setInit(true);
      }

      loadData();
    }, [])

    const chartRef = useRef(null);
    const scatterMax = getMax(scatterData, scatterYAxisKey);

    const pointRadius = radiusMap[active];

    let chartOptions = {
      onClick: onClick,
      interaction: {
        mode: "point",
        intersect: false
      },
      plugins: {
        toolTipLine: false,
        tooltip: {
          mode: "point",
          intersect: false,
          callbacks: {
            beforeBody: (toolTipItems) => {
              const newToolTipItems = []
              toolTipItems.forEach(toolTipItem => {
                if (toolTipItem.raw.originals) {
                  newToolTipItems.push(...toolTipItem.raw.originals.map(a => ({raw: a})));
                } else {
                  newToolTipItems.push(toolTipItem);
                }
              })
              if (newToolTipItems.length > 10) {
                return scatterFormatterMany(newToolTipItems);
              } else {
                return newToolTipItems.map(a => scatterFormatter(a))
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
              let newScatter = getDataBetween(scatterData, scatterXAxisKey, chart.scales.xAxes.min, chart.scales.xAxes.max)
              setTx(newScatter.length);
              if (filterConfig.filtered) {
                newScatter = compressDataSet(newScatter, scatterXAxisKey, scatterYAxisKey, filterConfig.xMargin, filterConfig.yMargin);
              }
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
          min: getMin(scatterData, scatterYAxisKey)
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
        }
        ,
        pan: {
          animation: {
            duration: 0
          }
        }
        ,
      }
    }

    const chartData = {
      version,
      datasets: [
        {
          data: pannedFilteredData,
          showLine: false,
          parsing: {
            xAxisKey: scatterXAxisKey,
            yAxisKey: scatterYAxisKey
          },
          pointRadius: (data) => {
            if (data?.raw?.originals) {
              return pointRadius * 2;
            }
            return pointRadius;
          },
          hoverBorderWidth: pointRadius / 2,
          pointHitRadius: 10
        },
        {
          hidden: true,
          data: garbageData,
          showLine: false,
          parsing: {
            xAxisKey: scatterXAxisKey,
            yAxisKey: scatterYAxisKey
          },
          pointBorderColor: "rgba(255,0,0,0.5)",
          pointHitRadius: 10,
          pointRadius: (data) => {
            if (data?.raw?.originals) {
              return pointRadius * 2;
            }
            return pointRadius;
          },
        },
      ]
    }

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
                     controls={[<ChartToggle key={2}
                                             name={<FontAwesomeIcon style={{color: "rgba(255,0,0,0.5)"}} icon={faTrash}/>}
                                             onToggle={a => {
                                               if (chartRef.current) {
                                                 chartRef.current.data.datasets[1].hidden = !a;
                                                 chartRef.current.update();
                                               }
                                             }} initChecked={garbage}/>,
                       <ChartToggle key={3} name="Log" onToggle={a => {
                         setLogarithmic(a);
                         setVersion(version + 1);
                       }} initChecked={logarithmic}/>]}
                     plugins={[initialZoom, showZoomPlugin]}
                     stats={[<ChartStat key={2} name="Average"
                                        value={`Ξ ${(Math.round(avg * 100) / 100).toLocaleString()}`}
                                        icon={<FontAwesomeIcon icon={faChartLine}/>}
                                        percentage={pricePercentage}/>,
                       <ChartStat key={3} name="Sales" value={tx}
                                  icon={<FontAwesomeIcon icon={faShoppingBasket}/>}/>
                     ]}
                     chartOptions={chartOptions}
                     isLoading={isLoading}/>
    );
  }
;

export default BigScatterChart;