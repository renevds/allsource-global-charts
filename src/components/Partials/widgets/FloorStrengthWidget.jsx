//Style
import './FloorStrengthWidget.css'
import {useEffect, useState} from "react";
import {Ethereum} from "@allsource/ui.partials.ethereum";

const FloorStrengthWidget = ({prices}) => {

  const [values, setValues] = useState({
    target: "",
    sales: "",
    volume: ""
  });

  const [changed, setChanged] = useState("");

  useEffect(() => {
    if (changed === 'target') {
      let sales = 0;
      let volume = 0;
      for (let i = 0; i < prices.length; i++) {
        if (prices[i] < values.target) {
          sales++;
          volume += prices[i];
        } else {
          break;
        }
      }
      setValues({
        target: values.target,
        sales,
        volume
      })
    }

    if (changed === 'sales') {
      let sales = 0;
      let volume = 0;
      let floor = 0;
      for (let i = 0; i < prices.length; i++) {
        if (sales < values.sales) {
          sales++;
          volume += prices[i];
          floor = prices[i];
        } else {
          break;
        }
      }
      setValues({
        target: floor,
        sales: values.sales,
        volume
      })
    }

    if (changed === 'volume') {
      let sales = 0;
      let volume = 0;
      let floor = 0;
      for (let i = 0; i < prices.length; i++) {
        if (volume < values.volume) {
          sales++;
          volume += prices[i];
          floor = prices[i];
        } else {
          break;
        }
      }
      setValues({
        target: floor,
        sales: sales,
        volume: values.volume
      })
    }

    setChanged("");
  }, [changed]);


  const handleTargetChange = e => {
    const newVal = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(newVal)) {
      setValues(old => ({
        ...old,
        target: newVal
      }))
    }
    setChanged("target");
  }

  const handleSalesChange = e => {
    const newVal = e.target.value;
    if (/^[0-9]*$/.test(newVal)) {
      setValues(old => ({
        ...old,
        sales: newVal
      }))
    }
    setChanged("sales");
  }

  const handleVolumeChange = e => {
    const newVal = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(newVal)) {
      setValues(old => ({
        ...old,
        volume: newVal
      }))
    }
    setChanged("volume");
  }

  return (
    <div className="floorstrengthwidget__container">
      <div className="floorstrengthwidget__title">Floor Strength</div>
      <div className="floorstrengthwidget__input">
        Target Floor <input value={values.target} onChange={handleTargetChange}/>&nbsp;<Ethereum/>
      </div>
      <div className="floorstrengthwidget__input">
        Req Sales <input value={values.sales} onChange={handleSalesChange}/>
      </div>
      <div className="floorstrengthwidget__input">
        Req Volume <input value={values.volume} onChange={handleVolumeChange}/>&nbsp;<Ethereum/>
      </div>
    </div>
  )
}

export default FloorStrengthWidget;