//Hooks
import {useEffect, useState} from "react";

//Queries
import {getListingsData} from "../../../../chart_queries";

//Style
import './Listings.css'

//Components
import Listing from "./Listing";

const tokenNameKey = "contractSlug"
const valueKey = "value"
const timestampKey = "timestamp"

const filters = {
  All: null,
  Buy: null,
  Sell: null
}

const Listings = ({address}) => {

  const [filter, setFilter] = useState("All");
  const [listings, setListings] = useState([]);

  console.log(listings)

  useEffect(() => {
    getListingsData(address).then(a => setListings(a.reverse()))
  }, [])


  return (
    <div className="listings__container">
      <div className="listings__buttons">
        {Object.keys(filters).map(a => <button key={a}
                                               className={"listings__button" + (filter === a ? " listings__button__active" : "")}
                                               onClick={() => setFilter(a)}>{a}</button>)}
      </div>
      <div className="listings__entries">
        {listings.map(a => <Listing key={a[tokenNameKey]} listing={a}/>)}
      </div>
    </div>
  )
}

export default Listings;