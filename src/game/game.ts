import type { GameState } from "./gameState";
import { Renderer } from "./rendering/renderer";
import { Simulation } from "./simulation/simulation";
import { Input } from "./input";

export class Game {
    private renderer: Renderer

    private simulation = new Simulation()
    private input = new Input()
    
    private state: GameState = {
        time: 0,
        angle: 0
    }

    private animationFrame = 0
    private lastTime = performance.now()

    public dt = 0
    public fps = 0

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas)
        this.simulation.camera.setViewport(canvas.clientWidth, canvas.clientHeight)
        window.addEventListener('resize', this.renderer.resize)
    }

    start = () => {
        const tick = (time: number) => {  // STUB: shouldnt need these?
            this.dt = (time - this.lastTime) / 1000
            this.lastTime = time
            this.fps = this.dt > 0 ? 1 / this.dt : 0

            this.tick(this.dt)

            this.animationFrame = requestAnimationFrame(tick)
        }

        this.animationFrame = requestAnimationFrame(tick)
    }

    private tick = (dt: number) => {
        let renderData = this.simulation.tick(dt, this.input.getData(), this.state)
        this.renderer.render(renderData, this.simulation.camera)
        this.input.clear()
    }

    destroy = () => {
        cancelAnimationFrame(this.animationFrame)

        this.renderer.destroy()
    }
}