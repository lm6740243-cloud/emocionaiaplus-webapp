import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Calendar, TrendingUp, Heart, Plus, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MoodTrackerCard = () => {
  const { toast } = useToast();
  const [currentMood, setCurrentMood] = useState([3]);
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState("");

  const moodLabels = {
    1: { label: "Muy mal", color: "bg-red-500", emoji: "😔" },
    2: { label: "Mal", color: "bg-orange-500", emoji: "😕" },
    3: { label: "Normal", color: "bg-yellow-500", emoji: "😐" },
    4: { label: "Bien", color: "bg-lime-500", emoji: "🙂" },
    5: { label: "Muy bien", color: "bg-green-500", emoji: "😊" }
  };

  const recentEntries = [
    { date: "Hoy", mood: 4, notes: "Me sentí más relajado después de la meditación matutina" },
    { date: "Ayer", mood: 3, notes: "Día normal, algo de estrés en el trabajo" },
    { date: "Hace 2 días", mood: 5, notes: "Excelente día! Completé todos mis ejercicios" },
    { date: "Hace 3 días", mood: 2, notes: "Ansiedad por la presentación del trabajo" },
  ];

  const weeklyData = [3, 4, 2, 5, 4, 3, 4]; // Datos de ejemplo para 7 días
  const averageMood = weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length;

  const getMoodInfo = (level: number) => {
    return moodLabels[level as keyof typeof moodLabels] || moodLabels[3];
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: user.id,
            mood_level: currentMood[0],
            notes: notes || null,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        toast({
          title: "Estado guardado",
          description: "Tu estado de ánimo se ha registrado correctamente"
        });
        setShowForm(false);
        setNotes("");
      }
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu estado de ánimo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:shadow-card transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Estado de Ánimo
        </CardTitle>
        <CardDescription>
          Registra y monitorea tu bienestar emocional diario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Registro de hoy */}
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-accent-foreground">¿Cómo te sientes hoy?</h4>
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              Hoy
            </Badge>
          </div>
          
          {!showForm ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar mi estado de ánimo
            </Button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Selector de estado de ánimo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mi estado de ánimo:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodInfo(currentMood[0]).emoji}</span>
                    <Badge 
                      className={`${getMoodInfo(currentMood[0]).color} text-white`}
                    >
                      {getMoodInfo(currentMood[0]).label}
                    </Badge>
                  </div>
                </div>
                <Slider
                  value={currentMood}
                  onValueChange={setCurrentMood}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Muy mal</span>
                  <span>Normal</span>
                  <span>Muy bien</span>
                </div>
              </div>

              {/* Notas opcionales */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional):</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="¿Qué influyó en tu estado de ánimo hoy? Describe tu experiencia..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-primary"
                >
                  Guardar registro
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen semanal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Resumen esta semana
            </h4>
            <Badge variant="outline">
              Promedio: {averageMood.toFixed(1)} {getMoodInfo(Math.round(averageMood)).emoji}
            </Badge>
          </div>

          {/* Gráfico simple de barras */}
          <div className="flex items-end justify-between h-20 p-3 bg-muted/30 rounded-lg">
            {weeklyData.map((mood, index) => {
              const height = (mood / 5) * 100;
              const moodInfo = getMoodInfo(mood);
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-4 ${moodInfo.color} rounded-t transition-all duration-300`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {index === 6 ? 'Hoy' : `D${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Entradas recientes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Registros recientes</h4>
            <Button variant="ghost" size="sm">
              Ver todos
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentEntries.map((entry, index) => {
              const moodInfo = getMoodInfo(entry.mood);
              return (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{entry.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{moodInfo.emoji}</span>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${moodInfo.color} text-white`}
                      >
                        {moodInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.notes}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold">15</div>
            <div className="text-xs text-muted-foreground">Registros este mes</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-primary font-semibold">
              {averageMood > 3.5 ? "↗️" : averageMood < 2.5 ? "↘️" : "→"} 
              {averageMood > 3.5 ? "Mejora" : averageMood < 2.5 ? "Baja" : "Estable"}
            </div>
            <div className="text-xs text-muted-foreground">Tendencia semanal</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrackerCard;