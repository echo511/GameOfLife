import { CellMap } from "./CellMap"
import { Cell } from "./Cell"

export class GameOfLife {

    private states: Map<string, boolean> = new Map()

    constructor(
        private cellMap: CellMap
    ) {
        const state = cellMap.getState(0)
        this.states.set(this.toHexString(state), true)
    }

    public run(): Promise<{ done: boolean }> {
        const lastIndex = this.states.size - 1
        return this.calculate(this.cellMap, lastIndex)
    }

    private calculate(cellMap: CellMap, iteration: number): Promise<{ done: boolean }> {
        return new Promise((resolver) => {
            let changed = false
            let cycle = true

            let gridState: Array<boolean> = [] // BigInt not ready until ecma2020

            cellMap.forEach((cell) => {
                let alive = 0

                cell.getNeighbors().forEach((neighbor: Cell) => {
                    if (neighbor.getState(iteration)) alive++
                })

                const state = cell.getState(iteration)
                let nextState: boolean = state

                if (state) { // Live cell
                    if (alive < 2) { // If 0 or 1 neighbors alive, die
                        nextState = false
                    } else if (alive <= 3) { // If 2 or 3 neighbors alive, live
                        nextState = true
                    } else { // If more than 3 neighbors alive, die
                        nextState = false
                    }
                } else {
                    if (alive == 3) {
                        nextState = true
                    }
                }

                cell.setState(iteration + 1, nextState)

                const stateM3 = cell.getState(iteration - 3)
                const stateM2 = cell.getState(iteration - 2)
                const stateM1 = cell.getState(iteration - 1)
                const state1 = cell.getState(iteration + 1)

                if (state != state1) changed = true
                cycle = cycle &&
                    stateM3 == stateM1 &&
                    stateM2 == state &&
                    stateM1 == state1

                gridState.push(nextState)
            })

            console.log("State of iteration " + (iteration + 1) + " " + this.toHexString(gridState))

            if (iteration + 1 != this.states.size) throw "State in disarray"
            const hexState = this.toHexString(gridState)

            const done: boolean = this.states.has(hexState) // cycle detection

            this.states.set(hexState, true)

            resolver({ done })
        })
    }

    private toHexString(byteArray: Array<boolean>): string {
        byteArray.unshift(true) // first bit always one

        let value: Array<number> = []

        let char: Array<boolean> = []
        let number: number
        let max = byteArray.length - 1
        for (let i = 1; i <= Math.ceil(byteArray.length / 4); i++) {
            const from = max - i * 4 + 1
            const to = max - (i - 1) * 4 + 1 // last element is excluded => + 1

            char = byteArray.slice(from >= 0 ? from : 0, to)
            number = char.reduce((acc: number, x: boolean) => {
                return (acc << 1) | (x ? 1 : 0)
            }, 0)

            value.push(number)
        }

        return value.reverse().map(x => x.toString(16)).join('')
    }

    private fromHexString(hex: string): Array<boolean> {
        const a: boolean[] = []

        let beginning = true
        hex.split('').forEach(number => {
            const int = parseInt(number, 16)

            for (let i = 0; i <= 3; i++) {
                const value = !!(int & (8 >> i)) // bit check: start with 1000 and shift right

                if (beginning && value === false) continue // skip zeros
                if (beginning && value === true) { // first one marks start of the array as in toHexString()
                    beginning = false
                    continue
                }

                a.push(value)
            }
        })

        return a
    }

}