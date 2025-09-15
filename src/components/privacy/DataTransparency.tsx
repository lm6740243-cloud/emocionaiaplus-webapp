import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Download, 
  Eye, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Activity,
  ShieldCheck,
  Clock,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DataStats {
  chat_messages: number;
  mood_entries: number;
  wellness_tracking: number;
  external_data: number;
  appointments: number;
  total_size: string;
}

export const DataTransparency = () => {
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const dataCategories = [
    {
      title: "Conversaciones con IA",
      description: "Mensajes e historial de chat con el asistente de IA",
      icon: MessageSquare,
      color: "bg-blue-500",
      key: "chat_messages",
      retention: "Se conservan por tiempo indefinido hasta que solicites su eliminación"
    },
    {
      title: "Registros de Estado de Ánimo", 
      description: "Entradas diarias de seguimiento emocional y notas",
      icon: Heart,
      color: "bg-red-500",
      key: "mood_entries",
      retention: "Se conservan por 2 años o hasta que solicites su eliminación"
    },
    {
      title: "Datos de Bienestar",
      description: "Seguimiento de sueño, estrés, energía y actividad física",
      icon: Activity,
      color: "bg-green-500", 
      key: "wellness_tracking",
      retention: "Se conservan por 1 año para análisis de tendencias"
    },
    {
      title: "Datos Externos",
      description: "Información sincronizada desde dispositivos wearables",
      icon: Database,
      color: "bg-purple-500",
      key: "external_data", 
      retention: "Se conservan por 6 meses para generar recomendaciones"
    },
    {
      title: "Citas y Sesiones",
      description: "Historial de appointments programadas con profesionales",
      icon: Calendar,
      color: "bg-yellow-500",
      key: "appointments",
      retention: "Se conservan por 5 años por requisitos médicos"
    }
  ];

  useEffect(() => {
    loadDataStats();
  }, []);

  const loadDataStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get counts for each data type
      const [chatMessages, moodEntries, wellnessData, externalData, appointments] = await Promise.all([
        supabase.from('chat_messages').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('mood_entries').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('wellness_tracking').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('external_data').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('patient_id', user.id)
      ]);

      const stats: DataStats = {
        chat_messages: chatMessages.count || 0,
        mood_entries: moodEntries.count || 0,
        wellness_tracking: wellnessData.count || 0,
        external_data: externalData.count || 0,
        appointments: appointments.count || 0,
        total_size: calculateEstimatedSize({
          chat_messages: chatMessages.count || 0,
          mood_entries: moodEntries.count || 0,
          wellness_tracking: wellnessData.count || 0,
          external_data: externalData.count || 0,
          appointments: appointments.count || 0
        })
      };

      setDataStats(stats);
    } catch (error) {
      console.error('Error loading data stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas de datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedSize = (stats: Omit<DataStats, 'total_size'>) => {
    // Rough estimation based on typical data sizes
    const sizes = {
      chat_messages: stats.chat_messages * 0.5, // ~500 bytes per message
      mood_entries: stats.mood_entries * 0.3, // ~300 bytes per entry
      wellness_tracking: stats.wellness_tracking * 0.2, // ~200 bytes per entry
      external_data: stats.external_data * 0.1, // ~100 bytes per data point
      appointments: stats.appointments * 1, // ~1KB per appointment
    };

    const totalKB = Object.values(sizes).reduce((sum, size) => sum + size, 0);
    
    if (totalKB < 1000) {
      return `${Math.round(totalKB)} KB`;
    } else {
      return `${(totalKB / 1000).toFixed(1)} MB`;
    }
  };

  const exportUserData = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Collect all user data
      const [chatMessages, moodEntries, wellnessData, externalData, appointments] = await Promise.all([
        supabase.from('chat_messages').select('*').eq('user_id', user.id),
        supabase.from('mood_entries').select('*').eq('user_id', user.id),
        supabase.from('wellness_tracking').select('*').eq('user_id', user.id),
        supabase.from('external_data').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('patient_id', user.id)
      ]);

      const exportData = {
        export_date: new Date().toISOString(),
        user_id: user.id,
        data: {
          chat_messages: chatMessages.data || [],
          mood_entries: moodEntries.data || [],
          wellness_tracking: wellnessData.data || [],
          external_data: externalData.data || [],
          appointments: appointments.data || []
        },
        metadata: {
          total_records: (chatMessages.data?.length || 0) + (moodEntries.data?.length || 0) + 
                        (wellnessData.data?.length || 0) + (externalData.data?.length || 0) + 
                        (appointments.data?.length || 0),
          estimated_size: dataStats?.total_size || 'Calculando...'
        }
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emocionalIA_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Exportación completada",
        description: "Tus datos han sido descargados exitosamente",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error en la exportación",
        description: "No se pudieron exportar tus datos. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
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
            <Eye className="h-5 w-5" />
            Transparencia de Datos
          </CardTitle>
          <CardDescription>
            Información completa sobre qué datos guardamos y cómo los utilizamos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {dataStats ? Object.values(dataStats).slice(0, -1).reduce((a: number, b: number) => a + b, 0) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Total de registros</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataStats?.total_size || '0 KB'}</div>
              <div className="text-sm text-muted-foreground">Tamaño estimado</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Tipos de datos</div>
            </div>
          </div>

          <Separator />

          {/* Data Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Categorías de Datos Almacenados
            </h4>
            
            {dataCategories.map((category, index) => {
              const Icon = category.icon;
              const count = dataStats ? dataStats[category.key as keyof DataStats] as number : 0;
              
              return (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{category.title}</h5>
                          <Badge variant="secondary">{count} registros</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Retención: {category.retention}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          {/* Data Export */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Mis Datos
            </h4>
            
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Puedes descargar una copia completa de todos tus datos en formato JSON. 
                Este archivo incluye toda la información asociada a tu cuenta.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Exportación Completa de Datos</p>
                <p className="text-sm text-muted-foreground">
                  Descarga todos tus datos en un archivo JSON legible
                </p>
              </div>
              <Button 
                onClick={exportUserData}
                disabled={exporting}
                className="bg-gradient-primary"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Datos
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Data Usage */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Uso de los Datos
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <h5 className="font-medium text-green-600 mb-2">✓ Cómo SÍ usamos tus datos:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Personalizar recomendaciones de bienestar</li>
                    <li>• Generar análisis de progreso personal</li>
                    <li>• Detectar patrones para mejorar tu experiencia</li>
                    <li>• Facilitar comunicación con profesionales (con tu consentimiento)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-4">
                  <h5 className="font-medium text-red-600 mb-2">✗ Cómo NO usamos tus datos:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nunca vendemos tu información personal</li>
                    <li>• No compartimos datos sin tu consentimiento explícito</li>
                    <li>• No usamos datos para publicidad externa</li>
                    <li>• No almacenamos información financiera</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};