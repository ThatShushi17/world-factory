import type { Position, Rect, Size } from "../../core/types";
import type { InputData } from "../input";

export class Player {
    position: Position = { x: 0, y: 0 }
    size: Size = { width: 50, height: 50 }
    speed = 300
    
    public get rect() : Rect {
        return { position: this.position, size: this.size }
    }

    update = (dt: number, input: InputData) => {    
        let dx = 0
        let dy = 0

        if (input.keys.has('KeyA')) dx -= 1
        if (input.keys.has('KeyD')) dx += 1
        if (input.keys.has('KeyW')) dy -= 1
        if (input.keys.has('KeyS')) dy += 1

        if (dx !== 0 || dy !== 0) {
            const len = Math.hypot(dx, dy)

            dx /= len
            dy /= len

            this.position.x += dx * this.speed * dt
            this.position.y += dy * this.speed * dt
        }
    }
}