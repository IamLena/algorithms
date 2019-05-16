const table = document.querySelector('#tableBody')

const a0 = 1
const a1 = 2
const a2 = 3
const xb = 20
const xe = 30
const step = 1

let yValues = []
let yExact = []

let proc1 = 0, proc2 = 0, proc3 = 0, proc4 = 0, proc5 = 0

for (let x = xb; x <= xe; x+= step) {
    yValues.push(yFunc(x))
    yExact.push(yDif(x))
}
const length = yValues.length

for (let i = 0; i < length; i++) {
    const x = xb + i * step
    const y = yValues[i]
    const d6 = yExact[i]

    const d1 = RightSideSub(i)
    const d2 = edgesDif(i)
    const d3 = CentralDif(i)
    const d4 = leftSideRunge(i)
    const d5 = alingVars(i)
    
    printLine(x, y.toFixed(5), d1, d2, d3, d4, d5, d6.toFixed(5))
}
proc1 = (proc1 / (length - 1)).toFixed(2)
proc1 = `${proc1}%`

proc2 = (proc2 / 2).toFixed(2)
proc2 = `${proc2}%`

proc3 = (proc3 / (length - 2)).toFixed(2)
proc3 = `${proc3}%`

proc4 = (proc4 / (length - 4)).toFixed(2)
proc4 = `${proc4}%`
printLine('', '', proc1, proc2, proc3, proc4, proc5 / length, '100%')

function printLine(x, y, d1, d2, d3, d4, d5, d6) {
    const newLine = document.createElement('tr');
    newLine.innerHTML =`
    <td>${x}</td>
    <td>${y}</td>
    <td>${d1}</td>
    <td>${d2}</td>
    <td>${d3}</td>
    <td>${d4}</td>
    <td>${d5}</td>
    <td>${d6}</td>`;
    table.appendChild(newLine)
}

function yFunc(x) {
    return a0 * x / (a1 + a2 * x)
}

function yDif(x) {
    return a0 * a1 / Math.pow(a1 + a2 * x, 2)
}

function RightSideSub(index) {
    let d1
    if (index != length - 1) {
        const exact = yExact[index]
        let dif = (( yValues[index + 1] - yValues[index] ) / step)
        let precision = Math.abs(exact - dif) / exact * 100
        proc1 += precision
        dif = dif.toFixed(5)
        precision = Math.round(precision)
        d1 = `${dif}  (${precision}%)`
    }
    else {d1 = '-'}

    return d1
}

function edgesDif(index) {
    if (length < 3) {return '-'}
    if (index == 0) {
        let dif = (-3 * yValues[0] + 4 * yValues[1] - yValues[2]) / (2 * step)
        let precision = Math.abs(yExact[0] - dif) / yExact[0] * 100
        proc2 += precision
        dif = dif.toFixed(5)
        precision = Math.round(precision)
        return `${dif}  (${precision}%)`
    }
    else if (index == length - 1) {
        let dif = (3 * yValues[index] - 4 * yValues[index - 1] + yValues[index - 2]) / 2 / step
        let precision = Math.abs(yExact[length - 1] - dif) / yExact[length -1] * 100
        proc2 += precision
        dif = dif.toFixed(5)
        precision = Math.round(precision)
        return `${dif}  (${precision}%)`
    }

    else {return '-'}
}

function CentralDif(index) {
    if (index != 0 && index != length - 1) {
        let dif = (yValues[index + 1] - yValues[index - 1]) / 2 / step
        let precision = Math.abs(yExact[index] - dif) / yExact[index] * 100
        proc3 += precision
        dif = dif.toFixed(5)
        precision = Math.round(precision)
        return `${dif}  (${precision}%)`
    }
    return '-'
}

function leftSideRunge(index) {
    if (length < 3) {return '-'}
    if (index != 0 && index != 1) {
        let dif1step = (yValues[index] - yValues[index - 1]) / step
        let dif2step = (yValues[index] - yValues[index - 2]) / (2 * step)
        let dif = dif1step + (dif1step - dif2step) / 3
        console.log(dif1step, dif2step, dif)

        let precision = Math.abs(yExact[index] - dif) / yExact[index] * 100
        proc4 += precision
        dif = dif.toFixed(5)
        precision = Math.round(precision)
        return `${dif}  (${precision}%)`
    }
    return '-'
}

function CentralRunge(index) {
    if (length < 5) {return '-'}
    if (index != 0 && index != 1 && index != length - 1 && index != length - 2) {
        let dif1step = (yValues[index + 1] - yValues[index - 1]) / 2 / step
        let dif2step = (yValues[index + 2] - yValues[index - 2]) / 4 / step
        let dif = dif1step + (dif1step - dif2step) / 3
        console.log(dif1step, dif2step, dif)

        let precision = Math.abs(yExact[index] - dif) / yExact[index] * 100
        proc4 += precision
        dif = dif.toFixed(5)
        precision = Math.round(precision)
        return `${dif}  (${precision}%)`
    }
    return '-'
}

function ksi(x) {
    return 1 / x
}
function etta(y) {
    return 1 / y
}

function alingVars(index) {
    return RightSideSub()
}