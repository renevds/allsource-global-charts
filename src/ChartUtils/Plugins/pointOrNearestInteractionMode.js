// This interaction mode either chooses a hover point or otherwise looks upwards to the first point above it with a small x-value offset allowed
// This is used in the sales chart so you can move your under the sales and see the price
import {Interaction} from "chart.js";

const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

Interaction.modes.pointOrNearest = function (chart, e, options, useFinalPosition) {
  const res = Interaction.modes.point(chart, e, options, useFinalPosition);
  if (res.length > 0) {
    let selected = res[0];
    let dis = distance(res[0].element, e);
    for (let i = 1; i < res.length; i++) {
      const newDis = distance(res[i].element, e);
      if(newDis < dis){
        dis = newDis;
        selected = res[i];
      }
    }
    return [selected];
  } else {
    const res = []
    const ids = [];
    const ys = [];
    for (let i = -10; i < 10; i++) {
      Interaction.modes.x(chart, {...e, x: e.x + i}, options, useFinalPosition).forEach(a => {
        if (!ids.includes(a.index) && a.element.y < e.y) {
          ids.push(a.index);
          res.push(a);
          ys.push(a.element.y);
        }
      })
    }

    const lowestIndex = ys.indexOf(Math.max(...ys));
    const lowest = res[lowestIndex];
    if (lowest) {
      return Interaction.modes.nearest(chart, {
        ...e,
        x: lowest.element.x,
        y: lowest.element.y
      }, options, useFinalPosition);
    } else {
      return [];
    }
  }
};