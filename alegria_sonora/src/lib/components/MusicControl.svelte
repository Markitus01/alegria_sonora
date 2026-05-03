<script lang="ts">
    import { playing, artwork, togglePlay } from '$lib/music.js'
</script>

<button class="control" onclick={togglePlay} aria-label={$playing ? 'Pausar música' : 'Reproducir música'}>
    {#if $artwork}
        <img src={$artwork} alt="portada" class="portada" />
    {/if}
    <span class="icono">{$playing ? '||' : '>'}</span>
</button>

<style>
    .control
    {
        position:        fixed;
        bottom:          1.5rem;
        left:            1.5rem;
        z-index:         500;
        background:      #0a0a0a;
        border:          1px solid #F5A623;
        color:           #F5A623;
        width:           3rem;
        height:          3rem;
        border-radius:   50%;
        cursor:          pointer;
        display:         flex;
        align-items:     center;
        justify-content: center;
        overflow:        hidden;
        padding:         0;
    }

    .portada
    {
        position:   absolute;
        inset:      0;
        width:      100%;
        height:     100%;
        object-fit: cover;
        opacity:    0.5;
    }

    .icono
    {
        position:    relative;
        z-index:     1;
        font-family: 'Press Start 2P', monospace;
        font-size:   0.7rem;
    }
</style>