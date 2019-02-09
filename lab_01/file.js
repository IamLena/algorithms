const handleFile = (e) => {
    const file = e.target.files[0]
    if (window.FileReader) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = () => {
            console.log('loaded')
            const allText = reader.result
            const values = processData(allText)
            console.log(values.x)
            console.log(values.y)
        }
    }
    else {
        console.log('filereader is not supported')
    }
}

function processData(allText) {
    let xValues = []
    let yValues = []
    const elements = allText.split('\n')
    elements.sort()
    elements.forEach((item) => {
      item = item.split(',')
      const x = item[0]
    //   if (x.isNan()) {
    //       return
    //   }
      xValues.push(parseFloat(item[0]))
      yValues.push(parseFloat(item[1]))
    })
    return {x: xValues, y: yValues}
  }