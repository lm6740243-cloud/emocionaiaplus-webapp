# 🧪 Guía de Beta Testing - EmocionalIA+ v1.0.0

## 📋 Resumen Ejecutivo

Esta guía proporciona instrucciones completas para reclutar beta testers externos, distribuir builds de prueba y recolectar feedback estructurado para EmocionalIA+ antes del lanzamiento público en App Store y Google Play.

**Estado actual:** ✅ Release Candidate 1.0.0  
**Objetivo:** Completar 2-4 semanas de testing externo con 20-50 usuarios reales  
**Meta de lanzamiento:** Después de resolver bugs críticos y recolectar feedback

---

## 🎯 Objetivos del Beta Testing

### Objetivos Técnicos
- ✅ Validar estabilidad en dispositivos reales (iOS 15+, Android 8+)
- ✅ Identificar bugs críticos y crashes
- ✅ Probar rendimiento en conexiones 3G/4G/5G/WiFi
- ✅ Verificar compatibilidad cross-device
- ✅ Evaluar tiempos de carga y UX

### Objetivos de Producto
- ✅ Validar usabilidad con usuarios reales
- ✅ Recolectar feedback sobre features clave (IA, mood tracker, grupos)
- ✅ Identificar pain points en onboarding
- ✅ Evaluar claridad de mensajes y UI
- ✅ Medir engagement y retención temprana

### Objetivos de Negocio
- ✅ Validar value proposition
- ✅ Obtener testimonios para marketing
- ✅ Identificar segmentos de usuarios más activos
- ✅ Refinar pricing y features premium

---

## 👥 Reclutamiento de Beta Testers

### Perfil Ideal de Tester (Target: 20-50 personas)

**Demografía:**
- 📍 Ubicación: Ecuador (80%), LATAM (15%), Otros (5%)
- 👤 Edad: 18-45 años
- 🎓 Interés en salud mental, bienestar o tecnología
- 📱 Propietarios de iPhone (iOS 15+) o Android (8.0+)

**Distribución Sugerida:**
- 40% Usuarios generales (pacientes potenciales)
- 30% Profesionales de salud mental (psicólogos)
- 20% Tech-savvy early adopters
- 10% Usuarios con experiencia en grupos de apoyo

### Canales de Reclutamiento

#### 1. Redes Sociales (Principales)
```
📱 Instagram/Facebook:
- Publicar en grupos de salud mental Ecuador
- Stories con formulario de inscripción
- Hashtags: #SaludMentalEcuador #BienestarDigital #BetaTesting

🐦 Twitter/X:
- Tweets dirigidos a comunidad tech y wellness
- Mencionar a influencers de salud mental

💼 LinkedIn:
- Posts en grupos de psicología profesional
- Mensaje directo a psicólogos certificados
```

#### 2. Universidades y Centros de Salud
```
🎓 Contactar:
- Facultades de Psicología (PUCE, USFQ, UCE)
- Clínicas universitarias
- Grupos estudiantiles de salud mental

📧 Ofrecer:
- Acceso early bird gratuito
- Certificado de participación en beta
- Posibilidad de influir en el producto final
```

#### 3. Comunidades Online
```
💬 Plataformas:
- Reddit: r/Ecuador, r/mentalhealth
- Discord: Servidores de salud mental LATAM
- Telegram: Grupos de bienestar

🎁 Incentivos:
- Premium gratis por 6 meses
- Merchandising exclusivo
- Reconocimiento público como beta tester
```

### 📝 Formulario de Inscripción

**URL sugerida:** https://forms.gle/emocionaliaplus-beta

**Preguntas clave:**
1. Nombre completo
2. Email (para invitación TestFlight/Google Play)
3. Tipo de dispositivo (iPhone modelo X / Android marca Y)
4. Versión de OS
5. ¿Te identificas como? (Paciente / Profesional / Ambos)
6. ¿Has usado apps de salud mental antes? (Sí/No, cuáles)
7. ¿Cuánto tiempo puedes dedicar al testing? (1-2h/semana / 3-5h/semana)
8. ¿Qué esperas de EmocionalIA+? (Texto libre)
9. Acepto NDA y términos de beta testing (Checkbox)

---

## 📱 Distribución de Builds Beta

### iOS - TestFlight

#### Paso 1: Preparar App en App Store Connect
```bash
# En tu máquina local con Xcode
cd emocionaliaplus-webapp
npx cap sync ios
npx cap open ios

# En Xcode:
1. Product > Archive
2. Distribute App > App Store Connect
3. Upload
```

