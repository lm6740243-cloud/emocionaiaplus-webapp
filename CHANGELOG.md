# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [1.0.0] - 2025-01-15

### 🎉 Lanzamiento Inicial

#### Añadido - Core Features

##### Para Usuarios (Pacientes)
- **Asistente IA Conversacional**
  - Chat inteligente basado en OpenAI GPT-4
  - Tres tonos configurables: profesional, motivacional, relajado
  - Detección automática de crisis con keywords configurables
  - Historial de conversaciones persistente
  - Entrada por voz (speech-to-text)
  
- **Dashboard Personalizado**
  - Mood tracker circular visual
  - Estadísticas de progreso semanal
  - Actividades diarias sugeridas
  - Quick stats de bienestar
  
- **Grupos de Apoyo**
  - Creación y búsqueda de grupos locales
  - Chat grupal en tiempo real
  - Moderación automática y manual
  - Reuniones virtuales y presenciales
  - Sistema de asistentes con recordatorios
  - Presencia en línea de miembros
  
- **Recursos Educativos**
  - Biblioteca de artículos sobre salud mental
  - Ejercicios de respiración guiados
  - Técnicas de mindfulness y relajación
  - Recursos locales verificados (Ecuador)
  - Líneas de ayuda 24/7
  
- **Seguimiento de Bienestar**
  - Registro diario de emociones
  - Mood tracker con gráficas
  - Integración con wearables (preparado)
  - Recomendaciones basadas en patrones
  
- **Evaluaciones Clínicas**
  - Cuestionario PHQ-9 (depresión)
  - Cuestionario GAD-7 (ansiedad)
  - Gráficas de progreso temporal
  - Estadísticas de impacto global

##### Para Psicólogos
- **Panel de Gestión**
  - Lista de pacientes asignados
  - Perfiles detallados con historial clínico
  - Alertas de riesgo prioritizadas
  - Notas privadas por paciente
  
- **Sistema de Tareas**
  - Asignación de ejercicios terapéuticos
  - Seguimiento de cumplimiento
  - Priorización (alta, media, baja)
  - Fechas de vencimiento
  
- **Comunicación**
  - Chat rápido con pacientes
  - Notificaciones en tiempo real
  - Estado de lectura de mensajes
  
- **Recursos Compartibles**
  - Biblioteca personal de materiales
  - Asignación de recursos a pacientes
  - Tracking de recursos completados
  
- **Calendario de Citas**
  - Programación de sesiones
  - Gestión de disponibilidad
  - Recordatorios automáticos

#### Seguridad y Privacidad
- **Autenticación Robusta**
  - Email/password con Supabase Auth
  - Reset de contraseña seguro
  - Confirmación de email configurable
  - Refresh tokens automático
  
- **Row-Level Security (RLS)**
  - Políticas user-specific en todas las tablas
  - Aislamiento completo de datos entre usuarios
  - Roles diferenciados (paciente, psicólogo, admin)
  - Security definer functions para queries complejas
  
- **Gestión de Consentimientos**
  - Consentimiento informado obligatorio
  - Gestión de cookies personalizada
  - Transparencia de uso de datos IA
  - Exportación de datos personales (GDPR)
  - Eliminación completa de cuenta
  
- **Protección de Datos Sensibles**
  - Cifrado de contraseñas con bcrypt
  - Secrets management en Supabase
  - Logs de acceso auditables
  - Validación de inputs con Zod

#### Integraciones Externas
- **OpenAI (GPT-4)**
  - Chat conversacional terapéutico
  - Detección de sentimientos en mensajes
  - Análisis de patrones emocionales
  
- **Stripe**
  - Suscripciones premium
  - Checkout seguro
  - Customer portal
  - Webhook para eventos
  
- **Twilio**
  - SMS de emergencia
  - Notificaciones críticas
  - Alertas a contactos de emergencia

#### Sistema de Alertas y Crisis
- **Detección Automática**
  - 50+ keywords de crisis categorizadas
  - Niveles de severidad (bajo, medio, alto, crítico)
  - Detección en chat IA y grupos
  - Logging completo de alertas
  
- **Protocolo de Emergencia**
  - Notificación automática a psicólogo asignado
  - SMS a contacto de emergencia
  - Modal de recursos inmediatos
  - Líneas de ayuda 24/7 accesibles
  
- **Panel de Moderación**
  - Revisión de alertas en grupos
  - Acciones: silenciar, expulsar, banear
  - Chat privado moderador-miembro
  - Historial de moderación

#### Gamificación y Engagement
- **Sistema de Logros**
  - Racha de días consecutivos
  - Ejercicios completados
  - Participación en grupos
  - Progreso en evaluaciones
  
- **Niveles y Progreso**
  - XP por actividades completadas
  - Niveles visuales con badges
  - Recompensas desbloqueables

