import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, TrendingUp, BookOpen, Users, MessageCircle } from "lucide-react";

const Paciente = () => {
  const activities = [
    { name: "Meditación matutina", completed: true, time: "10 min" },
    { name: "Registro emocional", completed: true, time: "5 min" },
    { name: "Ejercicio de respiración", completed: false, time: "8 min" },
    { name: "Reflexión nocturna", completed: false, time: "15 min" },
  ];

  const weeklyProgress = 65;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Espacio Personal</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido de vuelta, sigamos cuidando tu bienestar
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Heart className="h-4 w-4 mr-1" />
            Activo
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Semanal</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{weeklyProgress}%</div>
              <Progress value={weeklyProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                +12% respecto a la semana pasada
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Días consecutivos</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">7</div>
              <p className="text-xs text-muted-foreground mt-1">
                ¡Excelente racha! Sigue así
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado de ánimo</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Positivo</div>
              <p className="text-xs text-muted-foreground mt-1">
                Basado en tu registro diario
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Activities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Actividades de Hoy
              </CardTitle>
              <CardDescription>
                Completa tus rutinas diarias de bienestar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    activity.completed 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      activity.completed 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        activity.completed ? 'text-primary' : 'text-foreground'
                      }`}>
                        {activity.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  {!activity.completed && (
                    <Button size="sm" variant="outline">
                      Iniciar
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Herramientas y recursos disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start bg-gradient-primary hover:shadow-glow transition-all duration-300" 
                size="lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Iniciar sesión de chat IA
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all duration-300" 
                size="lg"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar recursos
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all duration-300" 
                size="lg"
              >
                <Users className="h-4 w-4 mr-2" />
                Unirse a grupo de apoyo
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground transition-all duration-300" 
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar cita
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Paciente;