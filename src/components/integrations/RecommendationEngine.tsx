import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  Moon, 
  Activity, 
  Coffee, 
  Heart,
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'sleep' | 'exercise' | 'stress' | 'break';
  priority: 1 | 2 | 3;
  trigger_data?: any;
  expires_at?: string;
}

const recommendationIcons = {
  sleep: Moon,
  exercise: Activity,
  stress: Heart,
  break: Clock
};

const priorityColors = {
  1: "bg-red-500",
  2: "bg-yellow-500", 
  3: "bg-blue-500"
};

const priorityLabels = {
  1: "Alta",
  2: "Media",
  3: "Baja"
};

export const RecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
    generateRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: recommendations } = await supabase
        .from('wellness_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (recommendations) {
        setRecommendations(recommendations.map(rec => ({
          id: rec.id,
          title: rec.title,
          description: rec.description,
          type: rec.recommendation_type as 'sleep' | 'exercise' | 'stress' | 'break',
          priority: rec.priority as 1 | 2 | 3,
          trigger_data: rec.trigger_data,
          expires_at: rec.expires_at || undefined
        })));
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get recent external data
      const { data: externalData } = await supabase
        .from('external_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Get recent mood entries
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Generate recommendations based on patterns
      const newRecommendations = [];

      // Sleep analysis
      const sleepData = externalData?.filter(d => d.data_type === 'sleep') || [];
      if (sleepData.length > 0) {
        const avgSleep = sleepData.reduce((sum, d) => sum + Number(d.value), 0) / sleepData.length;
        
        if (avgSleep < 6) {
          newRecommendations.push({
            user_id: user.id,
            recommendation_type: 'sleep',
            title: 'Mejora tu descanso nocturno',
            description: 'Has estado durmiendo menos de 6 horas. Te recomendamos una rutina de relajación 30 minutos antes de dormir.',
            priority: 1,
            trigger_data: { avg_sleep: avgSleep, pattern: 'insufficient_sleep' }
          });
        }
      }

      // Steps analysis
      const stepsData = externalData?.filter(d => d.data_type === 'steps') || [];
      if (stepsData.length > 0) {
        const avgSteps = stepsData.reduce((sum, d) => sum + Number(d.value), 0) / stepsData.length;
        
        if (avgSteps < 5000) {
          newRecommendations.push({
            user_id: user.id,
            recommendation_type: 'exercise',
            title: 'Incrementa tu actividad diaria',
            description: 'Caminar 15 minutos más al día puede mejorar significativamente tu bienestar.',
            priority: 2,
            trigger_data: { avg_steps: avgSteps, pattern: 'low_activity' }
          });
        }
      }

      // Mood analysis
      if (moodEntries && moodEntries.length > 0) {
        const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood_level, 0) / moodEntries.length;
        
        if (avgMood < 3) {
          newRecommendations.push({
            user_id: user.id,
            recommendation_type: 'stress',
            title: 'Ejercicio de respiración recomendado',
            description: 'Tu estado de ánimo ha estado bajo. Un ejercicio de respiración de 5 minutos puede ayudarte.',
            priority: 1,
            trigger_data: { avg_mood: avgMood, pattern: 'low_mood' }
          });
        }
      }

      // Time-based recommendations
      const currentHour = new Date().getHours();
      if (currentHour >= 14 && currentHour <= 16) {
        newRecommendations.push({
          user_id: user.id,
          recommendation_type: 'break',
          title: 'Micropause de la tarde',
          description: 'Es un buen momento para una pausa de 5 minutos. Estira o camina un poco.',
          priority: 3,
          trigger_data: { time: currentHour, pattern: 'afternoon_break' },
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // Expires in 2 hours
        });
      }

      // Save new recommendations
      if (newRecommendations.length > 0) {
        await supabase.from('wellness_recommendations').insert(newRecommendations);
        await loadRecommendations();
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const dismissRecommendation = async (id: string) => {
    try {
      await supabase
        .from('wellness_recommendations')
        .update({ is_active: false })
        .eq('id', id);
      
      setRecommendations(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: "Recomendación descartada",
        description: "La recomendación ha sido marcada como completada.",
      });
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recomendaciones Personalizadas
        </CardTitle>
        <CardDescription>
          Sugerencias basadas en tus patrones de sueño, actividad y estado de ánimo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ¡Excelente! No hay recomendaciones pendientes. Sigue así.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation) => {
              const Icon = recommendationIcons[recommendation.type];
              
              return (
                <Card key={recommendation.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 text-primary" />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{recommendation.title}</h4>
                            <Badge className={priorityColors[recommendation.priority]}>
                              {priorityLabels[recommendation.priority]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {recommendation.description}
                          </p>
                          {recommendation.expires_at && (
                            <p className="text-xs text-muted-foreground">
                              Expira: {new Date(recommendation.expires_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissRecommendation(recommendation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={generateRecommendations}
            className="w-full"
          >
            Actualizar Recomendaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};