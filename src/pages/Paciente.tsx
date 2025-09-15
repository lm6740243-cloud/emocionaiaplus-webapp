import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Calendar, TrendingUp, BookOpen, Users, MessageCircle, Bell, Settings, User, ChevronRight } from "lucide-react";
import AIAssistantCard from "@/components/patient/AIAssistantCard";
import ExercisesCard from "@/components/patient/ExercisesCard";
import MoodTrackerCard from "@/components/patient/MoodTrackerCard";
import LibraryCard from "@/components/patient/LibraryCard";
import GamificationCard from "@/components/patient/GamificationCard";
import { ExternalDataDashboard } from "@/components/integrations/ExternalDataDashboard";

const Paciente = () => {
  const [userName] = useState("María");
  const [streak] = useState(7);
  const [weeklyProgress] = useState(68);
  
  const quickStats = [
    { label: "Sesiones completadas", value: "12", icon: "🧘" },
    { label: "Días consecutivos", value: streak.toString(), icon: "🔥" },
    { label: "Minutos practicados", value: "156", icon: "⏱️" },
    { label: "Nivel de bienestar", value: "Bien", icon: "😊" }
  ];

  const todayActivities = [
    { name: "Meditación matutina", completed: true, time: "10 min", category: "Mindfulness" },
    { name: "Registro emocional", completed: true, time: "5 min", category: "Estado de ánimo" },
    { name: "Ejercicio de respiración", completed: false, time: "8 min", category: "Respiración" },
    { name: "Reflexión nocturna", completed: false, time: "15 min", category: "Reflexión" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header personalizado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="/placeholder.svg" alt={userName} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-semibold">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                ¡Bienvenida de vuelta, {userName}! 🌟
              </h1>
              <p className="text-muted-foreground mt-1">
                Es genial verte aquí. Sigamos construyendo juntos tu bienestar emocional.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-card transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progreso semanal destacado */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progreso de esta semana
                </CardTitle>
                <CardDescription>
                  Vas muy bien, ¡sigue así! Has mejorado un 12% respecto a la semana pasada.
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                +12%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Completado</span>
                <span className="font-semibold">{weeklyProgress}% de tus objetivos</span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lunes</span>
                <span>Martes</span>
                <span>Miércoles</span>
                <span>Jueves</span>
                <span>Viernes</span>
                <span>Sábado</span>
                <span>Domingo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Data Integration Section */}
        <ExternalDataDashboard />

        {/* Tarjetas principales del panel */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Asistente IA */}
          <AIAssistantCard />
          
          {/* Ejercicios */}
          <ExercisesCard />
          
          {/* Estado de ánimo */}
          <MoodTrackerCard />
          
          {/* Biblioteca */}
          <LibraryCard />
        </div>

        {/* Gamificación - Ancho completo */}
        <GamificationCard />

        {/* Actividades de hoy - Sección adicional */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Actividades pendientes para hoy
                </CardTitle>
                <CardDescription>
                  Completa tus rutinas diarias para mantener tu progreso
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Personalizar rutina
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                    activity.completed 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/30 border-border hover:bg-muted/50 hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      activity.completed 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-muted-foreground'
                    }`}>
                      {activity.completed && "✓"}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        activity.completed ? 'text-primary' : 'text-foreground'
                      }`}>
                        {activity.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {!activity.completed && (
                    <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                      Iniciar
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acceso rápido a otras funciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Grupos de Apoyo</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Conéctate con otros en tu camino de bienestar
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Explorar grupos
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Agendar Cita</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Reserva una sesión con tu psicólogo
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver disponibilidad
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Centro de Recursos</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Accede a herramientas y materiales adicionales
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ir a recursos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Paciente;