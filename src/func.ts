import { CellMap } from "./CellMap"
import { Cell } from "./Cell"

export type CanvasConfiguration = {
    canvas: HTMLCanvasElement
    canvasSize: number
    rows: number
    cols: number
}

export function draw(canvasConfiguration: CanvasConfiguration, cellMap: CellMap, iteration: number): Promise<void> {
    return new Promise((resolve) => {
        const canvas = canvasConfiguration.canvas
        const canvasSize = canvasConfiguration.canvasSize
        canvas.width = canvasConfiguration.rows * canvasSize
        canvas.height = canvasConfiguration.cols * canvasSize

        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        cellMap.forEach((cell) => {
            ctx.beginPath()
            ctx.rect(
                cell.coordinates.x * canvasSize - 1,
                cell.coordinates.y * canvasSize - 1,
                canvasSize - 1, // width
                canvasSize - 1, // height
            )
            ctx.fillStyle = cell.getState(iteration) ? "black" : "white"
            ctx.fill()
        })

        resolve()
    })
}

export function calculate(cellMap: CellMap, iteration: number): Promise<{ changed: boolean, cycle: boolean }> {
    return new Promise((resolver) => {
        console.log("Calculating iteration " + iteration)

        let changed = false
        let cycle = true

        cellMap.forEach((cell) => {
            let alive = 0

            cell.getNeighbors().forEach((neighbor: Cell) => {
                if (neighbor.getState(iteration)) alive++
            })

            if (cell.getState(iteration)) { // live cell
                if (alive < 2) {
                    cell.setState(iteration + 1, false)
                } else if (alive <= 3) {
                    cell.setState(iteration + 1, true)
                } else {
                    cell.setState(iteration + 1, false)
                }
            } else {
                if (alive == 3) {
                    cell.setState(iteration + 1, true)
                } else {
                    cell.setState(iteration + 1, false)
                }
            }

            const stateM3 = cell.getState(iteration - 3)
            const stateM2 = cell.getState(iteration - 2)
            const stateM1 = cell.getState(iteration - 1)
            const state = cell.getState(iteration)
            const state1 = cell.getState(iteration + 1)

            if (state != state1) {
                changed = true
            }

            if (!(
                cycle &&
                stateM3 == stateM1 &&
                stateM2 == state &&
                stateM1 == state1
            )) {
                cycle = false
            }
        })

        resolver({ changed, cycle })
    })
}