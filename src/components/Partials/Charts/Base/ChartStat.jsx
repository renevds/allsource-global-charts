//Style
import './ChartStat.css'

//Components
import {HigherLower} from "@allsource/ui.partials.icons.higher_lower";
import {formatDecimal} from "../../../../ChartUtils/Utils/chartDataUtils";

const ChartStat = ({name, value, icon, percentage, colorValue, valueSign, valueClass, textColor}) => {

  valueSign = valueSign || "";

  const textStyle = {}
  if(textColor){
    textStyle.color = textColor;
  }

  return (
    <div className={"chartstat__container" + (percentage ? " chartstat__container__wide" : "")}>
      <div className="chartstat__icon">
        {icon}
      </div>
      <div className="chartstat__data">
        <div className="chartstat__name" style={textStyle}>
          {name}
        </div>
        <div className={"chartstat__value" + (valueClass ? " " + valueClass : "")} style={textStyle}>
          {colorValue ?
            <div className={value > 0 ? "chartstat__positive" : "chartstat__negative"}>
              {value > 0 ? "+" : "-"} {formatDecimal(Math.abs(value)).toLocaleString() + valueSign}
            </div>
            : (valueSign ? value + valueSign : value)
          }
        </div>
        {percentage !== undefined &&
          <div className={"chartstat__percentage" + (percentage > 0 ? "" : " chartstat__percentage_negative")}>
            <HigherLower value={percentage.toLocaleString()}/> {Math.abs(percentage)}%
          </div>}
      </div>
    </div>
  )
}

export default ChartStat;