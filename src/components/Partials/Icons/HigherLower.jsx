//Style
import './HigherLower.css'

const HigherLower = ({value}) => {
  if (value <= 0) {
    return (<img className='higherlower__arrow higherlower__arrow__higher' src="https://files.allsource.io/icons/arrow_down.svg" alt="arrow down"/>)
  } else {
    return (<img className='higherlower__arrow' src="https://files.allsource.io/icons/arrow_up.svg" alt="arrow up"/>)
  }
}

export default HigherLower;