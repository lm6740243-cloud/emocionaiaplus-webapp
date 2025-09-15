import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Brain, Users, ArrowRight, Sparkles, Shield, Clock, BookOpen } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Atención Personalizada",
      description: "Herramientas adaptadas a tus necesidades específicas de bienestar emocional."
    },
    {
      icon: Brain,
      title: "IA Avanzada",
      description: "Tecnología de vanguardia para un apoyo inteligente y comprensivo."
    },
    {
      icon: Users,
      title: "Comunidad de Apoyo",
      description: "Conecta con otros en un ambiente seguro y de comprensión mutua."
    },
    {
      icon: Shield,
      title: "Privacidad Garantizada",
      description: "Tus datos están protegidos con los más altos estándares de seguridad."
    },
    {
      icon: Clock,
      title: "Disponible 24/7",
      description: "Acceso a recursos y herramientas cuando más los necesites."
    },
    {
      icon: BookOpen,
      title: "Recursos Especializados",
      description: "Biblioteca completa de contenido creado por profesionales."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Heart className="h-16 w-16 text-primary animate-pulse" />
              <Brain className="h-16 w-16 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Plataforma de Nueva Generación
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
              EmocionalIA+
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Tu plataforma integral para el cuidado de la salud mental y bienestar emocional.
              Conecta con profesionales, accede a recursos especializados y forma parte de una comunidad que te comprende.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/onboarding">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-4"
              >
                Comenzar tu Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className="hover:shadow-soft transition-all duration-300 text-lg px-8 py-4"
              >
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              ¿Por qué elegir EmocionalIA+?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Una plataforma diseñada por profesionales de la salud mental con tecnología de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 bg-gradient-card"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-hero/5 border-primary/20 shadow-glow">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Comienza tu camino hacia el bienestar
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Únete a miles de personas que ya están transformando su vida con EmocionalIA+
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/paciente">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8"
                  >
                    Soy Paciente
                  </Button>
                </Link>
                
                <Link to="/psicologo">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="hover:shadow-soft transition-all duration-300 text-lg px-8"
                  >
                    Soy Profesional
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Gratuito para comenzar • Sin compromiso • Privacidad garantizada
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
