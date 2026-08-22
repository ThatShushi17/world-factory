// TODO: make render() a public api
// STUB: remove testing triangle code

import { createShader, createProgram } from "../../core/shaders"
import vertexSource from './shaders/triangle.vert?raw'
import fragmentSource from './shaders/triangle.frag?raw'
import type { GameState } from "../gameState"

export class Renderer {
    private canvas: HTMLCanvasElement
    private gl: WebGL2RenderingContext
    private animationFrame = 0

    private program: WebGLProgram
    private vao: WebGLVertexArrayObject
    private vbo: WebGLBuffer

    private angleLocation: WebGLUniformLocation | null
    private positionLocation: number
    private colorLocation: number

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

        this.vbo = buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

        const vertices = new Float32Array([
        //   x      y      r    g    b
            0.0,   0.6,   1.0, 0.0, 0.0,
           -0.52, -0.3,   0.0, 1.0, 0.0,
            0.52, -0.3,   0.0, 0.0, 1.0,
        ])

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

                const vao = gl.createVertexArray()

        if (!vao) {
            throw new Error('Failed to create vertex array')
        }

        this.vao = vao
        gl.bindVertexArray(this.vao)

        const positionLocation = gl.getAttribLocation(this.program, 'a_position')
        const colorLocation = gl.getAttribLocation(this.program, 'a_color')

        const stride = 5 * Float32Array.BYTES_PER_ELEMENT

        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(
            positionLocation,
            2,
            gl.FLOAT,
            false,
            stride,
            0
        )

        gl.enableVertexAttribArray(colorLocation)
        gl.vertexAttribPointer(
            colorLocation,
            3,
            gl.FLOAT,
            false,
            stride,
            2 * Float32Array.BYTES_PER_ELEMENT
        )

        gl.bindVertexArray(null)

        this.angleLocation = gl.getUniformLocation(this.program, 'u_angle')
        this.positionLocation = gl.getAttribLocation(this.program, 'a_position')
        this.colorLocation = gl.getAttribLocation(this.program, 'a_color')

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

    render(state: GameState) {
        const gl = this.gl

        gl.clearColor(0.02, 0.02, 0.04, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)

        gl.uniform1f(this.angleLocation, state.angle)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        gl.bindVertexArray(null)
    }

    destroy() {
        this.gl.deleteVertexArray(this.vao)
        this.gl.deleteBuffer(this.vbo)
        this.gl.deleteProgram(this.program)

        window.removeEventListener('resize', this.resize)
    }
}