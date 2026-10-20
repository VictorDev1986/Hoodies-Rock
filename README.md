# Hoodies Rock

E-commerce de ropa y accesorios musicales construido con Next.js 16, TypeScript y Tailwind CSS.

## Descripción

Hoodies Rock es una tienda online de camisetas, buzos, gorras y mugs inspirados en la música. Incluye:

- **Tienda pública**: Catálogo con filtros, carrito y checkout
- **Panel de usuario**: Perfil, historial de pedidos y direcciones
- **Panel de administración**: Gestión de productos, usuarios y pedidos

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| Next.js 16 | Framework (App Router) |
| TypeScript | Lenguaje |
| Tailwind CSS v4 | Estilos |
| shadcn/ui | Componentes UI |
| Prisma | ORM y migraciones |
| Supabase | PostgreSQL y base de datos |
| Zustand | Estado global |
| NextAuth.js | Autenticación |

## Requisitos

- Node.js 18+
- Proyecto de Supabase con PostgreSQL

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd Hoodies-Rock

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear .env.local y agregar las credenciales de Supabase:
# DATABASE_URL: pooler de transacciones, puerto 6543
# DIRECT_URL: pooler de sesiones para migraciones, puerto 5432

# Aplicar migraciones en Supabase
npx prisma migrate deploy

# Sembrar datos iniciales
npm run db:seed
```

### Variables de entorno

No subas `.env` ni `.env.local` al repositorio. Configura estas variables localmente
y también en Vercel:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[POOLER-HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[POOLER-HOST]:5432/postgres"
AUTH_SECRET="tu-clave-segura"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`DATABASE_URL` se usa para las consultas de la aplicación y `DIRECT_URL` para
las migraciones de Prisma. Si la contraseña contiene caracteres especiales,
codifícalos para URL, por ejemplo `#` como `%23` y `@` como `%40`.

### Flujo de base de datos

```bash
# Crear una migración durante el desarrollo
npx prisma migrate dev --name nombre_del_cambio

# Aplicar migraciones existentes en Supabase o producción
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio
```

## Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |

## Estructura del Proyecto

```
src/
├── app/
│   ├── (shop)/          # Rutas públicas (tienda)
│   ├── (admin-panel)/   # Panel de administración
│   ├── (auth)/          # Login y registro
│   └── api/             # API Routes
├── components/
│   ├── ui/              # shadcn/ui
│   ├── layout/          # Header, Footer, Nav
│   ├── products/        # Componentes de productos
│   ├── cart/            # Carrito
│   └── admin/           # Panel admin
├── data/                # Datos mock
├── lib/                 # Utilidades
├── stores/              # Zustand stores
└── types/               # Tipos TypeScript
```

## Documentación

- [PRD](./docs/PRD.md) - Documento de requisitos del producto
- [Plan](./docs/PLAN.md) - Plan de implementación
- [Modelo de datos](./docs/DATA-MODEL.md) - Schema de base de datos
- [Páginas](./docs/PAGES.md) - Listado de rutas y endpoints

## Licencia

MIT
