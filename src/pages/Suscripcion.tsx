import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/contexts/SubscriptionContext";
import { ArrowLeft, Check, Crown, Sparkles, Users, Brain, BarChart3, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Suscripcion = () => {
  const navigate = useNavigate();
  const { tier, subscribed, subscriptionEnd, createCheckout, openCustomerPortal, loading } = useSubscription();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tierIcons = {
    free: <Brain className="h-8 w-8" />,
    patient_premium: <Sparkles className="h-8 w-8" />,
    psychologist_premium: <Crown className="h-8 w-8" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-center">
            Planes de EmocionalIA+
          </h1>
          <div className="w-20" />
        </div>

        {/* Current Subscription Status */}
        {subscribed && subscriptionEnd && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Tu Plan Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{SUBSCRIPTION_TIERS[tier].name}</p>
                  <p className="text-muted-foreground">
                    Renovación: {formatDate(subscriptionEnd)}
                  </p>
                </div>
                <Button onClick={openCustomerPortal} variant="outline">
                  Gestionar Suscripción
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tierInfo]) => {
            const isCurrentTier = tier === key;
            const isPopular = key === 'patient_premium';
            
            return (
              <Card 
                key={key}
                className={`relative ${isCurrentTier ? 'border-primary ring-2 ring-primary/20' : ''} ${
                  isPopular ? 'border-primary/50' : ''
                }`}
              >
                {isPopular && (
                  <Badge 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1"
                    variant="default"
                  >
                    Más Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary">
                    {tierIcons[key as keyof typeof tierIcons]}
                  </div>
                  <CardTitle className="text-xl">{tierInfo.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${tierInfo.price}
                    </span>
                    {tierInfo.price > 0 && (
                      <span className="text-muted-foreground">/mes</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {key === 'free' && 'Perfecto para comenzar'}
                    {key === 'patient_premium' && 'Para pacientes que buscan bienestar completo'}
                    {key === 'psychologist_premium' && 'Para profesionales de la salud mental'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
                    {tierInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentTier ? (
                    <Button className="w-full" disabled>
                      Plan Actual
                    </Button>
                  ) : tierInfo.priceId ? (
                    <Button 
                      className="w-full" 
                      onClick={() => createCheckout(tierInfo.priceId!)}
                      disabled={loading}
                      variant={isPopular ? "default" : "outline"}
                    >
                      {loading ? 'Procesando...' : 'Suscribirse'}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Plan Gratuito
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Comparación Detallada de Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Plan Gratuito</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 10 mensajes IA por día</li>
                    <li>• Registro básico de ánimo</li>
                    <li>• 3 recursos por semana</li>
                    <li>• Sin contacto con psicólogos</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Paciente Premium</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Chat IA ilimitado + voz</li>
                    <li>• Análisis avanzado de ánimo</li>
                    <li>• Recursos ilimitados</li>
                    <li>• Contacto directo con psicólogos</li>
                    <li>• Planes personalizados</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Crown className="h-12 w-12 mx-auto mb-3 text-secondary" />
                  <h3 className="font-semibold mb-2">Psicólogo Premium</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Panel profesional completo</li>
                    <li>• Gestión ilimitada de pacientes</li>
                    <li>• Estadísticas y reportes</li>
                    <li>• Chat rápido</li>
                    <li>• Herramientas de seguimiento</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">¿Por qué precios en dólares?</h4>
              <p className="text-sm text-muted-foreground">
                Ofrecemos precios competitivos adaptados a Latinoamérica. Puedes pagar con cualquier tarjeta local.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">¿Puedo cancelar cuando quiera?</h4>
              <p className="text-sm text-muted-foreground">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu portal de cliente.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">¿Hay descuentos por pago anual?</h4>
              <p className="text-sm text-muted-foreground">
                Próximamente ofreceremos planes anuales con descuentos significativos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Suscripcion;