#### Paso 2: Configurar TestFlight
```
1. Ir a App Store Connect > TestFlight
2. Crear grupo "Beta Externos"
3. Agregar build 1.0.0
4. Completar información de testing:
   - Descripción de cambios
   - Email de contacto
   - Información de beta testing
5. Enviar para revisión de Apple (1-2 días)
```

#### Paso 3: Invitar Testers
```
Opción A: Por email individual
- Agregar emails de testers uno por uno
- Apple envía invitación automática

Opción B: Link público
- Generar link público de TestFlight
- Compartir link: https://testflight.apple.com/join/XXXXX
- Límite: 10,000 testers
```

**Email de invitación sugerido:**
```
Asunto: 🧠 Únete al Beta de EmocionalIA+ (iOS)

Hola [Nombre],

¡Gracias por unirte al beta testing de EmocionalIA+! 🎉

Para instalar la app en tu iPhone/iPad:
1. Descarga TestFlight (gratis): https://apps.apple.com/app/testflight/id899247664
2. Abre este link en tu dispositivo: [LINK TESTFLIGHT]
3. Acepta la invitación e instala EmocionalIA+

📝 Guía de testing: [LINK A NOTION/GOOGLE DOCS]
💬 Canal de feedback: [DISCORD/SLACK/EMAIL]
🐛 Reportar bugs: [FORM URL]

Duración del beta: 2-4 semanas
Compromiso: 1-2 horas/semana

¡Muchas gracias por ayudarnos a mejorar! 💚

Equipo EmocionalIA+
```

### Android - Google Play Internal Testing

#### Paso 1: Preparar AAB/APK
```bash
# Generar build de producción
cd emocionaliaplus-webapp
npm run build
npx cap sync android
npx cap open android

# En Android Studio:
1. Build > Generate Signed Bundle / APK
2. Seleccionar "Android App Bundle"
3. Crear/usar keystore (GUARDAR SEGURO)
4. Build variant: release
5. Generar AAB
```

#### Paso 2: Configurar Internal Testing en Play Console
```
1. Ir a Google Play Console > Versiones > Testing > Internal testing
2. Crear nueva versión
3. Subir AAB
4. Completar notas de versión
5. Guardar y revisar
6. Iniciar implementación para testers internos
```

#### Paso 3: Crear Lista de Testers
```
1. En Play Console > Configuración > Listas de testers
2. Crear lista "Beta Externos"
3. Agregar emails de testers
4. Compartir link de opt-in
```

**Email de invitación sugerido:**
```
Asunto: 🧠 Únete al Beta de EmocionalIA+ (Android)

Hola [Nombre],

¡Bienvenido/a al beta testing de EmocionalIA+! 🎉

Para instalar la app en tu Android:
1. Abre este link en tu dispositivo: [LINK PLAY CONSOLE]
2. Acepta unirte al programa beta
3. Instala EmocionalIA+ desde Google Play

📝 Guía de testing: [LINK]
💬 Canal de feedback: [LINK]
🐛 Reportar bugs: [FORM URL]

Duración: 2-4 semanas
Compromiso: 1-2 horas/semana

¡Gracias por ser parte de esto! 💚

Equipo EmocionalIA+
```

---

## 📊 Sistema de Recolección de Feedback

### 1. Encuesta Inicial (Día 0)
**Timing:** Inmediatamente después de instalar

**Preguntas (5 mins):**
1. ¿Pudiste instalar la app sin problemas? (Sí/No + comentarios)
2. Primera impresión (1-5 estrellas)
3. ¿El onboarding fue claro? (Sí/No + sugerencias)
4. ¿Completaste el perfil inicial? (Sí/No + por qué)

**Herramienta:** Google Forms / Typeform  
**URL:** Enviar por email después de instalación

### 2. Pruebas Dirigidas por Semana

#### Semana 1: Core Features
**Tareas:**
- ✅ Completar onboarding
- ✅ Registrar mood tracker 3 veces
- ✅ Conversar con IA (mínimo 10 mensajes)
- ✅ Explorar recursos educativos

**Feedback esperado:**
- Facilidad de uso (1-5)
- Bugs encontrados
- Features confusas
- Sugerencias de mejora

#### Semana 2: Features Sociales
**Tareas:**
- ✅ Unirse a 1-2 grupos de apoyo
- ✅ Enviar mensajes en grupo
- ✅ Registrarse a reunión virtual/presencial
- ✅ Probar chat con moderador (si aplicable)

**Feedback esperado:**
- Seguridad y moderación
- Claridad de normas
- Facilidad para encontrar grupos
- Calidad de interacciones

