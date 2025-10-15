import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Flame, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DailyChallenge {
  id: string;
  challenge_type: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  completed: boolean;
  expires_at: string;
}

export const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        await generateDailyChallenges(user.id);
        await loadChallenges();
      } else {
        setChallenges(data);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyChallenges = async (userId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const challengeTemplates = [
      {
        challenge_type: 'breathing',
        title: 'Ejercicio de Respiración',
        description: 'Completa una sesión de respiración consciente de 5 minutos',
        difficulty: 'easy',
        points: 10
      },
      {
        challenge_type: 'meditation',
        title: 'Meditación Matutina',
        description: 'Medita durante 10 minutos por la mañana',
        difficulty: 'medium',
        points: 15
      },
      {
        challenge_type: 'mood_tracking',
        title: 'Registro Emocional',
        description: 'Registra tu estado de ánimo 3 veces durante el día',
        difficulty: 'easy',
        points: 10
      },
      {
        challenge_type: 'gratitude',
        title: 'Diario de Gratitud',
        description: 'Escribe 3 cosas por las que estás agradecido/a',
        difficulty: 'easy',
        points: 10
      },
      {
        challenge_type: 'physical',
        title: 'Actividad Física',
        description: 'Completa 8,000 pasos según tu wearable',
        difficulty: 'medium',
        points: 15
      },
      {
        challenge_type: 'sleep',
        title: 'Descanso Óptimo',
        description: 'Duerme entre 7-8 horas esta noche',
        difficulty: 'medium',
        points: 15
      },
      {
        challenge_type: 'mindfulness',
        title: 'Momento Presente',
        description: 'Practica 3 momentos de atención plena durante el día',
        difficulty: 'medium',
        points: 15
      }
    ];

    const selectedChallenges = challengeTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    for (const challenge of selectedChallenges) {
      await supabase.from('daily_challenges').insert({
        user_id: userId,
        ...challenge,
        expires_at: tomorrow.toISOString()
      });
    }
  };

  const completeChallenge = async (challengeId: string, points: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('daily_challenges')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', challengeId);

      const { data: userPoints } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userPoints) {
        await supabase
          .from('user_points')
          .update({
            total_points: userPoints.total_points + points,
            available_points: userPoints.available_points + points
          })
          .eq('user_id', user.id);
      } else {
        await supabase.from('user_points').insert({
          user_id: user.id,
          total_points: points,
          available_points: points
        });
      }

      toast({
        title: "¡Desafío completado!",
        description: `Has ganado ${points} puntos 🎉`,
      });

      loadChallenges();
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount = challenges.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Cargando desafíos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Desafíos Diarios
            </CardTitle>
            <CardDescription>
              Completa desafíos para ganar puntos y mejorar tu bienestar
            </CardDescription>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completedCount}/{totalCount}</div>
            <div className="text-xs text-muted-foreground">Completados</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso del día</span>
            <span className="font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border transition-all ${
                challenge.completed
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty === 'easy' && 'Fácil'}
                      {challenge.difficulty === 'medium' && 'Medio'}
                      {challenge.difficulty === 'hard' && 'Difícil'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-primary">
                      <Trophy className="h-3 w-3" />
                      {challenge.points} puntos
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Expira hoy
                    </span>
                  </div>
                </div>
                {challenge.completed ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Completado</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => completeChallenge(challenge.id, challenge.points)}
                    className="bg-gradient-primary"
                  >
                    Completar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {completedCount === totalCount && totalCount > 0 && (
          <div className="bg-gradient-primary p-4 rounded-lg text-center text-primary-foreground animate-fade-in">
            <Sparkles className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold">¡Todos los desafíos completados!</p>
            <p className="text-sm opacity-90">Vuelve mañana para más desafíos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
