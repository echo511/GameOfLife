import { CellMap } from "./CellMap"
import { Cell } from "./Cell"
import { CanvasConfiguration, draw } from "./func"
import { GameOfLife } from "./Game"

// Configure grid
const rows = 20
const cols = 20

// Configure population
const aliveProbability = 0.35

// Construct grid
const cellMap = new CellMap
for (let x = 0; x < rows; x++) {
  for (let y = 0; y < cols; y++) {
    const cell = new Cell
    cell.cellMap = cellMap
    cell.coordinates = { x, y }
    cell.setState(0, Math.random() >= 1 - aliveProbability)
    cellMap.add(cell)
  }
}

// Setup cycle for debugging
cellMap.get(4, 4).setState(0, true)
cellMap.get(5, 4).setState(0, true)

cellMap.get(6, 3).setState(0, true)
cellMap.get(6, 5).setState(0, true)

cellMap.get(7, 4).setState(0, true)
cellMap.get(8, 4).setState(0, true)
cellMap.get(9, 4).setState(0, true)
cellMap.get(10, 4).setState(0, true)

cellMap.get(11, 3).setState(0, true)
cellMap.get(11, 5).setState(0, true)

cellMap.get(12, 4).setState(0, true)
cellMap.get(13, 4).setState(0, true)

// Game
const gol = new GameOfLife(cellMap)

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
var runButton: any = document.getElementById("run")
var iterationInput: any = document.getElementById("iteration")
if (!(iterationInput instanceof HTMLInputElement)) throw "Iteration has to be input element"
iterationInput.addEventListener("change", (event: any) => {
  const iteration = parseInt(event.target.value)
  draw(canvasConfiguration, cellMap, iteration)
})

// Runner
let state = false
let lastIteration = 0
const fn = (i: number) => {
  console.log("Run iteration " + i)

  if (!state) return

  setTimeout(() => { // timeout needed for controls to respond, otherwise JS queue is filled with calculations so one cannot stop them
    gol.run().then(({ done }) => {
      draw(canvasConfiguration, cellMap, i + 1).then(() => {
        if (done) {
          runButton.style.display = "none"
          return
        }

        i++
        lastIteration = i
        iterationInput.value = i
        fn(i)
      })
    })
  }, 1)
}

// Run control
runButton.addEventListener("click", () => {
  state = !state

  if (state) {
    const val = iterationInput.value > lastIteration ? lastIteration : iterationInput.value
    let i = parseInt(val)
    if (isNaN(i)) i = 0
    if (!(i >= 0)) i = 0
    console.log("Run for iteration " + i);
    fn(i)
  }
})

draw(canvasConfiguration, cellMap, 0)
