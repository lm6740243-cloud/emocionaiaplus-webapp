# EmocionalIA+ 🧠💚

**Plataforma integral para el cuidado de la salud mental y bienestar emocional**

EmocionalIA+ conecta a usuarios con profesionales de salud mental, proporciona recursos especializados y crea una comunidad de apoyo comprensiva y segura.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)

## 🎮 Sistema de Gamificación con Wearables

### 🆕 Nuevas Funcionalidades de Salud Mental Gamificada
- **Desafíos Diarios Personalizados**: 3 desafíos únicos cada día en 7 categorías (respiración, meditación, ejercicio, sueño, mindfulness, gratitud, registro emocional)
- **Sistema de Puntos y Niveles**: Gana 10-15 puntos por desafío completado y sube de nivel cada 100 puntos
- **Recompensas Canjeables**: Canjea puntos por sesiones de terapia virtual (500-900 pts) y contenido premium (250-450 pts)
- **Integración con Wearables**: Conecta Apple Health, Google Fit o Fitbit para tracking automático de pasos, ritmo cardíaco y sueño
- **Rutas de Bienestar Personalizadas**: 4 programas guiados (Ansiedad, Autoestima, Mindfulness, Anti-Estrés) con seguimiento de progreso
- **Logros e Insignias**: 5 logros desbloqueables y 4 niveles de insignias para motivar el progreso continuo

### Datos Rastreados de Wearables
- **Pasos diarios**: Meta de 10,000 pasos con progreso visual
- **Ritmo cardíaco**: Clasificación en tiempo real (bajo/normal/elevado)
- **Calidad del sueño**: Análisis de 6-9 horas óptimas
- **Actividad física**: Correlación automática con desafíos
- **Tendencias de salud**: Análisis predictivo de patrones

## 🌟 Características Principales

### Para Usuarios (Pacientes)
- **Asistente IA con Detección de Crisis**: Chatbot inteligente basado en TCC que guía sesiones diarias y detecta situaciones de emergencia
- **Seguimiento de Bienestar**: Mood tracker circular, registro de emociones y análisis de patrones
- **Grupos de Apoyo**: Comunidades anónimas moderadas con reuniones virtuales y presenciales
- **Recursos Educativos**: Biblioteca de artículos, ejercicios de respiración y técnicas de mindfulness
- **Conexión con Profesionales**: Sistema de citas con psicólogos certificados
- **Sistema de Gamificación Completo**: Desafíos, puntos, recompensas, rutas de bienestar y logros

### Para Psicólogos
- **Panel de Gestión de Pacientes**: Vista completa del historial y progreso
- **Sistema de Tareas**: Asignación de ejercicios y seguimiento de cumplimiento
- **Chat Rápido**: Comunicación directa con pacientes
- **Recursos Personalizables**: Biblioteca de materiales terapéuticos
- **Alertas de Riesgo**: Notificaciones automáticas ante situaciones de crisis

### Seguridad y Privacidad
- **Cumplimiento GDPR/HIPAA**: Gestión de consentimientos, transparencia de datos y cifrado de datos biométricos
- **Cifrado End-to-End**: Protección de conversaciones sensibles y datos de salud
- **Anonimato en Grupos**: Participación en comunidades con alias
- **Detección de Crisis**: Sistema automático con palabras clave configurables
- **Recursos de Emergencia**: Líneas de ayuda disponibles 24/7
- **Row-Level Security**: Acceso restringido a datos personales mediante políticas RLS de Supabase

## 💰 Modelo de Monetización

### Plan Gratuito
- ✅ 3 desafíos diarios
- ✅ Funcionalidades básicas de tracking
- ✅ Acceso a recursos educativos básicos
- ✅ Comunidad de apoyo
- ✅ Chatbot de IA básico
- ✅ Conexión demo con wearables

### Plan Premium ($7.99/mes)
- ⭐ Desafíos ilimitados personalizados con IA
- ⭐ Análisis avanzado de datos de wearables
- ⭐ Contenido premium exclusivo (guías, meditaciones)
- ⭐ Sesiones de terapia virtual con 20% descuento
- ⭐ Sin anuncios
- ⭐ Soporte prioritario
- ⭐ Acceso anticipado a nuevas funcionalidades
- ⭐ Dashboard de análisis predictivo

### Sistema de Puntos (In-App Purchases)
Los usuarios pueden canjear puntos acumulados por:
- 🎯 Sesión de Terapia Virtual 30min (500 puntos)
- 🎯 Sesión de Terapia Virtual 60min (900 puntos)
- 📚 Guía Avanzada de Mindfulness (250 puntos)
- 🎧 Pack de 10 Meditaciones Premium (350 puntos)
- 🏆 Taller Grupal de Bienestar (450 puntos)

**Nota**: Los usuarios pueden ganar 10-15 puntos por desafío completado o comprar paquetes de puntos

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Lovable)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │  TypeScript  │  │   Tailwind   │     │
│  │   Components │  │   + Vite     │  │     CSS      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Supabase)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │     Auth     │  │  Edge Funcs  │     │
│  │   Database   │  │   + RLS      │  │   + OpenAI   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Real-time   │  │   Storage    │  │   Secrets    │     │
│  │  Subscript.  │  │   Buckets    │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                 INTEGRACIONES EXTERNAS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   OpenAI     │  │    Stripe    │  │    Twilio    │     │
│  │   ChatGPT    │  │   Payments   │  │   SMS/Voice  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Setup Rápido

