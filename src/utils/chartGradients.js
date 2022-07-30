export function horizontalBlueGreenGradient(context){
  const ctx = context.chart.ctx;
  const grad = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  grad.addColorStop(0, '#069EFC');
  grad.addColorStop(1, '#14F4C9');
  return grad;
}

export function verticalBlueDarkGradient(context){
  const ctx = context.chart.ctx;
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, '#7230DE');
  grad.addColorStop(0.25, 'rgba(99, 41, 196, 0.7595)');
  grad.addColorStop(0.50, "rgba(86, 35, 173, 0.4846)");
  grad.addColorStop(1, "rgba(79, 31, 159, 0.2253)")
  return grad;
}

