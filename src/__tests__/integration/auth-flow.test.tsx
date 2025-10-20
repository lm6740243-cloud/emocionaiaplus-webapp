import { describe, it, expect, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
  },
}));

describe('Authentication Flow', () => {
  it('should handle successful login', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser as any, session: {} as any },
      error: null,
    });

    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.error).toBeNull();
    expect(result.data.user).toEqual(mockUser);
  });

  it('should handle failed login with invalid credentials', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' } as any,
    });

    const result = await supabase.auth.signInWithPassword({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toBe('Invalid credentials');
  });

  it('should handle successful signup', async () => {
    const mockUser = { id: 'new-user-123', email: 'newuser@example.com' };
    
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser as any, session: {} as any },
      error: null,
    });

    const result = await supabase.auth.signUp({
      email: 'newuser@example.com',
      password: 'securepassword123',
    });

    expect(result.error).toBeNull();
    expect(result.data.user).toEqual(mockUser);
  });

  it('should handle logout', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null,
    });

    const result = await supabase.auth.signOut();

    expect(result.error).toBeNull();
  });
});
