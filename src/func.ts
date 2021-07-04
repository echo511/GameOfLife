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
            ctx.stroke()
        })

        resolve()
    })
}

