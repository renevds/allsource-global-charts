//Hooks
import {useEffect, useState} from "react";

//Queries
import {anySaleInEthForPeriod} from "../../../../chart_queries";

//Style
import './TransactionList.css'

//Components
import TransactionListItem from "./TransactionListItem";
import {projectFetch} from "@allsource/config.axios_instances";

const FILTERS = [
  'Sale',
  'Swap',
  'Loan',
  'Mint',
  'Transfer',
  'Liquidity'
]

const ACTION_KEY = "action"

const TransactionList = ({address}) => {

  const [activeFilters, setActiveFilters] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [amount, setAmount] = useState(100);
  const [error, setError] = useState("");
  const [collectionInfo, setCollectionInfo] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const newTransactions = await anySaleInEthForPeriod(address, 3650).then(a => a.reverse())
        const path = "/getCollectionsImages";

        const customConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await projectFetch.post(
          path,
          {contractsList: [address]},
          customConfig
        );
        setCollectionInfo(response.data[0]);
        setTransactions(newTransactions);
        setDisplayedTransactions(newTransactions);
      } catch (e) {
        setError("List data not available.");
      }
    }
    load();
  }, [])

  useEffect(() => {
    if (Object.keys(activeFilters).length === 0 || !Object.values(activeFilters).some(a => a)) {
      setDisplayedTransactions(transactions);
    } else {
      setDisplayedTransactions(transactions.filter(a => activeFilters[a[ACTION_KEY]]))
    }
  }, [activeFilters, transactions]);

  return (
    <div className="transaction__list__container">
      <div className="transaction__list__buttons">
        <button
          className={"transaction__list__button" + ((Object.keys(activeFilters).length === 0 || !Object.values(activeFilters).some(a => a)) ? " transaction__list__button__active" : "")}
          onClick={() => setActiveFilters({})}>
          All
        </button>
        {Object.keys(FILTERS).map(a => <button key={a}
                                               className={"transaction__list__button" + (activeFilters[FILTERS[a]] ? " transaction__list__button__active" : "")}
                                               onClick={() => {
                                                 setActiveFilters(b => ({
                                                   ...b,
                                                   [FILTERS[a]]: !b[FILTERS[a]]
                                                 }));
                                               }}>{FILTERS[a]}</button>)}
      </div>
      <div className="transaction__list__entries">
        {error ? <div className="transaction__list__error">{error}</div> : displayedTransactions.slice(0, amount).map((a, i) => <TransactionListItem key={i} transaction={a}
                                                                                             collectionInfo={collectionInfo}/>)}
        {displayedTransactions.length === 0 && <div className="transaction__list__error">No transactions found for selected filters.</div>}
      </div>
    </div>
  )
}

export default TransactionList;