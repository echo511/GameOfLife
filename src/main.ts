import { CellMap } from "./CellMap"
import { Cell } from "./Cell"
import { CanvasConfiguration, draw } from "./ui"
import { GameOfLife } from "./GameOfLife"

// Configure grid
const rows = 20
const cols = 20

// Configure population
const aliveProbability = 0.35

// Construct grid
const cellMap = CellMap.createGrid(20, 20)

cellMap.setStateWith(0, (cell: Cell) => {
  return Math.random() > aliveProbability ? false : true
})

// Interesting cycles
//const cycleState = '10006fa3825d3835d95483d9010370311244e8c782b2f8c8151a814a121604102a088b260b8e3f313223e0081809e154741c0'
//const cycleState = '10000000000000000000000800008000140000800008000080000800014000080000800000000000000000000000000000000'
//cellMap.setState(0, cycleState)


// Game of life
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
  if (!state) return

  setTimeout(() => { // timeout needed for controls to respond, otherwise JS queue is filled with calculations so one cannot stop them
    gol.run().then(({ done, iteration, state }) => {
      draw(canvasConfiguration, cellMap, i + 1).then(() => {
        if (done) {
          runButton.style.display = "none"
          return
        }

        console.log("Iteration " + iteration + " state: " + state)

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
