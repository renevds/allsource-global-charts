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

const BarLineChart = ({
                        defaultEndpoint,
                        durationMap,
                        labelKey,
                        barYkey,
                        lineYKey,
                        dataEndpoint,
                        barFormatter,
                        lineFormatter,
                        barAxesLabel,
                        lineAxesLabel
                      }) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(defaultEndpoint);
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
          text: lineAxesLabel,
          color: "#14F4C9"
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
          text: barAxesLabel,
          color: '#7230DE'
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
        pointRadius: 0,
        type: 'line',
        tension: 0,
        data: data.map(a => a[lineYKey]),
        borderColor: horizontalBlueGreenGradient,
        tooltip: {
          callbacks: {
            label: lineFormatter,
          }
        }
      },
      {
        type: 'bar',
        data: data.map(a => a[barYkey]),
        backgroundColor: verticalBlueDarkGradientNonTransparent,
        hoverBackgroundColor: "rgba(86,245,184,0.5)",
        tooltip: {
          callbacks: {
            label: barFormatter,
          }
        },
        yAxisID: 'yAxes1'
      }
    ],
    labels: data.map(a => a[labelKey])
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

export default BarLineChart;