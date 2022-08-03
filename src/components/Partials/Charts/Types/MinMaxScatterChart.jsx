//Style
import "../Base/BaseLineChart.css";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDownWideShort, faChartLine, faShoppingBasket, faTrash} from "@fortawesome/free-solid-svg-icons";
import ChartToggle from "../Base/ChartToggle";
import ChartStat from "../Base/ChartStat";

//Gradient
import {horizontalBlueGreenGradient, verticalBlueDarkGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Utils
import {filterOutliers, getAvg, getDataBetween, getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {initialZoom} from "../../../../ChartUtils/Plugins/initialZoomPlugin";
import {showZoomPlugin} from "../../../../ChartUtils/Plugins/showZoomPlugin";
import {calcTotalMomentumFromArray} from "../../../../utils/statsUtils";

const MinMaxScatterChart = ({
                              scatterEndpoint,
                              scatterFormatter,
                              scatterXAxisKey,
                              scatterYAxisKey,
                              defaultEndpoint,
                              averageEndpoint,
                              averageFormatter,
                              minMaxEndpoint,
                              minFormatter,
                              maxFormatter,
                              averageXAxisKey,
                              averageYAxisKey,
                              minYAxisKey,
                              maxYAxisKey,
                              minMaxXAxisKey,
                              durationMap,
                              scatterMap
                            }) => {

    const [active, setActive] = useState(defaultEndpoint || Object.keys(durationMap)[0]);
    const [version, setVersion] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [scatterData, setScatterData] = useState([]);
    const [averageData, setAverageData] = useState([]);
    const [minMaxData, setMinMaxData] = useState([]);
    const [error, setError] = useState("");
    const [outliers, setOutliers] = useState(true);
    const [logarithmic, setLogarithmic] = useState(false);
    const [loans, setLoans] = useState(false);
    const [avg, setAvg] = useState(0);
    const [initialXMin, setInitialXMin] = useState(0);
    const [initialXMax, setInitialXMax] = useState(0);
    const [initialPannedScatterData, setInitialPannedScatterData] = useState([]);
    const [tx, setTx] = useState(0);
    const [init, setInit] = useState(false);
    const [dataMin, setDataMin] = useState(0);
    const [pricePercentage, setPricePercentage] = useState(0);

    const isScatter = Boolean(scatterMap[active]);

    useEffect(() => {
      if (init) {
        try {
          const newInitialMax = getMax(averageData, averageXAxisKey);
          const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1);
          const avgInView = getDataBetween(averageData, averageXAxisKey, newInitialMin, newInitialMax, averageXAxisKey);
          const newAvg = getAvg(avgInView, averageYAxisKey);
          const newInitialPannedScatterData = getDataBetween(scatterData, scatterXAxisKey, newInitialMin, newInitialMax);
          const newDataMin = getMin(averageData, averageXAxisKey);
          const avgInViewMin = getMin(avgInView, averageXAxisKey);
          const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey];
          const lastAvg = averageData.filter(a => a[averageXAxisKey] === newInitialMax)[0][averageYAxisKey];
          setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg))
          setInitialXMax(newInitialMax);
          setInitialXMin(newInitialMin);
          setAvg(newAvg);
          setInitialPannedScatterData(newInitialPannedScatterData);
          setTx(newInitialPannedScatterData.length);
          setDataMin(newDataMin);
          setIsLoading(false);
          setVersion(v => v + 1);
        } catch (e) {
          setError(e);
        }
      }
    }, [active, init])

    useEffect(() => {
      async function loadData() {
        const newScatterData = await scatterEndpoint()
        const newAverageData = await averageEndpoint()
        const newMinMaxData = await minMaxEndpoint()
        setScatterData(newScatterData);
        setAverageData(newAverageData);
        setMinMaxData(newMinMaxData);
        setActive(active);
        setInit(true);
      }

      loadData();
    }, [])

    const chartRef = useRef(null);
    const toolTipMode = isScatter ? "point" : "index";
    const scatterMax = getMax(scatterData, scatterYAxisKey);

    const initialPannedFilteredScatterData = outliers ? initialPannedScatterData : filterOutliers(initialPannedScatterData, scatterYAxisKey);

    let chartOptions = {
      interaction: {
        mode: toolTipMode,
        intersect: false
      },
      plugins: {
        toolTipLine: !isScatter,
        tooltip: {
          mode: toolTipMode,
          intersect: false
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
              if (!outliers) {
                newScatter = filterOutliers(newScatter, scatterYAxisKey)
              }
              if (isScatter) {
                chart.config.data.datasets[0].data = newScatter.filter(a => a.type === "Sale");
                chart.config.data.datasets[4].data = loans ? newScatter.filter(a => a.type !== "Sale") : [];
              }
              setTx(newScatter.length);
              const avgInView = getDataBetween(averageData, averageXAxisKey, chart.scales.xAxes.min, chart.scales.xAxes.max, averageXAxisKey);
              setAvg(getAvg(avgInView, averageYAxisKey));
              const avgInViewMin = getMin(avgInView, averageXAxisKey);
              const avgInViewMax = getMax(avgInView, averageXAxisKey);
              const firstAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMin)[0][averageYAxisKey];
              const lastAvg = averageData.filter(a => a[averageXAxisKey] === avgInViewMax)[0][averageYAxisKey];
              setPricePercentage(Math.round((lastAvg - firstAvg) * 100 / firstAvg))
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
        },
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
          data: isScatter ? initialPannedFilteredScatterData.filter(a => a.type === "Sale") : [],
          showLine: false,
          parsing: {
            xAxisKey: scatterXAxisKey,
            yAxisKey: scatterYAxisKey
          },
          tooltip: {
            callbacks: {
              label: scatterFormatter,
            }
          },
          pointHitRadius: 10
        },
        {
          tension: 0,
          data: isScatter ? [] : minMaxData,
          showLine: false,
          pointRadius: 0,
          pointHitRadius: 0,
          parsing: {
            xAxisKey: minMaxXAxisKey,
            yAxisKey: maxYAxisKey
          },
          backgroundColor: verticalBlueDarkGradient,
          fill: 1,
          tooltip: {
            callbacks: {
              label: maxFormatter,
            }
          }
        },
        {
          data: averageData,
          tension: 0,
          pointRadius: 0,
          pointHitRadius: 10,
          showLine: true,
          parsing: {
            xAxisKey: averageXAxisKey,
            yAxisKey: averageYAxisKey
          },
          borderColor: horizontalBlueGreenGradient,
          tooltip: {
            callbacks: {
              label: averageFormatter,
            }
          }
        },
        {
          tension: 0,
          data: isScatter ? [] : minMaxData,
          showLine: false,
          pointRadius: 0,
          pointHitRadius: 0,
          parsing: {
            xAxisKey: minMaxXAxisKey,
            yAxisKey: minYAxisKey
          },
          backgroundColor: verticalBlueDarkGradient,
          fill: 1,
          tooltip: {
            callbacks: {
              label: minFormatter,
            }
          }
        },
        {
          data: loans ? initialPannedFilteredScatterData.filter(a => a.type !== "Sale") : [],
          showLine: false,
          parsing: {
            xAxisKey: scatterXAxisKey,
            yAxisKey: scatterYAxisKey
          },
          tooltip: {
            callbacks: {
              label: scatterFormatter,
            }
          },
          pointBorderColor: "rgba(255,0,0,0.5)",
          pointHitRadius: 10
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
                     controls={[/*isScatter && <ChartToggle key={1} name="Outliers" onToggle={a => {
                       setOutliers(a);
                       setVersion(version + 1);
                     }} initChecked={outliers}/>*/,
                       isScatter &&
                       <ChartToggle key={2} name={<FontAwesomeIcon style={{color: "rgba(255,0,0,0.5)"}} icon={faTrash}/>}
                                    onToggle={a => {
                                      setLoans(a);
                                      setVersion(version + 1);
                                    }} initChecked={loans}/>,
                       <ChartToggle key={3} name="Log" onToggle={a => {
                         setLogarithmic(a);
                         setVersion(version + 1);
                       }} initChecked={logarithmic}/>]}
                     plugins={[!isScatter && toolTipLinePlugin, initialZoom, showZoomPlugin]}
                     stats={[
                       /*       <ChartStat key={1} name="Floor" value="Ξ 11.39"
                                         icon={<FontAwesomeIcon icon={faArrowDownWideShort}/>}/>,*/
                       <ChartStat key={2} name="Average" value={`Ξ ${(Math.round(avg*100)/100).toLocaleString()}`}
                                  icon={<FontAwesomeIcon icon={faChartLine}/>}
                                  percentage={pricePercentage}/>,

                       <ChartStat key={3} name="Sales" value={tx}
                                  icon={<FontAwesomeIcon icon={faShoppingBasket}/>}/>,
                     ]}
                     chartOptions={chartOptions}
                     isLoading={isLoading}/>
    );
  }
;

export default MinMaxScatterChart;