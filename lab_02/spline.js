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
    console.log('main process')
    const values = processData(allText)
    const xValues = values.x
    const yValues = values.y
    console.log(xValues)
    console.log(yValues)

    const H = formH(xValues)
    console.log(H)
    const A = formA(H)
    console.log(A)
    const B = formB(H)
    console.log(B)
    const D = formD(H)
    console.log(D)
    const F = formF(H, yValues)
    console.log(F)
    const m = findKoef1(A, B, D)
    console.log(m)
    const n = findKoef2(A, B, F, m)
    console.log(n)
    const C = formC(m, n)
    console.log(C)

    const a = backa(yValues)
    console.log(a)
    const d = backd(C, H)
    console.log(d)
    const b = backb(yValues, H, C)
    console.log(b)

    document.querySelector('#input').style.display = 'block'

    document.querySelector('form#x-input').addEventListener('submit', (e) => {
        e.preventDefault()
        x = e.target.elements.x.value
        e.target.elements.x.value = ''
        if (!x) {
            console.log('invalid input')
        }
        x = parseFloat(x)
        index = findXIndex(x, xValues)
        const y = calculate(x, xValues[index - 1], index, a, b, C, d)
        console.log(y)
    })
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
    values.sort((a, b) => {
        if (a[0] > b [0]) return 1
        if (a[0] < b[0]) return -1
        return 0
    })

    values.forEach((item) => {
        xValues.push(item[0])
        yValues.push(item[1])
    }) 
    //console.log(values)
    return {
        x: xValues,
        y: yValues
    }
}

function formH(xValues) {
    let H = [NaN]
    for (let i = 1; i < xValues.length; i++) {
        H.push(xValues[i] - xValues[i - 1])
    }
    return H
}

function formA(H) {
    let A = [NaN]
    H.forEach((item) => A.push(item))
    return A
}

function formB(H) {
    let B = [NaN]
    for (let i = 1; i < H.length; i++) {
        B.push(-2 * (H[i - 1] + H[i]))
    }
    return B
}

function formD(H) {
    let D = H.slice()
    return D
}

function formF(H, yValues) {
    let F = [NaN, NaN]
    for (let i = 2; i < H.length; i++) {
        // console.log(`3 * ((${yValues[i]} - ${yValues[i - 1]}) / ${H[i - 1]} - (${yValues[i - 1]} - ${yValues[i - 2]})/${H[i - 2]})`)
        // console.log(`=${3 * ((yValues[i] - yValues[i - 1]) / H[i - 1] - ((yValues[i - 1] - yValues[i - 2]) / H[i - 2]))}`)
        F.push(3 * ((yValues[i] - yValues[i - 1]) / H[i] - ((yValues[i - 1] - yValues[i - 2]) / H[i - 1])))
    }
    return F
}

function findKoef1(A, B, D) {
    let m = [0, 0, 0]
    for (let i = 2; i < B.length; i++) {
        // console.log(`${D[i] / (B[i] - A[i] * m[i])} = ${D[i]}/ (${B[i]} - ${A[i]} * ${m[i]})`)
        m.push(D[i] / (B[i] - A[i] * m[i]))
    }
    return m
}

function findKoef2(A, B, F, m) {
    let n = [0, 0, 0]
    for (let i = 2; i < B.length; i++) {
        // console.log(`(${A[i]} * ${n[i]} + ${F[i]}) / (${B[i]} - ${A[i]} - ${m[i]})`)
        n.push((A[i] * n[i] + F[i]) / (B[i] - A[i] - m[i]))
    }
    return n
}

function formC(m, n) {
    let C = [0]

    let j = 0
    for (let i = m.length - 1; i >= 0; i--, j++) {
        // console.log(`${m[i]} * ${C[j]} + ${n[i]}`)
        C.push(m[i] * C[j] + n[i])
    }
    C.reverse()
    return C
}

function backa(yValues) {
    let a = [NaN]
    yValues.forEach((item) => a.push(item))
    return a
}

function backd(C, H) {
    let d = []
    for (let i = 0; i < H.length; i++) {
        // console.log(`(${C[i + 1]} - ${C[i]}) / (3 * ${H[i]})`)
        d.push((C[i + 1] - C[i]) / (3 * H[i]))
    }
    return d
}

function backb(yValues, H, C) {
    let b = [NaN]
    for (let i = 1; i < H.length; i++) {
        b.push(((yValues[i] - yValues[i-1]) / H[i]) - (1 / 3 * H[i] * (C[i+1] + 2 * C[i])))
    }
    return b
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

function calculate(x, prevX, index, a, b, C, d) {
    console.log(`${x} - index = ${index}`)
    console.log('calcs')

    let y = 0
    let step = x - prevX
    console.log (`step = ${x} - ${prevX} = ${step}`)

    console.log(a[index])
    console.log(b[index])
    console.log(C[index])
    console.log(d[index])

    y += a[index]
    y += b[index] * step
    y += C[index] * step * step
    y += d[index] * Math.pow(step, 3)

    return y
}