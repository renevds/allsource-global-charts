//Hooks
import {useEffect, useRef, useState} from "react";

//Gradients
import {horizontalBlueGreenGradient, verticalBlueDarkGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Utils
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";

//Components
import CompactLineChart from "../Base/CompactLineChart";
import {saveImageToStorage} from "../../../../ChartUtils/Plugins/saveImageToStoragePlugin";

const BasicLineChart = ({
                          xKey,
                          yKey,
                          dataEndpoint,
                          saveToSessionName
                        }) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [initialXMin, setInitialXMin] = useState(0);
  const [initialXMax, setInitialXMax] = useState(0);

  useEffect(() => {
    if (init) {
      try {
        const newInitialMax = getMax(data, xKey);
        const newInitialMin = getMin(data, xKey);
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setIsLoading(false);
        setVersion(version + 1);
      } catch (e) {
        setError(e);
        setInit(true);
      }
    }
  }, [init])

  if (!init) {
    dataEndpoint().then(a => {
      setData(a);
      setInit(true);
    }).catch(() => setError("Chart data not available."));
  }

  const chartOptions = {
    interaction: {
      mode: "index",
      intersect: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: {
        type: 'time',
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: "linear",
      }
    },
    plugins: {
      tooltip: {
        enabled: false
      },
      saveImageToStorage: {
        enabled: saveToSessionName,
        name: saveToSessionName
      }
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
        backgroundColor: verticalBlueDarkGradient,
        fill: 'origin'
      }
    ]
  }

  const chartRef = useRef(null);

  return (
    <CompactLineChart chartData={chartData}
                      chartRef={chartRef}
                      chartOptions={chartOptions}
                      isLoading={isLoading}
                      plugins={[saveImageToStorage]}
    error={error}/>
  );
}

export default BasicLineChart;