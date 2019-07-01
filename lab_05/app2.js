//------------  входные данные  ---------------
const t0 = 10000
const tw = 3000
const m = 48

const pn = 0.5
const tn = 300

const eps = 0.0001

//--------------  константы  -------------
const E = [12.13, 20.98, 31.00, 45.00]
// T, Q1, Q2, Q3, Q4, Q5
const Q = [[2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000, 26000],
[1, 1, 1, 1.0001, 1.0025, 1.0198, 1.0895, 1.2827, 1.6973, 2.4616, 3.6552, 5.3749, 7.6838],
[4, 4, 4.1598, 4.3006, 4.4392, 4.5661, 4.6817, 4.7923, 4.9099, 5.0511, 5.2354, 5.4841, 5.8181],
[5.5, 5.5, 5.5116, 5.9790, 6.4749, 6.9590, 7.4145, 7.8370, 8.2289, 8.5970, 8.9509, 9.3018, 9.6621],
[11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]]
const zaryd = [-1, 0, 1, 2, 3, 4]

//--------------  функции  -------------

function myFunc(p) {
    let ntArray = formNtArray(p)
    const fValue = 7242 * pn / tn - 2 * integralByDots(ntArray)
    return fValue
}

function formNtArray(P) {
    let ntArray = []
    const N = 40
    const step = 1 / N

    let z = 0
    for (let i = 0; i <= N; i ++) {
        const curT = T(z)
        ntArray.push(nt(P, curT) * z)
        z += step
    }
    return ntArray
}

function T(z) {
    return t0 + (tw - t0) * Math.pow(z, m)
}

function nt(P, T) {
    let n = calcConcentration(P, T)
    const sum = n[1] + n[2] + n[3] + n[4] + n[5]
    return sum
}

function calcConcentration(P, T) {
    let gamma = 0
    let v_x = [-1, 2, -1, -2, -25, -35] //v, x1, x2, x3, x4, x5
    let n = [0, 0, 0, 0, 0, 0] // ne, n1, n2, n3, n4, n5
    let deltas = [0, 0, 0, 0, 0, 0]
        
    do {
        let matrix = [
            [1, -1, 1, 0, 0, 0],
            [1, 0, -1, 1, 0, 0],
            [1, 0, 0, -1, 1, 0],
            [1, 0, 0, 0, -1, 1], 
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]]

        //calculates v_x += deltas and n = exp(v_x)
        v_x.forEach((item, index, array) => {
            let new_value = item + deltas[index]
            array[index] = new_value
            n[index] = Math.exp(new_value)
        })

        //add two last rows to matrix
        for (let i = 0; i < 6; i++) {
            matrix[4][i] = -n[i] * zaryd[i]
            matrix[5][i] = -n[i]
        }

        let array = Array(6).fill(0)
        //first four elements
        for (let i = 1; i < 5; i++) {
            array[i - 1] = -v_x[0] - v_x[i + 1] + v_x[i] + calcLnK(i, T, gamma)
        }

        let sumRow5 = 0
        let sumRow6 = 0
        for (let i = 0; i < 6; i ++) {
            sumRow5 += zaryd[i] * n[i]
            sumRow6 += n[i]
        }
        array[4] = sumRow5
        let row6 = -7242 * P / T  + sumRow6 - calcAlpha(gamma, T)
        array[5] = row6

        deltas = solveSLAY(matrix, array)

        const gammaFunc = function(gamma) {
            let sum = n[0] / (1 + gamma / 2)
            for (let i = 2; i < 6; i++) {
                let z2 = Math.pow(zaryd[i], 2)
                let el = n[i] * z2 / (1 + z2 + gamma / 2)
                sum += el
            }
        
            return Math.pow(gamma, 2) - 5.87 * Math.pow(10, 10) / Math.pow(T, 3) * sum
        }

        gamma = halfDivision(0, 3, 0.0001, gammaFunc)
        
    } while (
        percision(deltas, v_x)
    )

    return n
}

function percision(deltas, v_x) {
    let res = true
    for (let i = 0; i < 6; i++) {
        res = res && (Math.abs(deltas[i] / v_x [i]) >= eps)
    }
    return res
}

