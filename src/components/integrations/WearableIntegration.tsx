import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Activity, Heart, Moon, Footprints, Smartphone, Watch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WearableData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  lastSync: Date;
}

export const WearableIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deviceTypes = [
    { name: "Apple Health", icon: Smartphone, connected: false, color: "bg-blue-500" },
    { name: "Google Fit", icon: Activity, connected: false, color: "bg-green-500" },
    { name: "Fitbit", icon: Watch, connected: false, color: "bg-purple-500" },
  ];

  useEffect(() => {
    loadWearableData();
  }, []);

  const loadWearableData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: externalData } = await supabase
        .from('external_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (externalData && externalData.length > 0) {
        const latestSteps = externalData.find(d => d.data_type === 'steps')?.value || 0;
        const latestHeartRate = externalData.find(d => d.data_type === 'heart_rate')?.value || 0;
        const latestSleep = externalData.find(d => d.data_type === 'sleep')?.value || 0;

        setWearableData({
          steps: Number(latestSteps),
          heartRate: Number(latestHeartRate),
          sleepHours: Number(latestSleep),
          lastSync: new Date(),
        });
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error loading wearable data:', error);
    }
  };

  const simulateConnection = async () => {
    setLoading(true);
    
    // Simulate connecting and syncing data
    setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Generate mock data
        const mockData = [
          { data_type: 'steps', value: Math.floor(Math.random() * 5000) + 5000, unit: 'steps' },
          { data_type: 'heart_rate', value: Math.floor(Math.random() * 40) + 60, unit: 'bpm' },
          { data_type: 'sleep', value: Math.random() * 3 + 6, unit: 'hours' }
        ];

        // Save to database
        for (const data of mockData) {
          await supabase.from('external_data').insert({
            user_id: user.id,
            ...data,
            device_source: 'Demo Device'
          });
        }

        await loadWearableData();
        setLoading(false);
        
        toast({
          title: "Dispositivo conectado",
          description: "Datos sincronizados exitosamente",
        });
      } catch (error) {
        console.error('Error syncing data:', error);
        setLoading(false);
      }
    }, 2000);
  };

  const getStepsProgress = () => {
    const goal = 10000;
    return wearableData ? Math.min((wearableData.steps / goal) * 100, 100) : 0;
  };

  const getHeartRateStatus = () => {
    if (!wearableData) return { status: "Sin datos", color: "bg-gray-500" };
    const hr = wearableData.heartRate;
    if (hr < 60) return { status: "Bajo", color: "bg-blue-500" };
    if (hr > 100) return { status: "Elevado", color: "bg-red-500" };
    return { status: "Normal", color: "bg-green-500" };
  };

  const getSleepQuality = () => {
    if (!wearableData) return { quality: "Sin datos", color: "bg-gray-500" };
    const hours = wearableData.sleepHours;
    if (hours < 6) return { quality: "Insuficiente", color: "bg-red-500" };
    if (hours > 9) return { quality: "Excesivo", color: "bg-orange-500" };
    return { quality: "Óptimo", color: "bg-green-500" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Integración de Dispositivos
          </CardTitle>
          <CardDescription>
            Conecta tus dispositivos wearables para un seguimiento completo de tu bienestar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deviceTypes.map((device, index) => (
                  <Card key={index} className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <device.icon className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{device.name}</p>
                      <Badge variant="secondary" className="mt-2">
                        No conectado
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button 
                onClick={simulateConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Conectando..." : "Conectar Dispositivo (Demo)"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-green-500">
                  Dispositivo Conectado
                </Badge>
                <Switch checked={true} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Steps Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Footprints className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Pasos</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{wearableData?.steps.toLocaleString()}</p>
                      <Progress value={getStepsProgress()} className="h-2" />
                      <p className="text-xs text-muted-foreground">Meta: 10,000 pasos</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Heart Rate Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Ritmo Cardíaco</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{wearableData?.heartRate} bpm</p>
                      <Badge className={getHeartRateStatus().color}>
                        {getHeartRateStatus().status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Sleep Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium">Sueño</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{wearableData?.sleepHours.toFixed(1)}h</p>
                      <Badge className={getSleepQuality().color}>
                        {getSleepQuality().quality}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {wearableData && (
                <p className="text-xs text-muted-foreground text-center">
                  Última sincronización: {wearableData.lastSync.toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};