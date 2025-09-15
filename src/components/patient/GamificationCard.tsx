import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Target, Star, Zap, Heart, Brain, Shield, ChevronRight } from "lucide-react";

const GamificationCard = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const achievements = [
    {
      id: 1,
      title: "Primera meditación",
      description: "Completaste tu primera sesión de meditación",
      icon: "🧘",
      unlocked: true,
      date: "Hace 2 días"
    },
    {
      id: 2,
      title: "Racha de 7 días",
      description: "Mantuviste tu rutina durante una semana completa",
      icon: "🔥",
      unlocked: true,
      date: "Ayer"
    },
    {
      id: 3,
      title: "Explorador de emociones",
      description: "Registraste tu estado de ánimo 10 veces",
      icon: "❤️",
      unlocked: true,
      date: "Hace 5 días"
    },
    {
      id: 4,
      title: "Maestro de respiración",
      description: "Completa 20 sesiones de respiración",
      icon: "🌬️",
      unlocked: false,
      progress: 15,
      total: 20
    },
    {
      id: 5,
      title: "Biblioteca activa",
      description: "Lee 5 recursos de la biblioteca",
      icon: "📚",
      unlocked: false,
      progress: 2,
      total: 5
    }
  ];

  const badges = [
    { name: "Principiante Zen", level: "Básico", icon: "🌱", unlocked: true, description: "Primeros pasos en mindfulness" },
    { name: "Guerrero de la Calma", level: "Intermedio", icon: "⚡", unlocked: true, description: "Dominas técnicas de relajación" },
    { name: "Sabio Emocional", level: "Avanzado", icon: "🧠", unlocked: false, description: "Comprende y gestiona emociones complejas" },
    { name: "Maestro Interior", level: "Experto", icon: "🏆", unlocked: false, description: "Guía tu propio crecimiento personal" }
  ];

  const wellnessRoutes = [
    {
      id: "anxiety",
      title: "Ruta de Ansiedad",
      description: "Aprende a manejar y reducir la ansiedad",
      icon: Shield,
      color: "blue",
      progress: 65,
      totalSteps: 12,
      completedSteps: 8,
      estimatedTime: "3-4 semanas",
      difficulty: "Intermedio",
      nextStep: "Técnicas de grounding avanzadas"
    },
    {
      id: "self-esteem",
      title: "Ruta de Autoestima",
      description: "Construye una imagen positiva de ti mismo",
      icon: Heart,
      color: "pink",
      progress: 30,
      totalSteps: 10,
      completedSteps: 3,
      estimatedTime: "2-3 semanas",
      difficulty: "Fácil",
      nextStep: "Ejercicios de autoaceptación"
    },
    {
      id: "mindfulness",
      title: "Ruta de Mindfulness",
      description: "Desarrolla la atención plena y presencia",
      icon: Brain,
      color: "purple",
      progress: 80,
      totalSteps: 15,
      completedSteps: 12,
      estimatedTime: "4-5 semanas",
      difficulty: "Avanzado",
      nextStep: "Meditación en movimiento"
    },
    {
      id: "stress",
      title: "Ruta Anti-Estrés",
      description: "Estrategias para manejar el estrés diario",
      icon: Zap,
      color: "yellow",
      progress: 45,
      totalSteps: 8,
      completedSteps: 4,
      estimatedTime: "2 semanas",
      difficulty: "Fácil",
      nextStep: "Organización y prioridades"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200",
      pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400 border-pink-200",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:shadow-card transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Mi Progreso y Logros
        </CardTitle>
        <CardDescription>
          Celebra tus avances y sigue creciendo en tu camino de bienestar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="routes">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="routes" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Rutas
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              Logros
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Insignias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="space-y-4 mt-4">
            {/* Ruta recomendada */}
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Ruta recomendada para ti
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ruta de Ansiedad</p>
                  <p className="text-sm text-muted-foreground">Continúa desde donde lo dejaste</p>
                </div>
                <Button size="sm">
                  Continuar
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Lista de rutas */}
            <div className="space-y-3">
              {wellnessRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <div
                    key={route.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedRoute === route.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedRoute(
                      selectedRoute === route.id ? null : route.id
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getColorClasses(route.color)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold">{route.title}</h5>
                            <Badge variant="outline" className="text-xs">
                              {route.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{route.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>{route.completedSteps}/{route.totalSteps} pasos completados</span>
                              <span className="text-primary font-medium">{route.progress}%</span>
                            </div>
                            <Progress value={route.progress} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedRoute === route.id && (
                      <div className="mt-4 pt-4 border-t border-border animate-fade-in space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Próximo paso:</span>
                          <span className="font-medium">{route.nextStep}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiempo estimado:</span>
                          <span>{route.estimatedTime}</span>
                        </div>
                        <Button size="sm" className="w-full bg-gradient-primary">
                          Continuar ruta
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3 mt-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 border rounded-lg ${
                  achievement.unlocked
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className={`font-semibold ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h5>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs">
                          ¡Desbloqueado!
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-primary mt-1">{achievement.date}</p>
                    )}
                    
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progreso</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.total!) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="badges" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg text-center ${
                    badge.unlocked
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <h5 className={`font-semibold text-sm mb-1 ${
                    badge.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {badge.name}
                  </h5>
                  <Badge 
                    variant={badge.unlocked ? "secondary" : "outline"}
                    className="text-xs mb-2"
                  >
                    {badge.level}
                  </Badge>
                  <p className={`text-xs ${
                    badge.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-primary font-semibold text-lg">3</div>
            <div className="text-xs text-muted-foreground">Logros desbloqueados</div>
          </div>
          <div className="text-center">
            <div className="text-primary font-semibold text-lg">2</div>
            <div className="text-xs text-muted-foreground">Insignias obtenidas</div>
          </div>
          <div className="text-center">
            <div className="text-primary font-semibold text-lg">55%</div>
            <div className="text-xs text-muted-foreground">Progreso general</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;