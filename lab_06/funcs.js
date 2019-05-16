function rightSideSub_dif(func, x, step) {
    return (func(x + step) - func(x)) / step
}

function leftSideSub_dif(func, x, step) {
    return (func(x) - func(x - step)) / step
}

function centalSub_dif(func, x, step) {
    return (func(x + step) - func(x - step)) / (2 * step)
}

function leftEdge_dif(func, x, step) {
    return ( -3 * func(x) + 4 * func(x + step) - func(x + 2 * step)) / (2 * step)
}

function rightEdge_dif(func, x, step) {
    return (3 * func(x) - 4 * func(x - step) + func(x - 2 * step)) / (2 * step)
}

function Runge(func, x, step, method, stepKoef, precision) {
    let dif1 = method(func, x, step)
    let dif2 = method(func, x, stepKoef * step)
    return dif1 + (dif1 - dif2) / (Math.pow(stepKoef, precision) - 1)
}

function alineVars_dif(func, x, step, method) {
    const ksi = function(x) {return 1 / x}
    const etta = function(y) {return 1 / y}
    return method(ksi, x, step) / method(etta, func(x), step) * maethod(etta, ksi(x),step)
}