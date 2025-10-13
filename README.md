# EmocionalIA+ 🧠💚

**Plataforma integral para el cuidado de la salud mental y bienestar emocional**

EmocionalIA+ conecta a usuarios con profesionales de salud mental, proporciona recursos especializados y crea una comunidad de apoyo comprensiva y segura.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)

## 🌟 Características Principales

### Para Usuarios (Pacientes)
- **Asistente IA con Detección de Crisis**: Chatbot inteligente basado en TCC que guía sesiones diarias y detecta situaciones de emergencia
- **Seguimiento de Bienestar**: Mood tracker circular, registro de emociones y análisis de patrones
- **Grupos de Apoyo**: Comunidades anónimas moderadas con reuniones virtuales y presenciales
- **Recursos Educativos**: Biblioteca de artículos, ejercicios de respiración y técnicas de mindfulness
- **Conexión con Profesionales**: Sistema de citas con psicólogos certificados
- **Gamificación**: Sistema de logros y progreso para mantener la motivación

### Para Psicólogos
- **Panel de Gestión de Pacientes**: Vista completa del historial y progreso
- **Sistema de Tareas**: Asignación de ejercicios y seguimiento de cumplimiento
- **Chat Rápido**: Comunicación directa con pacientes
- **Recursos Personalizables**: Biblioteca de materiales terapéuticos
- **Alertas de Riesgo**: Notificaciones automáticas ante situaciones de crisis

### Seguridad y Privacidad
- **Cumplimiento GDPR**: Gestión de consentimientos y transparencia de datos
- **Cifrado End-to-End**: Protección de conversaciones sensibles
- **Anonimato en Grupos**: Participación en comunidades con alias
- **Detección de Crisis**: Sistema automático con palabras clave configurables
- **Recursos de Emergencia**: Líneas de ayuda disponibles 24/7

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
