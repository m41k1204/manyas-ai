# 🚀 Deployment en AWS Amplify - Manyas AI Frontend

## ✅ Checklist Previo

Antes de deployar en Amplify, asegúrate de que:
- [ ] El backend esté funcionando en `https://api.manyas-ai.kiwiapp.lat`
- [ ] Puedas hacer `curl https://api.manyas-ai.kiwiapp.lat` y recibir respuesta
- [ ] Tu código esté en GitHub/GitLab/Bitbucket

---

## 📝 Pasos para Deployar

### 1️⃣ Subir código a GitHub (si aún no lo hiciste)

```bash
# Desde tu máquina local, en la carpeta frontend
cd /home/m41k1/Documents/UTEC/2025-2/Emprendedurismo/mvp/frontend

# Inicializar Git si no está iniciado
git init
git add .
git commit -m "Initial commit - Manyas AI frontend"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/tu-usuario/manyas-ai-frontend.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Ir a AWS Amplify Console

1. Ve a: https://console.aws.amazon.com/amplify/
2. Click en **"New app"** → **"Host web app"**
3. Selecciona tu proveedor de Git (GitHub, GitLab, etc.)
4. Autoriza el acceso a tu cuenta

---

### 3️⃣ Conectar Repositorio

1. **Selecciona el repositorio:** `manyas-ai-frontend` (o el nombre que le hayas puesto)
2. **Selecciona la rama:** `main`
3. Click en **"Next"**

---

### 4️⃣ Configurar Build Settings

Amplify detectará automáticamente que es Next.js y usará el archivo `amplify.yml`.

**Verificar que vea:**
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
```

Si se ve correcto, click en **"Next"**

---

### 5️⃣ Configurar Variables de Entorno (IMPORTANTE)

En la sección **"Advanced settings"** → **"Environment variables"**:

**Agregar esta variable:**

```
Key:   NEXT_PUBLIC_API_URL
Value: https://api.manyas-ai.kiwiapp.lat/api
```

⚠️ **IMPORTANTE:** Usa `https://` (no `http://`) ya que tu backend tiene SSL.

---

### 6️⃣ Revisar y Deployar

1. Revisa toda la configuración
2. Click en **"Save and deploy"**
3. Espera 5-10 minutos mientras se hace el build

**Verás 4 pasos:**
- Provision ✓
- Build ✓
- Deploy ✓
- Verify ✓

---

### 7️⃣ Obtener la URL de Amplify

Una vez que termine, verás tu URL de Amplify:

```
https://main.d1234567890.amplifyapp.com
```

**Copia esta URL**, la necesitarás para el siguiente paso.

---

### 8️⃣ Actualizar Backend con la URL del Frontend

Ahora debes actualizar el backend para aceptar requests de tu frontend:

```bash
# En tu VM
ssh usuario@tu-vm-ip
cd manyas-ai/backend

# Editar .env
nano .env
```

**Cambiar:**
```env
# De:
FRONTEND_URL=*

# A:
FRONTEND_URL=https://main.d1234567890.amplifyapp.com
```

**Guardar** (`Ctrl+O`, `Enter`, `Ctrl+X`)

**Reiniciar backend:**
```bash
docker compose restart backend
```

---

### 9️⃣ Verificar que Todo Funcione

1. **Abre tu app en Amplify:** `https://main.d1234567890.amplifyapp.com`
2. **Intenta registrarte** como usuario
3. **Haz login**
4. **Abre la consola del navegador** (F12) y verifica que no haya errores de CORS

---

## 🎉 ¡Listo!

Tu aplicación está funcionando en:
- **Frontend:** `https://main.d1234567890.amplifyapp.com`
- **Backend:** `https://api.manyas-ai.kiwiapp.lat`

---

## 🔄 Deploys Automáticos

Cada vez que hagas `git push` a la rama `main`, Amplify automáticamente:
1. Detectará los cambios
2. Hará build
3. Desplegará la nueva versión

---

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado

Si quieres usar tu propio dominio (ej: `app.manyas-ai.kiwiapp.lat`):

1. En Amplify Console → tu app
2. Click en **"Domain management"**
3. Click en **"Add domain"**
4. Sigue las instrucciones para configurar DNS

### Variables de Entorno Adicionales

Si necesitas agregar más variables:

1. Amplify Console → tu app
2. **"Environment variables"**
3. Click en **"Manage variables"**
4. Agregar las que necesites

---

## 🐛 Troubleshooting

### Error en Build

**Problema:** El build falla

**Solución:**
1. Ve a **"Build history"** en Amplify
2. Click en el build que falló
3. Revisa los logs
4. Los errores comunes son:
   - Dependencias faltantes → Revisa `package.json`
   - Errores de TypeScript → Arregla en local primero
   - Variables de entorno faltantes → Agrégalas en Amplify

### Error de CORS

**Problema:** Al hacer login/register sale error de CORS

**Solución:**
```bash
# En tu VM, verifica el .env
cat backend/.env | grep FRONTEND_URL

# Debe mostrar:
FRONTEND_URL=https://main.d1234567890.amplifyapp.com

# Si no, actualiza y reinicia:
nano backend/.env
docker compose restart backend
```

### Las imágenes no cargan

**Problema:** Las imágenes del portfolio no se ven

**Solución:**
El archivo `next.config.js` ya está configurado con el dominio de la API, pero verifica que esté correcto.

### La app se ve pero no carga datos

**Problema:** La app carga pero no muestra datos del backend

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Busca requests a tu API
5. Si dice "Failed" o "CORS error", revisa el backend

---

## 📊 Monitoreo

### Ver métricas

1. Amplify Console → tu app
2. **"Monitoring"** para ver:
   - Visitors
   - Page views
   - Requests

### Ver logs de build

1. Amplify Console → tu app
2. **"Build history"**
3. Click en cualquier build para ver logs

---

## 🔄 Actualizar la App

```bash
# Desde tu máquina local
cd frontend

# Hacer cambios...

# Commit y push
git add .
git commit -m "Update: descripción de cambios"
git push origin main

# Amplify detectará y desplegará automáticamente
```

---

## 💰 Costos

AWS Amplify Free Tier incluye:
- 1000 build minutes/mes
- 15 GB almacenamiento
- 100 GB transferencia/mes

**Para Manyas AI (MVP):** Debería estar dentro del free tier.

---

## 📚 Recursos

- [AWS Amplify Docs](https://docs.aws.amazon.com/amplify/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Amplify Pricing](https://aws.amazon.com/amplify/pricing/)
