const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
        document.querySelector('#file-label').textContent = `${file.name}`
        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = () => {
                const allText = reader.result
                mainProcess(allText);
            }
        } else {
            alert('filereader is not supported')
        }
    }
    else {document.querySelector('.file-return').textContent = `загрузите таблицу`}
}

function mainProcess(fileContent) {
    try {
        result = parseText(fileContent)
        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault()
            x = e.target.elements.x.value;
            nx = e.target.elements.nx.value;
            e.target.elements.x.value = '';
            e.target.elements.nx.value = '';
            y = e.target.elements.y.value;
            ny = e.target.elements.ny.value;
            e.target.elements.y.value = '';
            e.target.elements.ny.value = '';
            
            if (isNotValid(x) && isNotValid(y) && isNotValid(nx) && isNotValid(ny)) {
                throw Error('invalid input') 
            }
            else {
                x = parseFloat(x)
                nx = parseInt(nx)
                y = parseFloat(y)
                ny = parseInt(ny)
                console.log(x, nx, y, ny)
            }
        })
    }
    catch(e) {
        alert(e.message)
    }
    
}

function parseText(text) {
    matrix = []

    const lines = text.split('\n')
    let x = lines[0].split(',').slice(1) 
    x.forEach((item, index, array) => {
        if (isNotValid(item)) {
            console.log('invalid')
            throw Error('invalid file content')
        }
        array[index] = parseFloat(item)
    })

    let y = []
    let line = []
    for (let i = 1; i < lines.length; i++) {
        line = lines[i].split(',')
        if (line.length - 1 != x.length) {
            console.log('invalid')
            throw Error('invalid file content')
        }
        y.push(line[0])
        line = line.slice(1)
        line.forEach((item, index, array) => {
            if (isNotValid(item)) {
                console.log('invalid')
                throw Error('invalid file content')
            }
            array[index] = parseFloat(item)
        })
        matrix.push(line)
    }
    
    y.forEach((item, index, array) => {
        if (isNotValid(item)) {
            throw Error('invalid file content')
        }
        array[index] = parseFloat(item)
    })
    return {x, y, matrix}
}

function isNotValid(x) {
    return (isNaN(x) || x == '')
}