<script lang="ts">
    import { onMount } from 'svelte'
    import gsap from 'gsap'
    import { redimensionar, dibujarParticulas, dibujarParticulasLetras, dibujarScanlines } from '$lib/animations/intro.js'

    // referencia al elemento canvas del DOM
    let canvas = $state() as HTMLCanvasElement
    let visible = true
    // chorprecha jeje
    const linea1 = Math.random() < 0.001 ? 'ALEGRÍA' : 'ALERGIA'
    const linea2 = 'SONORA'

    // onMount se ejecuta cuando el componente ya está en el DOM, necesario pa poder pillar el canvas
    onMount(() =>
    {
        // obtenemos el contexto 2D del canvas para poder dibujar
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        // guardamos la refe para eliminarla en el cleaunup
        const onResize = () => redimensionar(canvas)
        // ejecutamos al montar y cada vez que se redimensione la ventana
        onResize()
        window.addEventListener('resize', onResize)

        let ratonX = -1000
        let ratonY = -1000

        canvas.addEventListener('mousemove', (e: MouseEvent) =>
        {
            ratonX = e.clientX
            ratonY = e.clientY
        })

        const NUM_PARTICULAS = 120
        // array de partículas con posición, velocidad y opacidad aleatorias
        const particulas = Array.from({ length: NUM_PARTICULAS }, () =>
        ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radio: Math.random() * 1.5 + 0.5,       // tamaño entre 0.5 y 2px
            vx: (Math.random() - 0.5) * 0.4,        // velocidad horizontal
            vy: (Math.random() - 0.5) * 0.4,        // velocidad vertical
            opacidad: Math.random() * 0.5 + 0.2,    // opacidad entre 0.2 y 0.7
            rotacion: Math.random() * Math.PI * 2   // orientación de los triangulos
        }))

        const tamano = Math.min(canvas.width / 5, 200)
        const separacion = tamano * 1.2  // espacio entre las dos líneas

        // canvas oculto donde dibujamos el texto para leer sus píxeles
        const canvasOculto = document.createElement('canvas')
        const ctxOculto = canvasOculto.getContext('2d') as CanvasRenderingContext2D
        canvasOculto.width = canvas.width
        canvasOculto.height = canvas.height

        // dibujamos las dos líneas en el canvas oculto
        ctxOculto.font = `bold ${tamano}px sans-serif`
        ctxOculto.fillStyle = '#F5A623'
        ctxOculto.textAlign = 'center'
        ctxOculto.textBaseline = 'middle'
        ctxOculto.fillText(linea1, canvas.width / 2, canvas.height / 2 - separacion / 2)
        ctxOculto.fillText(linea2, canvas.width / 2, canvas.height / 2 + separacion / 2)

        // leemos todos los píxeles del canvas oculto
        const imageData = ctxOculto.getImageData(0, 0, canvas.width, canvas.height)
        const pixeles = imageData.data // array con valores R,G,B,A por cada píxel

        // recorremos los píxeles y guardamos las posiciones donde hay letra
        // para no coger todos (serían miles), cogemos 1 de cada 6
        const posicionesLetras = []
        for (let y = 0; y < canvas.height; y += 6)
        {
            for (let x = 0; x < canvas.width; x += 6)
            {
                const indice = (y * canvas.width + x) * 4
                // si el píxel tiene opacidad (canal alpha > 128), es parte de la letra
                if (pixeles[indice + 3] > 128)
                {
                    posicionesLetras.push({ x, y })
                }
            }
        }

        // creamos partículas que empiezan en posiciones aleatorias
        // y tienen como destino una posición de la letra
        const particulasLetras = posicionesLetras.map(destino =>
        ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            destinoX: destino.x,
            destinoY: destino.y,
            progreso: 0,
            opacidad: 0,
            offsetX: 0,
            offsetY: 0,
            fase: Math.random() * Math.PI * 2
        }))

        // animamos todas las partículas hacia su destino con GSAP
        particulasLetras.forEach(p =>
        {
            gsap.to(p,
            {
                progreso: 1,
                opacidad: 1,
                duration: 3.5,
                delay: Math.random() * 2,   // cada partícula empieza en momento diferente
                ease: 'power2.out'          // desaceleración suave al llegar
            })
        })

        // guardamos referencia, gsap.ticker.remove necesita la misma que se pasa al add
        const onTick = () =>
        {
            // limpiamos el canvas antes de cada frame
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            dibujarParticulas(ctx, canvas, particulas)
            dibujarParticulasLetras(ctx, particulasLetras, ratonX, ratonY)
            dibujarScanlines(ctx, canvas)
        }

        gsap.ticker.add(onTick) // gsap.ticker es el bucle de animación de GSAP

        // el return limpia los listeners sobre objetos globales al destruirse el componente
        return () =>
        {
            window.removeEventListener('resize', onResize)
            gsap.ticker.remove(onTick)
        }
    })
</script>

{#if visible}
    <!-- contenedor del intro, ocupa toda la pantalla -->
    <div class="intro">
        <!-- bind:this nos da acceso al elemento canvas desde el script -->
        <canvas bind:this={canvas}></canvas>
    </div>
{/if}

<style>
    .intro
    {
        position: fixed;        /* fijo sobre todo el contenido */
        inset: 0;               /* ocupa toda la pantalla */
        background: #0a0a0a;
        cursor: pointer;
        z-index: 100;
    }

    canvas
    {
        width: 100%;
        height: 100%;
    }
</style>
