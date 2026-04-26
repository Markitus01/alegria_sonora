export const actuacion = {                                                                      name: 'actuacion',
    title: 'Actuación',                                                                       
    type: 'document',
    fields: [
        {
            name: 'artista',
            title: 'Artista',
            type: 'reference',
            to: [{ type: 'artista' }],
        },
        { // referencia a a edicion.ts illo que guapo el sanity
            name: 'edicion',
            title: 'Edición',
            type: 'reference',
            to: [{ type: 'edicion' }],
        },
        {
            name: 'horaInicio',
            title: 'Hora de inicio',
            type: 'datetime',
        },
        {
            name: 'horaFin',
            title: 'Hora de fin',
            type: 'datetime',
        },
    ],
}