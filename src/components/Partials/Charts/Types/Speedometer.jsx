//Hooks
import {useRef, useState} from "react";

//Style
import './Speedometer.css';

const Speedometer = ({dataEndpoint, range}) => {
  const [init, setInit] = useState(false);
  const [value, setValue] = useState(0);

  if (!init) {
    dataEndpoint().then(a => {
      setValue(a / range);
      setInit(true);
    })
  }

  const rad = -Math.PI/2 + Math.PI * value

  const canvasRef = useRef(null)

  const width = 99;
  const height = 65;

  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')

  if (canvasRef.current) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const volatilityDotImage = new Image();
    volatilityDotImage.onload = function () {
      ctx.drawImage(this, 42 , 44, 15, 15);
    }
    volatilityDotImage.src = "https://files.allsource.io/images/volatility_dot.svg";

    const volatilityInnerImage = new Image();
    volatilityInnerImage.onload = function () {
      ctx.drawImage(this, 12, 14, 76, 38);
    }
    volatilityInnerImage.src = "https://files.allsource.io/images/volatility_inner.svg";

    const volatilityOuterImage = new Image();
    volatilityOuterImage.onload = function () {
      ctx.drawImage(this, 4, 6, 91, 46);
    }
    volatilityOuterImage.src = "https://files.allsource.io/images/volatility_outer.svg";

    const volatilityPointerImage = new Image();
    volatilityPointerImage.onload = function () {
      ctx.save();
      ctx.translate(49.5, 52);
      ctx.rotate(rad);
      ctx.drawImage(this, -4.5, -49.5, 9, 57);
      ctx.restore();
    }
    volatilityPointerImage.src = "https://files.allsource.io/images/volatility_pointer.svg";
  }

  return (<canvas ref={canvasRef} width={width} height={height}/>)

}

export default Speedometer;