#### UI/UX
- **Design System**
  - Tokens semánticos de color HSL
  - Dark/Light mode completo
  - Paleta calmante con pasteles
  - Componentes shadcn/ui customizados
  
- **Navegación Intuitiva**
  - Tab bar principal (Paciente, Psicólogo, Grupos, Recursos)
  - Breadcrumbs en secciones complejas
  - Estados de loading elegantes
  - Toasts informativos
  
- **Accesibilidad**
  - Alt text en imágenes
  - Contraste WCAG AA
  - Keyboard navigation
  - Screen reader friendly

#### Edge Functions (Supabase)
- `ai-chat`: Conversación con IA y detección de crisis
- `create-checkout`: Stripe checkout sessions
- `customer-portal`: Portal de cliente Stripe
- `send-notification`: Push notifications
- `send-emergency-sms`: SMS de emergencia Twilio
- `speech-to-text`: Transcripción de audio
- `text-to-speech`: Síntesis de voz
- `check-subscription`: Validación de suscripciones

#### Base de Datos (Supabase PostgreSQL)
**Tablas Principales:**
- `profiles`: Perfiles de usuario
- `patients`: Información de pacientes
- `user_roles`: Sistema de roles
- `chat_sessions`: Sesiones de chat IA
- `chat_messages`: Mensajes de chat
- `mood_entries`: Registro de emociones
- `wellness_tracking`: Seguimiento de bienestar
- `support_groups`: Grupos de apoyo
- `grupo_miembros`: Miembros de grupos
- `grupo_mensajes`: Mensajes de grupos
- `grupo_reuniones`: Reuniones programadas
- `alertas_riesgo`: Alertas de crisis
- `crisis_keywords`: Keywords configurables
- `recursos_locales`: Recursos verificados
- `appointments`: Citas con psicólogos
- `tasks`: Tareas asignadas
- `assessments`: Evaluaciones clínicas
- `notifications`: Sistema de notificaciones

**Funciones y Triggers:**
- `handle_new_user()`: Creación automática de perfil
- `handle_new_group()`: Configuración de grupos nuevos
- `detect_crisis_in_message()`: Detección de crisis
- `moderate_member()`: Acciones de moderación
- `get_nearby_groups()`: Búsqueda geolocalizada
- `get_local_resources()`: Recursos por ubicación
- `send_meeting_reminders()`: Recordatorios automáticos
- `has_role()`: Verificación de roles (security definer)

#### Localización
- Español (ES) - Completo
- Inglés (EN) - Preparado para expansión

#### Documentación
- README.md completo con setup
- Guías de contribución
- Diagrama de arquitectura
- API documentation básica

---

## [Unreleased]

### Planeado para v1.1.0
- [ ] Integración completa con wearables (Fitbit, Apple Watch)
- [ ] Videollamadas integradas para terapia
- [ ] Modo offline con sync automático
- [ ] Notificaciones push nativas
- [ ] Localización completa EN/FR/PT
- [ ] Tests E2E automatizados (Cypress)
- [ ] Analytics avanzado (Firebase)
- [ ] Journaling con prompts IA

### Mejoras en Consideración
- [ ] Exportación de datos en PDF
- [ ] Integración con Google Calendar
- [ ] Chat de voz en tiempo real
- [ ] Biblioteca de meditaciones guiadas
- [ ] Planes familiares
- [ ] Certificación HIPAA completa
- [ ] App nativa (React Native)

---

## Notas de Versión

### v1.0.0 - Detalles Técnicos

**Stack:**
- Frontend: React 18.3.1 + Vite 5
- Backend: Supabase (PostgreSQL + Edge Functions)
- UI: Tailwind CSS 3 + shadcn/ui
- State: React Query + Context API
- Routing: React Router 6.30.1

**Requisitos de Sistema:**
- Node.js: 18+
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile Web: iOS 15+, Android 8+

**Rendimiento:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices, SEO)

**Seguridad:**
- RLS habilitado en 100% de tablas
- Secrets management vía Supabase Vault
- Rate limiting en endpoints críticos
- Input validation con Zod
- XSS/CSRF protection

**Cumplimiento:**
- GDPR: Consentimientos + Right to be Forgotten
- Disclaimer médico visible
- Privacy Policy integrada
- Terms of Service

---

## Soporte de Versiones

| Versión | Estado      | Lanzamiento | Fin de Soporte |
|---------|-------------|-------------|----------------|
| 1.0.x   | Estable     | 2025-01-15  | 2026-01-15     |

---

**Formato del Changelog:**
- `Added` (Añadido): Nuevas funcionalidades
- `Changed` (Cambiado): Cambios en funcionalidades existentes
- `Deprecated` (Obsoleto): Funcionalidades que se eliminarán
- `Removed` (Eliminado): Funcionalidades eliminadas
- `Fixed` (Corregido): Corrección de bugs
- `Security` (Seguridad): Parches de seguridad
