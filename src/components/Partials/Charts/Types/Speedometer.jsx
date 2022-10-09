//Hooks
import {useRef, useState} from "react";

//Style
import './Speedometer.css';

const Speedometer = ({dataEndpoint, range, saveToSessionName}) => {
  const [init, setInit] = useState(false);
  const [value, setValue] = useState(0);
  const [error, setError] = useState("");

  if (!init) {
    dataEndpoint().then(a => {
      setValue(a / range);
      setInit(true);
    }).catch(() => {
      setError("Chart data not available.");
      setInit(true);
    })
  }

  const rad = -Math.PI / 2 + Math.PI * value

  const canvasRef = useRef(null)

  const width = 99;
  const height = 65;

  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')

  let partsLoaded = 0;

  function saveImage() {
    sessionStorage.setItem(saveToSessionName, canvas.toDataURL('image/png'))
  }

  function drawPointer() {
    if (partsLoaded >= 3) {
      const volatilityPointerImage = new Image();
      volatilityPointerImage.crossOrigin = "anonymous";
      volatilityPointerImage.onload = function () {
        ctx.save();
        ctx.translate(49.5, 52);
        ctx.rotate(rad);
        ctx.drawImage(this, -4.5, -49.5, 9, 57);
        ctx.restore();
        if (saveToSessionName) {
          saveImage()
        }
      }
      volatilityPointerImage.src = "https://files.allsource.io/images/volatility_pointer.svg";
    }
  }

  if (canvasRef.current) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const volatilityDotImage = new Image();
    volatilityDotImage.crossOrigin = "anonymous";
    volatilityDotImage.onload = function () {
      ctx.drawImage(this, 42, 44, 15, 15);
      partsLoaded++;
      drawPointer();
    }
    volatilityDotImage.src = "https://files.allsource.io/images/volatility_dot.svg";

    const volatilityInnerImage = new Image();
    volatilityInnerImage.crossOrigin = "anonymous";
    volatilityInnerImage.onload = function () {
      ctx.drawImage(this, 12, 14, 76, 38);
      partsLoaded++;
      drawPointer();
    }
    volatilityInnerImage.src = "https://files.allsource.io/images/volatility_inner.svg";

    const volatilityOuterImage = new Image();
    volatilityOuterImage.crossOrigin = "anonymous";
    volatilityOuterImage.onload = function () {
      ctx.drawImage(this, 4, 6, 91, 46);
      partsLoaded++;
      drawPointer();
    }
    volatilityOuterImage.src = "https://files.allsource.io/images/volatility_outer.svg";
  }

  return (<canvas ref={canvasRef} width={width} height={height}/>)

}

export default Speedometer;