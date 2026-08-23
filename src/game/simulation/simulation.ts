import type { GameState } from "../gameState";
import type { InputData } from "../input";

export class Simulation {
    tick(dt: number, input: InputData, state: GameState) {
        state.time += dt,
        state.angle += dt
    }
}