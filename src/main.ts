import { CellMap } from "./CellMap"
import { Cell } from "./Cell"
import { CanvasConfiguration, draw, calculate } from "./func"

// Configure grid
const rows = 40
const cols = 40

// Configure population
const aliveProbability = 0.35

// Construct grid
const cellMap = new CellMap
for (let x = 0; x < rows; x++) {
  for (let y = 0; y < cols; y++) {
    const cell = new Cell
    cell.cellMap = cellMap
    cell.coordinates = { x, y }
    cell.setState(1, Math.random() > 1 - aliveProbability)
    cellMap.add(cell)
  }
}

// Construct canvas
var canvas = document.getElementById("canvas")
if (!(canvas instanceof HTMLCanvasElement)) throw "Canvas has to be canvas element"

const canvasConfiguration: CanvasConfiguration = {
  canvas,
  canvasSize: 20,
  rows,
  cols,
}

// Manual navigation
var iterationInput: any = document.getElementById("iteration")
if (!(iterationInput instanceof HTMLInputElement)) throw "Iteration has to be input element"
iterationInput.addEventListener("change", (event: any) => {
  const iteration = parseInt(event.target.value)
  draw(canvasConfiguration, cellMap, iteration)
})

// Runner
let state = false
let lastIteration = 1
const fn = (i: number) => {
  console.log("Run iteration " + i)

  if (!state) return

  setTimeout(() => { // timeout needed for controls to respond, otherwise JS queue is filled with calculations so one cannot stop them
    iterationInput.value = i
    calculate(cellMap, i).then(({ changed, cycle }) => {
      draw(canvasConfiguration, cellMap, i).then(() => {
        if (!changed) return
        if (i > 15 && cycle) return

        i++
        lastIteration = i
        fn(i)
      })
    })
  }, 1)
}

// Run control
document.getElementById("run").addEventListener("click", (event) => {
  state = !state

  if (state) {
    const i = iterationInput.value > lastIteration ? lastIteration : iterationInput.value
    fn(i)
  }
})

draw(canvasConfiguration, cellMap, 1)