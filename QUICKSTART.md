# Guía de Inicio Rápido - EQUUS Accounting

## Instalación Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase

Crea un proyecto en [supabase.com](https://supabase.com) y crea el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Crear tablas en Supabase

Ejecuta el script `lib/supabase/schema.sql` en el SQL Editor de Supabase.

### 4. Iniciar aplicación
```bash
npm run dev
```

Abre: `http://localhost:3000`

## Primeros Pasos

1. **Crear factura**: Ve a `/contabilidad` → Nueva Factura
2. **Registrar gasto**: Ve a `/gastos` → Nuevo Gasto  
3. **Añadir activo**: Ve a `/activos` → Nuevo Activo

## Comandos Útiles

```bash
npm run dev        # Desarrollo
npm run build      # Build producción
npm run type-check # Verificar tipos
npm run lint       # Linting
```

Para más información, consulta el README.md completo.
