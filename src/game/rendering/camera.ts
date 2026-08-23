import type { Position } from "../../core/types"
import type { InputData } from "../input"

export class Camera {
    position: Position = { x: 0, y: 0}
    target: Position = { x: 0, y: 0 }  // STUB: change to relative position
    translateSpeed = 6

    zoom = 1
    zoomSpeed = 0.01

    viewportWidth = 1
    viewportHeight = 1

    update = (dt: number, input: InputData) => {  // TODO: remove wasd, add look-forward with mouse, shift
        const speed = 2000  // STUB: change to player
        
        let x = 0
        let y = 0

        if (input.keys.has('KeyA')) x -= 1
        if (input.keys.has('KeyD')) x += 1
        if (input.keys.has('KeyW')) y -= 1
        if (input.keys.has('KeyS')) y += 1

        if (x !== 0 || y !== 0) {
            const len = Math.hypot(x, y)

            x /= len
            y /= len

            this.target.x = x * speed * dt
            this.target.y = y * speed * dt

            this.moveTowardsTarget(dt)
        }
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
        this.position.x += this.target.x * Math.min(this.translateSpeed * dt, 1)
        this.position.y += this.target.y * Math.min(this.translateSpeed * dt, 1)
    }

    // TODO: add a clampToWorldSize() to prevent out of bounds rendering
}