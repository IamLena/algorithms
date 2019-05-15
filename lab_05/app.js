// ввод
const t0 = 10000
const tw = 10000
const m = 1

// начальные
const eps = 0.0001
const pn = 15
const tn = 10000
let v = -1, x1 = 2, x2 = -1, x3 = -10, x4 = -25, x5 = -25

// const
const E = [12.13, 20.98, 31.00, 45.00]
// T - Q1, Q2, Q3, Q4, Q5
const Q = [[2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000, 26000],
[1, 1, 1, 1.0001, 1.0025, 1.0198, 1.0895, 1.2827, 1.6973, 2.4616, 3.6552, 5.3749, 7.6838],
[4, 4, 4.1598, 4.3006, 4.4392, 4.5661, 4.6817, 4.7923, 4.9099, 5.0511, 5.2354, 5.4841, 5.8181],
[5.5, 5.5, 5.5116, 5.9790, 6.4749, 6.9590, 7.4145, 7.8370, 8.2289, 8.5970, 8.9509, 9.3018, 9.6621],
[11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]]

const zaryd1 = 0
const zaryd2 = 1
const zaryd3 = 2
const zaryd4 = 3
const zaryd5 = 4

// концентрации
let n1 = Math.exp(x1)
let n2 = Math.exp(x2)
let n3 = Math.exp(x3)
let n4 = Math.exp(x4)
let n5 = Math.exp(x5)
let ne = Math.exp(v)

// let alpha = 0
let gamma = 0

function nt(P, T) {
    console.log(P, T)
    // console.log('concentrations:')
    // console.log(n1, n2, n3, n4, n5)
    calcConcentration(P, T)
    console.log(n1, n2, n3, n4, n5)
    const sum = n1 + n2 + n3 + n4 + n5
    return sum
    // return Math.pow(sum, -18)
    //     return 7242 * P / T
}

function calcConcentration(P, T) {
    // console.log(`P=${P}, T = ${T}`)
    let deltas

    do {
        let matrix = [
        [1, -1, 1, 0, 0, 0],
        [1, 0, -1, 1, 0, 0],
        [1, 0, 0, -1, 1, 0],
        [1, 0, 0, 0, -1, 1],
        [ne, 0, -zaryd2*n2, -zaryd3*n3, -zaryd4*n4, -zaryd5*n5],
        [-ne, -n1, -n2, -n3, -n4, -n5]]
        let array = [
            -v - x2 + x1 + Math.log(calcK(1, T)),
            -v - x3 + x2 + Math.log(calcK(2, T)),
            -v - x4 + x3 + Math.log(calcK(3, T)),
            -v - x5 + x4 + Math.log(calcK(4, T)),
            -ne + zaryd2 * n2 + zaryd3 * n3 + zaryd4 * n4 + zaryd5 *n5,
            -7242 * P / T + ne + n1 + n2 + n3 + n4 + n5 - calcAlpha(gamma, T)
        ]
        deltas = solveSLAY(matrix, array)
        // console.log(deltas)
        v += deltas[0]
        x1 += deltas[1]
        x2 += deltas[2]
        x3 += deltas[3]
        x4 += deltas[4]
        x5 += deltas[5]

        n1 = Math.exp(x1)
        n2 = Math.exp(x2)
        n3 = Math.exp(x3)
        n4 = Math.exp(x4)
        n5 = Math.exp(x5)
        ne = Math.exp(v)

        gamma = halfDivision(0, 3, 0.0001, gammaFunc)
        
    } while (
        Math.abs(deltas[0]/v) < eps && 
        Math.abs(deltas[1]/x1) < eps &&
        Math.abs(deltas[2]/x2) < eps &&
        Math.abs(deltas[3]/x3) < eps &&
        Math.abs(deltas[4]/x4) < eps &&
        Math.abs(deltas[5]/x5) < eps
    )
}

function calcAlpha(gamma, T) {
    return 0.285 * Math.pow(10, -11) * Math.pow((gamma * T), 3)
}
function calcK(i, T) {
    let k = 4.83 * Math.pow(10, -3) * findQ(i + 1, T)/findQ(i, T) * Math.pow(T, 3/2)* Math.exp(-(E[i - 1] - deltaE(i, T)) * 11603/T)
    //console.log(`k = ${k}`)
    return k
}

