const table = document.querySelector('#tableBody')

const a0 = 1
const a1 = 2
const a2 = 3
const xb = 0
const xe = 10
const step = 1

function yFunc(x) {
    return a0 * x / (a1 + a2 * x)
}

for (let x = xb; x <= xe; x+= step) {
    const y = yFunc(x)
    const d1 = 1
    const d2 = 2
    const d3 = 3
    const d4 = 4
    const d5 = 5
    const d6 = 6
    printLine(x, y, d1, d2, d3, d4, d5, d6)
}

function printLine(x, y, d1, d2, d3, d4, d5, d6) {
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

