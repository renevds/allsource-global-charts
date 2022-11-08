//Hooks
import {useEffect, useState} from "react";

//Queries
import {anySaleInEthForPeriod} from "../../../../chart_queries";

//Style
import './TransactionList.css'

//Components
import TransactionListItem from "./TransactionListItem";

const tokenNameKey = "contractSlug"

const filters = {
  All: null,
  Buy: null,
  Sell: null
}

const TransactionList = ({address}) => {

  const [filter, setFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(100);

  console.log(transactions)

  useEffect(() => {
    anySaleInEthForPeriod(address, 3650).then(a => setTransactions(a.reverse()))
  }, [])


  return (
    <div className="transaction__list__container">
      <div className="transaction__list__buttons">
        {Object.keys(filters).map(a => <button key={a}
                                               className={"transaction__list__button" + (filter === a ? " transaction__list__button__active" : "")}
                                               onClick={() => setFilter(a)}>{a}</button>)}
      </div>
      <div className="transaction__list__entries">
        {transactions.splice(0, amount).map(a => <TransactionListItem key={a[tokenNameKey]} transaction={a}/>)}
      </div>
    </div>
  )
}

export default TransactionList;