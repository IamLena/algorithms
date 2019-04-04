function fileHandler(e) {
    const file = e.target.files[0]
    if (file) {
        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = () => {
                const allText = reader.result
                mainProcess(allText)
            }
        }
        else {
            alert('filereader is not supported')        }
    }
}

function clearCanvas() {
    document.querySelector('canvas').getContext('2d').clearRect(0, 0, 500, 500)
}

function mainProcess(allText) {
    clearCanvas()
    try {
        const dots = parseText(allText)
        drawDots(dots)
    
        document.querySelector("form").addEventListener('submit', (e) => {
            e.preventDefault()
            let n = e.target.elements.n.value
            if (isNotValid(n)) {alert('invalid n value')}
            else {
                n = parseN(n)
                if (!n) {
                    alert('n should be positive integer')
                }
                clearCanvas()
                let matrix = formMatrix(dots, n)
                let vector = formVector(dots, n)
                const aKoefs = getAkoefs(matrix, vector)
                drawGraph(dots, aKoefs)
            }
        })
    }
    catch(e) {
        alert(e.message)
    }
}

function isNotValid(x) {
    return (isNaN(x) || x == '')
}

function parseText(text) {
    const lines = text.split('\n') //line = xi, yi, pi\
    let dots = []
    lines.forEach((line) => {
        const dot = line.split(',')
        if (dot.length != 3) {throw Error ('invalid file content')}
        dot.forEach((item, index, array) => {
            array[index] = parseFloat(item)
            if (isNaN(array[index])) {throw Error ('invalid file content')}
        })
        dots.push(dot)
    })
    console.log(dots)
    return dots
}

function parseN (n) {
    n = parseFloat(n)
    if (n - Math.floor(n) == 0 && n > 0) {
        n = Math.floor(n)
        return n
    }
}

function formMatrix(dots, n) {
    const N = dots.length
    const matrix = []
    for (let i = 0; i <= n; i++) {
        const line = []
        for (let j = 0; j <= n; j++) {
            let element = 0
            for (let k = 0; k < N; k++) {
                element += dots[k][2] * Math.pow(dots[k][0], i + j)
            }
            line.push(element)
        }
        matrix.push(line)
    }
    console.log(matrix)
    return matrix
}

function formVector(dots, n) {
    const N = dots.length
    const vector = []
    for (let i = 0; i <= n; i++) {
        let element = 0
        for (let k = 0; k < N; k++)
            element += dots[k][2] * dots[k][1] * Math.pow(dots[k][0], i)
        vector.push(element)
    }
    console.log(vector)
    return vector
}

function getAkoefs(matrix, vector) {
    const Mdet = getDeterminator(matrix)
    let dets = []
    for (let i = 0; i < matrix.length; i++) {
        //swap column indexed i and vector
        const matrixVector = swapColumn(matrix, vector, i)
        //push det
        dets.push(getDeterminator(matrixVector))
    }
    let aArray = []
    dets.forEach((item) => {
        aArray.push(item / Mdet)
    })
    console.log(aArray)
    return aArray
}

function swapColumn(matrix, vector, index) {
    let copyMat = []
    for (let i = 0; i < matrix.length; i++) {
        let line = []
        for (let j = 0; j < matrix.length; j++) {
            if (j == index) {
                line.push(vector[i])
            }
            else {
                line.push(matrix[i][j])
            }
        }
        copyMat.push(line)
    }
    return copyMat
}

function getDeterminator(matrix) {
    let copyMat = []
    for (let i = 0; i < matrix.length; i++) {
        let line = []
        for (let j = 0; j < matrix.length; j++) {
            line.push(matrix[i][j])
        }
        copyMat.push(line)
    }

    for (let k = 0; k < copyMat.length; k++) {
        if (copyMat[k][k] == 0) {
            return 0
        }
        for (let i = k + 1; i < copyMat.length; i++) {
            const koef = copyMat[i][k] / copyMat[k][k]
            for (let j = k; j < copyMat.length; j++) {
                copyMat[i][j] -= koef * copyMat[k][j]
            }
        }
    }

    let det = 1
    for (let i = 0; i < copyMat.length; i++) {
        det *= copyMat[i][i]
    }
    return det
}

function scaledot (dot, scaleKoef) {
    let copy = [dot[0], dot[1]]
    copy[0] *= scaleKoef
    copy[1] *= -scaleKoef
    copy[0] += 250
    copy[1] += 250
    return copy
}

function getScaleKoef(dots) {
    let maxX = Math.abs(dots[0][0])
    let maxY = Math.abs(dots[0][1])
    dots.forEach((item) => {
        if (Math.abs(item[0]) >  maxX) {maxX = Math.abs(item[0])}
        if (Math.abs(item[1]) > maxY) {maxY = Math.abs(item[1])}
    })
    const max = maxX > maxY ? maxX : maxY
    const scaleKoef = Math.floor((250 - 10) / max)
    return scaleKoef
}

function drawDots(dots) {
    const scaleKoef = getScaleKoef(dots)

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 500, 500)
    ctx.strokeStyle = 'grey'
    ctx.beginPath()
    ctx.moveTo(0, 250)
    ctx.lineTo(500, 250)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(250, 0)
    ctx.lineTo(250, 500)
    ctx.stroke()

    ctx.fillStyle = 'red'
    dots.forEach((item) => {
        const cur = scaledot(item, scaleKoef)
        ctx.fillRect(cur[0]- 2, cur[1]- 2, 4, 4)
    })
}


function drawGraph(dots, aKoefs) {
    drawDots(dots)
    const scaleKoef = getScaleKoef(dots)

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    const start = dots[0][0]
    const end = dots[dots.length - 1][0]
    
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    for (let x = start; x <= end; x++) {
        const y = calc(x, aKoefs)
        const cur = scaledot([x, y], scaleKoef)
        ctx.lineTo(cur[0], cur[1])
    }
    ctx.stroke()
}

function calc(x, aKoefs) {
    let y = 0
    for (let i = 0; i < aKoefs.length; i++) {
        y += aKoefs[i] * Math.pow(x, i)
    }
    return y    
}