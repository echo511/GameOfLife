import { CellMap } from "./CellMap"
import { Cell } from "./Cell"
import { toHexString } from "./state"

export class GameOfLife {

    private states: Map<string, boolean> = new Map()

    constructor(
        private cellMap: CellMap
    ) {
        const state = cellMap.getState(0)
        this.states.set(toHexString(state), true)
    }

    public run(): Promise<{ done: boolean, iteration: number, state: string }> {
        const lastIndex = this.states.size - 1
        return this.calculate(this.cellMap, lastIndex)
    }

    private calculate(cellMap: CellMap, iteration: number): Promise<{ done: boolean, iteration: number, state: string }> {
        return new Promise((resolver) => {
            let gridState: Array<boolean> = [] // BigInt not ready until ecma2020

            let i = 0
            cellMap.forEach((cell) => {
                i++
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
                gridState.push(nextState)
            })

            const hexState = toHexString(gridState)
            const done: boolean = this.states.has(hexState) // cycle detection
            //console.log("State of iteration " + (iteration + 1) + " " + hexState)

            this.states.set(hexState, true)

            resolver({ done, iteration: iteration + 1, state: hexState })
        })
    }



}