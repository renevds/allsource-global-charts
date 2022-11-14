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
import {emptyBarLinePlugin} from "../../../../ChartUtils/Plugins/emptyBarLinePlugin";

const AMOUNT_OF_BARS = 14;
const VALUE_KEY = "value"
const SOLD_KEY = "hasSold"
const ACTIVE_KEY = "isActive"

const rangeMap = [0.001, 0.002, 0.005, 0.01, 0.05, 0.1, 1]

const FloorStrengthChart = ({address}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [listingsData, setListingsData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [rangeIndex, setRangeIndex] = useState(3);
  const [sortedPrices, setSortedPrices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        let listingsData = await getListingsData(address);
        listingsData = listingsData.filter(a => {
          return !a[SOLD_KEY] && a[ACTIVE_KEY]
        })
        listingsData = listingsData.sort((a, b) => (a[VALUE_KEY] > b[VALUE_KEY]) ? 1 : -1)
        setListingsData(listingsData);
        setSortedPrices(listingsData.map(a => a[VALUE_KEY]));
        let newRange = 0
        for (let i = 0; i < rangeMap.length; i++) {if(listingsData[0][VALUE_KEY]/rangeMap[i] > 5 || i === rangeMap.length - 1){
            newRange = i;
          }
          else {
            break;
          }
        }
        setRangeIndex(newRange);
      } catch (e) {
        setError("Chart data not available.");
      }
    }
    load();
  }, [])

  let range = rangeMap[rangeIndex]
  const getStr = i => (range * i).toLocaleString()

  useEffect(() => {
    const calc = () => {
      let res = [];
      let min =  Math.floor(listingsData[0][VALUE_KEY] / range);
      listingsData.forEach(listing => {
        const index = Math.floor(listing[VALUE_KEY] / range);
        res[index] = (res[index] || 0) + 1;
      })
      let keys = []
      let ret = []
      for (let i = min; i < res.length && ret.length <= AMOUNT_OF_BARS; i++) {
        if(res[i] !== undefined){
          ret.push(res[i])
          keys.push(getStr(i))
        }
        else if(res[i] === undefined && res[i + 1] !== undefined && res) {
          ret.push(0)
          keys.push("...")
        }
      }
      setData(ret);
      setLabels(keys);
      setIsLoading(false);
      setVersion(v => v + 1);
    }
    if(listingsData.length > 0){
      calc()
    }
  }, [rangeIndex, listingsData]);


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
                       buttons={rangeMap.map((value, index) => <ChartButton key={value}
                                                                            text={value}
                                                                            active={value === range}
                                                                            style={{}}
                                                                            onClick={() => {
                                                                              if (value !== range) {
                                                                                setIsLoading(true);
                                                                                setRangeIndex(index);
                                                                              }
                                                                            }}/>
                       )}
                       chartOptions={chartOptions}
                       isLoading={isLoading}
                       plugins={[toolTipLinePlugin, emptyBarLinePlugin]}
                       controls={[]}
                       error={error}
                       unit={<Ethereum/>}
                       sharpTop/>
      </div>
    </div>
  );
}

export default FloorStrengthChart;