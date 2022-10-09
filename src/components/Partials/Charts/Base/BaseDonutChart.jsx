//Style
import "./BaseDonutChart.css";

//Components
import {Doughnut} from 'react-chartjs-2';
import {Loader} from "@allsource/ui.partials.loader";

//Tools
import {mergeDeep} from "../../../../utils/objUtils";

//Chart.js
import {
  ArcElement,
  Chart as ChartJS,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const BaseDonutChart = ({chartData, plugins, chartOptions, chartRef, isLoading, error}) => {

    const defaultChartOptions = {
      interaction: {
        mode: "index"
      },
      cutout: "30%",
      responsive: true,
      maintainAspectRatio: false,
      spanGaps: true,
      plugins: {
        tooltip: {
          displayColors: false,
        },
        legend: {
          position: "right",
          labels: {
            color: "#FFFFFF"
          },
          onHover: function (event, legendItem, legend) {
            const activeElement = {
              datasetIndex: 0,
              index: legendItem.index
            };
            this.chart.tooltip.setActiveElements([activeElement]);
            this.chart.update();
          }
        }
      },
      animation: false,
      hover: {
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      borderRadius: 0,
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
      spacing: 0,
      borderColor: "#26232b"
    }

    const mergedOptions = mergeDeep(defaultChartOptions, chartOptions);

    return (
      <div className="base__donut__chart__container">
        <div className="base__donut__chart__base__donut__chart">
          <Doughnut options={mergedOptions} data={chartData} plugins={plugins}/>
        </div>
        {error ?
          <div className="base__donut__chart__error">{error}</div> :
          (isLoading && <Loader fullScreen={true} hideBackground={false}/>)
        }
      </div>
    );
  }
;

export default BaseDonutChart;