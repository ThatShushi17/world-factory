<script lang="ts">
import { onMount } from 'svelte'
import { Renderer } from '../../game/rendering/renderer'

let canvasElement: HTMLCanvasElement

onMount(() => {
    const renderer = new Renderer(canvasElement)

    const resize = () => renderer.resize()
    window.addEventListener('resize', resize)

    renderer.start()

    return () => {
        window.removeEventListener('resize', resize)
        renderer.destroy()
    }
})
</script>

<canvas bind:this={canvasElement}></canvas>

<style>
canvas {
    display: block;
    width: 100vw;
    height: 100vh;
}
</style>