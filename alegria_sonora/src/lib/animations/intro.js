import { Application, Graphics, RenderTexture, Sprite, Container, ParticleContainer, Particle, Texture } from 'pixi.js'
import gsap from 'gsap'

/**
 * @typedef {{ particle: Particle, vx: number, vy: number, rotSpeed: number }} Particula
 * @typedef {{ spriteGlow: Sprite, spriteCore: Sprite, x: number, y: number, destinoX: number, destinoY: number, progreso: number, opacidad: number, offsetX: number, offsetY: number, linea: number, faseAleatoria: number }} ParticulaLetra
 */

// === TEXTURAS BASE (SE GENERAN UNA SOLA VEZ) ================================

/**
 * Crea la textura de un triángulo pequeño para las partículas de fondo.
 * Se reutiliza para todos los Particle del ParticleContainer.
 * @param {Application} app
 * @returns {Texture}
 */
function crearTexturaTriangulo(app)
{
    const g = new Graphics()
    g.poly([0, -4, 3.46, 2, -3.46, 2]).fill(0xdcdcdc)
    const tex = app.renderer.generateTexture(g)
    g.destroy()
    return tex
}

/**
 * Crea la textura de un cuadrado difuso (glow) y otro nítido (core)
 * para las partículas de letra, evitando shadowBlur en Canvas 2D.
 * @param {Application} app
 * @returns {{ texGlow: Texture, texCore: Texture }}
 */
function crearTexturasLetra(app)
{
    // glow: cuadrado grande y semitransparente
    const gGlow = new Graphics()
    gGlow.rect(0, 0, 10, 10).fill(0xffffff)
    const texGlow = app.renderer.generateTexture(gGlow)
    gGlow.destroy()

    // core: cuadrado pequeño y nítido
    const gCore = new Graphics()
    gCore.rect(0, 0, 4, 4).fill(0xffffff)
    const texCore = app.renderer.generateTexture(gCore)
    gCore.destroy()

    return { texGlow, texCore }
}

/**
 * Genera la textura de scanlines CRT una sola vez en un RenderTexture.
 * En el loop es un sprite estático — un único draw call.
 * @param {Application} app
 * @returns {Sprite}
 */
function crearSpriteScanlines(app)
{
    const { width, height } = app.screen
    const rt = RenderTexture.create({ width, height })

    const g = new Graphics()
    for (let y = 0; y < height; y += 4)
        g.rect(0, y, width, 2).fill({ color: 0x000000, alpha: 0.15 })

    app.renderer.render({ container: g, target: rt })
    g.destroy()

    return new Sprite(rt)
}

// === SETUP DE PARTÍCULAS DE FONDO ==========================================

/**
 * Crea el ParticleContainer con las partículas triangulares de fondo.
 * ParticleContainer hace un único draw call en GPU para todos los Particle.
 * @param {Application} app
 * @param {Texture} texTriangulo
 * @param {number} NUM
 * @returns {{ container: ParticleContainer, particulas: Particula[] }}
 */
function crearParticulasFondo(app, texTriangulo, NUM)
{
    const { width, height } = app.screen
    const container = new ParticleContainer()

    const particulas = Array.from({ length: NUM }, () =>
    {
        const escala   = Math.random() * 0.75 + 0.25
        const particle = new Particle({
            texture:  texTriangulo,
            x:        Math.random() * width,
            y:        Math.random() * height,
            scaleX:   escala,
            scaleY:   escala,
            rotation: Math.random() * Math.PI * 2,
            alpha:    Math.random() * 0.5 + 0.2,
            anchorX:  0.5,
            anchorY:  0.5,
        })
        container.addParticle(particle)

        return {
            particle,
            vx:       (Math.random() - 0.5) * 0.4,
            vy:       (Math.random() - 0.5) * 0.4,
            rotSpeed: (Math.random() - 0.5) * 0.01,
        }
    })

    return { container, particulas }
}

// === SETUP DE PARTÍCULAS DE LETRAS =========================================

/**
 * Lee los píxeles del texto renderizado en un canvas oculto 2D
 * y devuelve las posiciones donde hay letra.
 * Este trabajo ocurre solo una vez al montar, no en el loop.
 * @param {number} width
 * @param {number} height
 * @param {string} linea1
 * @param {string} linea2
 * @returns {{ x: number, y: number, linea: number }[]}
 */
