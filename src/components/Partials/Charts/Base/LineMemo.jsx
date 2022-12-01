//Components
import {Line} from "react-chartjs-2";

///Hooks
import {memo} from "react";

// This wraps the chart.js line chart and only updates if version is changed
// Chart.js deciding when to update was not efficient

const LineMemo = memo(({options, data, plugins, chartRef, debug}) => {
  return (<Line options={options} data={data} plugins={plugins}
                redraw={true} //Todo can we get rid of this? https://stackoverflow.com/questions/60922006/options-changes-not-seen-in-react-chartjs-2
                ref={chartRef}/>)
}, (prevProps, nextProps) => {
  if(nextProps.debug){
    console.log(nextProps);
  }
  return prevProps.data.version === nextProps.data.version
})

export default LineMemo;