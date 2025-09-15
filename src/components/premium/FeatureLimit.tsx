import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureLimitProps {
  used: number;
  limit: number;
  feature: string;
  unit: string;
  className?: string;
}

const FeatureLimit = ({ used, limit, feature, unit, className = "" }: FeatureLimitProps) => {
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  if (isPremium()) {
    return (
      <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
        <Crown className="h-3 w-3 text-primary" />
        Ilimitado
      </Badge>
    );
  }

  const isNearLimit = used >= limit * 0.8;
  const isAtLimit = used >= limit;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
        className="flex items-center gap-1"
      >
        {used}/{limit} {unit}
      </Badge>
      
      {isNearLimit && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/suscripcion')}
          className="text-xs"
        >
          <Crown className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      )}
    </div>
  );
};

export default FeatureLimit;