import type { GameState } from "./gameState";
import { Renderer } from "./rendering/renderer";
import { Simulation } from "./simulation/simulation";
import { Input, type InputData } from "./input";
import { Camera } from "./rendering/camera";

export class Game {
    private renderer: Renderer
    private simulation: Simulation = new Simulation()
    private camera: Camera = new Camera
    private input: Input = new Input()
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
        window.addEventListener('resize', this.renderer.resize)
    }

    start = () => {
        const tick = (time: number) => {
            this.dt = (time - this.lastTime) / 1000
            this.lastTime = time
            this.fps = this.dt > 0 ? 1 / this.dt : 0

            this.tick(this.dt)

            this.animationFrame = requestAnimationFrame(tick)
        }

        this.animationFrame = requestAnimationFrame(tick)
    }

    private tick = (dt: number) => {
        this.simulation.tick(dt, this.input.getData(), this.state)
        this.camera.update(dt, this.input.getData())
        this.renderer.render(this.camera, this.state)
        this.input.clear()
    }

    destroy = () => {
        cancelAnimationFrame(this.animationFrame)

        this.renderer.destroy()
    }
}