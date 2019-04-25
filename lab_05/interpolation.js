function interpolation(xValues, yValues, x) {
    const n = 2
    const index = findXIndex(x, xValues);
    let values = getRange(n, xValues, yValues, index);
    const xRange = values.x;
    let yRange = values.y;
    const koefs = getKoefs(xRange, yRange);
    const y = calculate(x, koefs, xRange);
    return y
}

const findXIndex = (x, xValues) => {
    const length = xValues.length
    // less than any value
    if (x < xValues[0]) {
        console.log('extrapolation')
        alert('extropolation')
        //returning first index - 1 = -1
        return -1
    }
    // finding A[i] <= x <= A[i+1]
    // if success result is A[i]
    for (let i = 0; i < length - 1; i++) {
        if (xValues[i] == x) {return i}
        if (xValues[i+1] == x) {return i+1}
        if (xValues[i] < x && x < xValues[i + 1]) {
            return i + 1
        }
    }
    //if it is the last value
    if (x === xValues[length - 1]) {
        return length - 1
    }
    // else x is greater than any value, returning last index + 1
    console.log('extrapolation')
    alert('extropolation')
    return length
    //extrapolation is just by printing it
}

// getting the configuration aroud x for solving
const getRange = (n, xValues, yValues, index) => {
    const rangeLength = n + 1
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
    const indexFrom = index - Math.ceil(rangeLength / 2)
    const indexTo = index + Math.floor(rangeLength / 2)
    return {
        x: xValues.slice(indexFrom, indexTo),
        y: yValues.slice(indexFrom, indexTo)
    }
}

const getKoefs = (xValues, yValues) => {
    const koefs = []
    koefs.push(yValues[0])
    let len = 2
    for (let j = xValues.length - 1; j > 0; j--) {
        for (let i = 0; i < j; i++) {
            yValues[i] = (yValues[i] - yValues[i + 1]) / (xValues[i] - xValues[i + len - 1])
        }
        koefs.push(yValues[0])
        len++
    }
    return koefs
}

const calculate = (x, koefs, xValues) => {
    const length = koefs.length
    let n = 0
    let y = 0
    for (let i = 0; i < length; i++) {
        let mult = 1
        for (let j = 0; j < n; j++) {
            mult *= (x - xValues[j])
        }
        n++
        //console.log(`+y = ${koefs[i]} * ${mult} = ${koefs[i] * mult}`)
        y += (koefs[i] * mult)
    }

    return y
}