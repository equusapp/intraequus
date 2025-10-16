# Changelog - EQUUS Accounting

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.0.0] - 2025-01-15

### Añadido
- **Módulo de Contabilidad Automática**
  - Registro manual de facturas emitidas y recibidas
  - Generación automática de asientos contables
  - Cálculo automático de IVA y totales
  - Adjuntar documentos PDF/imagen
  - Filtros y búsqueda avanzada
  - Duplicación de facturas

- **Módulo de Conciliación Bancaria**
  - Importación de extractos CSV/OFX
  - Vista tipo hoja de cálculo
  - Vinculación manual con facturas
  - Estados de conciliación
  - Validación de saldos

- **Módulo de Facturación y Presupuestos**
  - Editor visual de facturas
  - Creación de presupuestos
  - Conversión presupuesto → factura
  - Múltiples líneas de conceptos
  - Cálculo automático de totales
  - Vista previa en tiempo real

- **Módulo de Gestión de Gastos**
  - Registro de gastos con tickets
  - Categorización visual
  - Vista de galería
  - Filtrado por categorías
  - Informes mensuales
  - Adjuntar imágenes

- **Módulo de Activos e Inmovilizados**
  - Registro de activos fijos
  - Cálculo automático amortización lineal
  - Gráfico de evolución
  - Valor contable neto
  - Estados del activo
  - Vida útil y depreciación

- **Módulo de Contactos**
  - Gestión de clientes y proveedores
  - Datos fiscales completos
  - Búsqueda avanzada
  - Clasificación por tipo

- **Dashboard Principal**
  - Resumen de métricas clave
  - Gráficos de evolución
  - Accesos rápidos
  - Facturas recientes

- **Sistema de Configuración**
  - Datos de empresa
  - Gestión de usuarios
  - Roles y permisos
  - Personalización visual
  - Notificaciones

- **Base de Datos**
  - Esquema completo en PostgreSQL (Supabase)
  - Row Level Security (RLS)
  - Políticas de acceso por empresa
  - Índices optimizados
  - Storage para archivos

- **Diseño UI/UX**
  - Paleta pastel EQUUS
  - Tipografía Montserrat
  - Componentes shadcn/ui
  - Responsive design
  - Animaciones suaves

### Tecnologías
- Next.js 14 (App Router)
- TypeScript 5.3
- TailwindCSS 3.4
- Supabase (PostgreSQL + Auth + Storage)
- Lucide Icons
- shadcn/ui components

### Pendiente
- [ ] Autenticación funcional con Supabase Auth
- [ ] Generación real de PDF
- [ ] Envío de emails
- [ ] Integración completa con Supabase (actualmente mock data)
- [ ] Sistema de backup
- [ ] Exportación a Excel
- [ ] Modo oscuro
- [ ] PWA para móviles
- [ ] Gestión de IVA trimestral
- [ ] Declaraciones fiscales

---

## Versiones Futuras Planificadas

### [1.1.0] - Q2 2025
- Autenticación completa
- Integración real con Supabase
- Generación de PDF
- Sistema de notificaciones

### [1.2.0] - Q3 2025
- Reportes avanzados
- Exportación a Excel
- Integración email
- Backup automático

### [1.3.0] - Q4 2025
- Gestión de IVA
- Declaraciones fiscales
- API pública
- Modo oscuro

### [2.0.0] - 2026
- Aplicación móvil nativa
- IA para categorización automática
- OCR para facturas
- Sincronización offline
