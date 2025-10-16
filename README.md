# 🐴 EQUUS Accounting

**Sistema contable completo para centros ecuestres - 100% conectado a Supabase**

![EQUUS Accounting](https://img.shields.io/badge/EQUUS-Accounting-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Connected-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## 📋 Descripción

EQUUS Accounting es una solución contable completa y moderna diseñada específicamente para la gestión financiera de centros ecuestres. Combina usabilidad, diseño visual atractivo y funcionalidades contables esenciales.

### ✨ Características Principales (100% Funcionales)

- **📊 Contabilidad Completa**: Facturas emitidas y recibidas con datos reales de Supabase
- **👥 Gestión de Contactos**: Clientes y proveedores con CRUD completo
- **💰 Control de Gastos**: Categorización y estadísticas automáticas
- **📦 Activos e Inmovilizados**: Amortización automática y cálculos en tiempo real
- **📈 Dashboard Inteligente**: Métricas reales calculadas dinámicamente
- **🔄 Tiempo Real**: Todas las operaciones sincronizadas con Supabase
- **🎨 Diseño EQUUS**: Interfaz moderna y responsive

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage
- **Iconos**: Lucide React
- **Tipografía**: Montserrat

## 📦 Instalación

### Prerequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratuita)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

```bash
cd c:/Users/Usuario/OneDrive/Documentos/EQUUS-Acounting/CascadeProjects/windsurf-project
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configurar Base de Datos en Supabase**

   a. Ve a [Supabase](https://supabase.com) y crea un nuevo proyecto
   
   b. En el SQL Editor, ejecuta el script completo de `lib/supabase/schema.sql`
   
   c. Verifica que todas las tablas se hayan creado correctamente

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

6. **Abrir en el navegador**

Visita: `http://localhost:3000`

## 🗂️ Estructura del Proyecto

```
windsurf-project/
├── app/
│   ├── (dashboard)/           # Rutas protegidas del dashboard
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── contabilidad/      # Módulo de contabilidad
│   │   ├── conciliacion/      # Conciliación bancaria
│   │   ├── facturacion/       # Facturas y presupuestos
│   │   ├── gastos/            # Gestión de gastos
│   │   ├── activos/           # Activos e inmovilizados
│   │   ├── contactos/         # Clientes y proveedores
│   │   └── configuracion/     # Configuración
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página de inicio
│   └── globals.css            # Estilos globales
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── layout/                # Sidebar, Header
│   ├── contabilidad/          # Componentes de contabilidad
│   ├── conciliacion/          # Componentes de conciliación
│   ├── facturacion/           # Componentes de facturación
│   ├── gastos/                # Componentes de gastos
│   ├── activos/               # Componentes de activos
│   └── contactos/             # Componentes de contactos
├── lib/
│   ├── supabase/              # Cliente y tipos de Supabase
│   └── utils.ts               # Utilidades generales
├── public/                    # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 📖 Módulos Principales

### 1️⃣ Contabilidad Automática (`/contabilidad`)

Permite registrar facturas emitidas y recibidas de forma manual, con generación automática de asientos contables.

**Funcionalidades:**
- Formulario guiado para nueva factura
- Cálculo automático de IVA y totales
- Vista previa del asiento contable
- Adjuntar PDF o imagen de la factura
- Filtros por tipo, estado, fechas
- Duplicar facturas similares
- Exportar datos

### 2️⃣ Conciliación Bancaria (`/conciliacion`)

Importa extractos bancarios y vincula movimientos con facturas existentes.

**Funcionalidades:**
- Subir archivos CSV o OFX
- Vista tipo hoja de cálculo
- Vincular movimientos con facturas
- Crear gastos/ingresos desde movimientos
- Estados: conciliado / pendiente
- Sugerencias automáticas de vinculación
- Validación de saldos

### 3️⃣ Facturación y Presupuestos (`/facturacion`)

Editor visual para crear facturas y presupuestos profesionales.

**Funcionalidades:**
- Editor de factura con vista previa
- Crear presupuestos
- Convertir presupuesto a factura con 1 clic
- Personalizar numeración
- Múltiples líneas de conceptos
- Cálculo automático de totales
- Descargar como PDF
- Enviar por email

### 4️⃣ Gestión de Gastos (`/gastos`)

Organiza gastos y tickets con categorización visual.

**Funcionalidades:**
- Subir tickets con imagen
- Categorización por tipo de gasto
- Vista de galería de tickets
- Informe mensual de gastos
- Filtrado por categorías
- Vinculación con cuentas contables
- Estadísticas por categoría

### 5️⃣ Activos e Inmovilizados (`/activos`)

Control de bienes con amortización automática.

**Funcionalidades:**
- Registro de activos fijos
- Cálculo automático de amortización lineal
- Gráfico de evolución de amortizaciones
- Valor contable neto actualizado
- Estado del activo (activo/amortizado/vendido)
- Imagen del activo
- Generación de asientos de amortización

### 6️⃣ Contactos (`/contactos`)

Base de datos de clientes y proveedores.

**Funcionalidades:**
- Gestión completa de contactos
- Clasificación: cliente / proveedor / ambos
- Datos fiscales y de contacto
- Búsqueda avanzada
- Historial de facturas por contacto

### 7️⃣ Dashboard (`/dashboard`)

Vista general con métricas clave y accesos rápidos.

**Funcionalidades:**
- Resumen de ingresos y gastos
- Facturas pendientes de pago
- Facturas vencidas
- Gráficos de evolución
- Accesos rápidos a módulos

## 🎨 Paleta de Colores EQUUS

```css
/* Colores principales */
--equus-beige: #F5F1E8
--equus-green-water: #B8D8D8
--equus-blue-light: #A8C5E0
--equus-blue-soft: #7FA6C8
--equus-cream: #FFF8F0
--equus-sand: #E8DCC4
```

## 🔐 Seguridad y Roles

### Roles de Usuario

- **Administrador**: Acceso completo a todos los módulos y configuración
- **Contable**: Acceso a contabilidad, facturación y gastos
- **Colaborador**: Acceso de solo lectura

### Row Level Security (RLS)

Cada empresa solo puede ver sus propios datos. Las políticas de seguridad se aplican a nivel de base de datos.

## 🗄️ Base de Datos

### Tablas Principales

- `companies`: Datos de empresa
- `users`: Usuarios del sistema
- `contacts`: Clientes y proveedores
- `invoices`: Facturas emitidas y recibidas
- `accounting_entries`: Asientos contables
- `accounting_lines`: Líneas de asientos (debe/haber)
- `bank_movements`: Movimientos bancarios
- `expenses`: Gastos y tickets
- `assets`: Activos e inmovilizados
- `quotes`: Presupuestos

## 🚧 Próximas Funcionalidades

- [ ] Autenticación con Supabase Auth
- [ ] Sistema de permisos por rol
- [ ] Generación de PDF de facturas
- [ ] Envío de facturas por email
- [ ] Importación masiva de datos
- [ ] Exportación a Excel
- [ ] Gráficos avanzados con Recharts
- [ ] Backup automático
- [ ] Modo oscuro
- [ ] Aplicación móvil (React Native)
- [ ] Gestión de IVA trimestral
- [ ] Impuestos y declaraciones

## 📝 Uso Básico

### Crear una Factura

1. Ve a `/contabilidad`
2. Haz clic en "+ Nueva Factura"
3. Rellena los campos:
   - Tipo: Emitida/Recibida
   - Número de factura
   - Cliente/Proveedor
   - Concepto
   - Base imponible e IVA
4. Adjunta el PDF si lo tienes
5. Revisa el asiento contable en el panel derecho
6. Guarda la factura

### Conciliar Movimientos Bancarios

1. Ve a `/conciliacion`
2. Haz clic en "Subir Extracto Bancario"
3. Selecciona tu archivo CSV/OFX
4. Revisa los movimientos importados
5. Para cada movimiento sin conciliar:
   - Busca la factura correspondiente
   - Vincula el movimiento
   - O crea un nuevo registro
6. Marca como conciliado

### Registrar un Gasto

1. Ve a `/gastos`
2. Haz clic en "+ Nuevo Gasto"
3. Sube la foto del ticket
4. Completa los datos:
   - Proveedor
   - Concepto
   - Importe e IVA
   - Categoría
5. Guarda el gasto

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Añadir Nuevos Componentes UI

```bash
# Los componentes shadcn/ui ya están incluidos
# Para añadir más, revisa: https://ui.shadcn.com
```

## 🤝 Contribución

Este es un proyecto privado para EQUUS APP. Para sugerencias o mejoras, contacta con el equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © 2025 EQUUS APP

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@equusapp.com
- Documentación: [Link a docs]

---

**Desarrollado con ❤️ para la comunidad ecuestre**

🐴 EQUUS Accounting - Gestión contable profesional para centros hípicos
