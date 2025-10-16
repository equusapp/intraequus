# 🚀 EQUUS Accounting - Guía de Deployment

## 📋 Resumen del Proyecto

**EQUUS Accounting** es un sistema contable completo para centros ecuestres, desarrollado con Next.js 14, TypeScript y Supabase.

### ✨ Características Principales
- Sistema de contabilidad completo con facturas emitidas/recibidas
- Conciliación bancaria automática
- Gestión de gastos con categorización
- Control de activos e inmovilizados con amortización
- Dashboard en tiempo real con métricas
- Gestión de contactos (clientes/proveedores)
- Interfaz moderna y responsive

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: TailwindCSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Iconos**: Lucide React
- **Deployment**: Vercel (recomendado)

## 📦 Estructura del Proyecto

```
windsurf-project/
├── app/                    # App Router de Next.js 14
│   ├── (dashboard)/        # Rutas protegidas
│   ├── login/              # Página de login
│   └── globals.css         # Estilos globales
├── components/             # Componentes React
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   └── [modules]/          # Componentes por módulo
├── lib/                    # Utilidades y configuración
│   ├── supabase/           # Cliente Supabase y tipos
│   └── utils.ts            # Utilidades generales
├── public/                 # Archivos estáticos
└── [config files]         # Configuración del proyecto
```

## 🔧 Variables de Entorno Requeridas

Crea un archivo `.env.local` con:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# App Configuration  
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

## 🗄️ Base de Datos

### Configuración de Supabase

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL y las API keys

2. **Ejecutar el schema**
   - Ve al SQL Editor en Supabase
   - Ejecuta el contenido de `lib/supabase/schema.sql`
   - Verifica que todas las tablas se crearon

3. **Configurar Row Level Security (RLS)**
   - Las políticas de seguridad están incluidas en el schema
   - Cada empresa solo puede ver sus propios datos

4. **Datos de prueba (opcional)**
   - Ejecuta `lib/supabase/seed-data.ts` para datos de ejemplo
   - O usa `lib/supabase/seed-users-simple.sql` para usuarios básicos

### Tablas Principales

- `companies` - Datos de empresas
- `users` - Usuarios del sistema  
- `contacts` - Clientes y proveedores
- `invoices` - Facturas emitidas y recibidas
- `accounting_entries` - Asientos contables
- `accounting_lines` - Líneas de debe/haber
- `bank_movements` - Movimientos bancarios
- `expenses` - Gastos y tickets
- `assets` - Activos e inmovilizados
- `quotes` - Presupuestos

## 🚀 Deployment en Vercel

### Opción 1: Deploy desde GitHub

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio `equus-accounting`

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Añade todas las variables del `.env.local`

3. **Deploy automático**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - El build se ejecutará automáticamente
   - Obtendrás una URL de producción

### Opción 2: Deploy manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 🔐 Configuración de Autenticación

### Configurar Supabase Auth

1. **En el dashboard de Supabase**
   - Ve a Authentication > Settings
   - Configura la URL del sitio: `https://tu-dominio.vercel.app`
   - Añade URLs de redirección permitidas

2. **Providers de autenticación**
   - Email/Password (habilitado por defecto)
   - Opcional: Google, GitHub, etc.

3. **Políticas de seguridad**
   - Las políticas RLS están configuradas en el schema
   - Verificar que funcionan correctamente

## 📊 Funcionalidades del Sistema

### Módulo de Contabilidad
- ✅ Facturas emitidas y recibidas
- ✅ Generación automática de asientos contables
- ✅ Cálculo automático de IVA
- ✅ Adjuntar documentos PDF

### Módulo de Conciliación
- ✅ Importar extractos bancarios (CSV)
- ✅ Vincular movimientos con facturas
- ✅ Estados de conciliación
- ✅ Sugerencias automáticas

### Módulo de Gastos
- ✅ Registro de gastos con imagen
- ✅ Categorización automática
- ✅ Informes por categoría
- ✅ Vinculación contable

### Módulo de Activos
- ✅ Registro de activos fijos
- ✅ Cálculo automático de amortización
- ✅ Gráficos de evolución
- ✅ Estados del activo

### Dashboard
- ✅ Métricas en tiempo real
- ✅ Gráficos de ingresos/gastos
- ✅ Facturas pendientes
- ✅ Accesos rápidos

## 🧪 Testing

### Comandos disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Verificar tipos
npm run type-check

# Linting
npm run lint
```

### Testing manual

1. **Verificar autenticación**
   - Login/logout funciona
   - Redirecciones correctas
   - Sesión persistente

2. **Probar módulos principales**
   - Crear facturas
   - Importar movimientos bancarios
   - Registrar gastos
   - Añadir activos

3. **Verificar datos en tiempo real**
   - Dashboard actualizado
   - Sincronización con Supabase
   - Cálculos correctos

## 🔍 Troubleshooting

### Problemas comunes

1. **Error "No API key found"**
   - Verificar variables de entorno
   - Reiniciar servidor de desarrollo
   - Comprobar archivo `.env.local`

2. **Error de conexión a Supabase**
   - Verificar URL y keys de Supabase
   - Comprobar que el proyecto está activo
   - Revisar políticas RLS

3. **Error de build en Vercel**
   - Verificar que todas las dependencias están en `package.json`
   - Comprobar errores de TypeScript
   - Revisar logs de build en Vercel

4. **Problemas de autenticación**
   - Verificar URLs de redirección en Supabase
   - Comprobar configuración de Auth
   - Revisar middleware de Next.js

## 📈 Próximas Mejoras

- [ ] Generación de PDF de facturas
- [ ] Envío de emails automático
- [ ] Importación masiva de datos
- [ ] Exportación a Excel
- [ ] Gráficos avanzados
- [ ] Modo oscuro
- [ ] App móvil
- [ ] Gestión de IVA trimestral

## 📞 Soporte

Para soporte técnico:
- Email: soporte@equusapp.com
- Documentación: Este archivo
- Issues: GitHub Issues del repositorio

---

**🐴 EQUUS Accounting - Sistema contable profesional para centros ecuestres**

*Desarrollado con ❤️ para la comunidad ecuestre*
