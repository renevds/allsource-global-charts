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
import {averagePerDaySaleForPeriod} from "@allsource/queries.chart_queries";
import moment from "moment";
import {simpleLineDataset, simpleBarDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartBlue, chartPurple} from "../../../../ChartUtils/Utils/chartColors";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "31D": 31,
  "3M": 90,
  "1Y": 365,
}

const VolumeTxChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("31D");
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [logarithmic, setLogarithmic] = useState(false);

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
    averagePerDaySaleForPeriod(address, 365)
      .then(b => b.map(a => {
        a.label = moment(a.timestamp).format("LL");
        return a;
      })).then(a => {
      setData(a);
      setInit(true);
    })
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
        max: data.length - 1,
        min: data.length - durationMap[active]
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
        title: {
          display: true,
          text: "Transactions",
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
        data: data.map(a => a.txCount),
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Tx ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        }
      },
      {
        ...simpleBarDataset,
        data: data.map(a => a.volume),
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Vol Ξ ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        },
        yAxisID: 'yAxes1'
      }
    ],
    labels: data.map(a => a["label"])
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

export default VolumeTxChart;