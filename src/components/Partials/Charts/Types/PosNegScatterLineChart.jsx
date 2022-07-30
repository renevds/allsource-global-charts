//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";

//Gradients
import {
  horizontalBlueGreenGradient,
  verticalGradientWithNegativeRed
} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import annotationPlugin from 'chartjs-plugin-annotation';

//Utils
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

const PosNegScatterLineChart = ({
                                  defaultEndpoint,
                                  durationMap,
                                  xKey,
                                  scatterYKey,
                                  lineYKey,
                                  dataEndpoint,
                                  scatterFormatter,
                                  lineFormatter,
                                  lineAxesLabel,
                                  scatterAxesLabel
                                }) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(defaultEndpoint);
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [logarithmic, setLogarithmic] = useState(false);
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(data, xKey);
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
    dataEndpoint().then(a => {
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
        type: 'time',
        ticks: {
          autoSkip: true
        },
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
        title: {
          display: true,
          text: scatterAxesLabel,
          color: verticalGradientWithNegativeRed
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
          text: lineAxesLabel,
          color: "#14F4C9"
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
            min: getMin(data, xKey),
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

  const chartData = {
    version,
    datasets: [
      {
        type: 'line',
        data,
        borderColor: horizontalBlueGreenGradient,
        tooltip: {
          callbacks: {
            label: lineFormatter,
          }
        },
        yAxisID: 'yAxes1',
        parsing: {
          xAxisKey: xKey,
          yAxisKey: lineYKey
        }
      },
      {
        type: 'line',
        showLine: false,
        data: data.filter(a => a[scatterYKey] > 0),
        borderColor: '#ffffff',
        tooltip: {
          callbacks: {
            label: scatterFormatter,
          }
        },
        parsing: {
          xAxisKey: xKey,
          yAxisKey: scatterYKey
        }
      },
      {
        type: 'line',
        showLine: false,
        data: data.filter(a => a[scatterYKey] <= 0),
        borderColor: '#ff0000',
        tooltip: {
          callbacks: {
            label: scatterFormatter,
          }
        },
        parsing: {
          xAxisKey: xKey,
          yAxisKey: scatterYKey
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

export default PosNegScatterLineChart;