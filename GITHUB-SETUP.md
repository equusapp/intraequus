# 🐴 EQUUS Accounting - Configuración de GitHub

## 📋 Pasos para Subir el Proyecto a GitHub

### 1️⃣ Instalar Git (si no está instalado)

1. **Descargar Git**
   - Ve a: https://git-scm.com/download/win
   - Descarga la versión de 64-bit para Windows
   - Ejecuta el instalador con las opciones por defecto

2. **Verificar instalación**
   ```bash
   git --version
   ```

### 2️⃣ Ejecutar el Script de Deployment

1. **Abrir PowerShell como Administrador**
   - Busca "PowerShell" en el menú inicio
   - Clic derecho > "Ejecutar como administrador"

2. **Navegar al proyecto**
   ```powershell
   cd "c:\Users\Usuario\OneDrive\Documentos\EQUUS-Acounting\CascadeProjects\windsurf-project"
   ```

3. **Ejecutar el script**
   ```powershell
   .\deploy-to-github.ps1
   ```

### 3️⃣ Crear Repositorio en GitHub

1. **Ir a GitHub**
   - Ve a: https://github.com/new
   - Inicia sesión en tu cuenta

2. **Configurar el repositorio**
   - **Repository name**: `equus-accounting`
   - **Description**: `Sistema contable completo para centros ecuestres - Next.js + Supabase`
   - **Visibility**: Elige `Private` o `Public`
   - **NO marques**: "Add a README file" (ya tenemos uno)
   - **NO marques**: "Add .gitignore" (ya tenemos uno)
   - **NO marques**: "Choose a license"

3. **Crear repositorio**
   - Haz clic en "Create repository"

### 4️⃣ Conectar con el Repositorio Local

Después de crear el repositorio, GitHub te mostrará comandos. Usa estos:

```bash
# Añadir el repositorio remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/equus-accounting.git

# Cambiar a la rama main
git branch -M main

# Subir el código
git push -u origin main
```

### 5️⃣ Verificar que se Subió Correctamente

1. **Refrescar la página de GitHub**
   - Deberías ver todos los archivos del proyecto
   - El README.md se mostrará automáticamente

2. **Verificar archivos importantes**
   - ✅ `README.md` - Documentación principal
   - ✅ `package.json` - Dependencias
   - ✅ `.gitignore` - Archivos ignorados
   - ✅ `.env.example` - Ejemplo de variables de entorno
   - ✅ `DEPLOYMENT.md` - Guía de deployment
   - ❌ `.env.local` - NO debe aparecer (está en .gitignore)

## 🔐 Configuración de Seguridad

### Variables de Entorno

**IMPORTANTE**: El archivo `.env.local` con tus claves reales NO se sube a GitHub por seguridad.

### Archivos Sensibles Excluidos

El `.gitignore` excluye automáticamente:
- `.env.local` - Variables de entorno locales
- `.env` - Variables de entorno
- `node_modules/` - Dependencias
- `.next/` - Build de Next.js

## 🚀 Deployment Automático con Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Ir a Vercel**
   - Ve a: https://vercel.com
   - Inicia sesión con tu cuenta de GitHub

2. **Importar proyecto**
   - Clic en "New Project"
   - Selecciona tu repositorio `equus-accounting`
   - Clic en "Import"

3. **Configurar variables de entorno**
   - En "Environment Variables" añade:
     ```
     NEXT_PUBLIC_SUPABASE_URL = tu-url-de-supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY = tu-anon-key
     SUPABASE_SERVICE_ROLE_KEY = tu-service-role-key
     NEXT_PUBLIC_APP_URL = https://tu-dominio.vercel.app
     ```

4. **Deploy**
   - Clic en "Deploy"
   - Espera a que termine el build
   - ¡Tu app estará online!

### Opción 2: CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 📊 Funcionalidades Incluidas

### ✅ Completamente Funcional
- Sistema de autenticación con Supabase
- Dashboard con métricas en tiempo real
- Gestión de facturas (emitidas/recibidas)
- Conciliación bancaria
- Control de gastos con categorías
- Gestión de activos e inmovilizados
- Base de datos de contactos
- Interfaz responsive y moderna

### 🎨 Diseño EQUUS
- Paleta de colores personalizada
- Componentes UI modernos (shadcn/ui)
- Iconografía ecuestre
- Responsive design
- Tipografía Montserrat

## 🔄 Flujo de Desarrollo

### Para futuras actualizaciones:

1. **Hacer cambios localmente**
2. **Commit y push**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
3. **Deploy automático**
   - Vercel detectará el push
   - Hará build y deploy automáticamente

## 📋 Checklist de Deployment

- [ ] Git instalado y configurado
- [ ] Repositorio creado en GitHub
- [ ] Código subido correctamente
- [ ] `.env.local` NO está en GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] App funcionando online
- [ ] Supabase conectado correctamente
- [ ] Autenticación funcionando

## 🆘 Solución de Problemas

### Error: "Git no reconocido"
- Reinstalar Git desde git-scm.com
- Reiniciar PowerShell después de instalar

### Error: "Permission denied"
- Ejecutar PowerShell como Administrador
- Verificar política de ejecución:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Error en Vercel: "Build failed"
- Verificar que todas las dependencias están en `package.json`
- Comprobar errores de TypeScript
- Revisar variables de entorno

### Error: "Supabase connection failed"
- Verificar URLs y keys en variables de entorno
- Comprobar que el proyecto Supabase está activo
- Revisar configuración de autenticación

## 📞 Soporte

Si tienes problemas:
1. Revisa este documento
2. Consulta `DEPLOYMENT.md`
3. Revisa los logs en Vercel
4. Contacta: soporte@equusapp.com

---

**¡Listo para compartir tu sistema contable EQUUS con el mundo! 🐴**
