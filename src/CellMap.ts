import { Cell } from "./Cell"

export class CellMap {

  map: Map<string, Cell>

  maxX: number = 0
  maxY: number = 0

  constructor() {
    this.map = new Map<string, Cell>()
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

}