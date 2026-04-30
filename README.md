# Alergia Sonora

Web oficial de **Alergia Sonora**, organizadora de ruiditos que escucharás en las criptas, o detrás de tu jardín ;), como **Alergia**, **Catarro** o *[REDACTED]*

## Stack

- [SvelteKit](https://kit.svelte.dev/) — framework frontend
- [GSAP](https://gsap.com/) — animaciones
- [Tailwind CSS](https://tailwindcss.com/) — estilos
- [Sanity](https://www.sanity.io/) — CMS headless (gestión de contenido)

## Instalación

```bash
cd alegria_sonora
npm install
npm run dev
```

El studio de Sanity tiene sus propias dependencias:

```bash
cd alegria_sonora/studio
npm install
npx sanity dev
```

## Estructura

```plaintext
alegria_sonora/
├── src/
│   ├── lib/
│   │   ├── animations/     # funciones de animación GSAP
│   │   ├── components/     # componentes Svelte
│   │   ├── queries.js      # queries GROQ para Sanity
│   │   └── sanity.js       # cliente de Sanity
│   └── routes/             # páginas de la app
└── studio/
    └── schemaTypes/        # schemas del CMS (edicion, artista, actuacion...)
```

## Licencia

© 2026 Mark Sandiumenge Villoria. El código de este proyecto está bajo licencia [MIT + Commons Clause](https://commonsclause.com/), lo que permite su uso libre pero prohíbe su uso comercial.  
Las imágenes, vídeos y demás contenido pertenecen a sus respectivos organizadores y autores y es usado en este proyecto con el permiso de los mismos.
