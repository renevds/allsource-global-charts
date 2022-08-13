export function horizontalBlueGreenGradient(context) {
  const ctx = context.chart.ctx;
  const grad = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  grad.addColorStop(0, '#069EFC');
  grad.addColorStop(1, '#14F4C9');
  return grad;
}

export function verticalBlueDarkGradient(context) {
  const ctx = context.chart.ctx;
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, '#7230DE');
  grad.addColorStop(1, 'rgba(99, 41, 196, 0.7595)');
  return grad;
}

export function verticalBlueGreenGradientWithNegativeRed(context) {
  const ctx = context.chart.ctx;
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  const redStop = context.chart.scales.yAxes.getPixelForValue(0) / ctx.canvas.height || 0;
  grad.addColorStop(0, '#069EFC');
  grad.addColorStop(redStop, '#14F4C9');
  grad.addColorStop(redStop, '#ff0000');
  return grad;
}

export function verticalGradientWithNegativeRed(context) {
  const ctx = context.chart.ctx;
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  const redStop = context.chart.scales.yAxes.getPixelForValue(0) / ctx.canvas.height || 0;
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(redStop, '#ffffff');
  grad.addColorStop(redStop, '#ff0000');
  return grad;
}