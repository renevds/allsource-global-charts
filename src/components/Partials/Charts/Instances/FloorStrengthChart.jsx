//Components
import BaseLineChart from "../Base/BaseLineChart";
//Hooks
import {useEffect, useRef, useState} from "react";

//Plugins
import {toolTipLinePlugin} from "../../../../ChartUtils/Plugins/toolTipLinePlugin";

//Utils
import {simpleBarDataset} from "../../../../ChartUtils/datasets/datasetTemplates";
import {chartGreen, chartPurple, hoverBackgroundPurple} from "../../../../ChartUtils/Utils/chartColors";

//Queries
import {getListingsData} from "../../../../chart_queries";
import ChartButton from "../Base/ChartButton";
import {Ethereum} from "@allsource/ui.partials.ethereum";

//Style
import './FloorStrengthChart.css'
import {verticalGreenDarkGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";
import FloorStrengthWidget from "../../widgets/FloorStrengthWidget";
import {Divider} from "@allsource/ui.partials.divider";

const AMOUNT_OF_BARS = 14;
const VALUE_KEY = "value"

const durationMap = [0.001, 0.002, 0.005, 0.01, 0.05, 0.1, 1]

const FloorStrengthChart = ({address}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [listingsData, setListingsData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [range, setRange] = useState(0.01);
  const [sortedPrices, setSortedPrices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const listingsData = await getListingsData(address);
        setListingsData(listingsData);
        setSortedPrices(listingsData.map(a => a[VALUE_KEY]).sort());
      } catch (e) {
        setError("Chart data not available.");
      }
    }
    load();
  }, [])

  const getStr = i => (range * i).toLocaleString()

  useEffect(() => {
    let res = [];
    listingsData.forEach(listing => {
      const index = Math.floor(listing[VALUE_KEY] / range);
      res[index] = (res[index] || 0) + 1;
    })
    while ((res[0] === undefined) && (res.length !== 0)) {
      res.shift();
    }
    res = res.slice(0, AMOUNT_OF_BARS + 1);
    const keys = []
    for (let i = 0; i < res.length; i++) {
      keys.push(getStr(i))
    }
    setData(res);
    setLabels(keys);
    setIsLoading(false);
    setVersion(v => v + 1);
  }, [range, listingsData]);


  const chartOptions = {
    interaction: {
      mode: "nearest",
      axis: 'x',
      intersect: false
    },
    scales: {
      xAxes: {
        type: 'category'
      },
      yAxes: {
        type: "modifiedLinear",
        title: {
          display: true,
          text: "Listings",
          color: chartGreen,
        }
      }
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: toolTipItem => {
            return `${toolTipItem[0].label} - ${(parseFloat(toolTipItem[0].label) + range).toLocaleString()} Ξ`
          },
        }
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
        ...simpleBarDataset,
        backgroundColor: verticalGreenDarkGradient,
        hoverBackgroundColor: hoverBackgroundPurple,
        data: data,
        tooltip: {
          callbacks: {
            label: toolTipItem => {
              return `Listings: ${toolTipItem.parsed.y?.toLocaleString() || 0}`
            }
          }
        },
        borderRadius: 8
      }
    ],
    labels: labels
  }
  const chartRef = useRef(null);

  return (
    <div className="floorstrengthchart__container">
      <FloorStrengthWidget prices={sortedPrices}/>
      <Divider color="#43404A" margin="5px"/>
      <div className="floorstrengthchart__chart">
        <BaseLineChart chartData={chartData}
                       chartRef={chartRef}
                       buttons={durationMap.map(value => <ChartButton key={value}
                                                                      text={value}
                                                                      active={value === range}
                                                                      style={{}}
                                                                      onClick={() => {
                                                                        if (value !== range) {
                                                                          setIsLoading(true);
                                                                          setRange(value);
                                                                        }
                                                                      }}/>
                       )}
                       chartOptions={chartOptions}
                       isLoading={isLoading}
                       plugins={[toolTipLinePlugin]}
                       controls={[]}
                       error={error}
                       unit={<Ethereum/>}
                       sharpTop/>
      </div>
    </div>
  );
}

export default FloorStrengthChart;