function findQ(i, T) {
    let xValues = Q[0].slice()
    let yValues = Q[i].slice()
    let x = T

    let y = interpolation(xValues, yValues, x)
    return y
}

function deltaE(i, T) {
    //zaryd[i+1] = i, zaryd[i] = i - 1
    let gammaDiv = (1 + Math.pow(i, 2) * gamma / 2) * (1 + gamma/2) / (1 + Math.pow((i - 1), 2) * gamma / 2)
    return 8.61 * Math.pow(10, -5) * T * Math.log(gammaDiv)
}

function gammaFunc() {
    const sum = (n2 * Math.pow(zaryd2, 2))/(1 + Math.pow(zaryd2, 2) + gamma / 2) + 
    (n3 * Math.pow(zaryd3, 2))/(1 + Math.pow(zaryd3, 2) + gamma / 2) +
    (n4 * Math.pow(zaryd4, 2))/(1 + Math.pow(zaryd4, 2) + gamma / 2) +
    (n5 * Math.pow(zaryd5, 2))/(1 + Math.pow(zaryd5, 2) + gamma / 2)

    return Math.pow(gamma, 2) - 5.87 * Math.pow(10, 10) / Math.pow(T, 3) * (ne/(1 + gamma / 2) + sum)
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
    console.log(ntArray)
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
    // console.log('ntArray')
    // console.log(ntArray)
    ntArray.forEach((item, index, array) => {
        array[index] = item * index / 40
    })
    // console.log(integralByDots(ntArray))
    const fValue = 7242 * pn/tn - 2 * integralByDots(ntArray)
    //console.log(`func value(${p}) = ${fValue}`)
    return fValue
}

// root on [a, b] with precision of eps
function halfDivision(a, b, eps, f) {
    if (a > b) {
        let t = a
        a = b
        b = t
    }
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

    for (let i = a; i < b; i += step) {
        I = I + ((i + step - i) / 6 * (f(i) + 4 * f((i + i + step)/2) + f(i + step)))
    }
    return I
}

function solveSLAY(matrix, array) {
    // console.log(matrix)
    // console.log(array)

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
    for (let i = length - 1; i >= 0; i--) {
        for (let j = length - 1; j > i; j--) {
            array[i] -= deltasRES[j] * matrix[i][j]
        }
        deltasRES[i] = array[i] / matrix[i][i]
    }
    return deltasRES
}

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
        //console.log(`+y = ${koefs[i]} * ${mult} = ${koefs[i] * mult}`)
        y += (koefs[i] * mult)
    }

    return y
}

// заупстить дихотомию по большой функции, для пойска значения Р при котором функци я равна нулю
// дихотомия на каждом шага уточняет значение Р и расчитывает функцию при данном Р
// чтобы найти значение функции надо посчитать интеграл по z от 0 до 1 функции Nt*z
// функция nt в результате представленна массивом из 41 элемента
// массив формируется для одного P и 41 значения Т (от t0 до tw), которое зависит от z (изменется от 0 до 1 с шагом 1/40)
// 
// nt - сумма концентраций атом и ионов n1 + n2 + n3 + n4 + n5
// для нахождения концентрации решается система нелинейных уравнений
// система нелинейных уравнений сводится к слау, решением которой является приращение (dv, dx1, dx2, dx3, dx4, dx5)
// для натурального логарифма концентраций (v, x1, x2, x3, x4, x5)
// начальные значения v, x1, x2, x3, x4, x5 - данны
// значения концентраций пересчитывается и снова решается слау, то тех пор пока не будет достигнута точность
//
// для решение данной слау (столбец) необходимо рассчитывать значения альфа и К (?? что это) начальное значения альфа равно 0
// они в свою очерель зависят от Q, E, Г - парметр неидеальности, поправка
// значение Г ищется методом дихотомии на интервале от 0 до 3 (начальное значения Г равно 0)
//
// полученные значения концентраций возврашаем в nt, где их складываем и возвращаем как значение функции

const result = halfDivision(3, 25, 0.0001, myFunc)
console.log(`result: f(${result}) = ${myFunc(result)}`)