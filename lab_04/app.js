//fires when the file is chosen, gets the content and calls the mainProcess function
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
            alert('filereader is not supported')
        }
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
                if (n == -1) {
                    alert('n should be a not negative integer')
                }
                clearCanvas()
                // let Ematrix = formExtendedMatrix(dots, n)
                // let koefs = solveSLAY(Ematrix)
                // console.log('new')
                // console.log(koefs)

                let matrix = formMatrix(dots, n)
                let vector = formVector(dots, n)
                const aKoefs = getAkoefs(matrix, vector)
                //console.log('old')
                console.log(aKoefs)
                drawGraph(dots, aKoefs)
            }
        })
    }
    catch(e) {
        alert(e.message)
    }
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
    return dots // an array of arrays like [xi, xi, pi]
}

function isNotValid(x) {
    return (isNaN(x) || x == '')
}
function parseN (n) {
    n = parseFloat(n)
    if (n - Math.floor(n) == 0 && n >= 0) {
        n = Math.floor(n)
        return n
    }
    else return -1
}

function formExtendedMatrix (dots, n) {
    const N = dots.length
    const matrix = []
    for (let i = 0; i <= n; i++) {
        const line = []
        //matrixline
        for (let j = 0; j <= n; j++) {
            let element = 0
            for (let k = 0; k < N; k++) {
                element += dots[k][2] * Math.pow(dots[k][0], i + j)
            }
            line.push(element)
        }
        //vector
        let element = 0
        for (let k = 0; k < N; k++)
            element += dots[k][2] * dots[k][1] * Math.pow(dots[k][0], i)
        line.push(element)

        matrix.push(line)
    }
    console.log(matrix)
    return matrix
}

function solveSLAY(matrix) {
    const n = matrix.length
    //to tiangle form
    for (let k = 1; k < n; k++) {
        if (matrix[k-1][k-1] === 0) {
            //swap lines k-1 and k
            for (let i = 0; i <= n; i++) {
                const temp = matrix[k-1][i]
                matrix[k-1][i] = matrix[k][i]
                matrix[k][i] = temp
            }
        }
        for (let j = k; j < n; j++) {
            const koef = matrix[j][k-1] / matrix[k-1][k-1]
            if (koef != 0) {
                for (let i = j; i <= n + 1; i++) {
                    matrix[j][i] -= koef * matrix[k-1][k-1]
                }
            }
        }
    }
    //get a koefs
    let aKoefs = new Array(n).fill(0)
    for (let i = n-1; i >= 0; i--) {
        aKoefs[i] = matrix[i][n] / matrix[i][i]
        for (let c = n-1; c > i; c--) {
            aKoefs[i] = aKoefs[i]  - matrix[i][c] * aKoefs[c] / matrix[i][i]
        }
    }
    return aKoefs
}

// Sum am * (um, uk) = (f, u) 
// (for 0 < m <= n)
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

//Sum am * (um, uk) = (f, u) 
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
    const Mdet = getDeterminator(matrix) //determinator of matrix
    if (Mdet == 0) {alert ('n is too big for this amount of data')}
    let dets = [] //array d1, d2, d3...
    for (let i = 0; i < matrix.length; i++) {
        //swap column indexed i and vector
        const matrixVector = swapColumn(matrix, vector, i)
        //get det and push it to array
        dets.push(getDeterminator(matrixVector))
    }

    let aArray = []
    dets.forEach((item) => {
        aArray.push(item / Mdet) // = di/dmatrix Kramer
    })
    return aArray
}

function swapColumn(matrix, vector, index) {
    //creates a copy, pushes values from initial  with the exception of index column
    // index column == vector
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

//gaus method
function getDeterminator(matrix) {
    let copyMat = []
    for (let i = 0; i < matrix.length; i++) {
        let line = []
        for (let j = 0; j < matrix.length; j++) {
            line.push(matrix[i][j])
        }
        copyMat.push(line)
    }//creates copy of initial matrix

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

    console.log(copyMat)

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
    //const scaleKoef = Math.floor((250 - 10) / max)
    const scaleKoef = (250 - 10) / max
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

    const start = -250 + 10 / scaleKoef //dots[0][0]
    const end = -start //dots[dots.length - 1][0]
    
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