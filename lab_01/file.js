const handleFile = (e) => {
    const file = e.target.files[0]
    if (window.FileReader) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = () => {
            console.log('loaded')
            const allText = reader.result
            try {
                const values = processData(allText)
                console.log(values.x)
                console.log(values.y)
            }
            catch (e) {
                alert(e.message)
            }
            
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
      const y = item[1]
      if (isNaN(x) || isNaN(y)) {
          throw Error ('Invalid file data')
      }
      xValues.push(parseFloat(item[0]))
      yValues.push(parseFloat(item[1]))
    })
    return {x: xValues, y: yValues}
  }