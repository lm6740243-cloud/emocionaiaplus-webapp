import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Users, MessageSquare, Calendar, Shield, Volume2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreference {
  tipo_notificacion: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  grupo_id?: string;
}

interface GlobalSettings {
  menciones: { in_app: boolean; email: boolean };
  respuestas: { in_app: boolean; email: boolean };
  reuniones: { in_app: boolean; email: boolean };
  moderacion: { in_app: boolean; email: boolean };
  mensajes_nuevos: { in_app: boolean; email: boolean };
}

export default function NotificationSettings() {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    menciones: { in_app: true, email: false },
    respuestas: { in_app: true, email: false },
    reuniones: { in_app: true, email: true },
    moderacion: { in_app: true, email: true },
    mensajes_nuevos: { in_app: false, email: false }
  });
  const [groupSettings, setGroupSettings] = useState<{ [key: string]: NotificationPreference[] }>({});
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user's groups
      const { data: userGroups } = await supabase
        .from('grupo_miembros')
        .select(`
          grupo_id,
          support_groups (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id)
        .eq('activo', true);

      if (userGroups) {
        const groupsData = userGroups.map(ug => ug.support_groups).filter(Boolean);
        setGroups(groupsData);
      }

      // Load notification preferences
      const { data: preferences } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (preferences) {
        // Separate global and group-specific preferences
        const globalPrefs: { [key: string]: NotificationPreference } = {};
        const groupPrefs: { [key: string]: NotificationPreference[] } = {};

        preferences.forEach(pref => {
          if (pref.grupo_id) {
            if (!groupPrefs[pref.grupo_id]) {
              groupPrefs[pref.grupo_id] = [];
            }
            groupPrefs[pref.grupo_id].push(pref);
          } else {
            globalPrefs[pref.tipo_notificacion] = pref;
          }
        });

        // Update global settings
        const newGlobalSettings = { ...globalSettings };
        Object.entries(globalPrefs).forEach(([tipo, pref]) => {
          if (newGlobalSettings[tipo as keyof GlobalSettings]) {
            newGlobalSettings[tipo as keyof GlobalSettings] = {
              in_app: pref.in_app_enabled,
              email: pref.email_enabled
            };
          }
        });
        setGlobalSettings(newGlobalSettings);
        setGroupSettings(groupPrefs);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones de notificación",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalSetting = async (tipo: keyof GlobalSettings, channel: 'in_app' | 'email', enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          tipo_notificacion: tipo,
          in_app_enabled: channel === 'in_app' ? enabled : globalSettings[tipo].in_app,
          email_enabled: channel === 'email' ? enabled : globalSettings[tipo].email
        });

      if (error) throw error;

      setGlobalSettings(prev => ({
        ...prev,
        [tipo]: {
          ...prev[tipo],
          [channel]: enabled
        }
      }));

      toast({
        title: "Configuración actualizada",
        description: "Las preferencias de notificación se han guardado correctamente"
      });
    } catch (error) {
      console.error('Error updating notification preference:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive"
      });
    }
  };

  const updateGroupSetting = async (grupoId: string, tipo: string, channel: 'in_app' | 'email', enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentGroupPrefs = groupSettings[grupoId] || [];
      const existingPref = currentGroupPrefs.find(p => p.tipo_notificacion === tipo);

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          grupo_id: grupoId,
          tipo_notificacion: tipo,
          in_app_enabled: channel === 'in_app' ? enabled : (existingPref?.in_app_enabled ?? true),
          email_enabled: channel === 'email' ? enabled : (existingPref?.email_enabled ?? false)
        });

      if (error) throw error;

      // Update local state
      setGroupSettings(prev => {
        const newGroupSettings = { ...prev };
        if (!newGroupSettings[grupoId]) {
          newGroupSettings[grupoId] = [];
        }
        
        const prefIndex = newGroupSettings[grupoId].findIndex(p => p.tipo_notificacion === tipo);
        if (prefIndex >= 0) {
          newGroupSettings[grupoId][prefIndex] = {
            ...newGroupSettings[grupoId][prefIndex],
            [`${channel}_enabled`]: enabled
          };
        } else {
          newGroupSettings[grupoId].push({
            tipo_notificacion: tipo,
            in_app_enabled: channel === 'in_app' ? enabled : true,
            email_enabled: channel === 'email' ? enabled : false,
            grupo_id: grupoId
          });
        }
        
        return newGroupSettings;
      });

      toast({
        title: "Configuración actualizada",
        description: "Las preferencias del grupo se han guardado correctamente"
      });
    } catch (error) {
      console.error('Error updating group notification preference:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración del grupo",
        variant: "destructive"
      });
    }
  };

  const getGroupPreference = (grupoId: string, tipo: string, channel: 'in_app' | 'email'): boolean => {
    const groupPrefs = groupSettings[grupoId] || [];
    const pref = groupPrefs.find(p => p.tipo_notificacion === tipo);
    if (channel === 'in_app') {
      return pref?.in_app_enabled ?? globalSettings[tipo as keyof GlobalSettings]?.in_app ?? true;
    }
    return pref?.email_enabled ?? globalSettings[tipo as keyof GlobalSettings]?.email ?? false;
  };

  const notificationTypes = [
    { key: 'menciones', label: 'Menciones', icon: Volume2, description: 'Cuando alguien te menciona en un mensaje' },
    { key: 'respuestas', label: 'Respuestas a mis mensajes', icon: MessageSquare, description: 'Cuando alguien responde a tus mensajes' },
    { key: 'reuniones', label: 'Nuevas reuniones', icon: Calendar, description: 'Cuando se programan nuevas reuniones en grupos' },
    { key: 'moderacion', label: 'Anuncios de moderación', icon: Shield, description: 'Anuncios importantes de los moderadores' },
    { key: 'mensajes_nuevos', label: 'Mensajes nuevos', icon: MessageSquare, description: 'Todos los mensajes nuevos en grupos' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Configuración de Notificaciones</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona cómo y cuándo recibir notificaciones de los grupos de apoyo
          </p>
        </div>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Configuración Global
            </CardTitle>
            <CardDescription>
              Estas configuraciones se aplicarán a todos los grupos por defecto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationTypes.map(({ key, label, icon: Icon, description }) => (
              <div key={key} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">{label}</h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-8">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`global-${key}-app`} className="text-sm">En la app</Label>
                    <Switch
                      id={`global-${key}-app`}
                      checked={globalSettings[key as keyof GlobalSettings]?.in_app ?? true}
                      onCheckedChange={(checked) => updateGlobalSetting(key as keyof GlobalSettings, 'in_app', checked)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={`global-${key}-email`} className="text-sm">Email</Label>
                    <Switch
                      id={`global-${key}-email`}
                      checked={globalSettings[key as keyof GlobalSettings]?.email ?? false}
                      onCheckedChange={(checked) => updateGlobalSetting(key as keyof GlobalSettings, 'email', checked)}
                    />
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Group-specific Settings */}
        {groups.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configuración por Grupo
              </CardTitle>
              <CardDescription>
                Personaliza las notificaciones para grupos específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {groups.map((group) => (
                <div key={group.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 ml-13">
                    {notificationTypes.map(({ key, label, icon: Icon }) => (
                      <div key={`${group.id}-${key}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-3 w-3 text-muted-foreground" />
                            <Switch
                              checked={getGroupPreference(group.id, key, 'in_app')}
                              onCheckedChange={(checked) => updateGroupSetting(group.id, key, 'in_app', checked)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <Switch
                              checked={getGroupPreference(group.id, key, 'email')}
                              onCheckedChange={(checked) => updateGroupSetting(group.id, key, 'email', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={loadData} variant="outline">
            Recargar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
}