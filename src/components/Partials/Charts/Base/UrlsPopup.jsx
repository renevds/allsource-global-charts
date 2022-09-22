//Components
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

//Icons
import {faXmark} from "@fortawesome/free-solid-svg-icons";

//Style
import './UrlsPopup.css';

const UrlsPopup = ({urls, onClose}) => {
  if (urls.length > 0) {
    return (
      <div className="urlspopup__urls">
        <div className="urlspopup__center">
          <div className="urlspopup__urls__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark}/>
          </div>
          <div className="urlspopup__urls__bg">
            {urls.map((a, i) => <a key={i} className="urlspopup__urls__a" href={a.url}
                              target='_blank'>{a.name}</a>)}
          </div>
        </div>
      </div>
    )
  }
}

export default UrlsPopup;
