import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Brain, Users, BookOpen, Settings, User, UserCheck } from "lucide-react";

const Onboarding = () => {
  const features = [
    {
      icon: User,
      title: "Paciente",
      description: "Accede a herramientas de autoayuda y seguimiento personal",
      route: "/paciente",
    },
    {
      icon: UserCheck,
      title: "Psicólogo",
      description: "Panel profesional para gestionar pacientes y sesiones",
      route: "/psicologo",
    },
    {
      icon: Users,
      title: "Grupos",
      description: "Participa en grupos de apoyo y terapia grupal",
      route: "/grupos",
    },
    {
      icon: BookOpen,
      title: "Recursos",
      description: "Biblioteca de recursos y herramientas terapéuticas",
      route: "/recursos",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-12 w-12 text-primary" />
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Bienvenido a EmocionalIA+
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tu plataforma integral para el cuidado de la salud mental y bienestar emocional
          </p>
          <Badge variant="secondary" className="mt-4">
            Plataforma de última generación
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
                <Link to={feature.route}>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Explorar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto hover:shadow-soft transition-all duration-300"
            >
              Ya tengo cuenta
            </Button>
          </Link>
          <Link to="/paciente">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Comenzar ahora
            </Button>
          </Link>
          <Link to="/configuracion">
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;