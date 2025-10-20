# 🧪 Guía de Tests - EmocionalIA+ v1.0.1

## 📋 Resumen de Tests Recomendados

Esta guía proporciona tests unitarios y de integración esenciales para las características clave de EmocionalIA+.

---

## 🎯 Tests Unitarios por Componente

### 1. Detección de Emociones - AIChat Component

**Archivo de test:** `src/components/ai-assistant/__tests__/AIChat.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIChat from '../AIChat';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('AIChat - Detección de Crisis', () => {
  it('debe detectar palabras clave de crisis', async () => {
    const mockResponse = {
      response: 'Entiendo que estás pasando por un momento difícil...',
      crisisDetected: true,
      detectedKeywords: ['suicidio', 'morir'],
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
    fireEvent.change(input, { target: { value: 'Quiero terminar con todo' } });
    
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/modal de emergencia/i)).toBeInTheDocument();
    });
  });

  it('debe aplicar el tono seleccionado correctamente', async () => {
    render(<AIChat />);
    
    const toneSelect = screen.getByRole('combobox');
    fireEvent.change(toneSelect, { target: { value: 'motivador' } });

    expect(screen.getByText(/motivador/i)).toBeInTheDocument();
  });

  it('debe respetar límites de mensajes para usuarios free', async () => {
    render(<AIChat />);
    
    // Simular 10 mensajes enviados
    for (let i = 0; i < 10; i++) {
      // Enviar mensaje
    }

    // El 11º mensaje debe mostrar límite alcanzado
    const limitMessage = await screen.findByText(/límite alcanzado/i);
    expect(limitMessage).toBeInTheDocument();
  });
});
```

### 2. Mood Tracker - CircularMoodTracker Component

