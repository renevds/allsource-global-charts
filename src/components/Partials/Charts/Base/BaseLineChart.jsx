//Style
import "./BaseLineChart.css";

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
  Tooltip,
  BarController
} from 'chart.js';
import 'chartjs-adapter-moment';

//Scales
import OffsetLogScale from "../../../../ChartUtils/Scales/offsetLogScale";
import ModifiedLinearScale from "../../../../ChartUtils/Scales/modifiedLinearScale";

//Plugins
import Log2ScalePlugin from "../../../../ChartUtils/Scales/log2ScalePlugin";
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from "chartjs-plugin-annotation";

//Utils
import {mergeDeep} from "../../../../utils/objUtils";
import {textColor} from "../../../../ChartUtils/Utils/chartColors";

ChartJS.register( // Register all Chart.js modules and plugins globally used in this project
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
  annotationPlugin,
  BarController,
);

// This is a basic line chart, but also the base for all scatter and bar charts
// This also includes the container for the chart and buttons, stats etc

const BaseLineChart = ({chartData, buttons, controls, plugins, stats, chartOptions, chartRef, isLoading, error, transparentError, sharpTop, debug}) => {

    if(debug){
      console.log(chartData);
    }

    const defaultChartOptions = { // Default set of options, these are globally used unless overwritten
      responsive: true,
      maintainAspectRatio: false,
      spanGaps: true,
      layout: {
        padding: 0
      },
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
          color: textColor,
          maxTicksLimit: 6,
          grid: {
            drawBorder: false,
            color: "#322F36"
          },
        },
        xAxes: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true
          },
          time: {
            unit: 'day',
            tooltipFormat: 'll',
            displayFormats: {
              'day': 'll'
            }
          },
          grid: {
            drawBorder: false,
            color: "#322F36",
            display: false
          }
        }
      },
      animation: true,
      //hover: {animationDuration: 0},
      responsiveAnimationDuration: 0
    }

    const mergedOptions = mergeDeep(defaultChartOptions, chartOptions);

    return (
      <div className={"chart__container" + (sharpTop ? " chart__sharp" : "")}>
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
          <LineMemo options={mergedOptions} data={chartData} plugins={plugins} chartRef={chartRef} debug={debug}/>
        </div>
        {error ?
          <div className={"chart__error" + (transparentError ? " chart__error__transparent" : "")}>
            {error}
          </div>
          :
          (isLoading && <Loader fullScreen={true} hideBackground={false}/>)
        }
      </div>
    );
  }
;

export default BaseLineChart;
