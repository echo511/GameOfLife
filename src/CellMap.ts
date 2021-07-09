import { Cell } from "./Cell"
import { fromHexString } from "./state"

export class CellMap {

  map: Map<string, Cell>

  maxX: number = 0
  maxY: number = 0

  constructor() {
    this.map = new Map<string, Cell>()
  }

  static createGrid(rows: number, cols: number): CellMap {
    const cellMap = new CellMap
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        const cell = new Cell
        cell.cellMap = cellMap
        cell.coordinates = { x, y }
        cellMap.add(cell)
      }
    }
    return cellMap
  }

  public add(cell: Cell): void {
    this.map.set(JSON.stringify(cell.coordinates), cell)
    if (cell.coordinates.x > this.maxX) this.maxX = cell.coordinates.x
    if (cell.coordinates.y > this.maxY) this.maxY = cell.coordinates.y
  }

  public get(x: number, y: number): Cell {
    return this.map.get(
      JSON.stringify({ x, y })
    )
  }

  public forEach(func: (cell: Cell) => void) {
    this.map.forEach(func)
  }

  public getState(iteration: number): Array<boolean> {
    const state: Array<boolean> = []
    this.forEach((cell) => {
      state.push(cell.getState(iteration))
    })
    return state
  }

  public setState(iteration: number, hexState: string) {
    const state = fromHexString(hexState)

    if (state.length != this.map.size) throw "State and cell map sizes do not match."

    let i = 0
    this.forEach((cell: Cell) => {
      cell.setState(iteration, state[i])
      i++
    })
  }

  public setStateWith(iteration: number, callback: (cell: Cell) => boolean) {
    this.forEach((cell: Cell) => {
      const state = callback(cell)
      cell.setState(iteration, state)
    })
  }

}