//Style
import './TransactionListItem.css'

//Utils
import moment from "moment";

//Components
import {Ethereum} from "@allsource/ui.partials.ethereum";

const timestampKey = "timestamp"
const tokenNameKey = "contractSlug"
const valueKey = "ev"
const nftIdKey = "nftId"
const actionKey = "action"
const senderKey = "s"
const receiverKey = "r"

const descriptions = {
  Sale: {
    color: "green",
    text: "Bought"
  }
}

const TransactionListItem = ({transaction}) => {

  const opensea = (<img src="https://files.allsource.io/icons/opensea-logo.svg" className="transaction__list__item__button"/>)

  const truncateAddress = a => a.slice(0, 2) + '..' + a.slice(-4)

  return (
    <div className="transaction__list__item__container">
      <div className="transaction__list__item__row">
        <div className={"transaction__list__item__" + descriptions[transaction[actionKey]]?.color + " transaction__list__item__buy"}>
          {descriptions[transaction[actionKey]]?.text}
        </div>
        <div className="transaction__list__item__date">about {moment(transaction[timestampKey]).fromNow()}</div>
      </div>
      <div className="transaction__list__item__row transaction__list__item__gap">
        <div>
          <div className="transaction__list__item__title transaction__list__item__title__column">To:</div>
          <span className="transaction__list__item__text">{truncateAddress(transaction[receiverKey])}</span>
        </div>
        <div>
          <div className="transaction__list__item__title transaction__list__item__title__column">From:</div>
          <span className="transaction__list__item__text">{truncateAddress(transaction[senderKey])}</span>
        </div>
      </div>
      <div className="transaction__list__item__row transaction__list__item__token">
        <img src="https://i.imgur.com/MApXoYW.png" className="transaction__list__item__img"/>
        <div className="transaction__list__item__token__info transaction__list__item__gap">
          <div className="transaction__list__item__text">
            Some NFT
          </div>
          <div className="transaction__list__item__green">
            #420
          </div>
        </div>
      </div>
      <div className="transaction__list__item__row__small transaction__list__item__text">
        <Ethereum/>&nbsp;{transaction[valueKey]}
      </div>
      <div className="transaction__list__item__row__small">
        <img src="https://files.allsource.io/icons/etherscan-logo.svg" className="transaction__list__item__button"/>
      </div>
    </div>
  )
}

export default TransactionListItem;