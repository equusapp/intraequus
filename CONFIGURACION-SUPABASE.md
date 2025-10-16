# 🔗 Configuración de Supabase - Lista de Verificación

## ✅ Tareas Completadas

### 1. **Base de Datos en Supabase** ✅
- ✅ Proyecto creado en Supabase
- ✅ Script SQL ejecutado correctamente
- ✅ Tablas creadas:
  - `companies` - Empresas
  - `users` - Usuarios
  - `contacts` - Clientes y proveedores
  - `invoices` - Facturas
  - `accounting_entries` - Asientos contables
  - `accounting_lines` - Líneas de asientos
  - `expenses` - Gastos
  - `bank_movements` - Movimientos bancarios
  - `assets` - Activos e inmovilizados
  - `quotes` - Presupuestos

### 2. **Archivo .env.local** ✅
- ✅ Archivo `.env.local` creado en la raíz del proyecto
- ✅ Variables de entorno configuradas:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://rrvsgapcwozpwrlvuany.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

### 3. **Configuración del Proyecto** ✅
- ✅ Cliente de Supabase configurado (`lib/supabase/client.ts`)
- ✅ Tipos TypeScript generados (`lib/supabase/types.ts`)
- ✅ Dependencias en `package.json`:
  - `@supabase/supabase-js`
  - `@supabase/auth-helpers-nextjs`

---

## 🚀 Pasos Finales

### **Paso 1: Instalar Dependencias**

Si aún no lo has hecho, instala las dependencias:

```bash
npm install
```

Esto instalará:
- Supabase client libraries
- Next.js y React
- TailwindCSS y componentes UI
- Todas las librerías necesarias

---

### **Paso 2: Verificar Conexión con Supabase**

Voy a crear un script de prueba para verificar que la conexión funciona:

#### Crear archivo de prueba temporal:

**Ubicación:** `lib/supabase/test-connection.ts`

```typescript
import { createClient } from './client'

export async function testSupabaseConnection() {
  const supabase = createClient()
  
  try {
    // Intentar obtener datos de la tabla companies
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error al conectar con Supabase:', error)
      return false
    }
    
    console.log('✅ Conexión exitosa con Supabase!')
    console.log('📊 Datos obtenidos:', data)
    return true
    
  } catch (err) {
    console.error('❌ Error inesperado:', err)
    return false
  }
}
```

---

### **Paso 3: Iniciar el Servidor**

```bash
npm run dev
```

Deberías ver:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
- Ready in X.X seconds
```

---

### **Paso 4: Verificar la Aplicación**

Abre tu navegador y ve a:
```
http://localhost:3000
```

Deberías ver la página de inicio de EQUUS Accounting.

---

## 📊 Crear Datos de Prueba (Opcional)

Para probar la aplicación con datos reales, ejecuta este SQL en Supabase:

```sql
-- 1. Crear empresa de prueba
INSERT INTO companies (id, name, tax_id, address, city, postal_code, country)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'EQUUS THE HORSING APP, S.L.',
  'B22810535',
  'Calle Ginzo de Limia 53, Piso 17 Puerta A',
  'Madrid',
  '28034',
  'España'
);

-- 2. Crear contactos de prueba
INSERT INTO contacts (company_id, name, tax_id, email, phone, type) VALUES
(
  '123e4567-e89b-12d3-a456-426614174000',
  'Club Hípico Madrid',
  'B11111111',
  'info@clubhipicomadrid.com',
  '+34 911 222 333',
  'client'
),
(
  '123e4567-e89b-12d3-a456-426614174000',
  'Veterinaria Equina S.L.',
  'B22222222',
  'contacto@veterinariaequina.es',
  '+34 622 333 444',
  'supplier'
),
(
  '123e4567-e89b-12d3-a456-426614174000',
  'Escuela Los Pinos',
  'B33333333',
  'escuela@lospinos.com',
  '+34 633 444 555',
  'client'
);

-- 3. Crear facturas de prueba
INSERT INTO invoices (
  company_id,
  type,
  invoice_number,
  contact_id,
  issue_date,
  concept,
  base_amount,
  vat_rate,
  vat_amount,
  total_amount,
  status
)
SELECT
  '123e4567-e89b-12d3-a456-426614174000',
  'issued',
  'FAC-2025-001',
  id,
  '2025-01-15',
  'Clases de equitación - Enero 2025',
  2450.00,
  21,
  514.50,
  2964.50,
  'paid'
