//document.querySelector('button').addEventListener('click', (e) => console.log('clicked'))

const t0 = 6000
const tw = 2000
const m = 8
const pn = 15
const tn = 5000
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

console.log('hello')
const result = halfDivision(3, 25, 0.0001, myFunc)
console.log(`result: f(${result}) = ${myFunc(result)}`)

// const integralValue = integral(0, 5, myFunc)
// console.log(`integral = ${integralValue}`)