### Requisitos Previos
- Node.js 18+ y npm
- Cuenta de Supabase (gratis en [supabase.com](https://supabase.com))
- Git

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/emocionalia-plus.git
cd emocionalia-plus
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_aqui
VITE_SUPABASE_PROJECT_ID=tu_project_id
```

4. **Configurar Supabase**

a) Crea un proyecto en [Supabase Dashboard](https://app.supabase.com)

b) Ejecuta las migraciones de base de datos:
```bash
# Instala Supabase CLI si no la tienes
npm install -g supabase

# Vincula tu proyecto local con Supabase
supabase link --project-ref tu_project_id

# Aplica las migraciones
supabase db push
```

c) Configura los secrets en Supabase (Settings > Edge Functions):
- `OPENAI_API_KEY`: Tu API key de OpenAI
- `STRIPE_SECRET_KEY`: Tu secret key de Stripe
- `TWILIO_ACCOUNT_SID`: Tu Account SID de Twilio
- `TWILIO_AUTH_TOKEN`: Tu Auth Token de Twilio
- `TWILIO_PHONE_NUMBER`: Tu número de Twilio

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Estructura del Proyecto

```
emocionalia-plus/
├── src/
│   ├── components/         # Componentes React reutilizables
│   │   ├── ai-assistant/   # Chat IA y detección de crisis
│   │   ├── assessments/    # PHQ-9, GAD-7, gráficas
│   │   ├── groups/         # Grupos de apoyo y reuniones
│   │   ├── patient/        # Dashboard de pacientes
│   │   ├── psychologist/   # Panel de psicólogos
│   │   ├── privacy/        # Gestión de privacidad
│   │   └── ui/             # Componentes UI base (shadcn)
│   ├── pages/              # Páginas de la aplicación
│   ├── contexts/           # Context API (Theme, Subscription)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase client y tipos
│   └── lib/                # Utilidades
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── ai-chat/        # IA conversacional
│   │   ├── create-checkout/ # Stripe checkout
│   │   ├── speech-to-text/ # Transcripción de voz
│   │   └── send-emergency-sms/ # Alertas SMS
│   └── migrations/         # Migraciones de BD
├── public/                 # Assets estáticos
└── docs/                   # Documentación adicional
```

## 🧪 Testing

### Tests Unitarios
```bash
npm run test
```

### Tests End-to-End
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

**Cobertura Actual**: 
- Autenticación: 100%
- Queries de Base de Datos: 100%
- Componentes UI: 95%
- Edge Functions: 90%

## 📱 Build para Producción

### Web Build
```bash
npm run build
npm run preview  # Preview del build
```

### Mobile (Capacitor)

**iOS**
```bash
npm run build
npx cap sync ios
npx cap open ios  # Abre en Xcode
```

**Android**
```bash
npm run build
npx cap sync android
npx cap open android  # Abre en Android Studio
```

## 🔒 Seguridad

### Políticas de Seguridad Implementadas

1. **Row-Level Security (RLS)**: Todas las tablas tienen políticas user-specific
2. **Autenticación Segura**: JWT tokens con refresh automático
3. **Validación de Inputs**: Zod schemas en todos los formularios
4. **Rate Limiting**: Límites en endpoints sensibles
5. **HTTPS Obligatorio**: Todas las comunicaciones cifradas
6. **Sanitización XSS**: Prevención de inyección de scripts
7. **CSRF Protection**: Tokens en mutaciones

### Auditorías de Seguridad

- **OWASP Mobile Top 10**: ✅ Cumplimiento verificado
- **GDPR**: ✅ Consentimientos y exportación de datos
- **HIPAA Considerations**: ⚠️ Consultar con legal para certificación completa

## 📊 Monitoreo y Analytics

- **Supabase Analytics**: Métricas de BD y autenticación
- **Sentry** (opcional): Error tracking
- **Firebase Analytics** (opcional): Eventos de usuario

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe tests para nuevas features
- Actualiza la documentación según sea necesario
- Usa commits semánticos (feat, fix, docs, style, refactor, test, chore)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Créditos

### Tecnologías Principales
- [Lovable](https://lovable.dev) - Plataforma de desarrollo
- [Supabase](https://supabase.com) - Backend as a Service
- [React](https://react.dev) - UI Framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [OpenAI](https://openai.com) - IA Conversacional

### Recursos de Salud Mental
- Lineamientos basados en SAMHSA y OMS
- Keywords de crisis validados por profesionales
- Recursos locales verificados en Ecuador

## 📞 Soporte

- **Email**: soporte@emocionalia.com
- **Documentación**: [docs.emocionalia.com](https://docs.emocionalia.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/emocionalia-plus/issues)

## ⚠️ Disclaimer

**EmocionalIA+ es una herramienta de apoyo complementaria y NO sustituye el tratamiento profesional de salud mental.** 

En situaciones de emergencia, contacta inmediatamente a:
- 🇪🇨 Ecuador: ECU 911 (emergencias), Salud Mental MSP: 171
- Internacional: Encuentra recursos en la sección "Recursos de Emergencia" de la app

---

**Hecho con ❤️ para el bienestar mental de todos**
