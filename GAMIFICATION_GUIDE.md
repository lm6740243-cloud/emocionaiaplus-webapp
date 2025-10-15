# Sistema de Gamificación de EmocionalIA+

## Descripción General

EmocionalIA+ integra un sistema completo de gamificación de salud mental que motiva a los usuarios mediante desafíos diarios, puntos canjeables y seguimiento con dispositivos wearables.

## Componentes Principales

### 1. Desafíos Diarios (`DailyChallenges.tsx`)

**Características:**
- Generación automática de 3 desafíos diarios únicos
- Diferentes categorías: respiración, meditación, registro emocional, gratitud, actividad física, sueño, mindfulness
- Sistema de dificultad (fácil, medio, difícil)
- Los desafíos expiran a medianoche
- Gana puntos al completar desafíos

**Tipos de Desafíos:**
- **Respiración** (10 pts): Ejercicios de respiración consciente de 5 minutos
- **Meditación** (15 pts): Sesiones de meditación matutina de 10 minutos
- **Registro Emocional** (10 pts): Registrar estado de ánimo 3 veces al día
- **Gratitud** (10 pts): Escribir 3 cosas por las que estás agradecido/a
- **Actividad Física** (15 pts): Completar 8,000 pasos según wearable
- **Sueño** (15 pts): Dormir 7-8 horas
- **Mindfulness** (15 pts): 3 momentos de atención plena

**Flujo de Uso:**
1. Al cargar la página, el sistema verifica si hay desafíos activos
2. Si no existen desafíos para hoy, genera 3 nuevos automáticamente
3. El usuario completa el desafío y marca como completado
4. Los puntos se acreditan automáticamente
5. Los desafíos se renuevan cada día a medianoche

### 2. Panel de Recompensas (`RewardsPanel.tsx`)

**Características:**
- Sistema de puntos acumulables
- Niveles de usuario basados en puntos totales
- Recompensas canjeables divididas en categorías
- Seguimiento de puntos disponibles y totales

**Recompensas Disponibles:**

**Terapia Virtual:**
- Sesión de 30 minutos: 500 puntos
- Sesión de 60 minutos: 900 puntos

**Contenido Premium:**
- Guía Avanzada de Mindfulness: 250 puntos
- Pack de 10 Meditaciones Premium: 350 puntos
- Taller Grupal de Bienestar: 450 puntos

**Sistema de Niveles:**
- Nivel 1: 0-99 puntos
- Nivel 2: 100-199 puntos
- Nivel 3: 200-299 puntos
- Y así sucesivamente (cada 100 puntos = 1 nivel)

**Flujo de Canje:**
1. Usuario acumula puntos completando desafíos
2. Navega por las recompensas disponibles
3. Verifica si tiene puntos suficientes
4. Canjea la recompensa
5. Los puntos se deducen automáticamente
6. La recompensa se registra en el sistema

### 3. Integración con Wearables (`WearableIntegration.tsx`)

**Dispositivos Soportados:**
- Apple Health
- Google Fit
- Fitbit

**Métricas Rastreadas:**
- Pasos diarios (meta: 10,000)
- Ritmo cardíaco (clasificación: bajo, normal, elevado)
- Horas de sueño (óptimo: 7-9 horas)

**Características:**
- Conexión en modo demo para pruebas
- Sincronización automática de datos
- Visualización en tiempo real de métricas
- Alertas basadas en datos biométricos

**Estados de Salud:**
- **Pasos**: Progreso hacia meta de 10,000 pasos
- **Ritmo Cardíaco**: 
  - Bajo: <60 bpm
  - Normal: 60-100 bpm
  - Elevado: >100 bpm
- **Sueño**:
  - Insuficiente: <6 horas
  - Óptimo: 6-9 horas
  - Excesivo: >9 horas

### 4. Gamificación Existente (`GamificationCard.tsx`)

**Rutas de Bienestar:**
- Ruta de Ansiedad: 12 pasos (intermedio)
- Ruta de Autoestima: 10 pasos (fácil)
- Ruta de Mindfulness: 15 pasos (avanzado)
- Ruta Anti-Estrés: 8 pasos (fácil)

