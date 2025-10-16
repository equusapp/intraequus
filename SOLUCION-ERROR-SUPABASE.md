# 🔧 Solución al Error de Variables de Entorno

## ❌ Error Actual
```
Error: either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!
```

## ✅ Solución

### 1. **Verificar el archivo `.env.local`**

Abre el archivo `.env.local` en la raíz del proyecto y asegúrate de que tiene este formato **EXACTO**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rrvsgapcwozpwrlvuany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ⚠️ **MUY IMPORTANTE:**

1. **NO puede haber espacios** alrededor del `=`
   - ❌ MAL: `NEXT_PUBLIC_SUPABASE_URL = https://...`
   - ✅ BIEN: `NEXT_PUBLIC_SUPABASE_URL=https://...`

2. **NO puede haber comillas** alrededor de los valores
   - ❌ MAL: `NEXT_PUBLIC_SUPABASE_URL="https://..."`
   - ✅ BIEN: `NEXT_PUBLIC_SUPABASE_URL=https://...`

3. **Las claves deben ser de tu proyecto en Supabase**

---

## 📝 Cómo Obtener las Claves de Supabase

### 1. Ve a tu proyecto en Supabase
```
https://supabase.com/dashboard/project/rrvsgapcwozpwrlvuany
```

### 2. Ve a **Settings** (Configuración) → **API**

### 3. Copia estas dos claves:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** (opcional) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔄 Después de Corregir el `.env.local`

### 1. **DETÉN el servidor** (si está corriendo)
```bash
Ctrl + C
```

### 2. **Borra la carpeta `.next`** (caché)
```bash
# En PowerShell
Remove-Item -Recurse -Force .next
```

O manualmente: Elimina la carpeta `.next` en la raíz del proyecto

### 3. **Reinicia el servidor**
```bash
npm run dev
```

### 4. **Refresca el navegador** con caché limpia
```
Ctrl + Shift + R
```

---

## 🧪 Verificar que Funciona

### 1. Abre la consola del navegador (F12)

### 2. Ve a la pestaña **Console**

### 3. Si ves este error nuevamente:
```
Missing Supabase environment variables
```

Significa que el `.env.local` NO está bien configurado.

### 4. Si NO ves ese error, ¡todo está bien! ✅

---

## 📋 Checklist de Verificación

Antes de reiniciar, verifica:

- [ ] El archivo `.env.local` está en la **raíz del proyecto** (mismo nivel que `package.json`)
- [ ] Las 4 líneas están escritas correctamente
- [ ] **NO hay espacios** alrededor del `=`
- [ ] **NO hay comillas** alrededor de los valores
- [ ] Las claves son de tu proyecto de Supabase
- [ ] Detuviste el servidor (`Ctrl + C`)
- [ ] Borraste la carpeta `.next`
- [ ] Reiniciaste el servidor (`npm run dev`)

---

## 🎯 Ejemplo de `.env.local` CORRECTO

```env
NEXT_PUBLIC_SUPABASE_URL=https://rrvsgapcwozpwrlvuany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJydnNnYXBjd296cHdybHZ1YW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4NzE2MjIsImV4cCI6MjAwODQ0NzYyMn0.ejemplo_de_key_muy_larga
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.otro_ejemplo_de_key_muy_larga
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

*(Reemplaza con tus claves reales)*

---

## 🆘 Si el Error Persiste

### Opción 1: Verifica las variables manualmente

Abre el archivo `lib/supabase/client.ts` y temporalmente añade esto al principio:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'NO DEFINIDA')
```

### Opción 2: Reinicia VSCode completo

A veces VSCode no recoge los cambios en `.env.local`:
1. Cierra VSCode completamente
2. Vuelve a abrirlo
3. Reinicia el servidor

---

## ✅ Una Vez Resuelto

Deberías poder:
- Ver las facturas de prueba
- Crear nuevas facturas
- Editar facturas
- Marcar como pagadas
- Todo funcionando con Supabase

---

**¡Sigue estos pasos exactamente y el error se solucionará!** 🚀
