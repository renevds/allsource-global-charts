//Style
import "./BaseLineChart.css";

//Components
import LineMemo from "./LineMemo";
import Loader from "../../Loader/Loader";

//Chart.js
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-moment';

//Gradients
import {horizontalBlueGreenGradient} from "../../../../ChartUtils/Utils/chartGradientUtils";

//Scales
import OffsetLogScale from "../../../../ChartUtils/Scales/offsetLogScale";
import ModifiedLinearScale from "../../../../ChartUtils/Scales/modifiedLinearScale";

//Plugins
import Log2ScalePlugin from "../../../../ChartUtils/Plugins/log2ScalePlugin";
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from "chartjs-plugin-annotation";

//Utils
import {mergeDeep} from "../../../../utils/objUtils";
ChartJS.register(
  TimeScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  OffsetLogScale,
  zoomPlugin,
  ModifiedLinearScale,
  CategoryScale,
  BarElement,
  Log2ScalePlugin,
  annotationPlugin
);

const BaseLineChart = ({chartData, buttons, controls, plugins, stats, chartOptions, chartRef, isLoading}) => {

    const defaultChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      spanGaps: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          displayColors: false,
        }
      },
      scales: {
        yAxes: {
          color: "#ffffff",
          maxTicksLimit: 6,
          grid: {
            borderWidth: 0,
            color: "#322F36"
          },
        },
        xAxes: {
          ticks: {
            maxTicksLimit: 10,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
          },
          time: {
            unit: 'day',
            tooltipFormat: 'LL',
            displayFormats: {
              'day': 'LL'
            }
          },
          grid: {
            borderWidth: 0,
            color: "#322F36"
          }
        }
      },
      animation: false,
      hover: {animationDuration: 0},
      responsiveAnimationDuration: 0,
      elements: {
        point: {
          backgroundColor: "rgba(255,255,255,0.1)",
          radius: 4,
          borderWidth: 1,
          hoverBorderWidth: 2,
          hoverRadius: 5.5,
          borderColor: horizontalBlueGreenGradient
        }
      }
    }

    const mergedOptions = mergeDeep(defaultChartOptions, chartOptions);

    return (
      <div className="chart__container">
        <div className="chart__row">
          <div className="chart__stats">
            {stats}
          </div>
          <div className="chart__buttons">
            {controls}
            <div className="chart__buttons__bg">
              {buttons}
            </div>
          </div>
        </div>
        <div className="chart__chart">
          <LineMemo options={mergedOptions} data={chartData} plugins={plugins} chartRef={chartRef}/>
        </div>
        {isLoading && <Loader fullScreen={true} hideBackground={false}/>}
      </div>
    );
  }
;

export default BaseLineChart;
