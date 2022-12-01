//Style
import './ChartButton.css'

// Basic button for selecting a period used on above the chart
const ChartButton = ({text, active, onClick, style}) => {
  const className = "chart__button" + (active ? " chart__button__active" : "")

  return (
    <div className="chart__button__container">
      <button style={style} className={className} onClick={onClick}>{text}</button>
    </div>
  );
};

export default ChartButton;