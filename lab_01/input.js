//variables
let xValues = []
let yValues = []
let x
let n
let xRange = []

//open the file, read text data
$(document).ready(function() {
  $.ajax({
      type: "GET",
      url: "coma-table.csv",
      dataType: "text",
      success: function(data) {processData(data);}
   });
});

//convert text data to arrays: xValue, yValue
function processData(allText) {
  const elements = allText.split('\n')
  console.log(`now 1`)
  elements.sort()
  console.log(elements)
  elements.forEach((item) => {
    item = item.split(',')
    xValues.push(parseFloat(item[0]))
    yValues.push(parseFloat(item[1]))
  })
}

console.log('now 2')
console.log(xValues)
console.log(yValues)

//checking the valid input
const validInput = () => {
  //defined
  if (!x || !n) {
    console.log('undefined')
    return -1
  }
  //numbers
  // N - should be natural !! now it floors
  if (isNaN(x) || isNaN(n)) {
    console.log('not a number')
    return -1
  }
  if (n < 0) {
    console.log('n should be not negative')
    return -1
  }
  //convert strings to numbers
  x = parseFloat(x)
  n = parseInt(n)
  console.log(`x = ${x}; n = ${n}`)
  return 0
}

//finding x index in the xValue array
const findXIndex = () => {
  const length = xValues.length
  // less than any value
  if (x < xValues[0]) { 
    console.log('extrapolation')
    //return somethimg else!!!!! -1
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
  // else x is greater than any value, returning -2
  console.log('extrapolation')
  return length

  //extrapolation is just by printing it
}

// getting the configuration aroud x for solving
const getXRange = () => {
  const rangeLength = n + 1
  console.log(rangeLength)
  const index = findXIndex()
  console.log(`index = ${index}`)
  //the first n+1 values
  if (index <= (rangeLength) / 2) {
    return xValues.slice(0, rangeLength)
  }
  // the n+1 values from the end
  if (index >= xValues.length - rangeLength) {
    return xValues.slice(-rangeLength)
  }
  // a slice in the middle
  const indexFrom = index - Math.ceil(rangeLength/ 2)
  const indexTo = index + Math.floor(rangeLength / 2)
  return xValues.slice(indexFrom, indexTo)
}

//solving function
//fires when input is provided
// calls other functions and checks it result
const solve = () =>
{
  if (validInput() == -1) {
    return
  }
  xRange = getXRange()
  console.log(xRange)

  console.log('solving ...')
}

//getting the input by submitting the form
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  x = e.target.elements.x.value
  n = e.target.elements.n.value
  e.target.elements.x.value = ''
  e.target.elements.n.value = ''

  solve()
})