document.querySelector('button.root').addEventListener('click', (e) => {
    const x = findRoot()
    const answer = `~f(${x}) = 0`
    document.querySelector('p.root').textConstent = answer
})

const findRoot = () => {
    console.log('finding root')
    return 1
}