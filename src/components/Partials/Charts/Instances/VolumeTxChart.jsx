//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import ChartToggle from "../Base/ChartToggle";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {txnAndVol, floorAndMarketCap} from "../../../../chart_queries";
import moment from "moment";
import {simpleLineDataset, simpleBarDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartBlue, chartPurple} from "../../../../ChartUtils/Utils/chartColors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartColumn, faShoppingBasket} from "@fortawesome/free-solid-svg-icons";
import ChartStat from "../Base/ChartStat";
import {formatDecimal, getDataBetween, getSum} from "../../../../ChartUtils/Utils/chartDataUtils";
import {horizontalBlueGreenGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "30D": 30,
  "3M": 90,
  "1Y": 365,
}

const timestampKey = "ts";
const dateKey = "date";
const floorPriceKey = "floorPrice";
const volumeKey = "volume";
const txCountKey = "txCount";

const VolumeTxChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("30D");
  const [averageData, setAverageData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [logarithmic, setLogarithmic] = useState(false);
  const [pannedData, setPannedData] = useState([]);

  useEffect(() => {
    if (init) {
      try {
        setPannedData(averageData.slice(averageData.length - durationMap[active], averageData.length - 1));
        setIsLoading(false);
        setVersion(version + 1);
      } catch (e) {
        setError(e);
      }
    }
  }, [active, init])

  if (!init) {
    const load = async () => {
      try {
        let newAverageData = await txnAndVol(address, 365);

        const newFloorPriceData = await floorAndMarketCap(address, 365);
        const floorPriceByDate = {};

        newFloorPriceData.forEach(a => {
          floorPriceByDate[a[dateKey]] = a[floorPriceKey];
        })

        newAverageData = newAverageData.map(a => {
          a[floorPriceKey] = floorPriceByDate[a[dateKey]];
          return a;
        })

        newAverageData = newAverageData

        setAverageData(newAverageData);
        setInit(true);
      } catch (e) {
        setError("Chart data not available.");
        setInit(true);
      }
    }
    load();
  }

  const chartOptions = {
    interaction: {
      mode: "index",
      intersect: false
    },
    scales: {
      xAxes: {
        ticks: {
          autoSkip: true
        },
        max: averageData.length - 1,
        min: averageData.length - durationMap[active]
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
        title: {
          display: true,
          text: "Floor Ξ",
          color: horizontalBlueGreenGradient,
        }
      },
      yAxes1: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
        position: 'right',
        display: true,
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: "Volume Ξ",
          color: chartPurple,
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          mode: "x",
          enabled: true,
          onPan: ({chart}) => {
            const newPannedData = averageData.slice(chart.scales.xAxes.min, chart.scales.xAxes.max + 1);
            setPannedData(newPannedData);
          },
        }
      },
      tooltip: {
        mode: "index",
        intersect: false
      },
    }
  }

  const chartData = {
    version,
    datasets: [
      {
        ...simpleLineDataset,
        data: averageData.map(a => a[floorPriceKey]),
        tooltip: {
          callbacks: {
            label: () => false,
          }
        }
      },
      {
        ...simpleBarDataset,
        data: averageData.map(a => a[volumeKey]),
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              const raw = averageData[toolTipItem.dataIndex];
              return [
                raw.floorPrice ? `Floor price ${raw[floorPriceKey].toLocaleString()} Ξ` : "",
                `Volume ${raw[volumeKey].toLocaleString()} Ξ`,
                `Transactions ${raw[txCountKey].toLocaleString()}`]
            },
          }
        },
        yAxisID: 'yAxes1'
      }
    ],
    labels: averageData.map(a => a[dateKey])
  }
  const chartRef = useRef(null);

  return (
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
                   stats={[<ChartStat key={1} name="Total Vol"
                                      value={formatDecimal(getSum(pannedData, "volume")).toLocaleString()}
                                      icon={<FontAwesomeIcon icon={faChartColumn}/>}
                                      valueSign={" Ξ"}/>,
                     <ChartStat key={2} name="Total Profit"
                                value={formatDecimal(getSum(pannedData, "txCount")).toLocaleString()}
                                icon={<FontAwesomeIcon icon={faShoppingBasket}/>}
                                valueSign={" Ξ"}/>]}
                   plugins={[toolTipLinePlugin]}
                   controls={[<ChartToggle key={1} name="Log" onToggle={a => {
                     setLogarithmic(a);
                     setVersion(version + 1);
                   }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}/>
  );
}

export default VolumeTxChart;