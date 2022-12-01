// This is used to save an image of a chart to the browser storage after it is rendered
export const saveImageToStorage = {
  id: 'saveImageToStorage',
  afterRender: (chart, args, options) => {
    if(options.enabled){
      sessionStorage.setItem(options.name, chart.canvas.toDataURL("image/png"))
    }
  }
}