# ClinicMind

Sistema de gestión de pacientes para profesionales de salud mental. Combina un sitio web publico para la Lic. Micaela Vulcano con un dashboard privado multi-tenant donde cada profesional registrado administra sus propios pacientes, sesiones y citas.

## Tech stack

- **Next.js 16** (App Router) — framework full-stack
- **TypeScript** — tipado estricto en todo el proyecto
- **Prisma 7** — ORM con PostgreSQL
- **NextAuth.js v5** — autenticacion con credentials provider (JWT)
- **Tailwind CSS v4** — estilos utilitarios con tema personalizado
- **Zod v4** — validacion de formularios
- **@uiw/react-md-editor** — editor Markdown para notas de sesion
- **Resend** — emails transaccionales (notificaciones de feedback)
- **Docker** — contenedores para desarrollo y produccion
- **Vercel** — deploy con CI automatico en push a main

## Arquitectura

```
src/
├── app/
│   ├── (public)/           # Sitio publico (Navbar + Footer)
│   │   ├── page.tsx        # Home
│   │   ├── about/          # Sobre mi
│   │   ├── servicios/      # Servicios
│   │   ├── blog/           # Blog con MDX
│   │   ├── contacto/       # Contacto
│   │   └── test/           # Test interactivo
│   ├── login/              # Login
│   ├── register/           # Registro de profesional
│   ├── dashboard/          # Panel privado (protegido por middleware)
│   │   ├── page.tsx        # Resumen: pacientes activos, citas de hoy, sesiones recientes
│   │   ├── pacientes/      # CRUD de pacientes + perfil clinico
│   │   ├── citas/          # Gestion de citas
│   │   ├── feedback/       # Formulario de feedback → email al desarrollador
│   │   └── perfil/         # Configuracion del profesional
│   └── api/auth/           # NextAuth route handler
├── components/
│   ├── dashboard/          # Sidebar, PatientTabs, StatusChanger, formularios
│   └── *.tsx               # Componentes publicos (Navbar, Footer, etc.)
├── lib/
│   ├── prisma.ts           # Singleton de PrismaClient con adapter PG
│   ├── db.ts               # Helper getDb(userId) para multi-tenancy
│   ├── auth.ts             # Configuracion NextAuth v5
│   ├── email.ts            # Cliente Resend
│   ├── validations.ts      # Schemas Zod para todos los formularios
│   └── actions/            # Server Actions (auth, patients, sessions, appointments, feedback, profile)
├── generated/prisma/       # Cliente Prisma generado (gitignored)
└── middleware.ts            # Proteccion de rutas /dashboard/*
```

### Multi-tenancy

Cada profesional registrado solo ve sus propios datos. Todas las queries de Prisma en Server Actions filtran por `userId: session.user.id`. El helper `getDb(userId)` abstrae el acceso para facilitar una futura migracion a bases de datos por tenant.

### Base de datos

```
User ──< Patient ──< Session
                  ──< Appointment
                  ──< Document
                  ──< ClinicalProfile (1:1)
User ──< Feedback
```

Enums: `Plan`, `PatientStatus`, `SessionStatus`, `PaymentStatus`, `AppointmentStatus`, `FeedbackType`, `Priority`, `FeedbackStatus`.

## Inicio rapido

### Opcion A: Con Docker (recomendado)

Solo necesitas Docker instalado. Un comando levanta todo:

```bash
make docker-init
```

Esto hace: build de la imagen → levanta Postgres + app → crea tablas → inserta datos de ejemplo.

