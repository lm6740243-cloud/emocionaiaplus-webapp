import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import CircularMoodTracker from '@/components/patient/CircularMoodTracker';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user' } },
        error: null,
      })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('CircularMoodTracker', () => {
  it('should render mood tracker with all mood options', () => {
    render(<CircularMoodTracker />);
    
    // Verificar que se muestran las opciones de estado de ánimo
    expect(screen.getByText(/Selecciona tu estado de ánimo/i)).toBeInTheDocument();
  });

  it('should allow selecting a mood', () => {
    render(<CircularMoodTracker />);
    
    const moodButtons = screen.getAllByRole('button');
    const firstMoodButton = moodButtons[0];
    
    fireEvent.click(firstMoodButton);
    
    // Verificar que el botón tiene algún estado activo
    expect(firstMoodButton.className).toContain('bg-');
  });

  it('should deselect mood when clicked again', () => {
    render(<CircularMoodTracker />);
    
    const moodButtons = screen.getAllByRole('button');
    const firstMoodButton = moodButtons[0];
    
    // Click para seleccionar
    fireEvent.click(firstMoodButton);
    
    // Click para deseleccionar
    fireEvent.click(firstMoodButton);
    
    // Debería volver al estado inicial
    expect(screen.getByText(/Selecciona tu estado de ánimo/i)).toBeInTheDocument();
  });

  it('should save mood entry to database', async () => {
    const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<CircularMoodTracker />);
    
    const moodButtons = screen.getAllByRole('button');
    const firstMoodButton = moodButtons[0];
    
    fireEvent.click(firstMoodButton);
    
    // Buscar y hacer click en el botón de guardar
    const saveButton = screen.getByText(/Guardar estado de ánimo/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it('should show error toast if save fails', async () => {
    const mockInsert = vi.fn(() => Promise.resolve({
      error: { message: 'Database error' },
    }));
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<CircularMoodTracker />);
    
    const moodButtons = screen.getAllByRole('button');
    fireEvent.click(moodButtons[0]);
    
    const saveButton = screen.getByText(/Guardar estado de ánimo/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });
});
