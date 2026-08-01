/**
 * SwarmRL - Disaster Zone Grid Coverage Map
 */

import { Vector3D } from '../types';

export class CoverageMap {
  private width: number;
  private length: number;
  private resolution: number; // cell size (m), e.g., 2m
  private cols: number;
  private rows: number;
  private grid: Uint8Array; // 0 = unexplored, 1 = explored, 2 = recently explored
  private totalCells: number;
  private exploredCellsCount: number = 0;

  constructor(width: number = 100, length: number = 100, resolution: number = 2.5) {
    this.width = width;
    this.length = length;
    this.resolution = resolution;

    this.cols = Math.ceil(width / resolution);
    this.rows = Math.ceil(length / resolution);
    this.totalCells = this.cols * this.rows;
    this.grid = new Uint8Array(this.totalCells);
  }

  public reset() {
    this.grid.fill(0);
    this.exploredCellsCount = 0;
  }

  /**
   * Registers agent position and marks cells within sensor radius as explored
   * Returns the count of NEWLY explored cells during this update step
   */
  public updateCoverage(agentPos: Vector3D, sensorRadius: number = 6.0): number {
    let newlyExplored = 0;

    const halfW = this.width / 2;
    const halfL = this.length / 2;

    // Convert agent pos to grid coordinates
    const centerCol = Math.floor((agentPos.x + halfW) / this.resolution);
    const centerRow = Math.floor((agentPos.z + halfL) / this.resolution);

    const radiusInCells = Math.ceil(sensorRadius / this.resolution);

    const minCol = Math.max(0, centerCol - radiusInCells);
    const maxCol = Math.min(this.cols - 1, centerCol + radiusInCells);
    const minRow = Math.max(0, centerRow - radiusInCells);
    const maxRow = Math.min(this.rows - 1, centerRow + radiusInCells);

    const radiusSqInCells = radiusInCells * radiusInCells;

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        const dc = c - centerCol;
        const dr = r - centerRow;
        if (dc * dc + dr * dr <= radiusSqInCells) {
          const idx = r * this.cols + c;
          if (this.grid[idx] === 0) {
            this.grid[idx] = 1; // Explored
            this.exploredCellsCount++;
            newlyExplored++;
          }
        }
      }
    }

    return newlyExplored;
  }

  public getCoveragePercentage(): number {
    return (this.exploredCellsCount / this.totalCells) * 100;
  }

  public getExploredCount(): number {
    return this.exploredCellsCount;
  }

  public getTotalCells(): number {
    return this.totalCells;
  }

  public getGridData(): { grid: Uint8Array; cols: number; rows: number; resolution: number } {
    return {
      grid: this.grid,
      cols: this.cols,
      rows: this.rows,
      resolution: this.resolution,
    };
  }
}
