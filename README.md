# RazonaPro - Frontend

Plataforma de preparación Saber Pro de la Universidad Francisco de Paula Santander Ocaña (UFPSO).

## Tecnologías

- [Astro](https://astro.build/) v6
- [Tailwind CSS](https://tailwindcss.com/) v4
- [TypeScript](https://www.typescriptlang.org/)
- Node.js >= 22.12.0

## Requisitos

- Node.js `>=22.12.0`
- npm `>=9`
- Backend Spring Boot corriendo en `http://localhost:8080` (o configurable vía `.env`)

## Configuración

Copia el archivo de ejemplo y ajusta la URL del backend:

```bash
cp env.example .env
```

```env
PUBLIC_API_URL=http://localhost:8080
```

## Comandos

| Comando             | Descripción                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Inicia el servidor de desarrollo     |
| `npm run build`     | Genera el build de producción        |
| `npm run preview`   | Previsualiza el build localmente     |

## Estructura del proyecto

```text
razonapro/
├── public/                        # Archivos estáticos (favicon, imágenes)
├── src/
│   ├── assets/                    # SVGs e imágenes del proyecto
│   ├── components/
│   │   ├── layout/                # Componentes estructurales
│   │   │   ├── AccessibilityWidget.astro
│   │   │   ├── Sidebar.astro
│   │   │   └── Topbar.astro
│   │   └── ui/                    # Componentes reutilizables
│   │       ├── CompetenceBar.astro
│   │       ├── EmptyState.astro
│   │       ├── RankingRow.astro
│   │       ├── Skeleton.astro
│   │       ├── StatCard.astro
│   │       ├── TestCard.astro
│   │       ├── TriedRow.astro
│   │       └── WelcomeModal.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Layout base (HTML, fuentes, accesibilidad)
│   │   ├── AppLayout.astro        # Layout con sidebar + topbar (autenticado)
│   │   └── AdminLayout.astro      # Wrapper de AppLayout para rutas /admin/*
│   ├── lib/
│   │   ├── api/                   # Clientes de API por dominio
│   │   │   ├── client.ts          # apiFetch base con manejo de errores y JWT
│   │   │   ├── auth.api.ts
│   │   │   ├── students.api.ts
│   │   │   ├── admins.api.ts
│   │   │   ├── tests.api.ts
│   │   │   ├── trieds.api.ts
│   │   │   ├── competences.api.ts
│   │   │   ├── programs.api.ts
│   │   │   ├── rankings.api.ts
│   │   │   ├── stats.api.ts
│   │   │   ├── ai-trieds.api.ts
│   │   │   ├── appeals.api.ts
│   │   │   ├── types.ts           # DTOs y tipos compartidos
│   │   │   └── index.ts
│   │   ├── auth.ts                # Gestión de sesión JWT (localStorage)
│   │   ├── constants.ts           # Paleta de competencias, modos de test
│   │   ├── toast.ts               # Sistema de notificaciones toast
│   │   └── utils.ts               # Utilidades: estilos, fechas, animaciones
│   ├── pages/
│   │   ├── index.astro            → /         (landing)
│   │   ├── auth.astro             → /auth     (login / registro / recuperación)
│   │   ├── verify-email.astro     → /verify-email
│   │   ├── reset-password.astro   → /reset-password
│   │   ├── about.astro            → /about
│   │   ├── tyc.astro              → /tyc
│   │   ├── 404.astro
│   │   ├── dashboard/
│   │   │   ├── index.astro        → /dashboard
│   │   │   ├── history.astro      → /dashboard/history
│   │   │   ├── rankings.astro     → /dashboard/rankings
│   │   │   ├── profile.astro      → /dashboard/profile
│   │   │   └── help.astro         → /dashboard/help
│   │   ├── tests/
│   │   │   ├── index.astro        → /tests
│   │   │   ├── exam.astro         → /tests/exam
│   │   │   ├── [competenceKey]/
│   │   │   │   └── index.astro    → /tests/lc, /tests/rq, etc.
│   │   │   └── review/
│   │   │       └── [triedId].astro → /tests/review/:id
│   │   ├── ai-practice/
│   │   │   ├── index.astro        → /ai-practice
│   │   │   └── exam.astro         → /ai-practice/exam
│   │   └── admin/
│   │       ├── home.astro         → /admin/home
│   │       ├── stats.astro        → /admin/stats
│   │       ├── students.astro     → /admin/students
│   │       ├── tests.astro        → /admin/tests
│   │       ├── questions.astro    → /admin/questions
│   │       ├── competences.astro  → /admin/competences
│   │       ├── programs.astro     → /admin/programs
│   │       ├── admins.astro       → /admin/admins
│   │       ├── rankings.astro     → /admin/rankings
│   │       ├── trieds.astro       → /admin/trieds
│   │       ├── doubts.astro       → /admin/doubts
│   │       ├── appeals.astro      → /admin/appeals
│   │       ├── ai.astro           → /admin/ai
│   │       ├── profile.astro      → /admin/profile
│   │       └── help.astro         → /admin/help
│   ├── styles/
│   │   └── global.css             # Design system: tokens, temas, a11y, utilidades
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```
## Características principales

### Para estudiantes
- **Dashboard** con estadísticas personales, progreso por competencia y ranking
- **Pruebas Saber Pro** en tres modos: Práctica, Examen y Cronometrado
- **Sistema anti-fraude** en modos Examen y Cronometrado (detección de cambio de ventana)
- **Práctica adaptativa con IA** (IRT): dificultad ajustada en tiempo real, pistas progresivas
- **Historial** de intentos con retroalimentación de un solo uso
- **Rankings** por periodo y fuente de datos
- **Apelaciones** para reactivación de cuenta

### Para administradores
- Gestión completa de estudiantes, tests, preguntas, competencias y programas
- Banco de preguntas con soporte multicompetencia
- Estadísticas globales y análisis de rendimiento por pregunta
- Revisión de intentos, dudas reportadas y sesiones IA
- Módulo de administradores con control de acceso por rol

### Sistema de accesibilidad
Widget flotante con las siguientes opciones sin recarga de página:
- Tamaño de texto (5 niveles)
- Modos de contraste (claro, oscuro, alto contraste, invertido, luz, oscuro+)
- Espaciado de letras y altura de línea
- Fuentes: Lora (predeterminada), Poppins, Lexend (apta para dislexia)
- Saturación de color y simulación de daltonismo (deuteranopia, protanopia, tritanopia)
- Cursor grande, resaltado de enlaces, máscara y guía de lectura

## Créditos

**Trabajo de Grado - Ingeniería de Sistemas, UFPSO**

- Fabian Rojas · Código: 0192270
- Andres Gomez · Código: 0192250
- Director: Duván Andrey Márquez Pinzón
