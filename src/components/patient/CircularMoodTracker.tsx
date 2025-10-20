import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CircularMoodTracker = () => {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moods = [
    { level: 5, emoji: "😊", label: "Muy bien", color: "hsl(120, 60%, 60%)", position: 0 },
    { level: 4, emoji: "🙂", label: "Bien", color: "hsl(100, 55%, 55%)", position: 72 },
    { level: 3, emoji: "😐", label: "Normal", color: "hsl(50, 70%, 60%)", position: 144 },
    { level: 2, emoji: "😕", label: "Mal", color: "hsl(30, 70%, 60%)", position: 216 },
    { level: 1, emoji: "😔", label: "Muy mal", color: "hsl(0, 70%, 60%)", position: 288 },
  ];

  const handleMoodSelect = (level: number) => {
    setSelectedMood(prev => prev === level ? null : level);
  };

  const getCurrentMoodInfo = () => {
    if (!selectedMood) return null;
    return moods.find(m => m.level === selectedMood);
  };

  const radius = 80;
  const center = 100;

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          ¿Cómo te sientes hoy?
        </CardTitle>
        <CardDescription>
          Selecciona tu estado de ánimo actual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tracker Circular */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-[200px] h-[200px]">
            {/* Círculo base */}
            <svg
              viewBox="0 0 200 200"
              className="transform -rotate-90"
            >
              {/* Círculo de fondo */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
              />
              
              {/* Segmentos de color */}
              {moods.map((mood, index) => {
                const startAngle = mood.position;
                const endAngle = mood.position + 72;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = center + radius * Math.cos(startRad);
                const y1 = center + radius * Math.sin(startRad);
                const x2 = center + radius * Math.cos(endRad);
                const y2 = center + radius * Math.sin(endRad);
                
                const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                
                const pathData = `
                  M ${center} ${center}
                  L ${x1} ${y1}
                  A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                  Z
                `;
                
                return (
                  <path
                    key={mood.level}
                    d={pathData}
                    fill={mood.color}
                    opacity={selectedMood === mood.level ? 1 : 0.3}
                    className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    onClick={() => handleMoodSelect(mood.level)}
                  />
                );
              })}
            </svg>

            {/* Emojis alrededor del círculo */}
            {moods.map((mood) => {
              const angle = (mood.position + 36 - 90) * (Math.PI / 180); // Centrar en el segmento
              const distance = 110;
              const x = center + distance * Math.cos(angle);
              const y = center + distance * Math.sin(angle);
              
              return (
                <button
                  key={mood.level}
                  className={`absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
                    selectedMood === mood.level ? 'scale-125' : 'scale-100'
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                  onClick={() => handleMoodSelect(mood.level)}
                >
                  {mood.emoji}
                </button>
              );
            })}

            {/* Centro con información */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              {selectedMood ? (
                <div className="space-y-1 animate-fade-in">
                  <div className="text-4xl">
                    {getCurrentMoodInfo()?.emoji}
                  </div>
                  <Badge
                    className="text-xs"
                    style={{
                      backgroundColor: getCurrentMoodInfo()?.color,
                      color: 'white'
                    }}
                  >
                    {getCurrentMoodInfo()?.label}
                  </Badge>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Selecciona
                </div>
              )}
            </div>
          </div>

          {/* Botón de guardar */}
          {selectedMood && (
            <Button 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 animate-fade-in"
              onClick={async () => {
                try {
                  // Save mood to database
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    const { error } = await supabase
                      .from('mood_entries')
                      .insert({
                        user_id: user.id,
                        mood_level: selectedMood,
                        created_at: new Date().toISOString()
                      });
                    
                    if (error) throw error;
                    
                    toast({
                      title: "Estado guardado",
                      description: "Tu estado de ánimo se ha registrado correctamente"
                    });
                    setSelectedMood(null);
                  }
                } catch (error) {
                  console.error("Error saving mood:", error);
                  toast({
                    title: "Error",
                    description: "No se pudo guardar tu estado de ánimo",
                    variant: "destructive"
                  });
                }
              }}
            >
              <Heart className="h-4 w-4 mr-2" />
              Guardar estado de ánimo
            </Button>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl">😊</div>
            <div className="text-xs text-muted-foreground mt-1">Más frecuente</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +15%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Esta semana</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold">7</div>
            <div className="text-xs text-muted-foreground mt-1">Días seguidos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircularMoodTracker;