**Logros Desbloqueables:**
- Primera meditación
- Racha de 7 días
- Explorador de emociones
- Maestro de respiración (20 sesiones)
- Biblioteca activa (5 recursos leídos)

**Insignias:**
- Principiante Zen (Básico)
- Guerrero de la Calma (Intermedio)
- Sabio Emocional (Avanzado)
- Maestro Interior (Experto)

## Base de Datos

### Tablas Principales

#### `daily_challenges`
```sql
- id: uuid (PK)
- user_id: uuid
- challenge_type: text
- title: text
- description: text
- difficulty: text (easy/medium/hard)
- points: integer
- completed: boolean
- completed_at: timestamp
- expires_at: timestamp
- metadata: jsonb
```

#### `user_points`
```sql
- id: uuid (PK)
- user_id: uuid (UNIQUE)
- total_points: integer
- available_points: integer
- level: integer
- created_at: timestamp
- updated_at: timestamp
```

#### `user_achievements`
```sql
- id: uuid (PK)
- user_id: uuid
- achievement_key: text
- unlocked_at: timestamp
- progress: integer
- metadata: jsonb
- UNIQUE(user_id, achievement_key)
```

#### `wellness_routes`
```sql
- id: uuid (PK)
- user_id: uuid
- route_type: text
- progress: integer
- completed_steps: jsonb
- started_at: timestamp
- completed_at: timestamp
- active: boolean
- UNIQUE(user_id, route_type)
```

#### `reward_redemptions`
```sql
- id: uuid (PK)
- user_id: uuid
- reward_type: text
- points_cost: integer
- redeemed_at: timestamp
- status: text
- metadata: jsonb
```

## Seguridad y Privacidad

### Row-Level Security (RLS)
Todas las tablas tienen políticas RLS habilitadas:
- Los usuarios solo pueden ver sus propios datos
- Los usuarios solo pueden modificar sus propios registros
- El sistema puede crear desafíos para todos los usuarios

### Cumplimiento GDPR/HIPAA
- Datos biométricos encriptados
- Acceso restringido mediante RLS
- Auditoría completa de accesos
- Políticas de retención de datos

## Flujo Completo del Usuario

1. **Login**: Usuario inicia sesión
2. **Dashboard**: Ve sus estadísticas generales
3. **Desafíos**: Recibe 3 desafíos diarios personalizados
4. **Wearables**: Conecta dispositivo para tracking automático
5. **Completar**: Realiza actividades y marca desafíos como completados
6. **Puntos**: Acumula puntos automáticamente
7. **Niveles**: Sube de nivel cada 100 puntos
8. **Recompensas**: Canjea puntos por terapias y contenido
9. **Rutas**: Progresa en rutas de bienestar personalizadas
10. **Logros**: Desbloquea logros e insignias

## Expansión Futura

### Características Planificadas:
- [ ] IA personalizada para generación de desafíos basados en datos del usuario
- [ ] Integración real con APIs de wearables (no solo demo)
- [ ] Sistema de amigos y competencias amistosas
- [ ] Notificaciones push para recordatorios de desafíos
- [ ] Dashboard de análisis predictivo de salud mental
- [ ] Integración con servicios de terapia virtual (BetterHelp, Talkspace)
- [ ] Playlist personalizadas de Spotify basadas en estado de ánimo
- [ ] Chatbot con IA para soporte 24/7
- [ ] Comunidad global con grupos de apoyo

### Machine Learning Futuro:
- Predicción de episodios de ansiedad/depresión basado en patrones
- Recomendaciones personalizadas de ejercicios y contenido
- Análisis de sentimiento en diarios emocionales
- Optimización de horarios de sueño
- Detección de patrones de estrés

## Métricas de Éxito

**KPIs Principales:**
- Tasa de completación de desafíos diarios
- Engagement promedio (días consecutivos de uso)
- Tasa de canje de recompensas
- Progreso en rutas de bienestar
- Mejora en métricas de salud (pasos, sueño, ritmo cardíaco)
- NPS (Net Promoter Score)
- Retención a 7, 30 y 90 días

## Soporte y Contacto

Para más información sobre el sistema de gamificación:
- Documentación técnica: `/docs`
- Issues de GitHub: [repositorio]
- Comunidad Discord: [enlace]
- Email de soporte: soporte@emocionaliaplus.com
