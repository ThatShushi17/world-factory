import type { Position } from "../core/types"

export interface InputData {
    keys: Set<string>

    mousePosition: Position
    mouseDeltaX: number
    mouseDeltaY: number
    mouseButtons: Set<number>

    pressedKeys: Set<string>
    releasedKeys: Set<string>
    pressedMouseButtons: Set<number>
    releasedMouseButtons: Set<number>
}

export class Input {
    private data: InputData = {
        keys: new Set(),
        mousePosition: { x: 0, y: 0 },
        mouseDeltaX: 0,
        mouseDeltaY: 0,
        mouseButtons: new Set(),
        pressedKeys: new Set(),
        releasedKeys: new Set(),
        pressedMouseButtons: new Set(),
        releasedMouseButtons: new Set()
    }

    constructor() {
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mouseup', this.onMouseUp)
    }

    getData = (): InputData => { return this.data }

    clear = (): void => {
        this.data.mouseDeltaX = 0
        this.data.mouseDeltaY = 0

        this.data.pressedKeys.clear()
        this.data.releasedKeys.clear()
        this.data.pressedMouseButtons.clear()
        this.data.releasedMouseButtons.clear()
    }

    destroy = (): void => {
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mousedown', this.onMouseDown)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (!this.data.keys.has(e.code)) {
            this.data.pressedKeys.add(e.code)
        }

        this.data.keys.add(e.code)
    }

    private onKeyUp = (e: KeyboardEvent): void => {
        this.data.keys.delete(e.code)
        this.data.releasedKeys.add(e.code)
    }

    private onMouseMove = (e: MouseEvent): void => {
        this.data.mousePosition = { x: e.clientX, y: e.clientY }
        
        this.data.mouseDeltaX += e.movementX
        this.data.mouseDeltaY += e.movementY
    }

    private onMouseDown = (e: MouseEvent): void => {
        this.data.mouseButtons.add(e.button)
        this.data.pressedMouseButtons.add(e.button)
    }

    private onMouseUp = (e: MouseEvent): void => {
        this.data.mouseButtons.delete(e.button)
        this.data.releasedMouseButtons.add(e.button)
    }
}