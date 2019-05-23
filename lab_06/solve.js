document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    document.querySelector('#tableBody').innerHTML = ''
    // document.querySelector('#canvas1').getContext('2d').clearRect(0, 0, 500, 400)
    // document.querySelector('#canvas2').getContext('2d').clearRect(0, 0, 500, 400)

    const a0 = convertToFloat(e.target.elements.a0.value)
    const a1 = convertToFloat(e.target.elements.a1.value)
    const a2 = convertToFloat(e.target.elements.a2.value)
    const xb = convertToFloat(e.target.elements.xb.value)
    const xe = convertToFloat(e.target.elements.xe.value)
    const step = convertToFloat(e.target.elements.step.value)

    if (a0 != undefined && a1 != undefined && a2 != undefined && xb != undefined && xe != undefined && step) {
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
            d4 = Runge(func, x, step, rightSideSub_dif, 2, 1).toFixed(5)
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

    const scaleX = (k, x) => {
        return 250 + k * x
    }
    
    const scaleY = (k, y) => {
        return 200 - k * y
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


    // const canvas1 = document.querySelector('#canvas1')
    // if (canvas1.getContext) {
    //     var ctx = canvas1.getContext('2d')

    //     ctx.beginPath();
    //     ctx.strokeStyle = 'black'
    //     ctx.moveTo(500/2, 0)
    //     ctx.lineTo(500/2 - 5, 12)
    //     ctx.moveTo(500/2, 0)
    //     ctx.lineTo(500/2 + 5, 12)
    //     ctx.moveTo(500/2, 0)
    //     ctx.lineTo(500/2, 400)
    //     ctx.stroke()
    //     //y
    //     ctx.beginPath();
    //     ctx.strokeStyle = 'black'
    //     ctx.moveTo(500, 400/2)
    //     ctx.lineTo(500-12, 400/2-5)
    //     ctx.moveTo(500, 400/2)
    //     ctx.lineTo(500-12, 400/2+5)
    //     ctx.moveTo(0, 400/2)
    //     ctx.lineTo(500, 400/2)
    //     ctx.stroke()

    //     const k = 50

    //     ctx.beginPath();
    //     ctx.strokeStyle = 'red'
    //     ctx.stroke()
    //     ctx.moveTo(scaleX(xe, k), scaleY(func(xe), k))
    //     for (let x = xb; x <= xe; x += 0.2) {
    //         console.log(scaleX(x, k), scaleY(func(x), k))
    //         ctx.lineTo(scaleX(x, k), scaleY(func(x), k))
            
    //     }
    //     ctx.stroke()
    // }

    // const canvas2 = document.querySelector('#canvas2')
    // if (canvas2.getContext) {
    //     var ctx = canvas2.getContext('2d')

    //     ctx.beginPath();
    //     ctx.strokeStyle = 'black'
    //     ctx.moveTo(500/2, 0)
    //     ctx.lineTo(500/2 - 5, 12)
    //     ctx.moveTo(500/2, 0)
    //     ctx.lineTo(500/2 + 5, 12)
    //     ctx.moveTo(500/2, 0)
    //     ctx.lineTo(500/2, 400)
    //     ctx.stroke()
    //     //y
    //     ctx.beginPath();
    //     ctx.strokeStyle = 'black'
    //     ctx.moveTo(500, 400/2)
    //     ctx.lineTo(500-12, 400/2-5)
    //     ctx.moveTo(500, 400/2)
    //     ctx.lineTo(500-12, 400/2+5)
    //     ctx.moveTo(0, 400/2)
    //     ctx.lineTo(500, 400/2)
    //     ctx.stroke()

    //     const k = 50

    //     ctx.beginPath();
    //     ctx.strokeStyle = 'red'
    //     ctx.stroke()
    //     ctx.moveTo(scaleX(xe, k), scaleY(funcDif(xe), k))
    //     for (let x = xb; x <= xe; x += 0.2) {
    //         console.log(scaleX(x, k), scaleY(funcDif(x), k))
    //         ctx.lineTo(scaleX(x, k), scaleY(funcDif(x), k))
    //     }
    //     ctx.stroke()
    //}