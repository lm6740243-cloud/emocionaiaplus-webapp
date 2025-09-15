import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Brain, Sparkles, Clock, Settings, Zap } from "lucide-react";
import AIChat from "../ai-assistant/AIChat";

const AIAssistantCard = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [showFullChat, setShowFullChat] = useState(false);
  
  const recentMessages = [
    { time: "Hace 2h", preview: "Hablamos sobre técnicas de respiración..." },
    { time: "Ayer", preview: "Reflexionaste sobre tu progreso semanal..." },
    { time: "Hace 3 días", preview: "Exploramos estrategias para la ansiedad..." }
  ];

  const features = [
    { name: "Memoria conversacional", description: "Recuerda tu historial", icon: "🧠" },
    { name: "Tonos configurables", description: "Profesional, motivador, relajado", icon: "🎭" },
    { name: "Entrada por voz", description: "Habla directamente", icon: "🎤" },
    { name: "Respuesta por audio", description: "Escucha las respuestas", icon: "🔊" },
    { name: "Detección de crisis", description: "Apoyo inmediato", icon: "🚨" }
  ];

  return (
    <>
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
                  Asistente IA Avanzado
                  <Sparkles className="h-4 w-4 text-primary animate-pulse-gentle" />
                </CardTitle>
                <CardDescription>Tu compañero empático con IA de OpenAI</CardDescription>
              </div>
            </div>
            <Badge variant={isActive ? "default" : "secondary"} className="animate-fade-in">
              {isActive ? "En conversación" : "Disponible 24/7"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nuevas características */}
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-accent-foreground mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Características avanzadas
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <span className="font-medium">{feature.name}</span>
                    <p className="text-muted-foreground text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estado del chat */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
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

          {/* Botones de acción */}
          <div className="space-y-3">
            <Dialog open={showFullChat} onOpenChange={setShowFullChat}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setIsActive(true)}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Abrir chat completo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Chat con Asistente IA
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 min-h-0">
                  <AIChat />
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/ai-chat')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Abrir en página completa
            </Button>
          </div>

          {/* Sugerencias rápidas */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Sugerencias rápidas:</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setShowFullChat(true)}
              >
                "¿Cómo me siento hoy?"
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setShowFullChat(true)}
              >
                "Necesito técnicas de relajación"
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setShowFullChat(true)}
              >
                "Tengo ansiedad"
              </Badge>
            </div>
          </div>

          {/* Advertencia de crisis */}
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <span>🚨</span>
              <span>
                <strong>Sistema de protección activo:</strong> El asistente puede detectar situaciones de crisis 
                y activar protocolos de emergencia para tu seguridad.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AIAssistantCard;