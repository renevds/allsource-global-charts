import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";
import {useEffect, useRef, useState} from "react";
import {horizontalBlueGreenGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";
import ChartToggle from "../Base/ChartToggle";
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {pluginTrendLineLinear} from "../../../../ChartUtils/Plugins/trendLinePlugin";
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

const ScatterTrendChart = ({
                             defaultEndpoint,
                             durationMap,
                             xKey,
                             yKey,
                             dataEndpoint,
                             lineFormatter
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
      }
    },
    plugins: {
      zoom: {
        pan: {
          mode: "x",
          enabled: true,
          onPan: ({chart}) => {
            if(chart.scales.xAxes.max > initialXMax){ //TODO this is a bad fix for the panning that is bugged
              chart.config.options.scales.xAxes.max = initialXMax;
              chart.config.options.scales.xAxes.min = initialXMin;
              chart.update();
            }
          }
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
        label: 'Line Dataset',
        showLine: false,
        data: data,
        parsing: {
          xAxisKey: xKey,
          yAxisKey: yKey
        },
        borderColor: horizontalBlueGreenGradient,
        tooltip: {
          callbacks: {
            label: lineFormatter,
          }
        },
        trendLineLinear: {
          style: horizontalBlueGreenGradient,
          width: 2,
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
                   plugins={[toolTipLinePlugin, pluginTrendLineLinear]}
                   controls={[<ChartToggle key={1} name="Log" onToggle={a => {
             setLogarithmic(a);
             setVersion(version + 1);
           }} initChecked={logarithmic}/>]}/>
  );
}

export default ScatterTrendChart;