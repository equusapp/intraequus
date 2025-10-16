# 🔧 Solución al Problema de Row Level Security (RLS)

## 🎯 **Problema Identificado**

Las facturas existen en Supabase pero la aplicación no las puede ver. Esto es típico de un problema de **Row Level Security (RLS)**.

---

## ✅ **Solución Inmediata - Desactivar RLS Temporalmente**

### **Paso 1: Ir a Supabase Dashboard**
1. Ve a tu proyecto en Supabase
2. Ve a **Authentication** → **Policies**

### **Paso 2: Desactivar RLS para las Tablas**

Ejecuta estos comandos en **SQL Editor** de Supabase:

```sql
-- Desactivar RLS temporalmente para desarrollo
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
```

### **Paso 3: Verificar que se Desactivó**

En **SQL Editor**, ejecuta:

```sql
-- Verificar estado de RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('invoices', 'contacts', 'companies');
```

Debería mostrar `rowsecurity = false` para todas las tablas.

---

## 🚀 **Probar la Aplicación**

Después de desactivar RLS:

1. **Reinicia el servidor:**
```bash
npm run dev
```

2. **Ve a la página de debug:**
```
http://localhost:3000/debug
```

3. **Haz clic en "🔄 Probar Conexión"**
   - Ahora debería encontrar las facturas

4. **Ve a Contabilidad:**
```
http://localhost:3000/contabilidad
```

5. **¡Deberías ver las facturas!** ✅

---

## 🔒 **Para Producción (Después)**

Una vez que todo funcione, puedes reactivar RLS con políticas correctas:

```sql
-- Reactivar RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir acceso a todos los datos (desarrollo)
CREATE POLICY "Allow all operations" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.companies FOR ALL USING (true);
```

---

## 🎯 **¿Por qué Pasó Esto?**

**Row Level Security (RLS)** está activado por defecto en Supabase y bloquea el acceso a los datos a menos que:

1. **Tengas políticas específicas** que permitan el acceso
2. **Estés autenticado** como usuario válido
3. **Las políticas coincidan** con tu contexto

Como no hemos implementado autenticación aún, RLS bloquea todo acceso.

---

## ✅ **Ejecuta el SQL y Prueba**

**Copia y pega este SQL en Supabase SQL Editor:**

```sql
-- SOLUCIÓN RÁPIDA: Desactivar RLS para desarrollo
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Verificar que se desactivó
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('invoices', 'contacts', 'companies');
```

**Después ejecuta esto y dime si funciona.** 🚀
