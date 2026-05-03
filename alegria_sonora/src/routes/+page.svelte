<script>
    import Splash from '$lib/components/Splash.svelte'
    import Intro from '$lib/components/Intro.svelte'
    import MusicControl from '$lib/components/MusicControl.svelte'
    let { data } = $props()
    let fase = $state('splash')
</script>

<Splash onDone={() => fase = 'intro'} />

<!-- el control de música aparece en cuanto el usuario ha interactuado -->
{#if fase !== 'splash'}
    <MusicControl />
{/if}

{#if fase === 'intro'}
    <Intro onDone={() => fase = 'home'} />
{/if}

{#if fase === 'intro' || fase === 'home'}
    <!-- home -->
{/if}

<!-- <pre> -->
    <!--
        null es para no filtrar nada, que muestre todo
        y el numero es la indentación
    -->
    <!-- {JSON.stringify(data, null, 4)} -->
    <!-- Edición:
    {JSON.stringify(data.edicion, null, 4)}

    Ubicación:
    {JSON.stringify(data.edicion.ubicacion, null, 4)}

    Galeria:
    {JSON.stringify(data.galeria, null, 4)}

    Todito:
    {JSON.stringify(data, null, 4)} -->
<!-- </pre> -->