# Guía de Deployment a Producción

## ✅ Pre-requisitos Completados

- ✅ Código limpio sin errores de TypeScript
- ✅ Integración Web3 completa (MetaMask, USDC, NFTs)
- ✅ Sistema de gamificación implementado
- ✅ Integración con wearables configurada
- ✅ Capacitor configurado para iOS y Android
- ✅ Documentación completa generada
- ✅ Seguridad RLS en Supabase
- ✅ Edge Functions desplegadas

## 📱 Deployment a App Stores

### 1. Preparar el Proyecto

```bash
# Clonar desde GitHub
git clone [tu-repositorio]
cd emocionaliaplus-webapp

# Instalar dependencias
npm install

# Build de producción
npm run build
```

### 2. Configuración de Capacitor

**IMPORTANTE**: Antes de hacer build para las tiendas, verifica que el archivo `capacitor.config.ts` tenga la sección `server` comentada (ya está configurado):

```typescript
// La sección server debe estar comentada para producción
/*
server: {
  url: 'https://...',
  cleartext: true
},
*/
```

### 3. iOS (App Store)

#### Pre-requisitos
- macOS con Xcode instalado
- Apple Developer Account ($99/año)

#### Pasos

```bash
# Agregar plataforma iOS (solo primera vez)
npx cap add ios

# Actualizar plataforma
npx cap update ios

# Sincronizar cambios
npx cap sync ios

# Abrir en Xcode
npx cap open ios
```

#### En Xcode:
1. Selecciona el proyecto `App` en el navegador
2. Ve a **Signing & Capabilities**
3. Selecciona tu **Team** (Apple Developer Account)
4. Cambia el **Bundle Identifier** a uno único (ej: `com.tuempresa.emocionaliaplus`)
5. Configura **App Icon** en `Assets.xcassets`
6. Agrega **Screenshots** requeridos
7. Build para **Any iOS Device (arm64)**
8. Product → Archive
9. Sube a App Store Connect

#### Información requerida en App Store Connect:
- **App Name**: EmocionalIA+
- **Subtitle**: Tu asistente de bienestar mental con IA
- **Category**: Health & Fitness / Medical
- **Age Rating**: 17+ (debido a contenido de salud mental)
- **Privacy Policy URL**: [tu URL]
- **Support URL**: [tu URL]
- **Screenshots**: Usa los de `public/screenshot-*.png`

### 4. Android (Google Play)

#### Pre-requisitos
- Android Studio instalado
- Google Play Developer Account ($25 única vez)

#### Pasos

```bash
# Agregar plataforma Android (solo primera vez)
npx cap add android

# Actualizar plataforma
npx cap update android

# Sincronizar cambios
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

#### En Android Studio:

1. **Cambiar Application ID**:
   - Abre `android/app/build.gradle`
   - Cambia `applicationId "app.lovable.77ff80669c5b40e7b3ed7ffe793f210e"` a tu ID único

2. **Configurar Keystore para firma**:
```bash
# Generar keystore
keytool -genkey -v -keystore emocionaliaplus.keystore -alias emocionaliaplus -keyalg RSA -keysize 2048 -validity 10000
```

3. **Configurar en `android/app/build.gradle`**:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../emocionaliaplus.keystore")
            storePassword "tu-password"
            keyAlias "emocionaliaplus"
            keyPassword "tu-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

4. **Build Release**:
   - Build → Generate Signed Bundle/APK
   - Selecciona **Android App Bundle**
   - Selecciona tu keystore
   - Elige **release**

5. **Subir a Google Play Console**:
   - Crea una nueva aplicación
   - Completa la información requerida
   - Sube el `.aab` generado

#### Información requerida en Google Play Console:
- **App Name**: EmocionalIA+
- **Short Description**: Asistente IA para salud mental
- **Full Description**: Ver `STORE_METADATA.md`
- **Category**: Health & Fitness
- **Content Rating**: Completa el cuestionario
- **Privacy Policy URL**: [tu URL]
- **Screenshots**: 
  - Mínimo 2 por cada tipo de dispositivo
  - Usa los de `public/screenshot-*.png`
- **Feature Graphic**: 1024x500px

## 🔐 Configuración de Producción

### Variables de Entorno

**IMPORTANTE**: Para producción, configura estas variables:

1. **Supabase** (ya configurado):
   - URL: `https://yquttchxjkhclipqhbze.supabase.co`
   - Anon Key: Ya incluido en el código

