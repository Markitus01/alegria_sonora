import { createClient } from '@sanity/client'

export const client = createClient(
{                                                                                                                                                          
    projectId: 'vcxix50z', // la id asignada por sanity en /studio/sanity.config.ts
    dataset: 'production',
    /**
     * sería tonto tenerlo en false, con cdn carga más rápido y lo máximo que podría ocurrir es que lleguen los cambios con un minuto o dos
     * de retraso tras un deploy de los admins, si quieren los datos en tiempo real entonces lo mismo si es putadilla pero bueno, ya me dirán
    */
    useCdn: true,
    apiVersion: '2026-04-26', // pillamos las features más recientes,
})