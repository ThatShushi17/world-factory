<script lang="ts">
import { onMount } from 'svelte'
import { Game } from './game/game';

import DebugCard from './ui/components/DebugCard.svelte';

let viewportCanvas: HTMLCanvasElement
let game: Game

let fps = 0
let dt = 0

onMount(() => {
    game = new Game(viewportCanvas)

    const debugInterval = setInterval(() => {
        fps = game.fps
        dt = game.dt
    }, 100)

    game.start()

    return () => {
        clearInterval(debugInterval)
        game.destroy()
    }
})
</script>

<canvas class="viewport" bind:this={viewportCanvas}></canvas>

<DebugCard {fps} {dt} />