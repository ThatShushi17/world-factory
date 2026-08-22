import type { GameState } from "../gameState";

export class Simulation {
    constructor() {
        return
    }

    tick(dt: number, state: GameState) {
        state.time += dt,
        state.angle += dt
    }
}