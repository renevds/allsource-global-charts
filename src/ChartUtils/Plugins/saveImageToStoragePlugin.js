export const saveImageToStorage = {
  id: 'saveImageToStorage',
  afterRender: (chart, args, options) => {
    if(options.enabled){
      sessionStorage.setItem(options.name, chart.canvas.toDataURL("image/png"))
    }
  }
}