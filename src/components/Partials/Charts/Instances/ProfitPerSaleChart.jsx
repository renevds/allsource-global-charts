//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";

//Gradients
import {
  verticalGradientWithNegativeRed
} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import annotationPlugin from 'chartjs-plugin-annotation';

//Utils
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";
import {marginPerSale} from "@allsource/queries.chart_queries";
import {chartBlue} from "../../../../ChartUtils/Utils/chartColors";
import {dashedLineDataset, simpleScatterDataset} from "../../../../ChartUtils/datasets/datasetTemplates";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "31D": 31
}

const ProfitPerSaleChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("7D");
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(data, "timestamp");
        const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1);
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
      mode: "x",
      intersect: false
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
        type: "modifiedLinear",
        title: {
          display: true,
          text: "Gain %",
          color: verticalGradientWithNegativeRed
        }
      },
      yAxes1: {
        type: "modifiedLinear",
        position: 'right',
        display: true,
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: "Price Ξ",
          color: chartBlue
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
            max: initialXMax
          }
        }
      },
      tooltip: {
        mode: "x",
        intersect: false
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
    return `Held for ${Math.floor(toolTipItem.raw.holdingTime)} days  |  Gain ${toolTipItem.raw.percentageGain.toLocaleString()}%`
  }

  const chartData = {
    version,
    datasets: [
      {
        ...dashedLineDataset,
        data,
        tooltip: {
          callbacks: {
            label: () => '',
          }
        },
        yAxisID: 'yAxes1',
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "ethGain"
        }
      },
      {
        ...simpleScatterDataset,
        data: data.filter(a => a["percentageGain"] > 0),
        pointBorderColor: '#ffffff',
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
        data: data.filter(a => a["percentageGain"] <= 0),
        pointBorderColor: '#ff6c52',
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
                   plugins={[toolTipLinePlugin, annotationPlugin]}
                   controls={[]}/>
  );
}

export default ProfitPerSaleChart;