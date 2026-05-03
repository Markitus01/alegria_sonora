import { writable } from 'svelte/store'
import gsap from 'gsap'

// estado global accesible desde cualquier componente
export const playing = writable(false) // si la música está sonando
export const artwork = writable('')    // url de la portada de la canción actual

/**
 * Tipo mínimo del SC Widget con los métodos que voy a enchichar.
 * SoundCloud no tiene tipos oficiales, así que los definimos a mano :P
 * @typedef {{ 
 * play: () => void, 
 * pause: () => void, 
 * skip: (index: number) => void, 
 * getSounds: (cb: (sounds: unknown[]) => void) => void, 
 * setVolume: (vol: number) => void, 
 * getCurrentSound: (cb: (sound: { artwork_url: string | null }) => void) => void, 
 * bind: (event: string, callback: () => void) => void 
 * }} SCWidget
 */


/** @type {SCWidget | null} */
let widget = null

/**
 * Registra el widget de SoundCloud una vez esté listo.
 * Arranca en volumen 0 y escucha el evento 'play' para actualizar la portada.
 * @param {SCWidget} w
 */
export function setWidget(w) {
    w.setVolume(0) // arrancamos en silencio, el fadeIn lo sube gradualmente
    widget = w

    // cada vez que empieza una canción, actualizamos la portada
    w.bind('play', () => {
        w.getCurrentSound(sound => {
            if (sound?.artwork_url)
                // SoundCloud devuelve '-large' (100x100), pedimos 200x200
                artwork.set(sound.artwork_url.replace('-large.', '-t200x200.'))
        })
    })
}

/**
 * Sube el volumen de 0 a 100 en el tiempo indicado.
 * Se llama desde Intro cuando las partículas empiezan a moverse.
 * @param {number} duration - segundos que tarda en llegar al volumen máximo
 */
export function fadeIn(duration) {
    if (!widget) return
    const w   = widget
    // GSAP no puede animar setVolume directamente, así que tweenamos
    // un objeto plano y llamamos setVolume en cada frame via onUpdate
    const obj = { vol: 0 }
    gsap.to(obj, {
        vol:      100,
        duration,
        ease:     'power1.inOut',
        onUpdate: () => w.setVolume(obj.vol),
    })
}

/**
 * Alterna entre play y pause, actualizando el store `playing`.
 * No hace nada si el widget todavía no está inicializado.
 */
export function togglePlay() {
    if (!widget) return
    // capturamos widget en local para que TypeScript sepa que no es null
    // dentro del callback (las variables de módulo pueden cambiar entre frames)
    const w = widget
    playing.update(p => {
        if (p) w.pause()
        else   w.play()
        return !p
    })
}