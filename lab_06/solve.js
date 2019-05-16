document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    document.querySelector('#tableBody').innerHTML = ''
    const a0 = convertToFloat(e.target.elements.a0.value)
    const a1 = convertToFloat(e.target.elements.a1.value)
    const a2 = convertToFloat(e.target.elements.a2.value)
    const xb = convertToFloat(e.target.elements.xb.value)
    const xe = convertToFloat(e.target.elements.xe.value)
    const step = convertToFloat(e.target.elements.step.value)

    if (a0 && a1 && a2 && xb && xe && step) {
        if (xb < xe && step > 0 && a1 != 0) {
            runProg(a0, a1, a2, xb, xe, step)
            return
        }
    }
    alert('invalid input')
})

function convertToFloat(x) {
    if (isNaN(x) || x == '') {
        return
    }
    else return parseFloat(x)
}

const runProg = function(a0, a1, a2, xb, xe, step) {
    const func = function(x) {
        return a0 * x / (a1 + a2 * x)
    }
    const funcDif = function(x) {
        return a0 * a1 / Math.pow(a1 + a2 * x, 2)
    }

    const length = (xe - xb) / step

    for (let x = xb; x <= xe; x += step) {
        let y = '', d1 = '', d2 = '', d3 = '', d4 = '', d5 = '', d6 =''
        let precision
        y = `${func(x).toFixed(5)}`
        d6 = `${funcDif(x).toFixed(5)}`
    
    
        if (x != xe && length >= 2) {
            d1 = rightSideSub_dif(func, x, step).toFixed(5)
            precision = calcPrecision(d6, d1)
            d1 = `${d1} (${precision}%)`
        }
    
    
        if (x == xb && length >= 3) {
            d2 = leftEdge_dif(func, x, step).toFixed(5)
            precision = calcPrecision(d6, d2)
            d2 = `${d2} (${precision}%)`
        }
        if (x == xe && length >= 3) {
            d2 = rightEdge_dif(func, x, step).toFixed(5)
            precision = calcPrecision(d6, d2)
            d2 = `${d2} (${precision}%)`
        }
    
    
        if (x != xb && x != xe && length >= 3) {
            d3 = centalSub_dif(func, x, step).toFixed(5)
            precision = calcPrecision(d6, d3)
            d3 = `${d3} (${precision}%)`
        }
    
    
        if (x != xe && x != xe - step && length >= 3) {
            d4 = Runge(func, x, step, rightSideSub_dif, 2, 2).toFixed(5)
            precision = calcPrecision(d6, d4)
            d4 = `${d4} (${precision}%)`
        }
    
    
        if (x != xe && length >= 2) {
            d5 = alineVars_dif(func, a0, a1, x, step).toFixed(5)
            precision = calcPrecision(d6, d5)
            d5 = `${d5} (${precision}%)`
        }
        
        printLine(x, y, d1, d2, d3, d4, d5, d6)
    }
}

function printLine(x, y, d1, d2, d3, d4, d5, d6) {
    const table = document.querySelector('#tableBody')
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