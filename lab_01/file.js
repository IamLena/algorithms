const handleFile = (e) => {
    const file = e.target.files[0]
    if (window.FileReader) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = () => {
            console.log('loaded')
            const allText = reader.result
            try {
                let values = processData(allText)
                let xValues = values.x
                let yValues = values.y
                console.log(xValues)
                console.log(yValues)
                document.querySelector('#input').style.display = 'block'
                document.querySelector('form').addEventListener('submit', (e) => {
                    e.preventDefault()
                    x = e.target.elements.x.value
                    n = e.target.elements.n.value
                    e.target.elements.x.value = ''
                    e.target.elements.n.value = ''
                    try {
                        xn = validInput(x, n)
                        x = xn.x
                        n = xn.n
                        console.log(`x = ${x},  n = ${n}`)
                        const index = findXIndex(x, xValues)
                        console.log(`index = ${index}`)
                        values = getRange(n, xValues, yValues, index)
                        xValues = values.x
                        yValues = values.y
                        console.log(xValues)
                        console.log(yValues)

                    }
                    catch (e) {
                        alert(e.message)
                    }
                })
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

const validInput = (x, n) => {
    // N - should be natural !! now it floors
    if (isNaN(x) || isNaN(n)) {
        console.log('not a number')
        throw Error (`Invalid input`)
    }
    if (n < 0) {
        console.log('n should be not negative')
        throw Error ('power should be not negative')
    }
    //convert strings to numbers
    x = parseFloat(x)
    n = parseInt(n)
    return {x: x, n: n}
}

const findXIndex = (x, xValues) => {
    const length = xValues.length
    // less than any value
    if (x < xValues[0]) { 
      console.log('extrapolation')
      //returning first index - 1 = -1
      return -1
    }
    // finding A[i] <= x <= A[i+1]
    // if success result is A[i]
    for (let i = 0; i < length - 1; i++) {
      if (xValues[i] <= x && x < xValues[i + 1]) {
        return i
      }
    }
    //if it is the last value
    if (x === xValues[length - 1]) {
      return length - 1
    }
    // else x is greater than any value, returning last index + 1
    console.log('extrapolation')
    return length
    //extrapolation is just by printing it
}

// getting the configuration aroud x for solving
const getRange = (n, xValues, yValues, index) => {
    const rangeLength = n + 1
    console.log(rangeLength)
    //the first n+1 values
    if (index <= (rangeLength) / 2) {
        return {
            x: xValues.slice(0, rangeLength),
            y: yValues.slice(0, rangeLength)
        }
    }
    // the n+1 values from the end
    if (index >= xValues.length - rangeLength) {
        return {
            x: xValues.slice(-rangeLength),
            y: yValues.slice(-rangeLength)
        }
    }
    // a slice in the middle
    const indexFrom = index - Math.ceil(rangeLength/ 2)
    const indexTo = index + Math.floor(rangeLength / 2)
    return {
        x: xValues.slice(indexFrom, indexTo),
        y: yValues.slice(indexFrom, indexTo)
    }
}