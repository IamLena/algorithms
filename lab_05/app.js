//document.querySelector('button').addEventListener('click', (e) => console.log('clicked'))

const t0 = 3000
const tw = 3000
const m = 1
const pn = 0.5
const tn = 300
const k = 1.38 * Math.pow(10, -23)


function nt(P, T) {
    return 7242 * P / T
}

function formNtArray(P) {
    let ntArray = []
    const N = 40
    const step = 1 / N

    let z = 0
    for (let i = 0; i <= N; i ++) {
        const curT = T(t0, tw, z, m)
        ntArray.push(nt(P, curT))
        z += step
    }
    console.log(`LENGTH: ${ntArray.length}`)
    return ntArray
}

function T(t0, tw, z, m) {
    return t0 + (tw - t0) * Math.pow(z, m)
}

function integralByDots(ntArray) {
    let I = 0
    const Nsteps = 40
    const step = 1 / Nsteps

    for (let i = 1; i < Nsteps; i += 2) {
        I += (ntArray[i - 1] + 4 * ntArray[i] + ntArray[i + 1])
    }
    return I * step / 3
}

function myFunc(p) {
    ntArray = formNtArray(p)
    ntArray.forEach((item, index, array) => {
        array[index] = item * index / 40
    })
    const fValue = 7242 * pn/tn - 2 * integralByDots(ntArray)
    console.log(fValue)
    return fValue
}

// root on [a, b] with precision of eps
function halfDivision(a, b, eps, f) {
    if (a > b) {
        let t = a
        a = b
        b = t
    }
    console.log(a, b)
    if (f(a) * f(b) > 0) {
        alert('no root on this interval')
        return
    }
    if (Math.abs(f(a)) < eps) {return a}
    if (Math.abs(f(b)) < eps) {return b}
    let rootValue = (a + b) / 2
    while (Math.abs(f(rootValue)) > eps) {
        console.log(`(${a}, ${b}) f(${rootValue}) = ${f(rootValue)}`)
        if (f(a) * f(rootValue) < 0) {
            b = rootValue
        }
        else {
            a = rootValue
        }
        rootValue = (a + b) / 2
    }
    return rootValue
}

//метод Симпсона
// ищет интеграл от параболы построенной по трем точкам - границам и среднему
function integral(a, b, f){
    if (a > b) {
        let t = a
        a = b
        b = t
    }

    let I = 0
    const Nsteps = 40
    const step = (b - a) / Nsteps
    console.log(step)

    for (let i = a; i < b; i += step) {
        I = I + ((i + step - i) / 6 * (f(i) + 4 * f((i + i + step)/2) + f(i + step)))
    }
    return I
}

// console.log('hello')
// const result = halfDivision(3, 25, 0.0001, myFunc)
// console.log(`result: f(${result}) = ${myFunc(result)}`)


function graph() {
    function scaleDot(dot, dx, dy) {
        dot[0] = 10 * dot[0] + dx
        dot[1] = -0.001 * dot[1] + dy
        return dot
    }
    
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const dx = width / 2
    const dy = height / 2
    
    ctx.beginPath()
    ctx.moveTo(0, dy)
    ctx.lineTo(width, dy)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(dx, 0)
    ctx.lineTo(dx, height)
    ctx.stroke()
    
    // ctx.moveTo(0, myFunc(0))
    // ctx.beginPath()
    // for (let p = 0; p < 30; p += 1) {
    //     let dot = scaleDot([p, myFunc(p)], dx, dy)
    //     ctx.lineTo(dot[0], dot[1])
    // }
    
    // ctx.moveTo(0, T(0))
    // ctx.beginPath()
    // for (let z = 0; z < 1.1; z += 1/40) {
    //     let dot = scaleDot([z, T(t0, tw, z, m)], dx, dy)
    //     ctx.lineTo(dot[0], dot[1])
    // }
    // ctx.stroke()
}

// const integralValue = integral(0, 5, myFunc)
// console.log(`integral = ${integralValue}`)
let matrix = [[4, 5, 9], [7, 8, -1], [9, 8, 1]]
let array = [1, 2, 8]
console.log(solveSLAY(matrix, array))

function solveSLAY(matrix, array) {
    const length = matrix.length
    let deltasRES = new Array(length).fill(0)
    for (let i = 0; i < length; i ++)
    {
        let maxEl = 0
        let max_index = 0
        for (let k = i; k < length; k++) {
            if (Math.abs(matrix[k][i]) >= maxEl) {
                maxEl = Math.abs(matrix[k][i])
                max_index = k
            }
        }
        if (maxEl === 0) {console.log('zero gauss'); return}
        if (max_index != i) {
            for (let k = 0; k < length; k++) {
                let tmp = matrix[i][k]
                matrix[i][k] = matrix[max_index][k]
                matrix[max_index][k] = tmp
            }
            tmp = array[max_index]
            array[max_index] = array[i]
            array[i] = tmp
        }
        let diagEL = matrix[i][i]
        for (let k = i + 1; k < length; k++) {
            const coef = matrix[k][i] / diagEL
            for (let j = i; j < length; j++) {
                matrix[k][j] -= coef * matrix[i][j]
            }
            array[k] -= coef * array[i]
        }
    }
    console.log('hey')
    console.log(matrix)
    console.log(array)
    console.log(deltasRES)
    for (let i = length - 1; i >= 0; i--) {
        for (let j = length - 1; j > i; j--) {
            array[i] -= deltasRES[j] * matrix[i][j]
        }
        deltasRES[i] = array[i] / matrix[i][i]
    }
    return deltasRES
}