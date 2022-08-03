//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import BaseDonutChart from "../Base/BaseDonutChart";

//Utils
import {interpolateColors} from "../../../../ChartUtils/Utils/chartColorUtils";

//Plugins
import {differentThicknessDonutPlugin} from "../../../../ChartUtils/Plugins/differentThicknessDonutPlugin";

const DonutChartWithLegend = ({
                      defaultEndpoint,
                      durationMap,
                      valueKey,
                      dataEndpoint,
                      formatter,
                      labelKey
                    }) => {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(defaultEndpoint);
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");

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

  const chartOptions = {}

  const chartData = {
    datasets: [
      {
        radius: "90%",
        cutout: "0%",
        data: data.map(a => a[valueKey]),
        tooltip: {
          callbacks: {
            label: formatter,
          }
        },
        backgroundColor: interpolateColors('rgb(114,48,220)', 'rgb(87,243,183)', data.length),
        radiusChange: data.map((_, index) => Math.pow(1.5, -index)),
        borderRadius: (context) => {
          return {
            outerEnd: 10,
            outerStart: (context.dataIndex === 0) ? 10 : 0
          }
        }
      },
      {
        radius: "70%",
        cutout: "43%",
        data: data.map(a => a[valueKey]),
        tooltip: {
          callbacks: {
            label: () => '',
          }
        },
        backgroundColor: interpolateColors('rgb(80,33,161)', 'rgb(51,147,117)', data.length),
        radiusChange: data.map(() => 1)
      }
    ],
    labels: data.map(a => a[labelKey])
  }


  return (<BaseDonutChart chartData={chartData} plugins={[differentThicknessDonutPlugin]} chartOptions={chartOptions}
                          isLoading={isLoading}/>)

}

export default DonutChartWithLegend;