<script>
    import Intro from '$lib/components/Intro.svelte'
    let { data } = $props()  // le metemos los datos del page.server.js
</script>

<Intro /> <!-- El componente intro, está en src/lib/components -->

<pre>
    <!--
        null es para no filtrar nada, que muestre todo
        2 es la indentación
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