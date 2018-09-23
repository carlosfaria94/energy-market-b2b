const Simulator = require('../src/Simulator.js')

describe('Simulator tests', async () => {
    it('simple test', async () => {
        console.log('test working')
        Simulator.firstFunction()
    })

    it('test compile', async () => {
        const contracObj = Simulator.compile()
        console.log(contracObj)
    })
})
