//Style
import './HigherLower.css'

//Images
import arrowDown from '../../../images/arrow_down.svg'
import arrowUp from '../../../images/arrow_up.svg'


const HigherLower = ({value}) => {
  if (value <= 0) {
    return (<img className='higherlower__arrow higherlower__arrow__higher' src={arrowDown} alt="arrow down"/>)
  } else {
    return (<img className='higherlower__arrow' src={arrowUp} alt="arrow up"/>)
  }
}

export default HigherLower;