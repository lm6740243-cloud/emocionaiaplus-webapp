import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wind, Anchor, Leaf, Headphones, Play, Timer } from "lucide-react";

const ExercisesCard = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const exercises = [
    {
      id: "breathing",
      title: "Respiración",
      description: "Técnicas de respiración profunda y calmante",
      icon: Wind,
      duration: "5-15 min",
      difficulty: "Fácil",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      completed: 12,
      total: 20
    },
    {
      id: "grounding",
      title: "Grounding",
      description: "Ejercicios para conectar con el presente",
      icon: Anchor,
      duration: "3-10 min",
      difficulty: "Fácil",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      completed: 8,
      total: 15
    },
    {
      id: "mindfulness",
      title: "Mindfulness",
      description: "Atención plena y conciencia del momento",
      icon: Leaf,
      duration: "10-30 min",
      difficulty: "Medio",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      completed: 6,
      total: 12
    },
    {
      id: "meditation",
      title: "Meditación guiada",
      description: "Sesiones de meditación con audio guía",
      icon: Headphones,
      duration: "15-45 min",
      difficulty: "Variado",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      completed: 4,
      total: 10
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-500";
      case "Medio": return "bg-yellow-500";
      case "Difícil": return "bg-red-500";
      default: return "bg-primary";
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:shadow-card transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Ejercicios de Bienestar
        </CardTitle>
        <CardDescription>
          Practica técnicas terapéuticas para mejorar tu estado emocional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ejercicio del día */}
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-accent-foreground">Ejercicio recomendado hoy</h4>
            <Badge variant="secondary">
              <Timer className="h-3 w-3 mr-1" />
              5 min
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Respiración 4-7-8 para reducir el estrés matutino
          </p>
          <Button size="sm" className="w-full">
            <Play className="h-3 w-3 mr-1" />
            Comenzar ahora
          </Button>
        </div>

        {/* Lista de ejercicios */}
        <div className="space-y-3">
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            const progressPercentage = (exercise.completed / exercise.total) * 100;
            
            return (
              <div
                key={exercise.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedExercise === exercise.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
                onClick={() => setSelectedExercise(
                  selectedExercise === exercise.id ? null : exercise.id
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${exercise.bgColor}`}>
                      <Icon className={`h-5 w-5 ${exercise.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-foreground">{exercise.title}</h5>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDifficultyColor(exercise.difficulty)} text-white`}
                        >
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exercise.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{exercise.duration}</span>
                        <span>•</span>
                        <span>{exercise.completed}/{exercise.total} completados</span>
                      </div>
                      <Progress value={progressPercentage} className="mt-2 h-1" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>

                {selectedExercise === exercise.id && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm">
                        Ver rutinas
                      </Button>
                      <Button size="sm" className="bg-gradient-primary">
                        Iniciar sesión
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold text-lg">30</div>
            <div className="text-xs text-muted-foreground">Sesiones completadas</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold text-lg">2.5h</div>
            <div className="text-xs text-muted-foreground">Tiempo total practicado</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExercisesCard;