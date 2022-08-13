import {Interaction} from "chart.js";

Interaction.modes.pointOrNearest = function (chart, e, options, useFinalPosition) {
  const res = Interaction.modes.point(chart, e, options, useFinalPosition);
  if (res.length > 0) {
    return res;
  } else {
    const yRes = Interaction.modes.x(chart, e, options, useFinalPosition);
    let selected = yRes[0];
    let selY = selected.element.y;
    for (let i = 1; i < yRes.length; i++) {
      const cur = yRes[i];
      if (cur.element.y > e.y && e.y > cur.element.y) {
        selected = cur;
        selY = cur.element.y;
      }
    }
    if(selected.element.y <= e.y){
      return [selected];
    }
    return []; //TODO fix
  }
};