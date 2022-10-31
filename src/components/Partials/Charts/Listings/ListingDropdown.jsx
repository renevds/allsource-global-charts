//Style
import './ListingDropdown.css'

//Hooks
import {useState} from "react";

//Components
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

//Icons
import {faArrowDown, faArrowUp, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

const ListingDropdown = ({options, defaultOption, handleChange, defaultReversed}) => {
  const [dropped, setDropped] = useState(false);
  const [selected, setSelected] = useState(defaultOption);
  const [reversed, setReversed] = useState(defaultReversed);

  const reverse = () => {
    const newReversed = !reversed;
    setReversed(newReversed);
    handleChange(options[selected].key, newReversed);
  }

  const handleClick = value => {
    if(value === selected){
      reverse();
    }
    else {
      setSelected(value);
      setReversed(options[value].defaultReversed);
      handleChange(options[value].key, options[value].defaultReversed);
    }
    setDropped(a => !a);
  }

  return (
    <div className="listing__dropdown__container">
      <FontAwesomeIcon icon={reversed ? faArrowDown : faArrowUp} className="listing__dropdown__reverser" onClick={reverse}/>
      <button className="listing__dropdown__button" onClick={() => setDropped(a => !a)}>
        {selected}<FontAwesomeIcon icon={dropped ? faChevronUp : faChevronDown} className="listing__dropdown__arrow"/>
      </button>
      {dropped && <div className="listing__dropdown__dropper">
        {Object.keys(options).map(a => <div className="listing__dropdown__entry" key={a} onClick={() => handleClick(a)}>{a}</div>)}
      </div>}
    </div>
  )
}

export default ListingDropdown;