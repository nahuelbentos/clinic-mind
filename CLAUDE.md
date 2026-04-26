@AGENTS.md

# ClinicMind — Resumen del proyecto

Sistema de gestión de pacientes para profesionales de salud mental. Combina un sitio web público para la Lic. Micaela Vulcano con un dashboard privado multi-tenant donde cada profesional registrado administra sus propios pacientes, sesiones y citas.

## Tech stack

- **Next.js 16** (App Router) — framework full-stack
- **TypeScript** — tipado estricto en todo el proyecto
- **Prisma 7** + **PostgreSQL** — ORM y base de datos
- **NextAuth.js v5** — autenticación con credentials provider (JWT)
- **Tailwind CSS v4** — estilos utilitarios con tema personalizado
- **Zod v4** — validación de formularios y Server Actions
- **@uiw/react-md-editor** — editor Markdown para notas de sesión
- **Resend** — emails transaccionales (notificaciones de feedback)
- **Docker** — contenedores para desarrollo y producción
- **Vercel** — deploy con CI automático en push a `main`

## Arquitectura

```
src/
├── app/
│   ├── (public)/           # Sitio público (Navbar + Footer)
│   │   ├── page.tsx        # Home
│   │   ├── about/          # Sobre mí
│   │   ├── servicios/      # Servicios
│   │   ├── blog/           # Blog con MDX
│   │   ├── contacto/       # Contacto
│   │   └── test/           # Test interactivo
│   ├── login/              # Login
│   ├── register/           # Registro de profesional
│   ├── dashboard/          # Panel privado (protegido por middleware)
│   │   ├── page.tsx        # Resumen: pacientes activos, citas de hoy, sesiones recientes
│   │   ├── pacientes/      # CRUD de pacientes + perfil clínico
│   │   ├── citas/          # Gestión de citas
│   │   ├── feedback/       # Formulario de feedback → email al desarrollador
│   │   └── perfil/         # Configuración del profesional
│   └── api/auth/           # NextAuth route handler
├── components/
│   ├── dashboard/          # Sidebar, PatientTabs, StatusChanger, formularios
│   └── *.tsx               # Componentes públicos (Navbar, Footer, etc.)
├── lib/
│   ├── prisma.ts           # Singleton de PrismaClient con adapter PG
│   ├── db.ts               # Helper getDb(userId) para multi-tenancy
│   ├── auth.ts             # Configuración NextAuth v5
│   ├── email.ts            # Cliente Resend
│   ├── validations.ts      # Schemas Zod para todos los formularios
│   └── actions/            # Server Actions (auth, patients, sessions, appointments, feedback, profile)
├── generated/prisma/       # Cliente Prisma generado (gitignored)
└── middleware.ts            # Protección de rutas /dashboard/*
```

## Multi-tenancy

Cada profesional registrado solo ve sus propios datos. Todas las queries de Prisma en Server Actions filtran por `userId: session.user.id`. El helper `getDb(userId)` abstrae el acceso para facilitar una futura migración a bases de datos por tenant.

## Modelo de datos

```
User ──< Patient ──< Session
                  ──< Appointment
                  ──< Document
                  ──< ClinicalProfile (1:1)
User ──< Feedback
```

Enums clave: `Plan` (FREE/PRO), `PatientStatus`, `SessionStatus`, `PaymentStatus`, `AppointmentStatus`, `FeedbackType`, `Priority`, `FeedbackStatus`.

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL |
| `AUTH_SECRET` | Secret para NextAuth |
| `AUTH_URL` | URL de la app |
| `RESEND_API_KEY` | API key de Resend (opcional en dev) |
| `DEVELOPER_EMAIL` | Email que recibe notificaciones de feedback (opcional en dev) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID (opcional) |

## Inicio rápido

```bash
# Con Docker (recomendado)
make docker-init

# Sin Docker
make setup   # install + db-generate + db-push + db-seed
make dev
```

Usuario demo: `demo@ejemplo.com` / `demo1234`

## Comandos útiles

```bash
make dev            # Servidor de desarrollo
make build          # Build de producción
make db-studio      # GUI de la base de datos (Prisma Studio)
make db-seed        # Insertar datos de ejemplo
make docker-init    # Primera vez con Docker
make deploy         # Deploy a producción en Vercel
```

## Rutas del dashboard

| Ruta | Función |
|---|---|
| `/dashboard` | Resumen general |
| `/dashboard/pacientes` | Lista con búsqueda y filtro |
| `/dashboard/pacientes/nuevo` | Nuevo paciente + perfil clínico |
| `/dashboard/pacientes/[id]` | Detalle: Info, Sesiones, Citas |
| `/dashboard/pacientes/[id]/sesiones/nueva` | Nueva sesión (editor Markdown) |
| `/dashboard/citas` | Próximas citas + agendar |
| `/dashboard/feedback` | Reportar bugs / sugerir mejoras |
| `/dashboard/perfil` | Editar datos del profesional |

## CI/CD

- **GitHub Actions** (`.github/workflows/ci.yml`): lint + build en cada push/PR a `main`
- **Vercel**: deploy automático a producción en push a `main`, preview en otras branches
