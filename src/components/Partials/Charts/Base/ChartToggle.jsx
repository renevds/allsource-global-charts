import './ChartToggle.css'
import {useState} from "react";

const ChartToggle = ({name, onToggle, initChecked}) => {
  const [checked, setChecked] = useState(initChecked);

  return (
    <div className="charttoggle_container">
      {name}
      <label className="charttoggle__switch">
        <input readOnly type="checkbox" checked={checked} onClick={() => {
          setChecked(!checked);
          onToggle(!checked);
        }}/>
        <span className="charttoggle__slider"/>
      </label>
    </div>
  )
}

export default ChartToggle;