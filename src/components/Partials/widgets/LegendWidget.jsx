//Style
import './LegendWidget.css'

const LegendWidget = ({chartData}) => {
  return [...chartData.datasets].reverse().map(a => (
    <div key={a.label} className="legendwidget__text">
      <div className="legendwidget__box" style={{backgroundColor: a.backgroundColor}}/>
      {a.label}
    </div>
  ))
}

export default LegendWidget;