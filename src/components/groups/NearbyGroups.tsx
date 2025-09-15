import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  Plus,
  Star,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface NearbyGroup {
  id: string;
  name: string;
  description?: string;
  city?: string;
  country?: string;
  region?: string;
  meeting_type?: string;
  current_members: number;
  capacidad_max?: number;
  created_at: string;
  is_local: boolean;
  distance_score: number;
}

interface NearbyGroupsProps {
  userCity?: string;
  userProvince?: string;
}

export const NearbyGroups: React.FC<NearbyGroupsProps> = ({ 
  userCity, 
  userProvince 
}) => {
  const [nearbyGroups, setNearbyGroups] = useState<NearbyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNearbyGroups();
  }, [userCity, userProvince]);

  const loadNearbyGroups = async () => {
    try {
      if (!userCity || !userProvince) {
        // If no location, show all groups
        const { data, error } = await supabase
          .from('support_groups')
          .select('*')
          .eq('is_active', true)
          .in('privacidad', ['publico', 'requiere_aprobacion'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        setNearbyGroups(data.map(group => ({
          ...group,
          is_local: false,
          distance_score: 4
        })));
      } else {
        // Use function to get location-based groups
        const { data, error } = await supabase.rpc('get_nearby_groups', {
          p_user_city: userCity,
          p_user_province: userProvince
        });

        if (error) throw error;
        setNearbyGroups(data || []);
      }
    } catch (error) {
      console.error('Error loading nearby groups:', error);
      toast.error('Error al cargar grupos cercanos');
    } finally {
      setLoading(false);
    }
  };

  const getDistanceLabel = (score: number, isLocal: boolean) => {
    if (isLocal) return 'En tu ciudad';
    switch (score) {
      case 2: return 'En tu provincia';
      case 3: return 'En Ecuador';
      case 4: return 'Internacional';
      default: return '';
    }
  };

  const getLocationDisplay = (group: NearbyGroup) => {
    if (group.city && group.region) {
      return `${group.city}, ${group.region}`;
    } else if (group.region) {
      return group.region;
    } else if (group.country) {
      return group.country;
    }
    return 'Ubicación no especificada';
  };

  const handleJoinGroup = (groupId: string) => {
    navigate(`/grupos/${groupId}`);
  };

  const localGroups = nearbyGroups.filter(g => g.is_local);
  const hasNearbyGroups = localGroups.length > 0;

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
            <Navigation className="h-6 w-6 text-primary" />
            Cerca de Mí
          </h2>
          <p className="text-muted-foreground mt-1">
            {userCity && userProvince 
              ? `Grupos de apoyo en ${userCity}, ${userProvince}` 
              : 'Grupos de apoyo cercanos'
            }
          </p>
        </div>
      </div>

      {!hasNearbyGroups && userCity && userProvince && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay grupos en tu área</h3>
            <p className="text-muted-foreground mb-4">
              No encontramos grupos de apoyo presenciales en {userCity}, {userProvince}.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ¿Te gustaría crear un grupo virtual para tu comunidad?
              </p>
              <Button onClick={() => navigate('/crear-grupo')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Grupo Virtual
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {nearbyGroups.length === 0 && (!userCity || !userProvince) && (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Configura tu ubicación</h3>
            <p className="text-muted-foreground">
              Actualiza tu ciudad y provincia en el perfil para ver grupos cercanos.
            </p>
          </CardContent>
        </Card>
      )}

      {nearbyGroups.length > 0 && (
        <div className="space-y-4">
          {/* Local Groups First */}
          {localGroups.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium">En tu ciudad</h3>
                <Badge variant="secondary">{localGroups.length}</Badge>
              </div>
              
              <div className="grid gap-3">
                {localGroups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group} 
                    onJoin={handleJoinGroup}
                    getLocationDisplay={getLocationDisplay}
                    getDistanceLabel={getDistanceLabel}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Groups */}
          {nearbyGroups.filter(g => !g.is_local).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Otros grupos</h3>
                <Badge variant="outline">
                  {nearbyGroups.filter(g => !g.is_local).length}
                </Badge>
              </div>
              
              <div className="grid gap-3">
                {nearbyGroups
                  .filter(g => !g.is_local)
                  .slice(0, 5)
                  .map((group) => (
                    <GroupCard 
                      key={group.id} 
                      group={group} 
                      onJoin={handleJoinGroup}
                      getLocationDisplay={getLocationDisplay}
                      getDistanceLabel={getDistanceLabel}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Group Card Component
const GroupCard: React.FC<{
  group: NearbyGroup;
  onJoin: (groupId: string) => void;
  getLocationDisplay: (group: NearbyGroup) => string;
  getDistanceLabel: (score: number, isLocal: boolean) => string;
}> = ({ group, onJoin, getLocationDisplay, getDistanceLabel }) => {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      group.is_local ? 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{group.name}</h4>
                {group.is_local && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {getDistanceLabel(group.distance_score, group.is_local)}
                  </Badge>
                )}
              </div>
              
              {group.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {group.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{getLocationDisplay(group)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {group.current_members}
                {group.capacidad_max && ` / ${group.capacidad_max}`} miembros
              </span>
            </div>
          </div>

          {group.meeting_type && (
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {group.meeting_type}
              </Badge>
              
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(group.id);
                }}
              >
                Ver Grupo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
