import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Brain, Sparkles, Clock } from "lucide-react";

const AIAssistantCard = () => {
  const [isActive, setIsActive] = useState(false);
  
  const recentMessages = [
    { time: "Hace 2h", preview: "Hablamos sobre técnicas de respiración..." },
    { time: "Ayer", preview: "Reflexionaste sobre tu progreso semanal..." },
    { time: "Hace 3 días", preview: "Exploramos estrategias para la ansiedad..." }
  ];

  return (
    <Card className="bg-gradient-card border-primary/20 hover:shadow-card transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="/placeholder.svg" alt="Asistente IA" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                <Brain className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Asistente IA
                <Sparkles className="h-4 w-4 text-primary animate-pulse-gentle" />
              </CardTitle>
              <CardDescription>Tu compañero empático disponible 24/7</CardDescription>
            </div>
          </div>
          <Badge variant={isActive ? "default" : "secondary"} className="animate-fade-in">
            {isActive ? "En línea" : "Disponible"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del chat */}
        <div className="bg-accent/10 p-4 rounded-lg">
          <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Conversaciones recientes
          </h4>
          <div className="space-y-2">
            {recentMessages.map((msg, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">{msg.time}</p>
                  <p className="text-foreground">{msg.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold">Memoria</div>
            <div className="text-xs text-muted-foreground">Recuerda tus conversaciones</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold">Empático</div>
            <div className="text-xs text-muted-foreground">Comprende tus emociones</div>
          </div>
        </div>

        {/* Botón principal */}
        <Button 
          onClick={() => setIsActive(!isActive)}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {isActive ? "Continuar conversación" : "Iniciar nueva conversación"}
        </Button>

        {/* Sugerencias rápidas */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
            "¿Cómo me siento hoy?"
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
            "Necesito relajarme"
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
            "Tengo ansiedad"
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantCard;