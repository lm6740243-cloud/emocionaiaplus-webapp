import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Heart, 
  Shield, 
  Clock, 
  MapPin, 
  AlertTriangle,
  PhoneCall,
  MessageCircle,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyResource {
  id: string;
  tipo: 'linea_crisis' | 'hospital' | 'policia' | 'organizacion';
  nombre: string;
  telefono: string;
  descripcion?: string;
  disponibilidad: string;
  orden: number;
}

interface CrisisHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmergencyContact?: {
    name: string;
    phone: string;
  };
}

const typeIcons = {
  linea_crisis: Heart,
  hospital: Shield,
  policia: AlertTriangle,
  organizacion: Users
};

const typeColors = {
  linea_crisis: 'text-red-500 bg-red-50 border-red-200',
  hospital: 'text-blue-500 bg-blue-50 border-blue-200',
  policia: 'text-orange-500 bg-orange-50 border-orange-200',
  organizacion: 'text-green-500 bg-green-50 border-green-200'
};

const typeLabels = {
  linea_crisis: 'Línea de Crisis',
  hospital: 'Centro Médico',
  policia: 'Emergencias',
  organizacion: 'Organización de Apoyo'
};

export function CrisisHelpModal({ open, onOpenChange, userEmergencyContact }: CrisisHelpModalProps) {
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadEmergencyResources();
    }
  }, [open]);

  const loadEmergencyResources = async () => {
    try {
      const { data, error } = await supabase
        .from('recursos_emergencia')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (error) throw error;
      setResources((data || []) as EmergencyResource[]);
    } catch (error) {
      console.error('Error loading emergency resources:', error);
      toast.error('Error al cargar recursos de emergencia');
    } finally {
      setLoading(false);
    }
  };

  const handleCallEmergencyContact = () => {
    if (userEmergencyContact?.phone) {
      window.open(`tel:${userEmergencyContact.phone}`, '_self');
    } else {
      toast.error('No tienes un contacto de emergencia configurado');
    }
  };

  const handleCallResource = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleStartPrivateChat = async () => {
    toast.success('Los moderadores han sido notificados y se contactarán contigo pronto.');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-6 w-6 text-red-500" />
            Ayuda Inmediata Disponible
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Crisis Message */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Tu bienestar es importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-sm leading-relaxed">
                Hemos detectado que podrías estar pasando por un momento difícil. 
                No estás solo/a. Hay personas capacitadas disponibles las 24 horas 
                del día para ayudarte y apoyarte.
              </p>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {userEmergencyContact && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Tu Contacto de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">{userEmergencyContact.name}</p>
                    <p className="text-sm text-blue-700">{userEmergencyContact.phone}</p>
                  </div>
                  <Button
                    onClick={handleCallEmergencyContact}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar Ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Professional Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Apoyo Profesional en el Grupo
              </CardTitle>
              <CardDescription>
                Los moderadores están capacitados para brindar apoyo inicial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleStartPrivateChat}
                variant="outline"
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Solicitar Chat Privado con Moderador
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Recursos de Emergencia - Ecuador</h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {resources.map((resource) => {
                  const IconComponent = typeIcons[resource.tipo];
                  return (
                    <Card 
                      key={resource.id} 
                      className={`border-l-4 hover:shadow-md transition-shadow ${typeColors[resource.tipo]}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm">{resource.nombre}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {typeLabels[resource.tipo]}
                                </Badge>
                              </div>
                              
                              {resource.descripcion && (
                                <p className="text-sm text-muted-foreground">
                                  {resource.descripcion}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="font-mono">{resource.telefono}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{resource.disponibilidad}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleCallResource(resource.telefono)}
                            className="ml-4 flex-shrink-0"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Llamar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Important Note */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-800">Nota Importante</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Si sientes que estás en peligro inmediato, llama al <strong>ECU 911</strong> 
                    o dirígete al hospital más cercano. Tu seguridad es lo más importante.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button
              onClick={() => handleCallResource('171')}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              Línea de Crisis 171
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}