FROM contacts
WHERE name = 'Club Hípico Madrid'
LIMIT 1;

INSERT INTO invoices (
  company_id,
  type,
  invoice_number,
  contact_id,
  issue_date,
  concept,
  base_amount,
  vat_rate,
  vat_amount,
  total_amount,
  status
)
SELECT
  '123e4567-e89b-12d3-a456-426614174000',
  'issued',
  'FAC-2025-002',
  id,
  '2025-01-18',
  'Alquiler de instalaciones',
  1890.50,
  21,
  397.01,
  2287.51,
  'pending'
FROM contacts
WHERE name = 'Escuela Los Pinos'
LIMIT 1;

INSERT INTO invoices (
  company_id,
  type,
  invoice_number,
  contact_id,
  issue_date,
  concept,
  base_amount,
  vat_rate,
  vat_amount,
  total_amount,
  status,
  payment_date
)
SELECT
  '123e4567-e89b-12d3-a456-426614174000',
  'received',
  'REC-2025-015',
  id,
  '2025-01-10',
  'Revisión veterinaria caballos',
  850.00,
  21,
  178.50,
  1028.50,
  'paid',
  '2025-01-12'
FROM contacts
WHERE name = 'Veterinaria Equina S.L.'
LIMIT 1;
```

---

## 🔍 Verificar Tablas en Supabase

### En Supabase Dashboard:

1. Ve a **Table Editor**
2. Verifica que todas las tablas existan:
   - ✅ companies
   - ✅ users
   - ✅ contacts
   - ✅ invoices
   - ✅ accounting_entries
   - ✅ accounting_lines
   - ✅ expenses
   - ✅ bank_movements
   - ✅ assets
   - ✅ quotes

3. Ve a **Database** → **Policies**
4. Verifica que las políticas RLS estén activas

---

## 🔐 Configurar Storage (Opcional)

Para subir archivos (PDFs, imágenes):

1. Ve a **Storage** en Supabase
2. Verifica que exista el bucket `accounting-files`
3. Si no existe, créalo:
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('accounting-files', 'accounting-files', false);
   ```

---

## 🐛 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que las variables en `.env.local` sean correctas
- Reinicia el servidor (`npm run dev`)

### Error: "Table does not exist"
- Verifica que el script SQL se ejecutó completamente
- Revisa el SQL Editor en Supabase para errores

### Error: "Connection refused"
- Verifica que tu proyecto de Supabase esté activo
- Comprueba la URL en `.env.local`

### Página en blanco
- Abre la consola del navegador (F12)
- Revisa errores de TypeScript o JavaScript
- Verifica que `npm run dev` se haya ejecutado correctamente

---

## ✅ Checklist Final

Antes de continuar, verifica:

- [ ] ✅ Dependencias instaladas (`npm install`)
- [ ] ✅ Archivo `.env.local` configurado
- [ ] ✅ Tablas creadas en Supabase
- [ ] ✅ Servidor de desarrollo iniciado (`npm run dev`)
- [ ] ✅ Aplicación accesible en `http://localhost:3000`
- [ ] ✅ (Opcional) Datos de prueba insertados

---

## 📝 Notas Importantes

### Seguridad
- **NUNCA** compartas tu `SUPABASE_SERVICE_ROLE_KEY` públicamente
- El archivo `.env.local` está en `.gitignore` automáticamente
- Para producción, usa variables de entorno del hosting (Vercel, Netlify, etc.)

### Row Level Security (RLS)
- Las políticas RLS aseguran que cada empresa solo vea sus datos
- En desarrollo, puedes desactivar RLS temporalmente si necesitas
- **IMPORTANTE:** Siempre activa RLS en producción

### Autenticación
- La estructura está preparada para Supabase Auth
- Próximo paso: Implementar login/registro de usuarios
- Por ahora, la aplicación funciona sin autenticación (desarrollo)

---

## 🎉 ¡Listo para Usar!

Si todos los pasos están completos, tu aplicación EQUUS Accounting está:

✅ Conectada a Supabase  
✅ Lista para desarrollo  
✅ Preparada para insertar y leer datos reales  

### Próximos Pasos:
1. **Conectar formularios con Supabase** (crear/editar/eliminar facturas)
2. **Implementar autenticación** de usuarios
3. **Subir archivos** a Supabase Storage
4. **Añadir validaciones** del lado del servidor

---

**¿Algún error o duda? Revisa la sección de Solución de Problemas o consulta la documentación de Supabase.**
