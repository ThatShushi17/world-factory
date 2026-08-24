import type { Position, Size } from "../../core/types";
import type { GameState } from "../gameState";
import type { InputData } from "../input";
import { Camera } from "../rendering/camera";
import type { RenderData } from "../rendering/renderData";
import { Player } from "./player";

export class Simulation {
    readonly player = new Player()
    readonly camera = new Camera()

    tick = (dt: number, input: InputData, state: GameState): RenderData => {
        this.player.update(dt, input)
        this.camera.setTarget(this.player.position)
        this.camera.setMouseOffset(input.mousePosition, input.mouseButtons.has(0))
        this.camera.update(dt)

        state.time += dt,
        state.angle += dt
        
        const pos: Position = { x: 100, y: 300 }
        const size: Size = { width: 100, height: 300 }

        return { playerRect: this.player.rect, worldRects: [{ position: pos, size: size }] }
    }
}