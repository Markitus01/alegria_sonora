export const artista = {                                                                                                                                                                          name: 'artista',
    title: 'Artista',                                                                                                                                                                           
    type: 'document',
    fields: 
    [
        {
            name: 'nombre',
            title: 'Nombre',
            type: 'string',
        },
        {
            name: 'bio',
            title: 'Biografía',
            type: 'text',
        },
        {
            name: 'foto',
            title: 'Foto',
            type: 'image',
        },
        {
            name: 'generos',
            title: 'Géneros musicales',
            type: 'array',
            of: [{ type: 'string' }]
        },
        {
            name: 'links',
            title: 'Links',
            type: 'object',
            fields: 
            [
                {
                    name: 'tidal',
                    title: 'Tidal',
                    type: 'url',
                },
                {
                    name: 'spotify',
                    title: 'Spotify',
                    type: 'url',
                },
                {
                    name: 'instagram',
                    title: 'Instagram',
                    type: 'url',
                },
                {
                    name: 'web',
                    title: 'Web oficial',
                    type: 'url',
                },
            ],
        },
    ],
}