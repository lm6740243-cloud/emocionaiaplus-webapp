import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumFeatureProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
  requiredTier?: 'patient_premium' | 'psychologist_premium';
  showUpgrade?: boolean;
}

const PremiumFeature = ({ 
  children, 
  feature, 
  fallback, 
  requiredTier,
  showUpgrade = true 
}: PremiumFeatureProps) => {
  const { hasFeature, isPremium, tier, createCheckout } = useSubscription();
  const navigate = useNavigate();

  // Check if user has the required tier specifically
  const hasAccess = requiredTier ? tier === requiredTier : hasFeature(feature) || isPremium();

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  // Default premium upgrade prompt
  const tierInfo = requiredTier ? {
    patient_premium: {
      name: 'Paciente Premium',
      price: 9.99,
      priceId: 'price_1S7jOD0viPDt0e9ueQm5yG6w'
    },
    psychologist_premium: {
      name: 'Psicólogo Premium', 
      price: 19.99,
      priceId: 'price_1S7jOb0viPDt0e9uaSvg4gJH'
    }
  }[requiredTier] : null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Premium
        </Badge>
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Feature Premium</CardTitle>
        </div>
        <CardDescription>
          {feature}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Esta función está disponible con {tierInfo?.name || 'un plan Premium'}
        </div>
        
        <div className="flex gap-2">
          {tierInfo ? (
            <Button 
              onClick={() => createCheckout(tierInfo.priceId)}
              className="flex-1"
            >
              Actualizar a {tierInfo.name} (${tierInfo.price}/mes)
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/suscripcion')}
              className="flex-1"
            >
              Ver Planes Premium
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeature;