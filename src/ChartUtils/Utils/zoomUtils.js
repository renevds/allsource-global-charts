export function updateRange(scale, {min, max}, limits, zoom = false) {
  const {axis, options: scaleOpts} = scale;
  const {min: minLimit = -Infinity, max: maxLimit = Infinity, minRange = 0} = limits && limits[axis] || {};
  const cmin = Math.max(min, minLimit);
  const cmax = Math.min(max, maxLimit);
  const range = zoom ? Math.max(cmax - cmin, minRange) : scale.max - scale.min;
  if (cmax - cmin !== range) {
    if (minLimit > cmax - range) {
      min = cmin;
      max = cmin + range;
    } else if (maxLimit < cmin + range) {
      max = cmax;
      min = cmax - range;
    } else {
      const offset = (range - cmax + cmin) / 2;
      min = cmin - offset;
      max = cmax + offset;
    }
  } else {
    min = cmin;
    max = cmax;
  }
  scaleOpts.min = min;
  scaleOpts.max = max;
  // return true if the scale range is changed
  return scale.parse(min) !== scale.min || scale.parse(max) !== scale.max;
}