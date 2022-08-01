//Style
import './ChartStat.css'

//Components
import HigherLower from "../../Icons/HigherLower";

const ChartStat = ({name, value, icon, percentage}) => {
  return (
    <div className="chartstat__container">
      <div className="chartstat__icon">
        {icon}
      </div>
      <div className="chartstat__data">
        <div className="chartstat__name">
          {name}
        </div>
        <div className="chartstat__value">
          {value}
        </div>
        {percentage !== undefined &&
        <div className={"chartstat__percentage" + (percentage > 0 ? "" : " chartstat__percentage_negative")}>
          <HigherLower value={percentage.toLocaleString()}/> {percentage}%
        </div>}

      </div>
    </div>
  )
}

export default ChartStat;