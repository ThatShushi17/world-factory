import type { Rect } from "../../core/types";
import type { GameState } from "../gameState";
import type { InputData } from "../input";
import { Camera } from "../rendering/camera";
import { Player } from "./player";

export class Simulation {
    readonly player = new Player()
    readonly camera = new Camera()

    tick = (dt: number, input: InputData, state: GameState): Rect => {
        this.player.update(dt, input)
        this.camera.setTarget(this.player.position)
        this.camera.update(dt)

        state.time += dt,
        state.angle += dt

        return this.player.rect
    }
}