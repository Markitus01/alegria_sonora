<script>
    import Splash from '$lib/components/Splash.svelte'
    import Intro from '$lib/components/Intro.svelte'
    let { data } = $props()  // le metemos los datos del page.server.js
    let fase = $state('splash')
</script>

<!-- Los componentes de svelte están en src/lib/components -->
{#if fase === 'splash' || fase === 'fadiendo'}
    <Splash onFadeStart={() => fase = 'fadiendo'} onDone={() => fase = 'intro'} />
{/if}

{#if fase === 'fadiendo' || fase === 'intro'}
    <Intro />
{/if}

<pre>
    <!--
        null es para no filtrar nada, que muestre todo
        y el numero es la indentación
    -->
    <!-- {JSON.stringify(data, null, 4)} -->
    Edición:
    {JSON.stringify(data.edicion, null, 4)}

    Ubicación:
    {JSON.stringify(data.edicion.ubicacion, null, 4)}

    Galeria:
    {JSON.stringify(data.galeria, null, 4)}

    Todo:
    {JSON.stringify(data, null, 4)}
</pre>