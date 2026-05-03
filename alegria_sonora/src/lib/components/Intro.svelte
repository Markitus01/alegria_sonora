<script lang="ts">
    import gsap from 'gsap'
    import { onMount } from 'svelte'
    import { iniciarIntro } from '$lib/animations/intro.js'
    import { fadeIn } from '$lib/music.js'

    // easter egg: 1 de cada 1000 veces sale "ALEGRÍA" en vez de "ALERGIA"
    const linea1 = Math.random() < 0.001 ? 'ALEGRÍA' : 'ALERGIA'

    let { onDone }: { onDone: () => void } = $props()
    let contenedor = $state() as HTMLButtonElement
    let cerrar: (() => Promise<void>) | null = null
    let clickable = $state(false) // evita clicks durante las animaciones de entrada/salida

    onMount(() => {
        let cleanup: () => void

        iniciarIntro(contenedor, linea1, 'SONORA').then(({ cleanup: c, cerrar: ce }) => {
            cleanup = c
            cerrar = ce

            // efecto encendido CRT: la pantalla se expande desde una línea horizontal
            gsap.from(contenedor, {
                scaleY:   0.02,
                duration: 0.4,
                ease:     'power2.out',
                onComplete: () => {
                    clickable = true
                    // 4.35s = duración (2.5s) + delay máximo (1.85s) de las partículas
                    // el volumen sube justo mientras las partículas forman las letras
                    fadeIn(4.35)
                },
            })
        })

        return () => cleanup?.()
    })

    async function handleClick() {
        if (!clickable || !cerrar) return
        clickable = false

        // las partículas vuelan de vuelta a posiciones aleatorias
        await cerrar()

        // efecto apagado CRT: colapsa verticalmente a una línea...
        await new Promise<void>(resolve => {
            gsap.to(contenedor, {
                scaleY:   0.02,
                duration: 0.35,
                ease:     'power2.in',
                onComplete: resolve,
            })
        })

        // ...luego la línea se encoge hacia el centro hasta desaparecer
        await new Promise<void>(resolve => {
            gsap.to(contenedor, {
                scaleX:   0,
                opacity:  0,
                duration: 0.2,
                ease:     'power2.in',
                onComplete: resolve,
            })
        })

        onDone()
    }
</script>

<button
    aria-label="Intro"
    class="intro"
    bind:this={contenedor}
    onclick={handleClick}
    style:cursor={clickable ? 'pointer' : 'default'}
>
</button>

<style>
    .intro
    {
        border: none;
        outline: none;
        padding: 0;
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