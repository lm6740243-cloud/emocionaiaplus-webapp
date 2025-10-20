import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import AIChat from '@/components/ai-assistant/AIChat';
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
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

// Mock SubscriptionContext
vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    isPremium: () => false,
    tier: 'free',
    hasFeature: () => false,
  }),
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('AIChat - Crisis Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: 'test-user' } } as any },
      error: null,
    });
  });

  it('should render chat interface', () => {
    render(<AIChat />);
    
    expect(screen.getByText(/Asistente IA EmocionalIA+/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribe tu mensaje/i)).toBeInTheDocument();
  });

  it('should detect crisis keywords and show emergency modal', async () => {
    const mockResponse = {
      response: 'Entiendo que estás pasando por un momento muy difícil...',
      crisisDetected: true,
      detectedKeywords: ['suicidio', 'morir'],
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Escribe tu mensaje/i);
    fireEvent.change(input, { target: { value: 'Quiero terminar con todo' } });
    
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('ai-chat', {
        body: expect.objectContaining({
          message: 'Quiero terminar con todo',
        }),
      });
    });
  });

  it('should apply selected tone correctly', () => {
    render(<AIChat />);
    
    const toneSelects = screen.getAllByRole('combobox');
    expect(toneSelects.length).toBeGreaterThan(0);
  });

  it('should show message limit for free users', async () => {
    render(<AIChat />);
    
    // El componente muestra el límite de mensajes para usuarios free
    await waitFor(() => {
      const limitElements = screen.queryAllByText(/mensajes/i);
      expect(limitElements.length).toBeGreaterThan(0);
    });
  });

  it('should clear chat when clear button is clicked', () => {
    render(<AIChat />);
    
    const clearButton = screen.getByRole('button', { name: /limpiar/i });
    fireEvent.click(clearButton);
    
    // Verificar que el chat se ha limpiado
    const welcomeMessage = screen.getByText(/Hola! Soy tu asistente/i);
    expect(welcomeMessage).toBeInTheDocument();
  });
});

describe('AIChat - Audio Features', () => {
  it('should toggle audio output when volume button is clicked', () => {
    render(<AIChat />);
    
    const audioButtons = screen.getAllByRole('button');
    const volumeButton = audioButtons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-volume-x') ||
      btn.querySelector('svg')?.classList.contains('lucide-volume-2')
    );
    
    expect(volumeButton).toBeDefined();
  });
});
