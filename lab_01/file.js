const handleFile = (e) => {
    //fires when file loaded, gets file content as text, calls main process
    const file = e.target.files[0]
    if (file) {
        document.querySelector('.file-return').textContent = `Selected file: ${file.name}`
        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = () => {
                console.log('loaded')
                const allText = reader.result
                mainProcess(allText);
            }
        } else {
            console.log('filereader is not supported')
            alert('filereader is not supported')
        }
    }
    else {document.querySelector('.file-return').textContent = `file is not selected`}
}

function mainProcess(allText) {
    //clear canvas and output fields
    clearCanvas()
    document.querySelector('p.root').textContent = ''
    document.querySelector('#output').textContent = ''

    try {
        let values = processData(allText);
        let xValues = values.x;
        let yValues = values.y;
        console.log(xValues, yValues)

        //draw the initial function, get scale koef back
        let k = getScaleKoef(xValues, yValues)
        draw(xValues, yValues, k);
        document.querySelector('#input').style.display = 'block';

        document.querySelector('button.root').addEventListener('click', (e) => {
            try {
                console.log('click')
                const x = findRoot(yValues, xValues)
                const answer = `~f(${x.toFixed(5)}) = 0`
                console.log(answer)
                document.querySelector('p.root').textContent = answer
            }
            catch(e) {
                alert(e.message)
            }
        })

        document.querySelector('form#xn-input').addEventListener('submit', (e) => {
            clearCanvas()
            draw(xValues, yValues, k);
            document.querySelector('p.root').textContent = ''
            document.querySelector('#output').textContent = ''
            e.preventDefault();
            x = e.target.elements.x.value;
            n = e.target.elements.n.value;
            e.target.elements.x.value = '';
            e.target.elements.n.value = '';
            try {
                xn = validInput(x, n);
                x = xn.x;
                n = xn.n;
                
                const index = findXIndex(x, xValues);
                values = getRange(n, xValues, yValues, index);
                const xRange = values.x;
                console.log('xRange')
                console.log(xRange)
                let yRange = values.y;
                const koefs = getKoefs(xRange, yRange);
                console.log('koefs')
                console.log(koefs)
                const y = calculate(x, koefs, xRange);
                printy(x, y)
                drawByFunc(xValues, calculate, koefs, xRange, k)
            } catch (e) {
                console.log(e)
                alert(e.message);
            }
        });
    } catch (e) {
        console.log(e)
        alert(e.message);
    }
}

const findRoot = (xValues, yValues) => {

    //console.log(xValues, yValues)
    const xValuesCopy = xValues.slice()
    const yValuesCopy = yValues.slice()

    koefs = getKoefs(xValuesCopy, yValuesCopy)
    console.log(koefs)
    const x = calculate(0, koefs, xValues)
    console.log(`x = ${x}`)
    if (isNaN(x)) {throw Error("can't find root")}
    return x
}

const printy = (x, y) => {
    if (x && y) {
        const output = `f(${x}) = ${y}`
        document.querySelector('#output').textContent = output
    }
}

function processData(allText) {
    let xValues = []
    let yValues = []
    let values = []
    const elements = allText.split('\n')
    elements.forEach((item) => {
        item = item.split(',')
        const x = item[0]
        const y = item[1]
        if (isNaN(x) || isNaN(y)) {
            throw Error('Invalid file data')
        }
        values.push([parseFloat(item[0]), parseFloat(item[1])])
    })
    values.sort( (a, b) => {
        if (a[0] > b [0]) return 1
        if (a[0] < b[0]) return -1
        return 0
    })

    values.forEach((item) => {
        xValues.push(item[0])
        yValues.push(item[1])
    }) 
    console.log(values)
    return {
        x: xValues,
        y: yValues
    }
}

const validInput = (x, n) => {
    // N - should be natural !! now it floors
    if (isNaN(x) || isNaN(n)) {
        console.log('not a number')
        throw Error(`Invalid input`)
    }
    if (n < 0) {
        console.log('n should be not negative')
        throw Error('power should be not negative')
    }
    //convert strings to numbers
    x = parseFloat(x)
    n = parseInt(n)
    return {
        x: x,
        n: n
    }
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

    console.log(`y(${x}) = ${y}`)
    return y
}

const scaleX = (width, k, x) => {
    return width/2 + k * x
}

const scaleY = (height, k, y) => {
    return height/2 - k * y
}

const getScaleKoef = (xValues, yValues) => {
    const canvas = document.querySelector('#Graph')
    const width = canvas.width
    const height = canvas.height

    //finding edged values for scale koefficient
    let min = Math.abs(xValues[0])
    let max = Math.abs(xValues[xValues.length - 1])
    let edgeX = min > max ? min : max

    min = Math.abs(yValues[0])
    max = Math.abs(yValues[yValues.length - 1])
    let edgeY = min > max ? min : max

    let absDivX = Math.abs((width - 25) / 2 / edgeX)
    absDivX = Math.floor(absDivX)

    let absDivY = Math.abs((height - 25) / 2 / edgeY)
    absDivY = Math.floor(absDivY)

    const k = absDivX < absDivY ? absDivX : absDivY

    return k
}

const draw = (xValues, yValues, k) => {
    console.log('drawing')
    var canvas = document.querySelector('#Graph')
    if (canvas.getContext) {
        const width = canvas.width
        const height = canvas.height

        var ctx = canvas.getContext('2d')

        ctx.beginPath();
        ctx.strokeStyle = 'blue'
        ctx.moveTo(scaleX(width, k, xValues[0]), scaleY(height, k, yValues[0]))
        for (let i = 1; i < xValues.length; i++) {
            ctx.lineTo(scaleX(width, k, xValues[i]), scaleY(height, k, yValues[i]))
            ctx.stroke()
            //debugger
        }
        // ctx.stroke()
        return k
    }    
}

const drawByFunc = (xValues, f, koefs, xRange, k) => {
    console.log('drawing')
    const canvas = document.querySelector('#Graph')
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d')

        ctx.beginPath();
        ctx.strokeStyle = 'red'
        ctx.moveTo(scaleX(canvas.width, k, xValues[0]), scaleY(canvas.height, k, f(xValues[0], koefs, xRange)))
        for (let i = 1; i < xValues.length; i++) {
            ctx.lineTo(scaleX(canvas.width, k, xValues[i]), scaleY(canvas.height, k, f(xValues[i], koefs, xRange)))
            ctx.stroke()
        }
    }
}

const clearCanvas = () => {
    const canvas = document.querySelector('#Graph')
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        //x
        ctx.beginPath();
        ctx.strokeStyle = 'black'
        ctx.moveTo(canvas.width/2, 0)
        ctx.lineTo(canvas.width/2 - 5, 12)
        ctx.moveTo(canvas.width/2, 0)
        ctx.lineTo(canvas.width/2 + 5, 12)
        ctx.moveTo(canvas.width/2, 0)
        ctx.lineTo(canvas.width/2, canvas.height)
        ctx.stroke()
        //y
        ctx.beginPath();
        ctx.strokeStyle = 'black'
        ctx.moveTo(canvas.width, canvas.height/2)
        ctx.lineTo(canvas.width-12, canvas.height/2-5)
        ctx.moveTo(canvas.width, canvas.height/2)
        ctx.lineTo(canvas.width-12, canvas.height/2+5)
        ctx.moveTo(0, canvas.height/2)
        ctx.lineTo(canvas.width, canvas.height/2)
        ctx.stroke()
    }
}