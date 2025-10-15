import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Coins, Video, BookOpen, Headphones, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserPoints {
  total_points: number;
  available_points: number;
  level: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  type: string;
  icon: any;
}

export const RewardsPanel = () => {
  const [userPoints, setUserPoints] = useState<UserPoints>({ total_points: 0, available_points: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const rewards: Reward[] = [
    {
      id: 'therapy-30',
      name: 'Sesión de Terapia Virtual 30min',
      description: 'Una sesión de 30 minutos con un profesional',
      points_cost: 500,
      type: 'therapy',
      icon: Video
    },
    {
      id: 'therapy-60',
      name: 'Sesión de Terapia Virtual 60min',
      description: 'Una sesión de 60 minutos con un profesional',
      points_cost: 900,
      type: 'therapy',
      icon: Video
    },
    {
      id: 'guide-advanced',
      name: 'Guía Avanzada de Mindfulness',
      description: 'Acceso a contenido premium de meditación',
      points_cost: 250,
      type: 'content',
      icon: BookOpen
    },
    {
      id: 'meditation-pack',
      name: 'Pack de Meditaciones Premium',
      description: '10 meditaciones guiadas exclusivas',
      points_cost: 350,
      type: 'content',
      icon: Headphones
    },
    {
      id: 'workshop',
      name: 'Taller Grupal de Bienestar',
      description: 'Acceso a taller en vivo sobre gestión emocional',
      points_cost: 450,
      type: 'workshop',
      icon: Award
    }
  ];

  useEffect(() => {
    loadUserPoints();
  }, []);

  const loadUserPoints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUserPoints(data);
      } else {
        await supabase.from('user_points').insert({
          user_id: user.id,
          total_points: 0,
          available_points: 0,
          level: 1
        });
      }
    } catch (error) {
      console.error('Error loading user points:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (reward: Reward) => {
    if (userPoints.available_points < reward.points_cost) {
      toast({
        title: "Puntos insuficientes",
        description: `Necesitas ${reward.points_cost - userPoints.available_points} puntos más`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('reward_redemptions').insert({
        user_id: user.id,
        reward_type: reward.type,
        points_cost: reward.points_cost,
        metadata: { reward_id: reward.id, reward_name: reward.name }
      });

      await supabase
        .from('user_points')
        .update({
          available_points: userPoints.available_points - reward.points_cost
        })
        .eq('user_id', user.id);

      toast({
        title: "¡Recompensa canjeada!",
        description: `Has canjeado: ${reward.name}`,
      });

      loadUserPoints();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "No se pudo canjear la recompensa",
        variant: "destructive"
      });
    }
  };

  const calculateLevel = () => {
    return Math.floor(userPoints.total_points / 100) + 1;
  };

  const pointsToNextLevel = () => {
    const currentLevel = calculateLevel();
    return currentLevel * 100 - userPoints.total_points;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Cargando recompensas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Recompensas y Nivel
        </CardTitle>
        <CardDescription>
          Canjea tus puntos por sesiones de terapia y contenido premium
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Coins className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{userPoints.available_points}</div>
            <div className="text-xs text-muted-foreground">Puntos Disponibles</div>
          </div>
          <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
            <Star className="h-5 w-5 mx-auto mb-2 text-accent-foreground" />
            <div className="text-2xl font-bold text-accent-foreground">Nivel {calculateLevel()}</div>
            <div className="text-xs text-muted-foreground">{pointsToNextLevel()} pts al próximo</div>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-lg border border-secondary">
            <Award className="h-5 w-5 mx-auto mb-2 text-secondary-foreground" />
            <div className="text-2xl font-bold text-secondary-foreground">{userPoints.total_points}</div>
            <div className="text-xs text-muted-foreground">Puntos Totales</div>
          </div>
        </div>

        {/* Rewards List */}
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="therapy">Terapia</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const canRedeem = userPoints.available_points >= reward.points_cost;
              
              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border transition-all ${
                    canRedeem
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${canRedeem ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {reward.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={canRedeem ? "default" : "secondary"}>
                            <Coins className="h-3 w-3 mr-1" />
                            {reward.points_cost} puntos
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => redeemReward(reward)}
                      disabled={!canRedeem}
                      className={canRedeem ? "bg-gradient-primary" : ""}
                    >
                      Canjear
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="therapy" className="space-y-3 mt-4">
            {rewards.filter(r => r.type === 'therapy').map((reward) => {
              const Icon = reward.icon;
              const canRedeem = userPoints.available_points >= reward.points_cost;
              
              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border transition-all ${
                    canRedeem
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${canRedeem ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {reward.description}
                        </p>
                        <Badge variant={canRedeem ? "default" : "secondary"}>
                          <Coins className="h-3 w-3 mr-1" />
                          {reward.points_cost} puntos
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => redeemReward(reward)}
                      disabled={!canRedeem}
                      className={canRedeem ? "bg-gradient-primary" : ""}
                    >
                      Canjear
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="content" className="space-y-3 mt-4">
            {rewards.filter(r => r.type === 'content' || r.type === 'workshop').map((reward) => {
              const Icon = reward.icon;
              const canRedeem = userPoints.available_points >= reward.points_cost;
              
              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border transition-all ${
                    canRedeem
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${canRedeem ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {reward.description}
                        </p>
                        <Badge variant={canRedeem ? "default" : "secondary"}>
                          <Coins className="h-3 w-3 mr-1" />
                          {reward.points_cost} puntos
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => redeemReward(reward)}
                      disabled={!canRedeem}
                      className={canRedeem ? "bg-gradient-primary" : ""}
                    >
                      Canjear
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
