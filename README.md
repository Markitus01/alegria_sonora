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

© 2026 Alegría Sonora. Este proyecto está bajo la licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