function calcAlpha(gamma, T) {
    return 0.285 * Math.pow(10, -11) * Math.pow((gamma * T), 3)
}

function calcLnK(i, T, gamma) {
    let k = 4.83 * Math.pow(10, -3) * findQ(i + 1, T)/findQ(i, T) * Math.pow(T, 3 / 2) * Math.exp(-(E[i - 1] - deltaE(i, T, gamma)) * 11603 / T)
    return Math.log(k)
}

function findQ(i, T) {
    let xValues = Q[0].slice() // T array
    let yValues = Q[i].slice() // Qi array
    let x = T

    let y = interpolation(xValues, yValues, x)
    return y
}

function deltaE(i, T, gamma) {
    let gammaDiv = (1 + Math.pow(zaryd[i + 1], 2) * gamma / 2) * (1 + gamma/2) / (1 + Math.pow(zaryd[i], 2) * gamma / 2)
    return 8.61 * Math.pow(10, -5) * T * Math.log(gammaDiv)
}

function halfDivision(a, b, eps, f) {
    if (a > b) {
        let t = a
        a = b
        b = t
    }
    let fa = f(a)
    let fb = f(b)
    if (fa * fb > 0) {
        console.log('no root on this interval')
        return
    }
    if (Math.abs(fa) < eps) {return a}
    if (Math.abs(fb) < eps) {return b}
    let rootValue = (a + b) / 2
    let f_value = f(rootValue)
    while (Math.abs(f_value) > eps) {
        if (fa * f_value < 0) {
            b = rootValue
            fb = f_value
        }
        else if (fb * f_value < 0){
            a = rootValue
            fa = f_value
        }
        else {
            return rootValue
        }
        rootValue = (a + b) / 2
        f_value = f(rootValue)
    }
    return rootValue
}

function integralByDots(ntArray) {
    let I = ntArray[0]
    const Nsteps = 40
    const step = 1 / Nsteps

    for (let i = 1; i < Nsteps; i ++) {
        if (i % 2 == 0) {I += 4 * ntArray[i]}
        else {I += 2 * ntArray[i]}
    }
    I += ntArray[Nsteps]
    return I * step / 3
}

function solveSLAY(matrix, array) {
    const length = matrix.length
    let deltasRES = new Array(length).fill(0)
    for (let i = 0; i < length; i ++)
    {
        let maxEl = matrix[i][i]
        let max_index = i
        for (let k = i + 1; k < length; k++) {
            if (Math.abs(matrix[k][i]) > maxEl) {
                maxEl = Math.abs(matrix[k][i])
                max_index = k
            }
        }
        if (maxEl === 0) {console.log('no solution'); return}
        if (max_index != i) {
            for (let j = 0; j < length; j++) {
                let tmp = matrix[i][j]
                matrix[i][j] = matrix[max_index][j]
                matrix[max_index][j] = tmp
            }
            tmp = array[max_index]
            array[max_index] = array[i]
            array[i] = tmp
        }
        
        let diagonalEL = matrix[i][i]
        for (let k = i + 1; k < length; k++) {
            const coef = matrix[k][i] / diagonalEL
            for (let j = i; j < length; j++) {
                matrix[k][j] -= coef * matrix[i][j]
            }
            array[k] -= coef * array[i]
        }
    }
    for (let i = length - 1; i >= 0; i--) {
        for (let j = length - 1; j > i; j--) {
            array[i] -= deltasRES[j] * matrix[i][j]
        }
        deltasRES[i] = array[i] / matrix[i][i]
    }
    return deltasRES
}

// --------------- интерполяция ------------------
function interpolation(xValues, yValues, x) {
    const n = 2
    const index = findXIndex(x, xValues);
    let values = getRange(n, xValues, yValues, index);
    const xRange = values.x;
    let yRange = values.y;
    const koefs = getKoefs(xRange, yRange);
    const y = calculate(x, koefs, xRange);
    return y
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
        y += (koefs[i] * mult)
    }

    return y
}

const result = halfDivision(3, 25, eps, myFunc)
const value = myFunc(result)
console.log(`f(${result}) = ${value}`)