#### Semana 3: Features Premium & Profesionales
**Tareas:**
- ✅ Explorar evaluaciones clínicas (PHQ-9, GAD-7)
- ✅ Ver gráficas de progreso
- ✅ Probar features premium (si otorgadas)
- ✅ Conectar con psicólogo (profesionales)

**Feedback esperado:**
- Value proposition de premium
- Utilidad de evaluaciones
- Insights de gráficas
- Panel profesional (psicólogos)

#### Semana 4: Edge Cases & Estabilidad
**Tareas:**
- ✅ Usar app en diferentes condiciones de red (3G, WiFi lento)
- ✅ Probar con batería baja
- ✅ Abrir/cerrar app múltiples veces
- ✅ Intentar operaciones simultáneas

**Feedback esperado:**
- Crashes o freezes
- Consumo de batería
- Uso de datos móviles
- Tiempo de carga

### 3. Encuesta Semanal Rápida (2 mins)
**Enviada cada lunes:**

1. ¿Cuántas veces usaste la app esta semana? (0-20+)
2. Feature más usada: (Mood tracker / IA / Grupos / Recursos / Otro)
3. ¿Encontraste algún bug? (Sí/No + descripción)
4. Satisfacción general (1-10)
5. Un cambio que harías: (Texto libre)

### 4. Reporte de Bugs Estructurado
**Formulario siempre disponible:**

**Campos obligatorios:**
- Título del bug
- Descripción detallada
- Pasos para reproducir
- Comportamiento esperado vs. actual
- Screenshots/video (opcional pero recomendado)
- Dispositivo y OS version
- Severidad: (Crítico / Alto / Medio / Bajo)

**URL:** https://forms.gle/emocionaliaplus-bugs  
**También:** Email a beta@emocionaliaplus.com

### 5. Sesiones de Feedback en Vivo (Opcional)
**Timing:** Semana 2 y 4

**Formato:**
- Zoom/Google Meet (1 hora)
- 5-8 testers por sesión
- Moderador del equipo EmocionalIA+
- Grabación con permiso

**Agenda:**
- Demo de features nuevas (15 mins)
- Discusión abierta de experiencias (30 mins)
- Q&A y votación de features (15 mins)

---

## 📈 Métricas de Éxito del Beta

### Métricas Técnicas
| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| Crash rate | < 0.5% | < 1% |
| ANR rate (Android) | < 0.1% | < 0.5% |
| Tiempo de carga inicial | < 3s | < 5s |
| API response time | < 500ms | < 1s |
| Batería por sesión | < 5% | < 10% |

### Métricas de Engagement
| Métrica | Objetivo | Bueno |
|---------|----------|-------|
| DAU/MAU ratio | > 40% | > 25% |
| Sesiones por día | 2-3 | 1-2 |
| Retention D7 | > 50% | > 30% |
| Completion rate (onboarding) | > 80% | > 60% |
| Features activas por usuario | 3+ | 2+ |

### Métricas de Satisfacción
| Métrica | Objetivo | Aceptable |
|---------|----------|-----------|
| NPS (Net Promoter Score) | > 50 | > 30 |
| Satisfacción general | 4.5/5 | 4.0/5 |
| Feature satisfaction (IA) | 4.5/5 | 4.0/5 |
| Intención de recomendar | > 80% | > 60% |
| Intención de pagar (premium) | > 30% | > 15% |

---

## 🐛 Gestión de Bugs y Feedback

### Priorización de Bugs

**Crítico (P0) - Fix inmediato:**
- App crashes al abrir
- Pérdida de datos del usuario
- Features core completamente rotas
- Seguridad o privacidad comprometida

**Alto (P1) - Fix en 24-48h:**
- Features principales parcialmente rotas
- UX severamente degradada
- Bugs que afectan a >25% de usuarios

**Medio (P2) - Fix antes de launch:**
- Features secundarias rotas
- UX issues menores
- Bugs que afectan a <25% usuarios

**Bajo (P3) - Backlog post-launch:**
- Mejoras de UX/UI
- Features nuevas sugeridas
- Edge cases raros

### Tablero Kanban Sugerido

**Herramienta:** Trello / Linear / GitHub Projects

**Columnas:**
1. **Reportado** - Todos los bugs nuevos
2. **Triaged** - Priorizados (P0-P3)
3. **In Progress** - En desarrollo activo
4. **Ready for Testing** - Fix listo para validar
5. **Validated** - Tester confirmó el fix
6. **Closed** - Resuelto y deployado

### Comunicación con Testers

**Canal principal:** Discord/Slack  
**Estructura:**
```
#general - Anuncios y bienvenida
#bugs-críticos - P0 y P1
#bugs-menores - P2 y P3
#feedback-features - Sugerencias
#preguntas - Q&A
#off-topic - Comunidad
```

