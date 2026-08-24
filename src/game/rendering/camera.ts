import type { Position } from "../../core/types"
import type { InputData } from "../input"

export class Camera {
    position: Position = { x: 0, y: 0}
    target: Position = { x: 0, y: 0 }
    translateSpeed = 6

    zoom = 1
    zoomSpeed = 0.01

    viewportWidth = 1
    viewportHeight = 1

    update = (dt: number) => {  // TODO: add look-forward with mouse, shift
        this.moveTowardsTarget(dt)
    }

    setTarget = (target: Position): void => {
        this.target.x = target.x
        this.target.y = target.y
    }

    setViewport = (width: number, height: number): void => {
        this.viewportWidth = width
        this.viewportHeight = height
    }

    screenToWorld = (screenPosition: Position): Position => {
        return {
            x: (screenPosition.x - this.viewportWidth / 2) / this.zoom + this.position.x,
            y: (screenPosition.y - this.viewportHeight / 2) / this.zoom + this.position.y
        }
    }

    worldToScreen = (worldPosition: Position): Position => {
        return {
            x: (worldPosition.x - this.position.x) * this.zoom + this.viewportWidth / 2,
            y: (worldPosition.y - this.position.y) * this.zoom + this.viewportHeight / 2
        }
    }

    private moveTowardsTarget = (dt: number): void => {
        this.position.x += (this.target.x - this.position.x) * Math.min(this.translateSpeed * dt, 1)
        this.position.y += (this.target.y - this.position.y) * Math.min(this.translateSpeed * dt, 1)
    }

    // TODO: add a clampToWorldSize() to prevent out of bounds rendering
}