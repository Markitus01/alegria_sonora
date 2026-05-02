<script lang="ts">
    import gsap from 'gsap'
    
    let { onDone, onFadeStart }: { onDone: () => void, onFadeStart: () => void } = $props()

    let contenedor = $state() as HTMLButtonElement

    function handleClick()
    {
        onFadeStart()
        gsap.set(contenedor.querySelector('p'), { opacity: 0 })
        gsap.to(contenedor, {
            opacity:    0,
            duration:   1,
            ease:       'power2.inOut',
            onComplete: onDone,
        })
    }
</script>

<button class="splash" bind:this={contenedor} onclick={handleClick}>
    <p class="texto">&gt; ENTER</p>
</button>   

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
</style>