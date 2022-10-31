//Hooks
import {useEffect, useState} from "react";

//Queries
import {getListingsData} from "../../../../chart_queries";

//Style
import './Listings.css'

//Components
import Listing from "./Listing";
import ListingDropdown from "./ListingDropdown";

const tokenNameKey = "tokenName"
const valueKey = "value"
const timestampKey = "timestamp"

const filters = {
  All: null,
  Buy: null,
  Sell: null
}

const sorters = {
  Price: {key: valueKey, defaultReversed: false},
  Date: {key: timestampKey, defaultReversed: true}
}

const Listings = ({address}) => {

  const [filter, setFilter] = useState("All");
  const [listings, setListings] = useState([]);
  const [sorter, setSorter] = useState()

  useEffect(() => {
    getListingsData(address).then(a => setListings(a.sort((a, b) => (a[timestampKey] > b[timestampKey]) ? -1 : 1)))
  }, [])


  const handleChange = (key, reversed) => {
    console.log(key, reversed)
    if (reversed) {
      setListings([...listings].sort((a, b) => (a[key] > b[key]) ? -1 : 1));
    } else {
      setListings([...listings].sort((a, b) => (a[key] > b[key]) ? 1 : -1));
    }
  }

  return (
    <div className="listings__container">
      <div className="listings__buttons">
        {Object.keys(filters).map(a => <button key={a}
                                               className={"listings__button" + (filter === a ? " listings__button__active" : "")}
                                               onClick={() => setFilter(a)}>{a}</button>)}
        <ListingDropdown options={sorters} defaultOption="Date" handleChange={handleChange} defaultReversed={true}/>
      </div>
      <div className="listings__entries">
        {listings.map(a => <Listing key={a[tokenNameKey]} listing={a}/>)}
      </div>
    </div>
  )
}

export default Listings;