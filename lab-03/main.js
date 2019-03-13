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
    else {document.querySelector('.file-return').textContent = `загрузите таблицу`}
}

function mainProcess(fileContent) {
    try {
        result = parseText(fileContent)
        xValues = result.x
        yValues = result.y
        matrix = result.matrix

        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault()
            x = e.target.elements.x.value;
            nx = e.target.elements.nx.value;
            e.target.elements.x.value = '';
            e.target.elements.nx.value = '';
            y = e.target.elements.y.value;
            ny = e.target.elements.ny.value;
            e.target.elements.y.value = '';
            e.target.elements.ny.value = '';
            
            if (isNotValid(x) && isNotValid(y) && isNotValid(nx) && isNotValid(ny)) {
                throw Error('invalid input') 
            }
            else {
                x = parseFloat(x)
                nx = parseInt(nx)
                y = parseFloat(y)
                ny = parseInt(ny)
                console.log(x, nx, y, ny)

                console.log(xValues)
                console.log(yValues)
                indexX = findIndex(x, xValues)
                indexY = findIndex(y, yValues)
                console.log(indexX, indexY)

                xRange = getRange(nx, xValues, indexX)
                yRange = getRange(ny, yValues, indexY)

                

                console.log(xRange)
                console.log(yRange)

            }
        })
    }
    catch(e) {
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

const findIndex = (x, xValues) => {
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

const getRange = (n, xValues, index) => {
    const rangeLength = n + 1
    console.log(rangeLength)
    //the first n+1 values
    if (index <= (rangeLength) / 2) {
        return {
            start: 0,
            end: rangeLength
        }
        return xValues.slice(0, rangeLength)
    }
    // the n+1 values from the end
    if (index >= xValues.length - rangeLength) {
        return {
            start: xValues.length - rangeLength,
            end: xValues.length
        }
        return xValues.slice(-rangeLength)
    }
    // a slice in the middle
    const indexFrom = index - Math.ceil(rangeLength / 2)
    const indexTo = index + Math.floor(rangeLength / 2)
    return {
        start: indexFrom,
        end: indexTo
    }
    return xValues.slice(indexFrom, indexTo)
}