2. **Web3 - Mainnet** (actualmente en testnet):
   - Actualiza los smart contracts en `src/components/web3/CryptoPayment.tsx`
   - Despliega contratos a mainnet (Ethereum/Polygon)
   - Actualiza las direcciones de los contratos

3. **Stripe** (si está configurado):
   - Cambia las API keys de test a producción en Supabase Secrets

### Seguridad

Antes de producción:
- ✅ RLS habilitado en todas las tablas
- ✅ Secrets configurados en Supabase
- ⚠️ **PENDIENTE**: Cambiar contratos Web3 de testnet a mainnet
- ⚠️ **PENDIENTE**: Configurar 2FA para operaciones críticas Web3
- ✅ HTTPS habilitado (automático con Lovable/Supabase)

## 🚀 Deployment del Backend

### Edge Functions
Las Edge Functions se despliegan automáticamente cuando haces push a GitHub (si tienes CI/CD configurado) o:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref yquttchxjkhclipqhbze

# Deploy functions
supabase functions deploy
```

### Database Migrations
Ya están aplicadas en Supabase. Si necesitas aplicar nuevas:

```bash
supabase db push
```

## 📊 Monitoreo Post-Launch

1. **Supabase Dashboard**:
   - Monitorea uso de Edge Functions
   - Revisa logs de errores
   - Verifica métricas de base de datos

2. **App Store Analytics**:
   - Downloads
   - Crashes
   - User reviews

3. **Web3 Monitoring**:
   - Monitorea transacciones en Etherscan/Polygonscan
   - Revisa logs de contratos
   - Verifica NFT minting

## ⚠️ Últimas Acciones Antes de Publicar

### 1. Smart Contracts (CRÍTICO)
Actualmente los contratos están en **TESTNET**. Para producción:

```bash
# Navega al directorio de contratos (si existe)
cd contracts

# Deploy a mainnet
# Ethereum Mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Polygon Mainnet
npx hardhat run scripts/deploy.js --network polygon

# Actualiza las direcciones en:
# - src/components/web3/CryptoPayment.tsx (líneas 12-15)
# - SMART_CONTRACTS.md
```

### 2. Configurar URLs de Producción

En `capacitor.config.ts`:
- ✅ Sección `server` ya está comentada

### 3. Testing Final

```bash
# Test de build
npm run build

# Test en dispositivo real
npx cap run ios
npx cap run android
```

### 4. Privacy Policy y Terms

Asegúrate de tener:
- ✅ Privacy Policy (ver `PRIVACY_POLICY.md`)
- ⚠️ **PENDIENTE**: Subir a tu sitio web
- ⚠️ **PENDIENTE**: Terms of Service

### 5. Recursos de Emergencia

Verifica que los números de emergencia en la app sean correctos para tu región:
- Ecuador: 911, 171
- Actualiza en `src/components/groups/CrisisHelpModal.tsx` si es necesario

## 📋 Checklist Final

- [ ] Build de producción sin errores (`npm run build`)
- [ ] Capacitor config sin URL de desarrollo
- [ ] Smart contracts desplegados a mainnet
- [ ] Stripe keys de producción configuradas
- [ ] Privacy Policy publicada online
- [ ] Terms of Service publicados online
- [ ] Screenshots actualizados (mínimo 5 por plataforma)
- [ ] App icons en todas las resoluciones
- [ ] Testeado en dispositivos reales (iOS + Android)
- [ ] Números de emergencia verificados
- [ ] URLs de soporte configuradas
- [ ] Email de contacto configurado

## 🎯 Próximos Pasos

1. **Inmediato**:
   - [ ] Subir código a GitHub (usar botón "Export to GitHub")
   - [ ] Desplegar contratos a mainnet
   - [ ] Publicar Privacy Policy en tu sitio

2. **Antes de Submit**:
   - [ ] Build y test en dispositivos físicos
   - [ ] Preparar screenshots finales
   - [ ] Escribir release notes

3. **Submit a Stores**:
   - [ ] App Store Connect
   - [ ] Google Play Console

4. **Post-Launch**:
   - [ ] Monitorear crashes
   - [ ] Responder reviews
   - [ ] Iterar basado en feedback

## 📞 Soporte

- **Web3 Issues**: Ver `WEB3_INTEGRATION_GUIDE.md`
- **Smart Contracts**: Ver `SMART_CONTRACTS.md`
- **General**: Ver `README.md`

---

**Estado**: ✅ 95% Listo para Producción

**Pendientes Críticos**:
1. Deploy smart contracts a mainnet
2. Publicar Privacy Policy online
3. Testing en dispositivos físicos
