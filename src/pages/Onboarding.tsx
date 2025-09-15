import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Sparkles } from "lucide-react";
import OnboardingForm from "@/components/OnboardingForm";
import BreathingExercise from "@/components/BreathingExercise";
import ThemePreview from "@/components/ThemePreview";
import { useToast } from "@/components/ui/use-toast";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<"welcome" | "breathing" | "form">("welcome");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartOnboarding = () => {
    setCurrentStep("breathing");
  };

  const handleBreathingComplete = () => {
    setCurrentStep("form");
  };

  const handleFormComplete = (data: any) => {
    console.log("Datos del formulario:", data);
    
    toast({
      title: "¡Registro completado!",
      description: `Bienvenido/a ${data.nombre}. Te hemos redirigido a tu panel personalizado.`,
    });

    // Redirigir según el rol
    const targetRoute = data.rol === "psicologo" ? "/psicologo" : "/paciente";
    navigate(targetRoute);
  };

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-16 w-16 text-primary animate-pulse-gentle" />
              <Brain className="h-16 w-16 text-primary animate-pulse-gentle" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ¡Bienvenido a EmocionalIA+!
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Estamos muy felices de tenerte aquí. Tu bienestar emocional es nuestra prioridad, 
              y queremos que te sientas cómodo y relajado desde el primer momento.
            </p>
          </div>

          {/* Welcome Card */}
          <Card className="bg-gradient-card border-primary/20 mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                Comencemos tu viaje hacia el bienestar
              </CardTitle>
              <CardDescription className="text-center text-base">
                Antes de configurar tu perfil, te invitamos a hacer un pequeño ejercicio 
                de respiración para que te sientas tranquilo y centrado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-accent-foreground mb-2">
                    ¿Por qué un ejercicio de respiración?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    La respiración consciente nos ayuda a reducir la ansiedad, mejorar la concentración 
                    y crear un estado de calma interior. Es el primer paso hacia el autoconocimiento.
                  </p>
                </div>
                
                <button
                  onClick={handleStartOnboarding}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-lg font-semibold 
                           hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Comenzar mi experiencia
                </button>
              </div>
            </CardContent>
          </Card>

          <Badge variant="secondary" className="animate-fade-in">
            Un proceso diseñado con cariño para ti ✨
          </Badge>
        </div>
      </div>
    );
  }

  if (currentStep === "breathing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          {/* Progress indicator */}
          <div className="text-center">
            <Badge variant="secondary">Paso 1 de 2: Relajación</Badge>
          </div>

          {/* Welcome message */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">
              Tómate un momento para respirar
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Este ejercicio de respiración te ayudará a sentirte más relajado y presente 
              antes de completar tu perfil.
            </p>
          </div>

          {/* Breathing exercise */}
          <div className="animate-fade-in">
            <BreathingExercise />
          </div>

          {/* Continue button */}
          <div className="text-center animate-fade-in">
            <button
              onClick={handleBreathingComplete}
              className="bg-gradient-primary text-white py-3 px-8 rounded-lg font-semibold 
                       hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
            >
              Continuar al registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        {/* Progress indicator */}
        <div className="text-center">
          <Badge variant="secondary">Paso 2 de 2: Tu perfil</Badge>
        </div>

        {/* Welcome message */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Ahora, cuéntanos sobre ti
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Esta información nos permitirá personalizar tu experiencia y ofrecerte 
            el mejor apoyo posible.
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
          <div className="xl:col-span-2">
            <OnboardingForm onComplete={handleFormComplete} />
          </div>
          <div className="space-y-6">
            <ThemePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;