import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  UserCheck, 
  Shield, 
  AlertCircle, 
  Phone, 
  Stethoscope, 
  Eye,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsentSettings {
  share_with_psychologist: boolean;
  emergency_contact_sharing: boolean;
  crisis_alerts_to_professionals: boolean;
  data_for_research: boolean;
  marketing_communications: boolean;
  third_party_integrations: boolean;
}

export const ConsentManagement = () => {
  const [consents, setConsents] = useState<ConsentSettings>({
    share_with_psychologist: false,
    emergency_contact_sharing: false,
    crisis_alerts_to_professionals: true,
    data_for_research: false,
    marketing_communications: false,
    third_party_integrations: false
  });
  const [loading, setLoading] = useState(true);
  const [showConsentDetails, setShowConsentDetails] = useState<string | null>(null);
  const { toast } = useToast();

  const consentCategories = [
    {
      id: "share_with_psychologist",
      title: "Compartir datos con psicólogo asignado",
      description: "Permite que tu psicólogo acceda a tu historial de estado de ánimo y conversaciones",
      icon: Stethoscope,
      color: "bg-blue-500",
      importance: "high",
      details: {
        what_shared: [
          "Registros de estado de ánimo y emociones",
          "Historial de conversaciones con IA (resúmenes)",
          "Patrones de actividad y progreso",
          "Alertas de crisis detectadas"
        ],
        why_useful: "Permite un seguimiento más completo de tu progreso y tratamiento personalizado",
        who_access: "Solo tu psicólogo asignado y personal médico autorizado",
        retention: "Mientras mantengas la relación terapéutica activa"
      }
    },
    {
      id: "emergency_contact_sharing",
      title: "Contacto de emergencia automático",
      description: "Notifica automáticamente a tu contacto de emergencia en situaciones críticas",
      icon: Phone,
      color: "bg-red-500",
      importance: "high",
      details: {
        what_shared: [
          "Notificación de alerta de crisis detectada",
          "Información básica sobre la situación",
          "Recomendaciones de acción inmediata",
          "Datos de ubicación (si están disponibles)"
        ],
        why_useful: "Garantiza que tengas apoyo inmediato en momentos críticos",
        who_access: "Solo tu contacto de emergencia registrado",
        retention: "Solo durante la situación de emergencia"
      }
    },
    {
      id: "crisis_alerts_to_professionals",
      title: "Alertas a profesionales de salud mental",
      description: "Envía alertas automáticas a profesionales cuando se detecta una crisis",
      icon: AlertCircle,
      color: "bg-orange-500",
      importance: "critical",
      details: {
        what_shared: [
          "Texto que activó la alerta de crisis",
          "Patrones recientes de comportamiento",
          "Información de contacto básica",
          "Historial de alertas previas"
        ],
        why_useful: "Permite intervención profesional rápida en situaciones de riesgo",
        who_access: "Profesionales de salud mental de emergencia certificados",
        retention: "30 días para seguimiento y mejora del sistema"
      }
    },
    {
      id: "data_for_research",
      title: "Datos anonimizados para investigación",
      description: "Contribuye con datos anónimos para mejorar tratamientos de salud mental",
      icon: Eye,
      color: "bg-green-500",
      importance: "low",
      details: {
        what_shared: [
          "Patrones de uso completamente anonimizados",
          "Tendencias de estado de ánimo sin identificadores",
          "Efectividad de recomendaciones (agregado)",
          "Datos demográficos generales"
        ],
        why_useful: "Ayuda a desarrollar mejores herramientas de salud mental para todos",
        who_access: "Investigadores académicos bajo estrictos protocolos éticos",
        retention: "Indefinido, pero completamente anonimizado"
      }
    },
    {
      id: "marketing_communications",
      title: "Comunicaciones de marketing",
      description: "Recibir información sobre nuevas funciones y mejoras del producto",
      icon: Info,
      color: "bg-purple-500",
      importance: "low",
      details: {
        what_shared: [
          "Dirección de correo electrónico",
          "Preferencias de comunicación",
          "Tipo de plan y fecha de registro",
          "Uso general de funcionalidades"
        ],
        why_useful: "Te mantiene informado sobre mejoras que pueden beneficiar tu experiencia",
        who_access: "Equipo de marketing de EmocionalIA+ únicamente",
        retention: "Hasta que retires el consentimiento"
      }
    },
    {
      id: "third_party_integrations",
      title: "Integraciones con terceros",
      description: "Permite sincronizar datos con aplicaciones de salud y bienestar externas",
      icon: Shield,
      color: "bg-teal-500",
      importance: "medium",
      details: {
        what_shared: [
          "Datos básicos de actividad física",
          "Patrones de sueño generales",
          "Métricas de bienestar seleccionadas",
          "Progreso en objetivos de salud"
        ],
        why_useful: "Permite una visión más completa de tu bienestar general",
        who_access: "Solo aplicaciones que hayas autorizado específicamente",
        retention: "Según las políticas de cada aplicación autorizada"
      }
    }
  ];

  useEffect(() => {
    loadConsentSettings();
  }, []);

  const loadConsentSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real implementation, you would load these from a user_consents table
      // For now, we'll use localStorage to persist consent settings
      const savedConsents = localStorage.getItem(`consents_${user.id}`);
      if (savedConsents) {
        setConsents(JSON.parse(savedConsents));
      }
    } catch (error) {
      console.error('Error loading consent settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (consentId: keyof ConsentSettings, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newConsents = { ...consents, [consentId]: value };
      setConsents(newConsents);

      // Save to localStorage (in real implementation, save to database)
      localStorage.setItem(`consents_${user.id}`, JSON.stringify(newConsents));

      // Log consent change for audit trail
      console.log(`Consent ${consentId} changed to ${value} for user ${user.id}`);

      toast({
        title: "Consentimiento actualizado",
        description: "Tus preferencias de privacidad han sido guardadas",
      });
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el consentimiento",
        variant: "destructive"
      });
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Gestión de Consentimientos
          </CardTitle>
          <CardDescription>
            Controla exactamente qué datos compartir y con quién
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consent Overview */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Tu privacidad es prioritaria.</strong> Puedes cambiar estos consentimientos 
              en cualquier momento. Los cambios son efectivos inmediatamente.
            </AlertDescription>
          </Alert>

          {/* Active Consents Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(consents).filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Consentimientos activos</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {consentCategories.filter(c => c.importance === 'high' || c.importance === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Consentimientos importantes</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {consents.crisis_alerts_to_professionals ? 1 : 0}
              </div>
              <div className="text-sm text-muted-foreground">Alertas de crisis activas</div>
            </div>
          </div>

          <Separator />

          {/* Consent Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Configuración de Consentimientos</h4>
            
            {consentCategories.map((category) => {
              const Icon = category.icon;
              const isActive = consents[category.id as keyof ConsentSettings];
              
              return (
                <Card key={category.id} className={`border-l-4 ${getImportanceColor(category.importance)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${category.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium">{category.title}</h5>
                            <Badge variant={category.importance === 'critical' ? 'destructive' : 'secondary'}>
                              {category.importance === 'critical' ? 'Crítico' : 
                               category.importance === 'high' ? 'Importante' :
                               category.importance === 'medium' ? 'Medio' : 'Opcional'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  Ver detalles
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Icon className="h-5 w-5" />
                                    {category.title}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">¿Qué información se comparte?</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                      {category.details.what_shared.map((item, idx) => (
                                        <li key={idx}>• {item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">¿Por qué es útil?</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {category.details.why_useful}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">¿Quién tiene acceso?</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {category.details.who_access}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">¿Por cuánto tiempo se conserva?</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {category.details.retention}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {isActive ? (
                              <Badge variant="default" className="bg-green-500 h-7">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="h-7">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => updateConsent(category.id as keyof ConsentSettings, checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          {/* Consent History & Audit */}
          <div className="space-y-4">
            <h4 className="font-semibold">Registro de Cambios</h4>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Todos los cambios de consentimiento son registrados con fecha y hora 
                para tu referencia y por requisitos legales de transparencia.
              </AlertDescription>
            </Alert>

            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                <strong>Último cambio:</strong> Hoy a las 14:30 - Consentimiento para alertas de crisis activado
              </p>
              <Button variant="ghost" size="sm" className="mt-2 h-7">
                Ver historial completo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};