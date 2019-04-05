//document.querySelector('button').addEventListener('click', (e) => console.log('clicked'))

function f(x) {
    return Math.pow(x, 3) + 8
}

// root on [a, b] with precision of eps
function halfDivision(a, b, eps) {
    debugger
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

console.log('hello')
debugger
result = halfDivision(-3, -1.5, 0.0001)
console.log(`result: f(${result}) = ${f(result)}`)