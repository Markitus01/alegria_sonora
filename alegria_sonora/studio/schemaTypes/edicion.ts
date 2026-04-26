export const edicion = {
    name: 'edicion',
    title: 'Edición',
    type: 'document',
    fields: 
    [
        {
            name: 'titulo',
            title: 'Título',
            type: 'string',
        },
        {
            name: 'fechaInicio',
            title: 'Fecha de inicio',
            type: 'datetime',
        },
        {
            name: 'fechaFin',
            title: 'Fecha de fin',
            type: 'datetime',
        },
        {
            name: 'descripcion',
            title: 'Descripción',
            type: 'text',
        },
        {
            name: 'cartel',
            title: 'Cartel',
            type: 'image',
        },
        { // referencia al schema de ubicación, rollo FK de BD
            name: 'ubicacion',
            title: 'Ubicación',
            type: 'reference',
            to: [{ type: 'ubicacion' }],
        },
    ],
}