function fileHandler(e) {
    const file = e.target.files[0]
    if (file) {
        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = () => {
                const allText = reader.result
                mainProcess(allText)
            }
        }
        else {
            alert('filereader is not supported')        }
    }
}

function mainProcess(allText) {
    console.log(allText)
    const data = parseText(allText)
    console.log(data)

    document.querySelector("form").addEventListener('submit', (e) => {
        e.preventDefault()
        let n = e.target.elements.n.value
        if (isNotValid(n)) {alert('invalid n value')}
        else {
            n = parseN(n)
            if (!n) {
                alert('n should be positive integer')
            }
            console.log(n)
        }
    })
}

function isNotValid(x) {
    return (isNaN(x) || x == '')
}

function parseText(text) {
    const lines = text.split('\n') //line = xi, yi, pi\
    let dots = []
    lines.forEach((line) => {
        dots.push(line.split(','))
    })
    console.log(dots)
    return lines
}

function parseN (n) {
    n = parseFloat(n)
    if (n - Math.floor(n) == 0 && n > 0) {
        n = Math.floor(n)
        return n
    }
}