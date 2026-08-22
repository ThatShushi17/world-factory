// TODO: make render() a public api
// TODO: call resize() on window resize
// STUB: remove testing triangle code

import { createShader, createProgram } from "../../core/shaders"
import vertexSource from './shaders/triangle.vert?raw'
import fragmentSource from './shaders/triangle.frag?raw'

export class Renderer {
    private canvas: HTMLCanvasElement
    private gl: WebGL2RenderingContext
    private animationFrame = 0

    private program: WebGLProgram
    private vertexBuffer: WebGLBuffer

    private angleLocation: WebGLUniformLocation | null

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas

        const gl = canvas.getContext('webgl2', {
            alpha: false,
            depth: true,
            antialias: true
        })

        if (!gl) {
            throw new Error('WebGL 2 is not supported')
        }

        this.gl = gl

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

        this.program = createProgram(gl, vertexShader, fragmentShader)

        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)

        const buffer = gl.createBuffer()
        
        if (!buffer) throw new Error('Failed to create vertex buffer')

        this.vertexBuffer = buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

        const vertices = new Float32Array([
        //   x     y      r    g    b
            0.0,  0.6,   1.0, 0.0, 0.0,
           -0.6, -0.6,   0.0, 1.0, 0.0,
            0.6, -0.6,   0.0, 0.0, 1.0,
        ])

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

        this.angleLocation = gl.getUniformLocation(this.program, 'u_angle')

        this.resize();
    }

    resize() {
        const dpr = window.devicePixelRatio

        this.canvas.width = this.canvas.clientWidth * dpr
        this.canvas.height = this.canvas.clientHeight * dpr

        this.gl.viewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
    }

    start() {  // TODO: add timing
        const frame = () => {
            this.render()
            this.animationFrame = requestAnimationFrame(frame)
        }

        frame()
    }

    private render() {
        const gl = this.gl

        gl.clearColor(0.02, 0.02, 0.04, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.useProgram(this.program)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)

        const positionLocation = gl.getAttribLocation(this.program, 'a_position')
        const colorLocation = gl.getAttribLocation(this.program, 'a_color')

        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(
            positionLocation,
            2,
            gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            0
        )

        gl.enableVertexAttribArray(colorLocation)
        gl.vertexAttribPointer(
            colorLocation,
            3,
            gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT
        )

        gl.uniform1f(this.angleLocation, performance.now() / 1000)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    destroy() {
        cancelAnimationFrame(this.animationFrame)
    }
}