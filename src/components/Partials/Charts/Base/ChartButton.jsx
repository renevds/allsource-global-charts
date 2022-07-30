//Style
import './ChartButton.css'

const ChartButton = ({text, active, onClick}) => {
  const className = "chart__button" + (active ? " chart__button__active" : "")

  return (
    <button className={className} onClick={onClick}>{text}</button>
  );
};

export default ChartButton;