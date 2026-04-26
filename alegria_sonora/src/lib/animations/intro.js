import gsap from 'gsap'


/** 
 * @typedef {{ x: number, y: number, radio: number, vx: number, vy: number, opacidad: number, rotacion: number }} Particula
 * @typedef {{ x: number, y: number, destinoX: number, destinoY: number, progreso: number, opacidad: number, offsetX: number, offsetY: number, fase: number }} PartiiculaLetra
 */

/**
 * Ajusta el canvas al tamaño real de la ventana
 * necesario porque CSS width/height no es lo mismo que los píxeles reales del canvas :3
 * @param {HTMLCanvasElement} canvas
 */
export function redimensionar(canvas)
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

/**
 * Dibuja y mueve las partículas triangulares de fondo
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {Particula[]} particulas
 */
export function dibujarParticulas(ctx, canvas, particulas)
{
    particulas.forEach(p =>
    {
        // movemos la partícula
        p.x += p.vx
        p.y += p.vy

        // si sale por un lado, reaparece por el otro
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // dibujamos la partícula como un triángulo con rotación aleatoria
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotacion)
        ctx.beginPath()
        ctx.moveTo(0, -p.radio * 2)
        ctx.lineTo(p.radio * 1.73, p.radio)
        ctx.lineTo(-p.radio * 1.73, p.radio)
        ctx.closePath()
        ctx.fillStyle = `rgba(220, 220, 220, ${p.opacidad})`
        ctx.fill()
        ctx.restore()
    })
}

/**
 * Dibuja los píxeles que forman las letras, con idle y distorsión por ratón
 * @param {CanvasRenderingContext2D} ctx
 * @param {PartiiculaLetra[]} particulasLetras
 * @param {number} ratonX
 * @param {number} ratonY
 */
export function dibujarParticulasLetras(ctx, particulasLetras, ratonX, ratonY)
{
    ctx.shadowBlur  = 8
    ctx.shadowColor = '#F5A623'

    particulasLetras.forEach(p =>
    {
        // posición interpolada según el progreso
        const x = p.x + (p.destinoX - p.x) * p.progreso
        const y = p.y + (p.destinoY - p.y) * p.progreso

        // idle oscilando para que los píxeles no estén quietos del todo
        const idleX = Math.sin(gsap.ticker.time * 2 + p.fase) * 1.5
        const idleY = Math.cos(gsap.ticker.time * 1.5 + p.fase) * 1.5

        // distorsión: calculamos distancia al ratón
        const dx = x - ratonX
        const dy = y - ratonY
        const distancia = Math.sqrt(dx * dx + dy * dy)
        const radio = 167  // radio de influencia del ratón (sixeven jaja)

        // calculamos el offset objetivo según la distancia al ratón
        let targetOffsetX = 0
        let targetOffsetY = 0

        if (distancia < radio && distancia > 0)
        {
            const fuerza = (1 - distancia / radio) * 30
            targetOffsetX = (dx / distancia) * fuerza
            targetOffsetY = (dy / distancia) * fuerza
        }

        // lerp asimétrico: rápido al distorsionar, lento al volver
        if (distancia < radio && distancia > 0)
        {
            p.offsetX += (targetOffsetX - p.offsetX) * 0.15
            p.offsetY += (targetOffsetY - p.offsetY) * 0.15
        }
        else
        {
            p.offsetX += (0 - p.offsetX) * 0.02
            p.offsetY += (0 - p.offsetY) * 0.02
        }

        ctx.globalAlpha = p.opacidad
        ctx.fillStyle   = '#F5A623'
        ctx.fillRect(x + p.offsetX + idleX - 2, y + p.offsetY + idleY - 2, 4, 4)
    })

    ctx.globalAlpha = 1
    ctx.shadowBlur  = 0
}

/**
 * Efecto CRT: líneas de escaneo horizontales sobre todo el canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 */
export function dibujarScanlines(ctx, canvas)
{
    // cada 4px una línea semitransparente oscura, le da aurilla uwu
    for (let y = 0; y < canvas.height; y += 4)
    {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
        ctx.fillRect(0, y, canvas.width, 2)
    }
}
