//Components
import {Line} from "react-chartjs-2";

///Hooks
import {memo} from "react";

const LineMemo = memo(({options, data, plugins, chartRef}) => {
  return (<Line options={options} data={data} plugins={plugins}
                redraw={true} //Todo can we get rid of this? https://stackoverflow.com/questions/60922006/options-changes-not-seen-in-react-chartjs-2
                ref={chartRef}/>)
}, (prevProps, nextProps) => {
  return prevProps.data.version === nextProps.data.version
})

export default LineMemo;