function leerPosicionesLetras(width, height, linea1, linea2)
{
    const canvasOculto = document.createElement('canvas')
    canvasOculto.width  = width
    canvasOculto.height = height
    const ctx = canvasOculto.getContext('2d')
    if (!ctx) return []

    const tamano     = Math.min(width / 5, 200)
    const separacion = tamano * 1.2

    ctx.font         = `bold ${tamano}px sans-serif`
    ctx.fillStyle    = '#F5A623'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(linea1, width / 2, height / 2 - separacion / 2)
    ctx.fillText(linea2, width / 2, height / 2 + separacion / 2)

    const { data } = ctx.getImageData(0, 0, width, height)
    const posiciones = []

    for (let y = 0; y < height; y += 6)
        for (let x = 0; x < width; x += 6)
            if (data[(y * width + x) * 4 + 3] > 128)
                posiciones.push({ x, y, linea: y < height / 2 ? 1 : 2 })

    return posiciones
}

/**
 * Crea los sprites de glow + core para cada posición de letra
 * y los anima con GSAP hacia su destino.
 * @param {{ texGlow: Texture, texCore: Texture }} texturas
 * @param {{ x: number, y: number, linea: number }[]} posicionesLetras
 * @param {number} width
 * @param {number} height
 * @returns {{ containerLetras: Container, particulasLetras: ParticulaLetra[] }}
 */
function crearParticulasLetras({ texGlow, texCore }, posicionesLetras, width, height)
{
    const containerLetras = new Container()

    const particulasLetras = posicionesLetras.map(destino =>
    {
        const spriteGlow = new Sprite(texGlow)
        spriteGlow.anchor.set(0.5)
        spriteGlow.alpha = 0

        const spriteCore = new Sprite(texCore)
        spriteCore.anchor.set(0.5)
        spriteCore.alpha = 0

        containerLetras.addChild(spriteGlow)
        containerLetras.addChild(spriteCore)

        const p = {
            spriteGlow,
            spriteCore,
            x:              Math.random() * width,
            y:              Math.random() * height,
            destinoX:       destino.x,
            destinoY:       destino.y,
            progreso:       0,
            opacidad:       0,
            offsetX:        0,
            offsetY:        0,
            linea:          destino.linea,
            faseAleatoria:  (Math.random() - 0.5) * 1.2 // offset aleatorio pa cada partícula
        }

        gsap.to(p, {
            progreso: 1,
            opacidad: 1,
            duration: 2.5,
            delay:    Math.random() * 1.85,
            ease:     'power2.out',
        })

        return p
    })

    return { containerLetras, particulasLetras }
}

// === LOOP DE ANIMACIÓN =====================================================

/**
 * Actualiza posición y rotación de cada partícula de fondo.
 * @param {Particula[]} particulas
 * @param {number} width
 * @param {number} height
 */
function tickParticulasFondo(particulas, width, height)
{
    for (const p of particulas)
    {
        p.particle.x        += p.vx
        p.particle.y        += p.vy
        p.particle.rotation += p.rotSpeed

        if (p.particle.x < 0)      p.particle.x = width
        if (p.particle.x > width)  p.particle.x = 0
        if (p.particle.y < 0)      p.particle.y = height
        if (p.particle.y > height) p.particle.y = 0
    }
}

/**
 * Actualiza posición, idle y distorsión por ratón de cada partícula de letra.
 * @param {ParticulaLetra[]} particulasLetras
 * @param {number} ratonX
 * @param {number} ratonY
 */
