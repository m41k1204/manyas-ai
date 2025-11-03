# Manyas AI Frontend

Frontend de Manyas AI - Marketplace UGC construido con Next.js y React

## Tecnologías

- Next.js 14
- React 18
- Tailwind CSS
- Axios
- React Hook Form
- React Icons

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env.local` basado en `.env.example`:
```bash
cp .env.example .env.local
```

3. Editar `.env.local` y configurar la URL de la API:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Ejecutar

### Modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Construir para producción
```bash
npm run build
npm start
```

## Estructura del Proyecto

```
frontend/
├── app/                      # Pages y layouts de Next.js App Router
│   ├── dashboard/            # Dashboards por rol
│   │   ├── creator/         # Dashboard del creador
│   │   └── company/         # Dashboard de la empresa
│   ├── login/               # Página de login
│   ├── register/            # Página de registro
│   ├── globals.css          # Estilos globales
│   ├── layout.js            # Layout principal
│   └── page.js              # Landing page
├── components/              # Componentes reutilizables
│   └── dashboard/          # Componentes del dashboard
├── contexts/               # Context API de React
│   └── AuthContext.js     # Contexto de autenticación
├── lib/                   # Utilidades y helpers
│   └── api.js            # Cliente de API configurado
└── public/               # Archivos estáticos

```

## Características

### Sistema de Autenticación
- Registro de usuarios (Creador o Empresa)
- Inicio de sesión con JWT
- Protección de rutas
- Persistencia de sesión con localStorage

### Dashboard para Creadores
- Vista general con estadísticas
- Gestión de portafolio (videos y fotos)
- Búsqueda y aplicación a ofertas de trabajo
- Gestión de categorías
- Visualización de aplicaciones

### Dashboard para Empresas
- Vista general con estadísticas
- Creación y gestión de job openings
- Búsqueda de creadores por categorías
- Revisión de aplicaciones recibidas
- Gestión de perfil de empresa

### Sistema de Roles Dinámico
- Redirección automática según el rol del usuario
- Navegación adaptada por rol
- Componentes condicionales basados en permisos

## Deployment en Amplify (AWS)

1. Conectar el repositorio a AWS Amplify
2. Configurar las variables de entorno en Amplify:
   - `NEXT_PUBLIC_API_URL`: URL del backend
3. El build se ejecutará automáticamente con: `npm run build`
4. Amplify detectará automáticamente Next.js y configurará el hosting

### Configuración de Build en Amplify

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Variables de Entorno

- `NEXT_PUBLIC_API_URL`: URL del backend API (debe ser accesible desde el navegador)

## Rutas Principales

### Públicas
- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro

### Creadores (requiere autenticación)
- `/dashboard/creator` - Dashboard principal
- `/dashboard/creator/portfolio` - Gestión de portafolio
- `/dashboard/creator/jobs` - Ofertas de trabajo disponibles
- `/dashboard/creator/applications` - Mis aplicaciones
- `/dashboard/creator/profile` - Perfil

### Empresas (requiere autenticación)
- `/dashboard/company` - Dashboard principal
- `/dashboard/company/jobs` - Mis ofertas
- `/dashboard/company/jobs/new` - Crear nueva oferta
- `/dashboard/company/creators` - Buscar creadores
- `/dashboard/company/profile` - Perfil de empresa

## Próximas Características

- Gestión completa de portafolio con upload de archivos
- Búsqueda avanzada de creadores con filtros
- Sistema de mensajería entre empresas y creadores
- Sistema de calificaciones y reviews
- Dashboard de analíticas con gráficos
- Notificaciones en tiempo real
- Integración con IA para matching inteligente
