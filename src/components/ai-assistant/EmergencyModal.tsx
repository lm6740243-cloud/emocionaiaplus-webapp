import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Users, 
  MessageSquare, 
  Clock,
  MapPin,
  User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedKeywords: string[];
}

const EmergencyModal = ({ isOpen, onClose, detectedKeywords }: EmergencyModalProps) => {
  const { toast } = useToast();
  const [isContactingEmergency, setIsContactingEmergency] = useState(false);
  const [emergencyContactSent, setEmergencyContactSent] = useState(false);

  const emergencyResources = {
    ecuador: [
      {
        name: "Teléfono de la Esperanza",
        number: "1800-532-835",
        description: "Línea gratuita de apoyo emocional 24/7",
        icon: Heart,
        available: "24 horas"
      },
      {
        name: "MSP - Salud Mental",
        number: "171",
        description: "Ministerio de Salud Pública (opción 6)",
        icon: Users,
        available: "24 horas"
      },
      {
        name: "Emergencias Generales",
        number: "911",
        description: "Servicios de emergencia nacional",
        icon: AlertTriangle,
        available: "24 horas"
      },
      {
        name: "Fundación Círculo Abierto",
        number: "098-311-3500",
        description: "Apoyo especializado en crisis emocionales",
        icon: MessageSquare,
        available: "Lun-Vie 8am-6pm"
      }
    ]
  };

  const handleCallEmergencyContact = async () => {
    setIsContactingEmergency(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes estar autenticado para usar esta función",
          variant: "destructive"
        });
        return;
      }

      // Obtener información del contacto de emergencia
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('emergency_contact_name, emergency_contact_phone, full_name')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile?.emergency_contact_phone) {
        toast({
          title: "Contacto no configurado",
          description: "No tienes un contacto de emergencia configurado. Ve a tu perfil para agregarlo.",
          variant: "destructive"
        });
        return;
      }

      // Enviar SMS de emergencia
      const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
        body: {
          phoneNumber: profile.emergency_contact_phone,
          emergencyType: 'crisis',
          userMessage: `Crisis detectada. Palabras clave: ${detectedKeywords.join(', ')}`
        }
      });

      if (error) throw error;

      const response = await data;
      
      setEmergencyContactSent(true);
      toast({
        title: "Contacto notificado",
        description: response.simulated 
          ? "Se ha simulado el envío del SMS a tu contacto de emergencia"
          : "Se ha enviado un SMS de emergencia a tu contacto",
      });

    } catch (error) {
      console.error('Error contacting emergency:', error);
      toast({
        title: "Error",
        description: "No se pudo contactar a tu emergencia. Intenta llamar directamente.",
        variant: "destructive"
      });
    } finally {
      setIsContactingEmergency(false);
    }
  };

  const makePhoneCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Apoyo Inmediato Disponible
          </DialogTitle>
          <DialogDescription className="text-base">
            Hemos detectado que podrías estar pasando por un momento difícil. 
            No estás solo - hay personas y recursos disponibles para ayudarte.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Palabras clave detectadas */}
          {detectedKeywords.length > 0 && (
            <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2">
                  Indicadores detectados:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detectedKeywords.map((keyword, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensaje de apoyo */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Tu vida tiene valor
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Los sentimientos difíciles son temporales. Existen personas capacitadas y recursos 
                profesionales que pueden ayudarte a superar este momento. No tienes que enfrentarlo solo.
              </p>
            </CardContent>
          </Card>

          {/* Acción inmediata - Contacto de emergencia */}
          <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Tu red de apoyo
              </h4>
              
              {!emergencyContactSent ? (
                <Button
                  onClick={handleCallEmergencyContact}
                  disabled={isContactingEmergency}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {isContactingEmergency ? (
                    "Enviando notificación..."
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Notificar a mi contacto de emergencia
                    </>
                  )}
                </Button>
              ) : (
                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg text-center">
                  <p className="text-green-800 dark:text-green-400 font-medium">
                    ✓ Tu contacto de emergencia ha sido notificado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recursos de emergencia en Ecuador */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Recursos de Emergencia en Ecuador
            </h4>
            <div className="grid gap-3">
              {emergencyResources.ecuador.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-semibold">{resource.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {resource.available}
                              </Badge>
                              <Badge variant="secondary" className="text-xs font-mono">
                                {resource.number}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => makePhoneCall(resource.number)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Llamar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button
              onClick={() => makePhoneCall("1800-532-835")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Llamar Teléfono de la Esperanza
            </Button>
          </div>

          {/* Mensaje final */}
          <div className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-lg">
            <p className="mb-1">
              <strong>Recuerda:</strong> Esta es una herramienta de apoyo. Si tienes pensamientos de autolesión 
              inmediatos, busca ayuda profesional urgente.
            </p>
            <p>
              EmocionalIA+ está comprometido con tu bienestar y seguridad.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;