**Archivo de test:** `src/components/patient/__tests__/CircularMoodTracker.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CircularMoodTracker from '../CircularMoodTracker';

describe('CircularMoodTracker', () => {
  it('debe permitir seleccionar un estado de ánimo', () => {
    render(<CircularMoodTracker />);
    
    const moodButton = screen.getByText('😊');
    fireEvent.click(moodButton);

    expect(screen.getByText(/muy bien/i)).toBeInTheDocument();
  });

  it('debe deseleccionar al hacer clic nuevamente', () => {
    render(<CircularMoodTracker />);
    
    const moodButton = screen.getByText('😊');
    fireEvent.click(moodButton);
    fireEvent.click(moodButton);

    expect(screen.getByText(/selecciona/i)).toBeInTheDocument();
  });

  it('debe guardar el estado de ánimo en la base de datos', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<CircularMoodTracker />);
    
    const moodButton = screen.getByText('😊');
    fireEvent.click(moodButton);
    
    const saveButton = screen.getByText(/guardar estado de ánimo/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: expect.any(String),
        mood_level: 5,
        created_at: expect.any(String),
      });
    });
  });

  it('debe mostrar toast de error si falla el guardado', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { message: 'Database error' },
    });
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<CircularMoodTracker />);
    
    // Seleccionar y guardar
    fireEvent.click(screen.getByText('😊'));
    fireEvent.click(screen.getByText(/guardar/i));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### 3. Text-to-Speech - AIChat Audio Feature

**Archivo de test:** `src/components/ai-assistant/__tests__/AIChat.audio.test.tsx`

```typescript
describe('AIChat - Audio Features', () => {
  it('debe reproducir texto a voz cuando está habilitado', async () => {
    const mockAudioPlay = vi.fn();
    global.Audio = vi.fn().mockImplementation(() => ({
      play: mockAudioPlay,
      onended: null,
      onerror: null,
    }));

    render(<AIChat />);
    
    // Habilitar audio
    const audioToggle = screen.getByLabelText(/volumen/i);
    fireEvent.click(audioToggle);

    // Enviar mensaje
    const input = screen.getByPlaceholderText(/escribe/i);
    fireEvent.change(input, { target: { value: 'Hola' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(mockAudioPlay).toHaveBeenCalled();
    });
  });

  it('debe limpiar recursos de audio al terminar', async () => {
    const mockRevokeObjectURL = vi.fn();
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    render(<AIChat />);
    
    // Simular reproducción y finalización de audio
    // ... test implementation

    await waitFor(() => {
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });
});
```

---

## 🔄 Tests de Integración

### 1. Flujo Completo de Chat con IA

**Archivo:** `src/__tests__/integration/ai-chat-flow.test.tsx`

```typescript
describe('Flujo Completo de Chat con IA', () => {
  it('debe completar un flujo de conversación exitoso', async () => {
    // 1. Autenticación
    // 2. Cargar historial
    // 3. Enviar mensaje
    // 4. Recibir respuesta
    // 5. Verificar guardado en BD
  });

  it('debe manejar errores de red correctamente', async () => {
    // Simular error de red
    vi.mocked(supabase.functions.invoke).mockRejectedValue(
      new Error('Network error')
    );

    render(<AIChat />);
    
    // Intentar enviar mensaje
    // Verificar mensaje de error
  });
});
```

### 2. Compatibilidad Móvil

**Archivo:** `src/__tests__/integration/mobile-compatibility.test.tsx`

```typescript
describe('Compatibilidad Móvil', () => {
  it('debe detectar correctamente dispositivos móviles', () => {
    // Mock window.innerWidth
    global.innerWidth = 375; // iPhone size
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });

  it('debe adaptar UI para pantallas pequeñas', () => {
    global.innerWidth = 375;
    
    render(<AIChat />);
    
    // Verificar que elementos móviles estén presentes
    // Verificar que elementos de escritorio estén ocultos
  });
});
```

---

## ⚡ Tests de Rendimiento

### 1. Carga de Mensajes

```typescript
describe('Rendimiento - Carga de Mensajes', () => {
  it('debe cargar 50 mensajes en menos de 500ms', async () => {
    const start = performance.now();
    
    // Cargar 50 mensajes
    await loadChatHistory();
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(500);
  });

  it('debe usar paginación correctamente', async () => {
    // Verificar que solo se carguen 50 mensajes a la vez
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .limit(50);
    
    expect(data?.length).toBeLessThanOrEqual(50);
  });
});
```

---

## 🛡️ Tests de Seguridad

### 1. Validación de Entrada

```typescript
describe('Seguridad - Validación de Entrada', () => {
  it('debe sanitizar entradas maliciosas', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/escribe/i);
    fireEvent.change(input, { target: { value: maliciousInput } });
    
    // Verificar que el script no se ejecute
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });

  it('debe requerir autenticación para features premium', async () => {
    // Mock usuario no autenticado
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    render(<AIChat />);
    
    const voiceButton = screen.getByLabelText(/micrófono/i);
    
    expect(voiceButton).toBeDisabled();
  });
});
```

---

## 🚀 Configuración de Tests

### Instalación de Dependencias

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuración de Vitest

**Archivo:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Setup de Tests

**Archivo:** `src/__tests__/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();
```

---

## 📊 Cobertura de Tests Objetivo

| Categoría | Objetivo | Actual |
|-----------|----------|---------|
| Componentes UI | 80% | - |
| Lógica de Negocio | 90% | - |
| Edge Functions | 85% | - |
| Integración | 70% | - |
| **Total** | **80%** | **-** |

---

## 🔧 Scripts de NPM

Agregar al `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

## ✅ Checklist Pre-Publicación

- [ ] Todos los tests unitarios pasan
- [ ] Cobertura de tests >= 80%
- [ ] Tests de integración completos
- [ ] Tests en dispositivos Android reales
- [ ] Tests en dispositivos iOS reales
- [ ] Tests de rendimiento aprobados
- [ ] Tests de seguridad completos
- [ ] Documentación de tests actualizada

---

## 📝 Notas Adicionales

### Tests Manuales Requeridos

1. **Dispositivos Reales:**
   - Samsung Galaxy S21 (Android 13)
   - Google Pixel 6 (Android 14)
   - iPhone 12 (iOS 16)
   - iPhone 14 (iOS 17)
   - iPad Air (iPadOS 16)

2. **Navegadores:**
   - Chrome Mobile (última versión)
   - Safari Mobile (última versión)
   - Samsung Internet

3. **Condiciones de Red:**
   - 5G
   - 4G
   - 3G
   - WiFi lento
   - Sin conexión (modo offline)

### Herramientas de Testing Móvil

- **BrowserStack**: Para testing en dispositivos reales remotos
- **Firebase Test Lab**: Para testing automatizado en Android
- **TestFlight**: Para testing beta en iOS
- **Chrome DevTools**: Device emulation

---

**Última actualización:** v1.0.1 - 2025-01-20
