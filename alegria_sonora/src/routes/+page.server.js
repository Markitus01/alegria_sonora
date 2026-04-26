import { client } from '$lib/sanity.js'
import { edicionActivaQuery, actuacionesQuery, galeriaQuery, noticiasQuery } from '$lib/queries.js'

/**
 * La función de load es lo que ejecuta SvelteKit en servidor antes de renderizar la pagina
 * que luego podemos pillar en +page con la variable "data" usando el $props
 * @returns 
 */
export async function load() {
    const edicion = await client.fetch(edicionActivaQuery)
    const actuaciones = await client.fetch(actuacionesQuery)
    const galeria = await client.fetch(galeriaQuery)
    const noticias = await client.fetch(noticiasQuery)

    return { edicion, actuaciones, galeria, noticias }
}

