import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [seconds, setSeconds] = useState(4);
  const [cycle, setCycle] = useState(0);

  const phases = {
    inhale: { duration: 4, text: "Inhala profundamente", color: "text-primary" },
    hold: { duration: 4, text: "Mantén la respiración", color: "text-accent-foreground" },
    exhale: { duration: 6, text: "Exhala lentamente", color: "text-secondary-foreground" },
    rest: { duration: 2, text: "Pausa", color: "text-muted-foreground" }
  };

  const phaseOrder: (keyof typeof phases)[] = ["inhale", "hold", "exhale", "rest"];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      const currentIndex = phaseOrder.indexOf(phase);
      const nextIndex = (currentIndex + 1) % phaseOrder.length;
      const nextPhase = phaseOrder[nextIndex];
      
      if (nextPhase === "inhale") {
        setCycle(cycle + 1);
      }
      
      setPhase(nextPhase);
      setSeconds(phases[nextPhase].duration);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, phase, cycle]);

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setSeconds(4);
    setCycle(0);
  };

  const currentPhase = phases[phase];

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-foreground">
          Ejercicio de Respiración Guiado
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tómate un momento para respirar y relajarte. Este ejercicio te ayudará a sentirte más tranquilo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Círculo animado de respiración */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Círculo exterior - pulso suave */}
            <div className={`w-40 h-40 rounded-full border-4 border-primary/20 absolute inset-0 ${isActive ? 'animate-pulse-gentle' : ''}`} />
            
            {/* Círculo principal - respiración */}
            <div className={`w-32 h-32 m-4 rounded-full bg-gradient-primary flex items-center justify-center transition-all duration-1000 ${
              isActive ? (phase === "inhale" ? "animate-breathe" : phase === "exhale" ? "animate-breathe-slow" : "") : ""
            }`}>
              <div className="text-white font-bold text-lg">
                {seconds}
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="text-center space-y-2">
          <h3 className={`text-xl font-semibold transition-colors duration-500 ${currentPhase.color}`}>
            {currentPhase.text}
          </h3>
          {cycle > 0 && (
            <p className="text-sm text-muted-foreground animate-fade-in">
              Ciclo {cycle} completado
            </p>
          )}
        </div>

        {/* Controles */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleExercise}
            variant={isActive ? "secondary" : "default"}
            className="transition-all duration-300"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Comenzar
              </>
            )}
          </Button>
          
          <Button
            onClick={resetExercise}
            variant="outline"
            className="transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {cycle >= 3 && (
          <div className="text-center p-4 bg-accent/20 rounded-lg animate-fade-in">
            <p className="text-accent-foreground font-medium">
              ¡Excelente! Has completado varios ciclos de respiración. ¿Cómo te sientes?
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;