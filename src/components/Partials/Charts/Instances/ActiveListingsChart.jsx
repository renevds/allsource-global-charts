//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseLineChart from "../Base/BaseLineChart";
import ChartButton from "../Base/ChartButton";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";

//Queries
import {getEthListingEvents} from "../../../../chart_queries";

//Utils
import moment from "moment";
import {simpleBarDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {
  chartGreen,
  chartPurple,
  chartRed,
  hoverBackgroundGreen,
  textColor
} from "../../../../ChartUtils/Utils/chartColors";import {
  horizontalBlueGreenGradient,
  verticalBlueDarkGradientNonTransparent
} from "../../../../ChartUtils/Utils/chartGradientUtils";
import LegendWidget from "../../widgets/LegendWidget";

const durationMap = {
  "7D": 7,
  "14D": 14,
  "30D": 30
}

const DATE_KEY = 'date';
const LISTED_KEY = 'listed';
const SOLD_KEY = 'sold';
const CANCELED_KEY = 'canceled';
const EXPIRED_KEY = 'expired';

const ActiveListingsChart = ({address}) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState("14D");
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [pannedData, setPannedData] = useState([]);

  useEffect(() => {
    if (init) {
      try {
        setPannedData(data.slice(data.length - durationMap[active], data.length - 1));
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
        let newData = await getEthListingEvents(address, 30);
        setData(newData);
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
      yAxes: {
        type: "modifiedLinear",
        title: {
          display: true,
          text: "Listings",
          color: 'rgb(166,166,166)',
        },
        stacked: true
      },
      xAxes: {
        stacked: true
      }
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        itemSort: function(a, b) {
          return b.datasetIndex - a.datasetIndex;
        }
      },
    }
  }

  const chartData = {
    version,
    datasets: [
      {
        ...simpleBarDataset,
        backgroundColor: chartRed,
        hoverBackgroundColor: "rgba(255, 108, 82, 0.5)",
        data: pannedData.map(a => a[CANCELED_KEY]),
        label: "Canceled",
        tooltip: {
          callbacks: {
            label: toolTipItem => `Canceled: ${toolTipItem.parsed.y}`,
          }
        }
      },
      {
        ...simpleBarDataset,
        backgroundColor: chartGreen,
        hoverBackgroundColor: "rgba(20,244,201,0.5)",
        data: pannedData.map(a => a[EXPIRED_KEY]),
        label: "Expired",
        tooltip: {
          callbacks: {
            label: toolTipItem => `Expired: ${toolTipItem.parsed.y}`,
          }
        }
      },
      {
        ...simpleBarDataset,
        backgroundColor: chartPurple,
        hoverBackgroundColor: "rgba(114,48,222,0.5)",
        label: "Sold",
        data: pannedData.map(a => a[SOLD_KEY]),
        tooltip: {
          callbacks: {
            label: toolTipItem => `Sold: ${toolTipItem.parsed.y}`,
          }
        }
      },
      {
        ...simpleBarDataset,
        backgroundColor: "rgb(166,166,166)",
        hoverBackgroundColor: "rgba(166,166,166,0.5)",
        label: "Listed",
        data: pannedData.map(a => a[LISTED_KEY]),
        tooltip: {
          callbacks: {
            label: toolTipItem => `Listed: ${toolTipItem.parsed.y}`,
          }
        },
        borderRadius: 8
      }
    ],
    labels: pannedData.map(a => moment(a[DATE_KEY]).format('ll'))
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
                   stats={<LegendWidget chartData={chartData}/>}
                   plugins={[toolTipLinePlugin]}/>
  );
}

export default ActiveListingsChart;