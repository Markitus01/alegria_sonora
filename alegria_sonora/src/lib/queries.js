export const edicionActivaQuery = 
`*[_type == "edicion"][0] 
{                                                                                                                                       titulo,                                                                                                                                                                                   
    fechaInicio,                                                                                                                                                                              
    fechaFin,   
    descripcion,
    cartel,
    ubicacion->
    {
        nombre,
        direccion,
        mapa
    }
}`

export const actuacionesQuery = 
`*[_type == "actuacion"] | order(horaInicio asc)
{
    horaInicio,
    horaFin,
    artista->
    {
        nombre,
        bio,
        foto,
        generos,
        links
    }
}`

export const galeriaQuery = 
`*[_type == "galeria"][0]
{
    items
}`

export const noticiasQuery = 
`*[_type == "noticia"] | order(fecha desc)
{
    titulo,
    fecha,
    imagen,
    cuerpo
}`