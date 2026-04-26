export const noticia = {                                                                        name: 'noticia',                                                                          
    title: 'Noticia',                                                                         
    type: 'document',
    fields: [
        {
            name: 'titulo',
            title: 'Título',
            type: 'string',
        },
        {
            name: 'fecha',
            title: 'Fecha',
            type: 'datetime',
        },
        {
            name: 'imagen',
            title: 'Imagen',
            type: 'image',
        },
        {
            name: 'cuerpo',
            title: 'Contenido',
            type: 'array',
            of: [{ type: 'block' }],
            /**
             * El tipo block dentro del array es un editor de texto enriquecido de Sanity
             * le podemos enchichar ttulos, estilos de texto, listas, links etc, chetao
             * para el bloque de notícies.
             */
        },
    ],
}