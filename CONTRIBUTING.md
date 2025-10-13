# Guía de Contribución - EmocionalIA+

¡Gracias por tu interés en contribuir a EmocionalIA+! 🙏

Este documento proporciona directrices para contribuir al proyecto de manera efectiva.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reporte de Bugs](#reporte-de-bugs)
- [Sugerencias de Features](#sugerencias-de-features)

## 📜 Código de Conducta

### Nuestro Compromiso

Como contribuyentes y mantenedores, nos comprometemos a hacer de la participación en este proyecto una experiencia libre de acoso para todos, independientemente de:

- Edad, tamaño corporal, discapacidad, etnia, identidad de género
- Nivel de experiencia, nacionalidad, apariencia física
- Raza, religión, orientación sexual

### Nuestros Estándares

**Comportamientos Positivos:**
- Uso de lenguaje inclusivo y acogedor
- Respeto a diferentes puntos de vista y experiencias
- Aceptación de críticas constructivas
- Enfoque en lo mejor para la comunidad
- Empatía hacia otros miembros

**Comportamientos Inaceptables:**
- Lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes o ataques personales
- Acoso público o privado
- Publicación de información privada sin permiso
- Conducta inapropiada en contexto profesional

## 🤝 ¿Cómo Puedo Contribuir?

### 1. Reportar Bugs

Antes de crear un bug report:
- Verifica que no exista un issue similar
- Recopila información sobre el bug
- Determina si es reproducible

**Crea un issue con:**
- Título descriptivo y claro
- Pasos exactos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Información del entorno (OS, navegador, versión)

### 2. Sugerir Mejoras

Para sugerencias de features:
- Verifica que no exista una sugerencia similar
- Describe claramente el caso de uso
- Explica por qué sería útil para la mayoría de usuarios
- Proporciona ejemplos de implementación si es posible

### 3. Contribuir con Código

#### Áreas Prioritarias
- **Alta Prioridad:**
  - Correcciones de seguridad
  - Bugs críticos
  - Mejoras de rendimiento
  
- **Media Prioridad:**
  - Nuevas features solicitadas
  - Mejoras de UX/UI
  - Optimizaciones
  
- **Baja Prioridad:**
  - Refactorización
  - Documentación
  - Tests adicionales

## 🔧 Proceso de Desarrollo

### Setup Inicial

```bash
# 1. Fork el repositorio
git clone https://github.com/tu-usuario/emocionalia-plus.git
cd emocionalia-plus

# 2. Instala dependencias
npm install

# 3. Configura entorno local
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 4. Vincula Supabase local
supabase link --project-ref tu_project_id
supabase db push

# 5. Inicia servidor de desarrollo
npm run dev
```

### Flujo de Trabajo Git

```bash
# 1. Crea una rama desde main
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo

# 2. Haz tus cambios
# ... edita archivos ...

# 3. Commit con mensaje descriptivo
git add .
git commit -m "feat: Descripción clara del cambio"

# 4. Push a tu fork
git push origin feature/nombre-descriptivo

# 5. Abre Pull Request en GitHub
```

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, sin cambios de código
- `refactor`: Refactorización sin cambios funcionales
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, herramientas, etc.

**Ejemplos:**
```
feat(ai-chat): Agregar detección de emociones en tiempo real

fix(groups): Corregir crash al enviar mensajes con emojis

docs(readme): Actualizar instrucciones de instalación

style(ui): Aplicar formato consistente en componentes

refactor(auth): Simplificar lógica de validación

perf(database): Optimizar queries con índices

test(mood): Añadir tests unitarios para mood tracker

chore(deps): Actualizar dependencias de Supabase
```

## 💻 Estándares de Código

### TypeScript

```typescript
// ✅ CORRECTO: Tipos explícitos
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'psychologist';
}

const fetchProfile = async (userId: string): Promise<UserProfile> => {
  // implementación
};

// ❌ INCORRECTO: Tipos any
const fetchProfile = async (userId: any): Promise<any> => {
  // implementación
};
```

### React Components

```typescript
// ✅ CORRECTO: Componente funcional tipado
import { FC } from 'react';

interface Props {
  title: string;
  onClose: () => void;
}

export const Modal: FC<Props> = ({ title, onClose }) => {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

// ❌ INCORRECTO: Sin tipos, props desestructuradas sin interfaz
export const Modal = (props) => {
  return <div>{props.title}</div>;
};
```

### Tailwind CSS

```typescript
// ✅ CORRECTO: Usar tokens semánticos del design system
<div className="bg-background text-foreground">
  <h1 className="text-primary">Título</h1>
  <p className="text-muted-foreground">Descripción</p>
</div>

// ❌ INCORRECTO: Colores directos
<div className="bg-white text-black">
  <h1 className="text-blue-500">Título</h1>
</div>
```

### Hooks

```typescript
// ✅ CORRECTO: Custom hook con tipos
import { useState, useEffect } from 'react';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // lógica de autenticación
  }, []);
  
  return { user, loading, error };
};
```

### Supabase Queries

```typescript
// ✅ CORRECTO: Manejo de errores y tipos
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

if (error) {
  console.error('Error fetching profile:', error);
  throw error;
}

return data;

// ❌ INCORRECTO: Sin manejo de errores
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId);

return data; // puede ser undefined
```

### Testing

```typescript
// Ejemplo de test unitario
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodTracker } from './MoodTracker';

describe('MoodTracker', () => {
  it('should render mood options', () => {
    render(<MoodTracker />);
    expect(screen.getByText('¿Cómo te sientes hoy?')).toBeInTheDocument();
  });
  
  it('should call onSelect when mood is clicked', () => {
    const onSelect = jest.fn();
    render(<MoodTracker onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('😊'));
    expect(onSelect).toHaveBeenCalledWith('happy');
  });
});
```

## 🔍 Proceso de Pull Request

### Antes de Abrir un PR

- [ ] El código compila sin errores
- [ ] Todos los tests pasan (`npm run test`)
- [ ] No hay warnings de linter (`npm run lint`)
- [ ] Código formateado (`npm run format`)
- [ ] Actualizaste documentación si es necesario
- [ ] Añadiste tests para nuevas funcionalidades

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix (non-breaking change)
- [ ] Nueva feature (non-breaking change)
- [ ] Breaking change (fix o feature que afecta funcionalidad existente)
- [ ] Documentación

## ¿Cómo se ha Testeado?
Describe los tests realizados

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado documentación
- [ ] Mis cambios no generan warnings
- [ ] He añadido tests que prueban mi fix/feature
- [ ] Tests unitarios e integración pasan localmente

## Screenshots (si aplica)
Agrega screenshots de cambios visuales
```

### Revisión de Código

Los PRs serán revisados por mantenedores considerando:
- Calidad del código
- Adherencia a estándares
- Cobertura de tests
- Impacto en rendimiento
- Compatibilidad hacia atrás
- Seguridad

## 🐛 Reporte de Bugs

### Template de Issue

```markdown
**Descripción del Bug**
Una descripción clara del problema

**Para Reproducir**
Pasos para reproducir:
1. Ve a '...'
2. Click en '....'
3. Scroll down a '....'
4. Ver error

**Comportamiento Esperado**
Qué debería pasar

**Screenshots**
Si aplica, agrega screenshots

**Entorno:**
 - OS: [e.g. iOS, Windows]
 - Navegador [e.g. chrome, safari]
 - Versión [e.g. 22]
 - Versión de la App [e.g. 1.0.0]

**Contexto Adicional**
Cualquier información adicional relevante
```

## ✨ Sugerencias de Features

### Template de Feature Request

```markdown
**¿Tu feature está relacionada con un problema?**
Descripción clara del problema

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase

**Describe alternativas consideradas**
Otras soluciones o features consideradas

**Contexto Adicional**
Cualquier contexto o screenshots
```

## 📚 Recursos Adicionales

### Documentación Técnica
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Lineamientos de Salud Mental
- [SAMHSA Guidelines](https://www.samhsa.gov)
- [WHO Mental Health](https://www.who.int/health-topics/mental-health)
- [Crisis Intervention Best Practices](https://www.integration.samhsa.gov/)

## 🙋 ¿Necesitas Ayuda?

- **Discord**: [Unirse a la comunidad](#)
- **Email**: contribute@emocionalia.com
- **Documentación**: [docs.emocionalia.com](#)

## 📝 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia MIT del proyecto.

---

**¡Gracias por hacer de EmocionalIA+ un mejor lugar para la salud mental! ❤️**
