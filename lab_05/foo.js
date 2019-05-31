let z = 2
let func1 = function() {
    let array = [1, 2, 3]
    let T = 10
    let g = 0
    let func2 = function(g) {
        let sum = array[0] + array[1] + array[2]
        g = sum * T * z
        return g
    }

    func3(func2, 2)
}

let func3 = function(f, a) {
    console.log(f(a))
}

func1();