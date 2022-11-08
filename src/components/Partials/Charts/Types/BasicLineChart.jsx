import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";
import {horizontalBlueGreenGradient, verticalPurpleDarkGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";
import ChartToggle from "../Base/ChartToggle";
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

const BasicLineChart = ({
                          defaultEndpoint,
                          durationMap,
                          xKey,
                          yKey,
                          dataEndpoint,
                          formatter
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
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear",
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
        type: 'line',
        data: data,
        parsing: {
          xAxisKey: xKey,
          yAxisKey: yKey
        },
        borderColor: horizontalBlueGreenGradient,
        tooltip: {
          callbacks: {
            label: formatter,
          }
        },
        backgroundColor: verticalPurpleDarkGradient,
        fill: 'origin'
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
                   plugins={[toolTipLinePlugin]}
                   controls={[<ChartToggle key={1} name="Log" onToggle={a => {
                     setLogarithmic(a);
                     setVersion(version + 1);
                   }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}/>
  );
}

export default BasicLineChart;