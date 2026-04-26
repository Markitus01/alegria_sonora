export const galeria = {
    name: 'galeria',                                                                          
    title: 'Galería',                                                                         
    type: 'document',
    fields: [
        { // referencia a la edición
            name: 'edicion',
            title: 'Edición',
            type: 'reference',
            to: [{ type: 'edicion' }],
        },
        {
            /**
             * El array de items pilla dos tipos mezclados, fotos o videos con la url
             * así los admins pueden meter cualquier combi en cualquier orden
             * luego en sveltekit construimos el embed con la url y nos ahorramos almacenarlo
             * en cualquier otro lado.
             */
            name: 'items',
            title: 'Contenido',
            type: 'array',
            of: 
            [
                {
                    type: 'image',
                    title: 'Foto',
                },
                {
                    type: 'object',
                    title: 'Vídeo',
                    fields: [
                    {
                        name: 'titulo',
                        title: 'Título',
                        type: 'string',
                    },
                    {
                        name: 'url',
                        title: 'URL de YouTube/Vimeo',
                        type: 'url',
                    },
                    ],
                },
            ],
        },
    ],
}