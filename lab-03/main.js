const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
        document.querySelector('#file-label').textContent = `${file.name}`
        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = () => {
                const allText = reader.result
                mainProcess(allText);
            }
        } else {
            alert('filereader is not supported')
        }
    }
    else {document.querySelector('.file-label').textContent = `загрузите таблицу`}
}

function mainProcess(fileContent) {
    document.querySelector('#result').textContent = ''
    try {
        const result = parseText(fileContent)
        const xValues = result.x
        const yValues = result.y
        const matrix = result.matrix

        document.querySelector('form').addEventListener('submit', (e) => {
            document.querySelector('#result').textContent = ''
    
            e.preventDefault()
            let x = e.target.elements.x.value;
            let nx = e.target.elements.nx.value;
            let y = e.target.elements.y.value;
            let ny = e.target.elements.ny.value;
    
            e.target.elements.x.value = '';
            e.target.elements.nx.value = '';
            e.target.elements.y.value = '';
            e.target.elements.ny.value = '';
            
            if (isNotValid(x) || isNotValid(y) || isNotValid(nx) || isNotValid(ny)) {
                alert ('invalid input')
            }
            else {
                x = parseFloat(x)
                y = parseFloat(y)

                nx = parseFloat(nx)
                ny = parseFloat(ny)

                if (nx - Math.floor(nx) != 0 || ny - Math.floor(ny) != 0) {
                    nx = Math.floor(nx)
                    ny = Math.floor(ny)
                    alert(`nx and ny must be integers\nnx: ${nx}, ny: ${ny}`)
                }
                console.log(`x: ${x}, nx: ${nx}, y: ${y}, ny: ${ny}`)
                
                try {
                    const indexX = findIndex(x, xValues)
                    const indexY = findIndex(y, yValues)
                    if (extra(indexX, xValues) || extra(indexY, yValues)) {
                        alert ('extrapolation')
                    }
                    else {
                        const xRangeIndexs = getRange(nx, xValues, indexX)
                        const yRangeIndexs = getRange(ny, yValues, indexY)
        
                        let zi = []
                        let xRange = []
                        for (let i = xRangeIndexs.start; i < xRangeIndexs.end; i++) {
                            let zValues = []
                            let yRange = []
                            for (let j = yRangeIndexs.start; j < yRangeIndexs.end; j++) {
                                yRange.push(yValues[j])
                                zValues.push(matrix[i][j])
                            }
        
                            const koefs = getKoefs(yRange, zValues)
                            zForXi = calculate(y, koefs, yRange)
                            console.log(`z(${xValues[i]}, ${y}) = ${zForXi}, for y from range ${yRange}`)
                            zi.push(zForXi)
                            xRange.push(xValues[i])
                        }
                        
                        const koefs = getKoefs(xRange, zi)
                        interRes = calculate(x, koefs, xRange)
                        interRes = interRes.toFixed(4)
                        console.log(`z(${x}, ${y}) = ${interRes}`)
                        document.querySelector('#result').textContent = `z(${x}, ${y}) = ${interRes}`
                    }
                }
                catch(e) {
                    alert(e.message)
                }
            }
        })
    }
    catch(e) {
        console.log(e)
        alert(e.message)
    }
}

function parseText(text) {
    matrix = []

    const lines = text.split('\n')
    let x = lines[0].split(',').slice(1) 
    x.forEach((item, index, array) => {
        if (isNotValid(item)) {
            console.log('invalid')
            throw Error('invalid file content')
        }
        array[index] = parseFloat(item)
    })

    let y = []
    let line = []
    for (let i = 1; i < lines.length; i++) {
        line = lines[i].split(',')
        if (line.length - 1 != x.length) {
            console.log('invalid')
            throw Error('invalid file content')
        }
        y.push(line[0])
        line = line.slice(1)
        line.forEach((item, index, array) => {
            if (isNotValid(item)) {
                console.log('invalid')
                throw Error('invalid file content')
            }
            array[index] = parseFloat(item)
        })
        matrix.push(line)
    }
    
    y.forEach((item, index, array) => {
        if (isNotValid(item)) {
            throw Error('invalid file content')
        }
        array[index] = parseFloat(item)
    })
    return {x, y, matrix}
}

function isNotValid(x) {
    return (isNaN(x) || x == '')
}

function extra(x, xValues) {
    return ((x == -1) || (x == xValues.length))
}

const findIndex = (x, xValues) => {
    const length = xValues.length
    // less than any value
    if (x < xValues[0]) {
        console.log('extrapolation')
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
    return length
}

const getRange = (n, xValues, index) => {
    const rangeLength = n + 1
    //the first n+1 values
    if (index <= (rangeLength) / 2) {
        return {
            start: 0,
            end: rangeLength
        }
    }
    // the n+1 values from the end
    if (index >= xValues.length - rangeLength) {
        return {
            start: xValues.length - rangeLength,
            end: xValues.length
        }
    }
    // a slice in the middle
    const indexFrom = index - Math.floor(rangeLength / 2)
    const indexTo = index + Math.ceil(rangeLength / 2)
    return {
        start: indexFrom,
        end: indexTo
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