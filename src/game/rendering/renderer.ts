// TODO: make render() a public api
// STUB: remove testing triangle code

import { createShader, createProgram } from "../../core/shaders"
import vertexSource from './shaders/sprite.vert?raw'
import fragmentSource from './shaders/sprite.frag?raw'
import type { Camera } from "./camera"
import type { Position, Rect, Size } from "../../core/types"

export class Renderer {
    private canvas: HTMLCanvasElement
    private gl: WebGL2RenderingContext
    private animationFrame = 0

    private program: WebGLProgram
    private vao: WebGLVertexArrayObject
    private vbo: WebGLBuffer

    // private angleLocation: WebGLUniformLocation | null
    // private positionLocation: number
    // private colorLocation: number

    private cameraPositionLocation: WebGLUniformLocation | null
    private cameraZoomLocation: WebGLUniformLocation | null
    private viewportSizeLocation: WebGLUniformLocation | null

    private positionLocation: WebGLUniformLocation | null
    private sizeLocation: WebGLUniformLocation | null
    private cameraLocation: WebGLUniformLocation | null

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

        // const vertices = new Float32Array([
        // //   x      y      r    g    b
        //     0.0,   0.6,   1.0, 0.0, 0.0,
        //    -0.52, -0.3,   0.0, 1.0, 0.0,
        //     0.52, -0.3,   0.0, 0.0, 1.0,
        // ])
        // const vertices = new Float32Array([
        // //   x      y      r    g    b
        //     0.0,  60.0,   1.0, 0.0, 0.0,
        //   -52.0, -30.0,   0.0, 1.0, 0.0,
        //    52.0, -30.0,   0.0, 0.0, 1.0,
        // ])
        const vertices = new Float32Array([
        //   x     y      u    v
           -0.5, -0.5,   0.0, 0.0,
            0.5, -0.5,   1.0, 0.0,
            0.5,  0.5,   1.0, 1.0,

           -0.5, -0.5,   0.0, 0.0,
            0.5,  0.5,   1.0, 1.0,
           -0.5,  0.5,   0.0, 1.0,
        ])

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

        const vao = gl.createVertexArray()

        if (!vao) {
            throw new Error('Failed to create vertex array')
        }

        this.vao = vao
        gl.bindVertexArray(this.vao)

        const positionLocation = gl.getAttribLocation(this.program, 'a_position')
        // const colorLocation = gl.getAttribLocation(this.program, 'a_color')
        const uvLocation = gl.getAttribLocation(this.program, 'a_uv')

        if (positionLocation === -1) {
            throw new Error("Shader attribute 'a_position' not found")
        }

        if (uvLocation === -1) {
            throw new Error("Shader attribute 'a_uv' not found")
        }

        const stride = 4 * Float32Array.BYTES_PER_ELEMENT

        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(
            positionLocation,
            2,
            gl.FLOAT,
            false,
            stride,
            0
        )

        gl.enableVertexAttribArray(uvLocation)
        gl.vertexAttribPointer(
            uvLocation,
            2,
            gl.FLOAT,
            false,
            stride,
            2 * Float32Array.BYTES_PER_ELEMENT
        )

        gl.bindVertexArray(null)

        this.positionLocation = gl.getUniformLocation(this.program, 'u_position')
        this.sizeLocation = gl.getUniformLocation(this.program, 'u_size')
        this.cameraLocation = gl.getUniformLocation(this.program, 'u_camera')

        // this.angleLocation = gl.getUniformLocation(this.program, 'u_angle')
        // this.positionLocation = gl.getAttribLocation(this.program, 'a_position')
        // this.colorLocation = gl.getAttribLocation(this.program, 'a_color')
        
        this.cameraPositionLocation = gl.getUniformLocation(this.program, 'u_camera_position')
        this.cameraZoomLocation = gl.getUniformLocation(this.program, 'u_camera_zoom')
        this.viewportSizeLocation = gl.getUniformLocation(this.program, 'u_viewport_size')

        this.resize()
        window.addEventListener('resize', this.resize)
    }

    resize = () => {
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

    render = (rect: Rect, camera: Camera) => {
        const gl = this.gl

        gl.clearColor(0.02, 0.02, 0.04, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)

        // gl.uniform1f(this.angleLocation, state.angle)
        gl.uniform1f(this.cameraZoomLocation, camera.zoom)
        gl.uniform2f(this.cameraPositionLocation, camera.position.x, camera.position.y)
        gl.uniform2f(this.viewportSizeLocation, this.canvas.width, this.canvas.height)

        const pos: Position = { x: 100, y: 300 }
        const size: Size = { width: 100, height: 300 }

        this.renderRect(rect, camera)
        this.renderRect({ position: pos, size: size }, camera)

        gl.bindVertexArray(null)
    }

    renderRect = (rect: Rect, camera: Camera) => {
        const gl = this.gl
        
        gl.uniform2f(this.positionLocation, rect.position.x, rect.position.y)
        gl.uniform2f(this.sizeLocation, rect.size.width, rect.size.height)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    destroy = () => {
        this.gl.deleteVertexArray(this.vao)
        this.gl.deleteBuffer(this.vbo)
        this.gl.deleteProgram(this.program)

        window.removeEventListener('resize', this.resize)
    }
}