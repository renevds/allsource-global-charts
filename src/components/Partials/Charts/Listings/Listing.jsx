//Style
import './Listing.css'

//Utils
import moment from "moment";

//Components
import {Ethereum} from "@allsource/ui.partials.ethereum";

const contractAddressKey = "0x33857Ad1031122A00A68E6Bf9Ac4475ba6c6F8be"
const expireKey = "expire"
const orderHashKey = "orderHash"
const timestampKey = "timestamp"
const tokenNameKey = "tokenName"
const valueKey = "value"

const Listing = ({listing}) => (
  <div className="listing__container">
    <div className="listing__row">
      <div className="listing__green listing__buy">
        Buy<img src="https://files.allsource.io/icons/opensea-logo.svg" className="listing__button"/>
      </div>
      <div className="listing__date">about {moment(listing[timestampKey]).fromNow()}</div>
    </div>
    <div className="listing__row listing__gap">
      <div>
        <div className="listing__title listing__title__column">To:</div>
        <span className="listing__text">You</span>
      </div>
      <div>
        <div className="listing__title listing__title__column">From:</div>
        <span className="listing__text">0x...d1eb</span>
      </div>
    </div>
    <div className="listing__row listing__token">
      <img src="https://i.imgur.com/MApXoYW.png" className="listing__img"/>
      <div className="listing__token__info listing__gap">
        <div className="listing__text">
          {listing[tokenNameKey].split('#')[0]}
        </div>
        <div className="listing__green">
          #{listing[tokenNameKey].split('#')[1]}
        </div>
      </div>
    </div>
    <div className="listing__row__small listing__text">
      <Ethereum/>&nbsp;{listing[valueKey]}
    </div>
    <div className="listing__row__small">
      <img src="https://files.allsource.io/icons/etherscan.svg" className="listing__button"/>
    </div>
  </div>
)

export default Listing;