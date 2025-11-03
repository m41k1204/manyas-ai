# ⚡ Quick Start - AWS Amplify

## ✅ El frontend está listo para Amplify

Archivos configurados:
- ✅ `amplify.yml` - Build configuration
- ✅ `next.config.js` - Incluye dominio de API
- ✅ `.env.example` - Template de variables

---

## 🚀 3 Pasos para Deployar

### 1. Sube a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/manyas-ai-frontend.git
git push -u origin main
```

### 2. Deploy en Amplify

1. Ve a: https://console.aws.amazon.com/amplify/
2. **New app** → **Host web app**
3. Conecta tu repo
4. Agrega variable de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://api.manyas-ai.kiwiapp.lat/api
   ```
5. **Save and deploy**

### 3. Actualiza el backend con la URL de Amplify

```bash
# En tu VM
nano backend/.env
# Cambiar FRONTEND_URL=* a tu URL de Amplify
# Ejemplo: FRONTEND_URL=https://main.d1234567890.amplifyapp.com

docker compose restart backend
```

---

## 📖 Guía Completa

Ver: [`AMPLIFY-DEPLOYMENT.md`](./AMPLIFY-DEPLOYMENT.md)

---

## ⚠️ IMPORTANTE

**La variable de entorno en Amplify debe ser:**
```
NEXT_PUBLIC_API_URL=https://api.manyas-ai.kiwiapp.lat/api
```

**Nota:** Usa `https://` (no `http://`)
