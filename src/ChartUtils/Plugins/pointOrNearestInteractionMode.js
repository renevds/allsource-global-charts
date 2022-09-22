import {Interaction} from "chart.js";

Interaction.modes.pointOrNearest = function (chart, e, options, useFinalPosition) {
  const res = Interaction.modes.point(chart, e, options, useFinalPosition);
  if (res.length > 0) {
    return Interaction.modes.nearest(chart, e, {}, useFinalPosition);
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