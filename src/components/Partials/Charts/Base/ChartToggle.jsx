//Hooks
import {useEffect, useRef, useState} from "react";

//Components
import Tippy from '@tippyjs/react';

//Style
import 'tippy.js/dist/tippy.css';
import './ChartToggle.css'

const ChartToggle = ({name, onToggle, initChecked, tooltip, afterName}) => {
  const [checked, setChecked] = useState(initChecked);

  return (
    <Tippy content={tooltip} className="charttoggle__tooltip">
      <div className="charttoggle_container">
        {name}
        <label className="charttoggle__switch">
          <input readOnly type="checkbox" checked={checked} onClick={() => {
            setChecked(!checked);
            onToggle(!checked);
          }}/>
          <span className="charttoggle__slider"/>
        </label>
        {afterName && <div style={{width: "5px"}}/>}
        {afterName}
      </div>
    </Tippy>
  )
}

export default ChartToggle;