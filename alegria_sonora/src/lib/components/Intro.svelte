<script lang="ts">
    import { onMount } from 'svelte'
    import { iniciarIntro } from '$lib/animations/intro.js'

    // div contenedor donde Pixi inyectará su propio canvas
    let contenedor = $state() as HTMLDivElement

    // chorprecha jeje
    const linea1 = Math.random() < 0.001 ? 'ALEGRÍA' : 'ALERGIA'
    const linea2 = 'SONORA'

    onMount(() =>
    {
        let cleanup: () => void

        iniciarIntro(contenedor, linea1, linea2).then(fn => { cleanup = fn })

        return () => cleanup?.()
    })
</script>

<!-- Pixi inyecta su canvas dentro de este div -->
<div class="intro" bind:this={contenedor}></div>

<style>
    .intro
    {
        position: fixed;
        inset: 0;
        background: #0a0a0a;
        cursor: pointer;
        z-index: 100;
    }

    /* el canvas que inyecta Pixi hereda el tamaño del contenedor */
    .intro :global(canvas)
    {
        width: 100% !important;
        height: 100% !important;
    }
</style>