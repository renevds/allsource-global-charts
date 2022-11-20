//Style
import './TransactionListItem.css'

//Utils
import moment from "moment";

//Components
import {Ethereum} from "@allsource/ui.partials.ethereum";

const TIMESTAMP_KEY = "timestamp"
const VALUE_KEY = "ev"
const ID_KEY = "tid"
const ACTION_KEY = "action"
const SENDER_KEY = "s"
const RECEIVER_KEY = "r"
const CONTRACT_KEY = "_ca"
const TRANSACTION_KEY = "th"

const LOGO_KEY = "projectLogo"
const TITLE_KEY = "projectTitle"

const descriptions = {
  Sale: {
    color: "green",
    text: "Sold"
  },
  Loan: {
    color: "white",
    text: "Loan"
  },
  Swap: {
    color: "purple",
    text: "Swap"
  },
  Mint: {
    color: "red",
    text: "Swap"
  },
  Transfer: {
    color: "white",
    text: "Swap"
  },
  Liquidity: {
    color: "white",
    text: "Liquidity"
  }
}

const TransactionListItem = ({transaction, collectionInfo}) => {

  const truncateAddress = a => a.slice(0, 2) + '..' + a.slice(-4)

  return (
    <div className="transaction__list__item__container">
      <div className="transaction__list__item__row">
        <div
          className={"transaction__list__item__" + descriptions[transaction[ACTION_KEY]]?.color + " transaction__list__item__buy"}>
          {descriptions[transaction[ACTION_KEY]]?.text}
          <img src="https://files.allsource.io/icons/opensea-logo.svg" className="transaction__list__item__button"
               onClick={() => {
                 window.open(`https://opensea.io/assets/ethereum/${transaction[CONTRACT_KEY]}/${transaction[ID_KEY]}`, '_blank').focus();
               }}/>
        </div>
        <div className="transaction__list__item__date">about {moment(transaction[TIMESTAMP_KEY]).fromNow()}</div>
      </div>
      <div className="transaction__list__item__row transaction__list__item__gap">
        <div>
          <div className="transaction__list__item__title transaction__list__item__title__column">To:</div>
          <span className="transaction__list__item__text transaction__list__item__hover" onClick={() => {
            window.open(`https://etherscan.io/address/${transaction[RECEIVER_KEY]}`, '_blank').focus();
          }}>
            {truncateAddress(transaction[RECEIVER_KEY])}
          </span>
        </div>
        <div>
          <div className="transaction__list__item__title transaction__list__item__title__column">From:</div>
          <span onClick={() => {
            window.open(`https://etherscan.io/address/${transaction[SENDER_KEY]}`, '_blank').focus();}}
            className="transaction__list__item__text transaction__list__item__hover">{truncateAddress(transaction[SENDER_KEY])}</span>
        </div>
      </div>
      <div className="transaction__list__item__row transaction__list__item__token">
        <img src={collectionInfo[LOGO_KEY]} className="transaction__list__item__img"/>
        <div className="transaction__list__item__token__info transaction__list__item__gap">
          <div className="transaction__list__item__text">
            {collectionInfo[TITLE_KEY]}
          </div>
          <div className="transaction__list__item__green">
            #{transaction[ID_KEY]}
          </div>
        </div>
      </div>
      <div className="transaction__list__item__row__small transaction__list__item__text">
        <Ethereum/>&nbsp;{transaction[VALUE_KEY].toLocaleString()}
      </div>
      <div className="transaction__list__item__row__small">
        <img src="https://files.allsource.io/icons/etherscan-logo.svg" className="transaction__list__item__button"
             onClick={() => {
               window.open(`https://etherscan.io/tx/${transaction[TRANSACTION_KEY]}`, '_blank').focus();
             }}/>
      </div>
    </div>
  )
}

export default TransactionListItem;