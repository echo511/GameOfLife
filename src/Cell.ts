import { Coordinates } from "./Coordinates"
import { CellMap } from "./CellMap"

export class Cell {
  coordinates: Coordinates
  cellMap: CellMap
  private states: Map<number, boolean>

  private neighbors: Array<Cell>|undefined

  constructor() {
    this.reset()
  }

  public reset() {
    this.states = new Map
  }

  public getState(iteration: number): boolean {
    return this.states.get(iteration)
  }

  public setState(iteration: number, state: boolean): void {
    this.states.set(iteration, state)
  }

  public getNeighbors(): Array<Cell> {
    if(this.neighbors) return this.neighbors

    const startingRow: number = this.coordinates.x > 0 ? (this.coordinates.x - 1) : 0
    const endingRow: number = this.coordinates.x < (this.cellMap.maxX - 1) ? (this.coordinates.x + 1) : (this.cellMap.maxX)

    const startingCol: number = this.coordinates.y > 0 ? (this.coordinates.y - 1) : 0
    const endingCol: number = this.coordinates.y < (this.cellMap.maxY - 1) ? (this.coordinates.y + 1) : (this.cellMap.maxY)

    const neighbors: Array<Cell> = []

    for (let x = startingRow; x <= endingRow; x++) {
      for (let y = startingCol; y <= endingCol; y++) {
        if (x == this.coordinates.x && y == this.coordinates.y) continue

        const neighbor = this.cellMap.get(x, y)
        if (!(neighbor instanceof Cell)) throw "No cell " + x + " " + y + "\n"
        neighbors.push(neighbor)
      }
    }

    this.neighbors = neighbors

    return neighbors
  }
}