function tickParticulasLetras(particulasLetras, ratonX, ratonY)
{
    const t = performance.now() / 1000 // gsap.ticker.time se pausaba cuando todas las particulas habían llegado a su destino

    for (const p of particulasLetras)
    {
        const x = p.x + (p.destinoX - p.x) * p.progreso
        const y = p.y + (p.destinoY - p.y) * p.progreso

        /**
         * lambda controla cuantas olas hay en cada palabra, más pequeño = más olas y viceversa
         * signo controla la dirección del viaje de la ola, -1 de izqueirda a derecha y 1 de derecha a izquierda
         * idle controla el desplazamiento de cada particula en cada eje, con signo * p.destino / lambda hacemos que
         * cada columna de partículas este desfasada con sus vecinas y así hacemos el efecto de ola.
         */
        const lambda = 60 
        const signo  = p.linea === 1 ? -1 : 1
        const idleX  = Math.cos(t * 2 + signo * p.destinoX / lambda + p.faseAleatoria) * 1.6 * p.progreso
        const idleY  = Math.sin(t * 2 + signo * p.destinoX / lambda + p.faseAleatoria) * 6   * p.progreso

        const dx        = x - ratonX
        const dy        = y - ratonY
        const distancia = Math.sqrt(dx * dx + dy * dy)
        const radio     = 167

        if (distancia < radio && distancia > 0)
        {
            const fuerza  = (1 - distancia / radio) * 30
            p.offsetX    += ((dx / distancia) * fuerza - p.offsetX) * 0.10
            p.offsetY    += ((dy / distancia) * fuerza - p.offsetY) * 0.10
        }
        else
        {
            p.offsetX += (0 - p.offsetX) * 0.01
            p.offsetY += (0 - p.offsetY) * 0.01
        }

        const fx = x + p.offsetX + idleX
        const fy = y + p.offsetY + idleY

        // cuánto se ha desplazado respecto al destino (0 = quieto, 1 = máximo)
        const desplazamiento = Math.min(Math.sqrt(p.offsetX ** 2 + p.offsetY ** 2) / 30, 1)

        // agitación extra que aumenta con el desplazamiento
        const glitchX = desplazamiento > 0.1 ? (Math.random() - 0.5) * desplazamiento * 8 : 0
        const glitchY = desplazamiento > 0.1 ? (Math.random() - 0.5) * desplazamiento * 8 : 0

        // por debajo del umbral se queda dorado, por encima glitchea
        let tint = 0xF5A623

        // array de colores de las partículas agitadas
        const colores = [
            0xFF0000,  // rojo
            0x00FFFF,  // cian
            0xFFFFFF,  // blanco
        ]

        if (desplazamiento > 0.10)
        {
            tint = colores[Math.floor(Math.random() * 3)]
        }

        // glow: semitransparente, simula el halo sin shadowBlur
        p.spriteGlow.x     = fx + glitchX
        p.spriteGlow.y     = fy + glitchY
        p.spriteGlow.alpha = p.opacidad * 0.35
        p.spriteGlow.tint  = tint

        // core: píxel nítido encima
        p.spriteCore.x     = fx + glitchX
        p.spriteCore.y     = fy + glitchY
        p.spriteCore.alpha = p.opacidad
        p.spriteCore.tint  = tint
    }
}

// === EXPORT ================================================================

/**
 * Inicializa la aplicación Pixi y monta toda la escena del intro.
 * Devuelve una función de cleanup para llamar desde onDestroy de Svelte.
 * @param {HTMLDivElement} contenedor
 * @param {string} linea1
 * @param {string} linea2
 * @returns {Promise<() => void>}
 */
export async function iniciarIntro(contenedor, linea1, linea2)
{
    // === PIXI APP ============================================================
    const app = new Application()
    await app.init({
        resizeTo:    contenedor,
        background:  0x0a0a0a,
        antialias:   false,
        resolution:  Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
    })
    contenedor.appendChild(app.canvas)

    const { width, height } = app.screen

    // === TEXTURAS (GENERADAS UNA SOLA VEZ) ==================================
    const texTriangulo         = crearTexturaTriangulo(app)
    const { texGlow, texCore } = crearTexturasLetra(app)

    // === CAPA 1: PARTÍCULAS DE FONDO ========================================
    const { container: containerFondo, particulas } = crearParticulasFondo(app, texTriangulo, 400)
    app.stage.addChild(containerFondo)

    // === CAPA 2: PARTÍCULAS DE LETRAS =======================================
    const posicionesLetras = leerPosicionesLetras(width, height, linea1, linea2)
    const { containerLetras, particulasLetras } = crearParticulasLetras({ texGlow, texCore }, posicionesLetras, width, height)
    app.stage.addChild(containerLetras)

    // === CAPA 3: EFECTO CRT ==================================================
    app.stage.addChild(crearSpriteScanlines(app))

    // === RATÓN ===============================================================
    let ratonX = -1000
    let ratonY = -1000
    const onMouseMove = (/** @type {MouseEvent} */ e) =>
    {
        ratonX = e.clientX
        ratonY = e.clientY
    }
    contenedor.addEventListener('mousemove', onMouseMove)

    // === TICKER ==============================================================
    app.ticker.add(() =>
    {
        tickParticulasFondo(particulas, app.screen.width, app.screen.height)
        tickParticulasLetras(particulasLetras, ratonX, ratonY)
    })

    // === CLEANUP =============================================================
    return () =>
    {
        contenedor.removeEventListener('mousemove', onMouseMove)
        app.destroy(true, { children: true, texture: true })
    }
}