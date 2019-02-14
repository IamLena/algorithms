const handleFile = (e) => {
    //document.querySelector('.input-file-trigger').style.background = 'rgb(50, 124, 184)'
    clearCanvas()
    const file = e.target.files[0]
    document.querySelector('.file-return').textContent = `Selected file: ${file.name}`
    if (window.FileReader) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = () => {
            console.log('loaded')
            const allText = reader.result
            clearCanvas()
            mainProcess(allText);
        }
    } else {
        console.log('filereader is not supported')
    }
}

function mainProcess(allText) {
    try {
        let values = processData(allText);
        let xValues = values.x;
        let yValues = values.y;
        console.log(xValues);
        console.log(yValues);
        let min = Math.abs(xValues[0])
        let max = Math.abs(xValues[xValues.length - 1])
        let edgeX = min > max ? min : max

        min = Math.abs(yValues[0])
        max = Math.abs(yValues[yValues.length - 1])
        let edgeY = min > max ? min : max

        draw(xValues, yValues, edgeX, edgeY);
        document.querySelector('#input').style.display = 'block';

        document.querySelector('button.root').addEventListener('click', (e) => {
            console.log('click')
            const x = findRoot(yValues, xValues)
            const answer = `~f(${x}) = 0`
            console.log(answer)
            document.querySelector('p.root').textContent = answer
        })

        document.querySelector('form#xn-input').addEventListener('submit', (e) => {
            e.preventDefault();
            x = e.target.elements.x.value;
            n = e.target.elements.n.value;
            e.target.elements.x.value = '';
            e.target.elements.n.value = '';
            try {
                xn = validInput(x, n);
                x = xn.x;
                n = xn.n;
                console.log(`x = ${x},  n = ${n}`);
                const index = findXIndex(x, xValues);
                console.log(`index = ${index}`);
                values = getRange(n, xValues, yValues, index);
                const xRange = values.x;
                let yRange = values.y;
                console.log(xRange);
                console.log(yRange);
                const koefs = getKoefs(xRange, yRange);
                console.log('koefs');
                console.log(koefs);
                const y = calculate(x, koefs, xRange);
                printy(x, y)
                drawByFunc(xValues, calculate, koefs, xRange)
                
  
            } catch (e) {
                console.log(e)
                //alert(e.message);
            }
        });
    } catch (e) {
        console.log(e)
        //alert(e.message);
    }
}

const findRoot = (xValues, yValues) => {

    console.log(xValues, yValues)
    koefs = getKoefs(xValues, yValues)
    return calculate(0, koefs, xValues)

    // console.log('finding root')
    // return 1
}

const printy = (x, y) => {
    const output = `f(${x}) = ${y}`
    document.querySelector('#output').textContent = output
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
            throw Error('Invalid file data')
        }
        xValues.push(parseFloat(item[0]))
        yValues.push(parseFloat(item[1]))
    })
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

const draw = (xValues, yValues, edgeX, edgeY) => {
    console.log('drawing')
    var canvas = document.querySelector('#Graph')
    if (canvas.getContext) {
        const width = canvas.width
        const height = canvas.height
        const k = Math.abs((width - 15) / edgeX) < Math.abs((height - 15) / edgeY) ? Math.abs((width - 15) / edgeX) : Math.abs((height - 15) / edgeY)

        var ctx = canvas.getContext('2d')

        ctx.beginPath();
        ctx.strokeStyle = 'blue'
        ctx.moveTo(scaleX(width, k, xValues[0]), scaleY(height, k, yValues[0]))
        for (let i = 1; i < xValues.length; i++) {
            ctx.lineTo(scaleX(width, k, xValues[i]), scaleY(height, k, yValues[i]))
            ctx.stroke()
        }
    }
}

const drawByFunc = (xValues, f, koefs, xRange) => {
    console.log('drawing')
    const canvas = document.querySelector('#Graph')
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d')

        ctx.beginPath();
        ctx.strokeStyle = 'red'
        ctx.moveTo(scale(xValues[0]), 500-scale(f(xValues[0], koefs, xRange)))
        for (let i = 1; i < xValues.length; i++) {
            ctx.lineTo(scale(xValues[i]), 500-scale(f(xValues[i], koefs, xRange)))
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