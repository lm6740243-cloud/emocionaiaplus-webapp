import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Users,
  Heart,
  Building2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface LocalResource {
  id: string;
  nombre: string;
  tipo: 'linea_ayuda' | 'organizacion' | 'hospital' | 'centro_salud' | 'ong';
  telefono?: string;
  email?: string;
  sitio_web?: string;
  direccion?: string;
  descripcion?: string;
  horarios?: string;
  servicios: string[];
  poblacion_objetivo: string[];
  costo: string;
  is_local: boolean;
  distance_score: number;
}

interface LocalResourcesProps {
  userCity?: string;
  userProvince?: string;
}

const typeLabels = {
  linea_ayuda: 'Línea de Ayuda',
  organizacion: 'Organización',
  hospital: 'Hospital',
  centro_salud: 'Centro de Salud',
  ong: 'ONG'
};

const typeIcons = {
  linea_ayuda: Phone,
  organizacion: Building2,
  hospital: Building2,
  centro_salud: Heart,
  ong: Users
};

const typeColors = {
  linea_ayuda: 'bg-red-500',
  organizacion: 'bg-blue-500',
  hospital: 'bg-green-500',
  centro_salud: 'bg-purple-500',
  ong: 'bg-orange-500'
};

export const LocalResources: React.FC<LocalResourcesProps> = ({ 
  userCity, 
  userProvince 
}) => {
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocalResources();
  }, [userCity, userProvince]);

  const loadLocalResources = async () => {
    try {
      if (!userCity || !userProvince) {
        // If no location, show national resources only
        const { data, error } = await supabase
          .from('recursos_locales')
          .select('*')
          .eq('ciudad', 'Nacional')
          .eq('activo', true)
          .eq('verificado', true)
          .order('nombre');

        if (error) throw error;

        setResources(data.map(resource => ({
          ...resource,
          tipo: resource.tipo as 'linea_ayuda' | 'organizacion' | 'hospital' | 'centro_salud' | 'ong',
          is_local: true,
          distance_score: 1
        })));
      } else {
        // Use function to get location-based resources
        const { data, error } = await supabase.rpc('get_local_resources', {
          p_user_city: userCity,
          p_user_province: userProvince
        });

        if (error) throw error;
        setResources((data || []).map(resource => ({
          ...resource,
          tipo: resource.tipo as 'linea_ayuda' | 'organizacion' | 'hospital' | 'centro_salud' | 'ong'
        })));
      }
    } catch (error) {
      console.error('Error loading local resources:', error);
      toast.error('Error al cargar recursos locales');
    } finally {
      setLoading(false);
    }
  };

  const getContactButtons = (resource: LocalResource) => {
    const buttons = [];

    if (resource.telefono) {
      buttons.push(
        <Button
          key="phone"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => window.open(`tel:${resource.telefono}`, '_self')}
        >
          <Phone className="h-4 w-4" />
          {resource.telefono}
        </Button>
      );
    }

    if (resource.email) {
      buttons.push(
        <Button
          key="email"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => window.open(`mailto:${resource.email}`, '_self')}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
      );
    }

    if (resource.sitio_web) {
      buttons.push(
        <Button
          key="website"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => window.open(resource.sitio_web, '_blank')}
        >
          <Globe className="h-4 w-4" />
          Sitio Web
          <ExternalLink className="h-3 w-3" />
        </Button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Recursos Locales
          </h2>
          <p className="text-muted-foreground mt-1">
            {userCity && userProvince 
              ? `Recursos de apoyo en ${userCity}, ${userProvince}` 
              : 'Recursos de apoyo disponibles'
            }
          </p>
        </div>
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay recursos locales</h3>
            <p className="text-muted-foreground">
              {userCity && userProvince 
                ? `No se encontraron recursos específicos para ${userCity}, ${userProvince}.`
                : 'Actualiza tu ubicación en el perfil para ver recursos locales.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* Group by type */}
          {Object.entries(
            resources.reduce((acc, resource) => {
              if (!acc[resource.tipo]) acc[resource.tipo] = [];
              acc[resource.tipo].push(resource);
              return acc;
            }, {} as Record<string, LocalResource[]>)
          ).map(([tipo, typeResources]) => {
            const TypeIcon = typeIcons[tipo as keyof typeof typeIcons];
            const typeColor = typeColors[tipo as keyof typeof typeColors];
            
            return (
              <div key={tipo} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${typeColor} text-white`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-medium">
                    {typeLabels[tipo as keyof typeof typeLabels]}
                  </h3>
                  <Badge variant="secondary">
                    {typeResources.length}
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {typeResources.map((resource) => (
                    <Card key={resource.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">{resource.nombre}</h4>
                              {resource.descripcion && (
                                <p className="text-sm text-muted-foreground">
                                  {resource.descripcion}
                                </p>
                              )}
                            </div>
                            {resource.is_local && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Local
                              </Badge>
                            )}
                          </div>

                          {/* Services */}
                          {resource.servicios.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Servicios
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {resource.servicios.slice(0, 3).map((servicio, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {servicio.replace(/_/g, ' ')}
                                  </Badge>
                                ))}
                                {resource.servicios.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{resource.servicios.length - 3} más
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Hours and Cost */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {resource.horarios && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {resource.horarios}
                              </div>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {resource.costo}
                            </Badge>
                          </div>

                          {/* Contact buttons */}
                          <div className="flex flex-wrap gap-2">
                            {getContactButtons(resource)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};