**Actualizaciones semanales:**
- Email cada viernes con:
  - Bugs resueltos esta semana
  - Features nuevas agregadas
  - Próximos focos de testing
  - Agradecimientos a top contributors

---

## 🎁 Incentivos y Reconocimientos

### Para Todos los Testers
- ✅ 6 meses de Premium gratis (valor $60)
- ✅ Badge especial "Beta Tester" en la app
- ✅ Early access a features nuevas
- ✅ Certificado digital de participación

### Para Top Contributors (Top 10 más activos)
- ✅ 1 año de Premium gratis (valor $100)
- ✅ Merchandise exclusivo (camiseta, stickers)
- ✅ Mención en "About" de la app
- ✅ Videollamada con el equipo fundador

### Para Reportes de Bugs Críticos
- ✅ $20-50 en créditos de app (según severidad)
- ✅ Reconocimiento público en changelog

---

## ✅ Criterios para Salir de Beta

### Checklist Pre-Launch

**Técnico:**
- [ ] 0 bugs P0 (críticos) pendientes
- [ ] < 5 bugs P1 (altos) pendientes
- [ ] Crash rate < 1%
- [ ] Todas las features core funcionan al 100%
- [ ] Tests de regresión pasados
- [ ] Tiempo de carga < 5s en 95% de casos

**Producto:**
- [ ] NPS > 30
- [ ] Satisfacción general > 4.0/5
- [ ] Retention D7 > 30%
- [ ] Onboarding completion > 60%
- [ ] Al menos 50% de testers completaron todas las tareas

**Legal/Compliance:**
- [ ] Privacy Policy aprobada por legal
- [ ] Términos de servicio finalizados
- [ ] GDPR compliance verificado
- [ ] Moderación de contenido configurada

**Marketing:**
- [ ] Al menos 10 testimonios recolectados
- [ ] Screenshots finales aprobados
- [ ] Store listing copy finalizada
- [ ] Landing page actualizada

---

## 📅 Timeline Sugerido

### Semana -1: Preparación
- [ ] Finalizar build 1.0.0
- [ ] Configurar TestFlight + Play Console
- [ ] Crear formularios de feedback
- [ ] Preparar documentación de testing
- [ ] Configurar Discord/Slack

### Semana 0: Reclutamiento
- [ ] Publicar formulario de inscripción
- [ ] Promocionar en redes sociales
- [ ] Contactar universidades y clínicas
- [ ] Seleccionar primeros 20-30 testers

### Semana 1-2: Beta Privado
- [ ] Invitar primeros testers
- [ ] Monitorear crashes diariamente
- [ ] Responder feedback rápidamente
- [ ] Fix bugs críticos en tiempo real

### Semana 3-4: Beta Extendido
- [ ] Invitar segunda ola (hasta 50 testers)
- [ ] Implementar feedback de semana 1-2
- [ ] Sesiones de feedback en vivo
- [ ] Preparar changelog final

### Semana 5: Pre-Launch
- [ ] Fix últimos bugs P1
- [ ] Validar todos los criterios de salida
- [ ] Generar build final 1.0.0
- [ ] Enviar para revisión en tiendas

### Semana 6-7: Revisión de Tiendas
- [ ] Responder consultas de Apple/Google
- [ ] Ajustes de último minuto (si necesario)
- [ ] Preparar comunicación de launch

### Semana 8: 🚀 LAUNCH
- [ ] Publicar en App Store y Google Play
- [ ] Notificar a beta testers
- [ ] Press release
- [ ] Campaña de marketing

---

## 📞 Contactos y Recursos

**Coordinador de Beta Testing:** [Nombre] - [email]  
**Soporte Técnico:** beta@emocionaliaplus.com  
**Discord de Beta Testers:** [Link]

**Documentación:**
- Testing Guide: [Link a Google Docs]
- Bug Report Template: [Link a Form]
- FAQ: [Link]

**Builds:**
- iOS TestFlight: [Link]
- Android Play Console: [Link]

---

## 🎉 Agradecimientos

El éxito de EmocionalIA+ depende de la generosidad y dedicación de nuestros beta testers. Cada bug reportado, cada sugerencia y cada minuto dedicado nos ayuda a crear una mejor experiencia para miles de usuarios que necesitan apoyo emocional.

**¡Gracias por ser parte de esta misión! 💚🧠**

---

**Última actualización:** 2025-01-20  
**Versión de la guía:** 1.0  
**Estado de beta:** Listo para iniciar reclutamiento ✅
