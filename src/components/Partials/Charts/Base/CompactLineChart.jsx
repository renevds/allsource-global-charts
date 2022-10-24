//Style
import "./CompactLineChart.css";

//Components
import LineMemo from "./LineMemo";
import {Loader} from "@allsource/ui.partials.loader";

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
  CategoryScale,
  BarElement,
);

const CompactLineChart = ({chartData, plugins, chartOptions, chartRef, isLoading, error}) => {

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
          display: false
        },
        xAxes: {
          display: false,
          ticks: {
            maxTicksLimit: 10,
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
          radius: 0,
          borderWidth: 0,
          hoverBorderWidth: 0,
          hoverRadius: 0,
        }
      }
    }

    const mergedOptions = mergeDeep(defaultChartOptions, chartOptions);

    return (
      <div className="compact__chart__container">
          <LineMemo options={mergedOptions} data={chartData} plugins={plugins} chartRef={chartRef} error={error}/>
        {isLoading && <Loader fullScreen={true} hideBackground={false}/>}
      </div>
    );
  }
;

export default CompactLineChart;