//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import ChartToggle from "../Base/ChartToggle";

//Gradients
import {
  horizontalBlueGreenGradient,
  verticalBlueDarkGradientNonTransparent
} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {averagePerDaySaleForPeriod, floorAndMarketCap} from "../../../../chart_queries";
import moment from "moment";
import {simpleLineDataset, simpleBarDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartBlue, chartPurple} from "../../../../ChartUtils/Utils/chartColors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine} from "@fortawesome/free-solid-svg-icons";
import ChartStat from "../Base/ChartStat";
import {getSum} from "../../../../ChartUtils/Utils/chartDataUtils";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "30D": 30,
  "3M": 90,
  "1Y": 365,
}

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
        let newAverageData = await averagePerDaySaleForPeriod(address, 365).then(b => b.map(a => {
          a.label = moment(a.timestamp).format("ll");
          return a;
        }))

        const newFloorPriceData = await floorAndMarketCap(address, 365);
        console.log(newFloorPriceData);
        const floorPriceByDate = {}

        newFloorPriceData.forEach(a => {
          floorPriceByDate[a.date] = a.floorPrice;
        })

        newAverageData = newAverageData.map(a => {
          a.floorPrice = floorPriceByDate[a.day];
          return a;
        })

        setAverageData(newAverageData);
        setPannedData(newAverageData.slice(newAverageData.length - durationMap[active], newAverageData.length - 1));
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
          color: chartBlue,
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
          enabled: true
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
        data: averageData.map(a => a.floorPrice),
        tooltip: {
          callbacks: {
            label: () => false,
          }
        }
      },
      {
        ...simpleBarDataset,
        data: averageData.map(a => a.volume),
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              const raw = averageData[toolTipItem.dataIndex];
              return [
                raw.floorPrice ? `Floor ${raw.floorPrice.toLocaleString()} Ξ` : "",
                `Vol ${raw.volume.toLocaleString()} Ξ`,
                `Tx ${raw.txCount.toLocaleString()}`]
            },
          }
        },
        yAxisID: 'yAxes1'
      }
    ],
    labels: averageData.map(a => a["label"])
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
                   stats={[<ChartStat key={2} name="Total Volume"
                                      value={`Ξ ${getSum(pannedData, "volume")}`}
                                      icon={<FontAwesomeIcon icon={faChartLine}/>}/>]}
                   plugins={[toolTipLinePlugin]}
                   controls={[<ChartToggle key={1} name="Log" onToggle={a => {
                     setLogarithmic(a);
                     setVersion(version + 1);
                   }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}/>
  );
}

export default VolumeTxChart;