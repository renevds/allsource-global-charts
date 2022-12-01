//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";

//Hooks
import {useEffect, useRef, useState} from "react";
import ChartToggle from "../Base/ChartToggle";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";
import {simpleLineDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartGreen, chartPurple} from "../../../../ChartUtils/Utils/chartColors";
//Utils
import {getMax, getMin} from "../../../../ChartUtils/Utils/chartDataUtils";
import {dayTimestampDuration} from "../../../../utils/timeUtils";

//Queries
import {holderOverTime} from "../../../../chart_queries"

const durationMap = { // Selectable time durations
  "7D": 7,
  "30D": 30,
  "ALL": Infinity,
}

const timestampKey = "ts"; // Keys for the api endpoint
const onlyNZTKey = "onlyNZT";
const zeroValueKey = "withZeroValueTransfers";
const numKey = "num";

const HoldersChart = ({address}) => {
  const [init, setInit] = useState(false); // Has data loaded
  const [isLoading, setIsLoading] = useState(true); // Has the chart fully loaded (this removes the animation)
  const [active, setActive] = useState("30D"); // The current selected period
  const [holdersData, setHoldersData] = useState({[onlyNZTKey]: [], [zeroValueKey]: []}); // The data for this chart
  const [version, setVersion] = useState(0); // The version if this chart, changing this will cause the underlying chart.js chart to update
  const [error, setError] = useState(""); // Current error to display, this would hide the chart
  const [logarithmic, setLogarithmic] = useState(false); // Is logarithmic scale enabled
  const [initialXMin, setInitialXMin] = useState(0); // Current min of the x-axes
  const [initialXMax, setInitialXMax] = useState(0); // Current max of the x-axes

  useEffect(() => { // This use effect calculates all needed values from the dataset
    if (init) {
      try {
        const newInitialMax = getMax(holdersData[onlyNZTKey], timestampKey); // Calculate the max x
        const newInitialMin = newInitialMax - dayTimestampDuration * (durationMap[active] - 1); // Calculate the min x
        setInitialXMax(newInitialMax);
        setInitialXMin(newInitialMin);
        setIsLoading(false); // Hide loading animation
        setVersion(version + 1); // Update chart.js chart
      } catch (e) {
        setError(e);
      }
    }
  }, [active, init]) // This use effect is called whenever the data is loaded or the period changes

  useEffect(() => {
    const load = async () => {
      try {
        const holders = await holderOverTime(address, 3650); // Call API endpoint
        setHoldersData(holders);
        setInit(true); // Trigger the above effect
      }catch (e){
        setError("Chart data not available."); // Set the error in case of an error
        setInit(false);
      }
    }
    load();
  }, []) // This is called when a new chart is made

  const chartOptions = { // This is the configuration for chart.js, this is overwritten on defaults in BaseLineChart.jsx, for a detailed explanation of the things below, check the chart.js docs
    interaction: {
      mode: "nearest",
      axis: 'x',
      intersect: false
    },
    scales: {
      xAxes: {
        type: 'time',
        max: initialXMax,
        min: initialXMin
      },
      yAxes: {
        type: logarithmic ? "log2Scale" : "modifiedLinear", // Set the scale depending on the mode, both are custom scales that can be found under src/ChartUtils/Scales
        title: {
          display: true,
          text: "Holders",
          color: chartGreen,
        }
      }
    },
    plugins: { // This uses the 'zoom' plugin but only to add panning
      zoom: {
        pan: {
          mode: 'x',
          enabled: true
        },
        limits: {
          xAxes: {
            min: getMin(holdersData[onlyNZTKey], timestampKey), // Set limits of the panning
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
  const chartData = { // The chart.js dataset
    version,
    datasets: [
      {
        ...simpleLineDataset, // Some default options for this type of dataset
        data: holdersData[zeroValueKey], // The data
        parsing: {
          xAxisKey: timestampKey,
          yAxisKey: numKey
        },
        tooltip: { // Logic for the tooltip
          callbacks: {
            label: toolTipItem => {
              return `Holders: ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        },
      },
      {
        ...simpleLineDataset,
        borderColor: chartPurple,
        pointBorderColor: chartPurple,
        data: holdersData[onlyNZTKey], // The data
        parsing: {
          xAxisKey: timestampKey,
          yAxisKey: numKey
        },
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Smart filtered holders: ${toolTipItem.parsed.y.toLocaleString()}`
            },
          }
        }
      }
    ]
  }
  const chartRef = useRef(null); // Reference to chart js object, can be used for some advanced scripting

  return (
    <BaseLineChart chartData={chartData} // Pass the chart.js dataset
                   chartRef={chartRef} // Set the reference
                   buttons={Object.keys(durationMap).map(endpoint => <ChartButton key={endpoint} // You can pass interval selection buttons here, here the duration is just mapped
                                                                                  text={endpoint}
                                                                                  active={endpoint === active}
                                                                                  onClick={() => {
                                                                                    if (endpoint !== active) {
                                                                                      setIsLoading(true);
                                                                                      setActive(endpoint);
                                                                                    }
                                                                                  }}/>
                   )}
                   chartOptions={chartOptions} // Pass the chart.js options
                   isLoading={isLoading} // Is loading animation shown
                   stats={[]} // Possibility to pass top stats
                   error={error} // Pass error
                   plugins={[toolTipLinePlugin]} // Pass extra plugins (some are registered by default, like the zoom)
                   controls={[<ChartToggle key={1} name="Log" onToggle={a => {
                     setLogarithmic(a);
                     setVersion(version + 1);
                   }} initChecked={logarithmic} tooltip="Logarithmic scale"/>]}/> // Pass top controls like log button
  );
}

export default HoldersChart;