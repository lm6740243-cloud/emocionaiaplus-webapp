import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Subscription tiers mapping
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Gratis',
    features: ['Chat IA básico', 'Registro de ánimo', 'Recursos limitados'],
    price: 0,
    priceId: null,
    productId: null,
  },
  patient_premium: {
    name: 'Paciente Premium',
    features: [
      'Chat IA con voz',
      'Rutas de bienestar avanzadas',
      'Recursos ilimitados',
      'Contacto con psicólogos',
      'Análisis detallado de progreso'
    ],
    price: 9.99,
    priceId: 'price_1S7jOD0viPDt0e9ueQm5yG6w',
    productId: 'prod_T3r6d5E7k5mlfq',
  },
  psychologist_premium: {
    name: 'Psicólogo Premium',
    features: [
      'Panel profesional avanzado',
      'Gestión completa de pacientes',
      'Estadísticas detalladas',
      'Chat rápido con pacientes',
      'Herramientas de seguimiento',
      'Análisis y reportes'
    ],
    price: 19.99,
    priceId: 'price_1S7jOb0viPDt0e9uaSvg4gJH',
    productId: 'prod_T3r6X5mJpOZFE5',
  },
};

interface SubscriptionContextType {
  subscribed: boolean;
  tier: keyof typeof SUBSCRIPTION_TIERS;
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  hasFeature: (feature: string) => boolean;
  isPremium: () => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [tier, setTier] = useState<keyof typeof SUBSCRIPTION_TIERS>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getTierFromProductId = (productId: string | null): keyof typeof SUBSCRIPTION_TIERS => {
    if (!productId) return 'free';
    
    for (const [key, tierInfo] of Object.entries(SUBSCRIPTION_TIERS)) {
      if (tierInfo.productId === productId) {
        return key as keyof typeof SUBSCRIPTION_TIERS;
      }
    }
    return 'free';
  };

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        setSubscribed(false);
        setTier('free');
        setSubscriptionEnd(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscribed(false);
        setTier('free');
        setSubscriptionEnd(null);
        return;
      }

      setSubscribed(data.subscribed || false);
      setTier(getTierFromProductId(data.product_id));
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear la sesión de pago",
          variant: "destructive",
        });
        return;
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Error al procesar el pago",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo abrir el portal de cliente",
          variant: "destructive",
        });
        return;
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Error al abrir el portal de gestión",
        variant: "destructive",
      });
    }
  };

  const hasFeature = (feature: string): boolean => {
    const currentTier = SUBSCRIPTION_TIERS[tier];
    return currentTier.features.includes(feature);
  };

  const isPremium = (): boolean => {
    return tier !== 'free';
  };

  useEffect(() => {
    checkSubscription();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkSubscription();
      }
    });

    // Check subscription every 2 minutes
    const interval = setInterval(checkSubscription, 120000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscribed,
        tier,
        subscriptionEnd,
        loading,
        checkSubscription,
        createCheckout,
        openCustomerPortal,
        hasFeature,
        isPremium,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};