La app queda corriendo en [http://localhost:3000](http://localhost:3000).

Para detener:

```bash
make docker-down
```

> Si necesitas pasar `AUTH_SECRET` u otras variables, crealas en un `.env` en la raiz y docker compose las levanta automaticamente.

### Opcion B: Sin Docker (desarrollo local)

#### 1. Clonar e instalar

```bash
git clone <repo-url> && cd clinic-mind
make install
```

#### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Variables requeridas:

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL |
| `AUTH_SECRET` | Secret para NextAuth (generar con `openssl rand -base64 32`) |
| `AUTH_URL` | URL de la app (`http://localhost:3000` en dev) |
| `RESEND_API_KEY` | API key de Resend para emails (opcional en dev) |
| `DEVELOPER_EMAIL` | Email que recibe notificaciones de feedback (opcional en dev) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (opcional) |

#### 3. Setup de base de datos

Necesitas un PostgreSQL corriendo. Luego:

```bash
make setup
```

Esto ejecuta: `install` → `db-generate` → `db-push` → `db-seed`.

#### 4. Desarrollo

```bash
make dev
```

### Datos de ejemplo

El seed crea un usuario demo:
- **Email:** `demo@ejemplo.com`
- **Password:** `demo1234`

Con 3 pacientes, 5 sesiones con notas Markdown, 2 citas y 1 feedback de ejemplo.

### URLs

- Sitio publico: [http://localhost:3000](http://localhost:3000)
- Login: [http://localhost:3000/login](http://localhost:3000/login)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Comandos disponibles

### Desarrollo local

| Comando | Descripcion |
|---|---|
| `make dev` | Servidor de desarrollo |
| `make build` | Build de produccion |
| `make start` | Iniciar build de produccion |
| `make lint` | Ejecutar ESLint |
| `make setup` | Setup inicial completo (install + db) |

### Base de datos

| Comando | Descripcion |
|---|---|
| `make db-generate` | Generar cliente Prisma |
| `make db-push` | Sincronizar schema con la DB (sin migraciones) |
| `make db-migrate` | Crear y aplicar migracion |
| `make db-seed` | Insertar datos de ejemplo |
| `make db-studio` | Abrir Prisma Studio (GUI de la DB) |
| `make db-reset` | Resetear DB y re-aplicar migraciones |

### Docker

| Comando | Descripcion |
|---|---|
| `make docker-init` | Primera vez: build + up + setup DB completo |
| `make docker-build` | Buildear imagen |
| `make docker-up` | Levantar contenedores (app + db) |
| `make docker-down` | Detener y remover contenedores |
| `make docker-setup` | Crear tablas + seed (requiere db corriendo) |
| `make docker-logs` | Ver logs de la app en tiempo real |

### Deploy y DB remota

| Comando | Descripcion |
|---|---|
| `make deploy` | Deploy a produccion en Vercel |
| `make preview` | Deploy preview en Vercel |
| `make logs` | Ver logs de produccion |
| `make vercel-env-pull` | Descargar variables de entorno de Vercel |
| `make db-push-prod` | Aplicar schema a la DB de produccion |
| `make db-seed-prod` | Insertar datos de ejemplo en produccion |
| `make db-setup-prod` | Push + seed en produccion (primera vez) |

## Rutas del dashboard

| Ruta | Funcion |
|---|---|
| `/dashboard` | Resumen: pacientes activos, sesiones del mes, pagos pendientes, citas de hoy |
| `/dashboard/pacientes` | Lista de pacientes con busqueda y filtro por estado |
| `/dashboard/pacientes/nuevo` | Formulario nuevo paciente (info + perfil clinico) |
| `/dashboard/pacientes/[id]` | Detalle del paciente con tabs: Info, Sesiones, Citas |
| `/dashboard/pacientes/[id]/sesiones/nueva` | Nueva sesion con editor Markdown |
| `/dashboard/citas` | Proximas citas + formulario para agendar |
| `/dashboard/feedback` | Reportar bugs o sugerir mejoras (envia email) |
| `/dashboard/perfil` | Editar nombre, profesion y matricula |

## CI/CD

### GitHub Actions

Cada push a `main` y cada PR ejecuta automaticamente:
1. `npm ci` — instala dependencias
2. `prisma generate` — genera cliente Prisma
3. `npm run lint` — linting
4. `npm run build` — build de produccion

El workflow esta en `.github/workflows/ci.yml`.

### Vercel

El proyecto esta conectado al repo de GitHub. Vercel hace deploy automatico:
- **Push a `main`** → deploy a produccion
- **Push a otra branch / PR** → deploy preview

Para que funcione necesitas:
1. Tener el proyecto linkeado en Vercel (`vercel link`)
2. Configurar las variables de entorno en el dashboard de Vercel:
   - `DATABASE_URL` — desde Neon u otro Postgres del Marketplace
   - `AUTH_SECRET`
   - `AUTH_URL` — URL de produccion
   - `RESEND_API_KEY` (opcional)
   - `DEVELOPER_EMAIL` (opcional)
