<script lang="ts">
    import gsap from 'gsap'
    import { onMount } from 'svelte'
    import { setWidget, togglePlay } from '$lib/music.js'

    type SCWidget = { 
        play: () => void; 
        pause: () => void; 
        skip: (index: number) => void; 
        getSounds: (cb: (sounds: unknown[]) => void) => void;
        setVolume: (vol: number) => void;
        getCurrentSound: (cb: (sound: { artwork_url: string | null }) => void) => void;
        bind: (event: string, cb: () => void) => void
    }
    
    type SCStatic = { Widget: ((iframe: HTMLIFrameElement) => SCWidget) & { Events: { READY: string } } }

    let { onDone }: { onDone: () => void } = $props()

    let contenedor = $state() as HTMLButtonElement
    let iframe     = $state() as HTMLIFrameElement

    // carga el script de la API de SoundCloud solo una vez
    // (si ya está en window, resuelve inmediatamente)
    function cargarSC(): Promise<void> {
        return new Promise(resolve => {
            if ((window as unknown as { SC?: unknown }).SC) { resolve(); return }
            const script  = document.createElement('script')
            script.src    = 'https://w.soundcloud.com/player/api.js'
            script.onload = () => resolve()
            document.head.appendChild(script)
        })
    }

    onMount(async () => {
        await cargarSC()
        const SC = (window as unknown as { SC: SCStatic }).SC

        // inicializamos el widget en onMount, no en el click:
        // SC.Widget necesita que el iframe esté cargado en el DOM
        const w = SC.Widget(iframe)
        w.bind(SC.Widget.Events.READY, () => {
            // elegimos una canción aleatoria de la playlist antes de registrar el widget
            w.getSounds(sounds => {
                const indice = Math.floor(Math.random() * sounds.length)
                w.skip(indice)
                setWidget(w)
            })
        })
    })

    function handleClick() {
        // los navegadores bloquean el autoplay hasta que hay interacción del usuario
        // este click es la interacción que desbloquea el audio
        togglePlay()

        gsap.set(contenedor.querySelector('p'), { opacity: 0 })
        gsap.to(contenedor, {
            opacity:    0,
            duration:   1,
            ease:       'power2.inOut',
            onComplete: () => {
                // quitamos eventos de ratón para que no bloquee la página de debajo
                contenedor.style.pointerEvents = 'none'
                onDone()
            },
        })
    }
</script>

<button class="splash" bind:this={contenedor} onclick={handleClick}>
    <p class="texto">&gt; ENTER</p>
</button>

<iframe
    bind:this={iframe}
    title="player"
    src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/mark-sandiumenge-villoria/sets/alegria-que-es-gerundio&auto_play=false&hide_related=true&show_comments=false&show_user=false"
    class="sc-iframe"
></iframe>

<style>
    .splash
    {
        border: none;
        outline: none;
        position: fixed;
        inset: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 200;
    }

    .splash::after
    {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(255, 255, 255, 0.04) 2px,
            rgba(255, 255, 255, 0.04) 4px
        );
        pointer-events: none;
        z-index: 1;
    }

    .texto
    {
        display:     flex;
        align-items: center;
        gap:         1rem;
        font-family: 'Press Start 2P', monospace;
        color: #F5A623;
        font-size: clamp(1.5rem, 5vw, 6rem);
        animation: parpadeo 1s step-end infinite;
    }

    @keyframes parpadeo
    {
        0%, 100%    { opacity: 1; }
        50%         { opacity: 0; }
    }

    .sc-iframe
    {
        position:       absolute;
        width:          1px;
        height:         1px;
        opacity:        0;
        pointer-events: none;
    }
</style>