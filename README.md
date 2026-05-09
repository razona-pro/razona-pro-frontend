# RazonaPro

Plataforma de razonamiento lógico de la Universidad Francisco de Paula Santander Ocaña (UFPSO).

## Tecnologías

- [Astro](https://astro.build/) v6
- [Tailwind CSS](https://tailwindcss.com/) v4
- Node.js >= 22.12.0

## Requisitos

- Node.js `>=22.12.0`
- npm `>=9`


## Comandos

| Comando         | Descripción                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo   |
| `npm run build` | Genera el build de producción      |
| `npm run preview` | Previsualiza el build localmente |

## Estructura del proyecto

```
razanapro/
├── public/                 # Archivos estáticos (favicon, imágenes públicas)
├── src/
│   ├── assets/             # Imágenes y SVGs del proyecto
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.astro
│   │   └── Footer.astro
│   ├── layouts/            # Plantillas base de página
│   │   └── BaseLayout.astro
│   ├── pages/              # Rutas — cada archivo es una URL
│   │   ├── index.astro     → /
│   │   └── about.astro     → /about
│   ├── routes/             # Definición centralizada de rutas
│   │   └── index.ts
│   └── styles/             # Estilos globales
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```


