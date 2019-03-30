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

function mainProcess(allText) {
    console.log(allText)
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
            console.log(n)
            let matrix = formMatrix(dots, n)
            const det = getDeterminator(matrix)
            let vector = formVector(dots, n)
        }
    })
}

function isNotValid(x) {
    return (isNaN(x) || x == '')
}

function parseText(text) {
    const lines = text.split('\n') //line = xi, yi, pi\
    let dots = []
    lines.forEach((line) => {
        const dot = line.split(',')
        dot.forEach((item, index, array) => {
            array[index] = parseFloat(item)
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

function drawDots(dots) {
    let maxX = dots[0][0]
    let maxY = dots[0][1]
    dots.forEach((item) => {
        if (item[0] >  maxX) {maxX = item[0]}
        if (item[1] > maxY) {maxY = item[1]}
    })
    const max = maxX > maxY ? maxX : maxY
    const scaleKoef = (500 - 5) / max
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    dots.forEach((item) => {
        ctx.fillRect(scaleKoef * item[0] - 1, scaleKoef * item[1] - 1, 2, 2)
    })
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
        const first = copyMat[k][k]
        copyMat[k].forEach((item, index, array) => {
            array[index] = item / first
        })
        
        for (let i = k + 1; i < copyMat.length; i++) {
            const koef = 1 / copyMat[i][k]
            copyMat[i].forEach((item, index, array) => {
                array[index] = item * koef
            })
        }

        for (let i = k + 1; i < copyMat.length; i ++) {
            for (let j = k; j < copyMat.length; j++) {
                copyMat[i][j] -= copyMat[k][j]
            }
        }
    }
    let det = 1
    for (let i = 0; i < copyMat.length; i++) {
        det *= copyMat[i][i]
    }
    console.log(copyMat)
    return det
}