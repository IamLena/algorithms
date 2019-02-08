let xValues = []
let yValues = []
let x
let n
let xRange = []

$(document).ready(function() {
  $.ajax({
      type: "GET",
      url: "coma-table.csv",
      dataType: "text",
      success: function(data) {processData(data);}
   });
});

function processData(allText) {
  const elements = allText.split('\n')
  elements.forEach((item) => {
    item = item.split(',')
    xValues.push(item[0])
    yValues.push(item[1])
  })
}

console.log(xValues)
console.log(yValues)

const validInput = () => {
  if (!x || !n) {
    console.log('undefined')
    return -1
  }
  if (isNaN(x) || isNaN(n)) {
    console.log('not a number')
    return -1
  }
  x = parseFloat(x)
  n = parseInt(n)
  console.log(`x = ${x}; n = ${n}`)
  return 0
}

const findXIndex = () => {
  const length = xValues.length
  if (x < xValues[0]) { 
    console.log('extrapolation')
    return 0
  }
  for (let i = 0; i < length - 1; i++) {
    if (xValues[i] <= x && x < xValues[i + 1]) {
      return i
    }
  }
  if (x === xValues[length - 1]) {
    return length
  }
  console.log('extrapolation')
  return -1
}

const getXRange = () => {
  const rangeLength = n + 1
  console.log(rangeLength)
  const index = findXIndex()
  console.log(`index = ${index}`)

  if (index == -1 || index >= xValues.length - rangeLength) {
    return xValues.slice(-rangeLength)
  }
  if (index <= (rangeLength) / 2) {
    return xValues.slice(0, rangeLength)
  }
  const indexFrom = index - Math.ceil(rangeLength/ 2)
  const indexTo = index + Math.floor(rangeLength / 2)
  return xValues.slice(indexFrom, indexTo)
}

const solve = () =>
{
  if (validInput() == -1) {
    return
  }
  xRange = getXRange()
  console.log(xRange)

  console.log('solving ...')
}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  x = e.target.elements.x.value
  n = e.target.elements.n.value
  e.target.elements.x.value = ''
  e.target.elements.n.value = ''

  solve()
})