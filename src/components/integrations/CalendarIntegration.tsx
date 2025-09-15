import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar,
  Clock,
  AlertTriangle,
  Coffee,
  Plus,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, addMinutes, isAfter, isBefore } from "date-fns";

interface CalendarEvent {
  id: string;
  event_title: string;
  event_start: string;
  event_end: string;
  is_stressful: boolean;
  stress_level?: number;
  break_recommended: boolean;
  break_scheduled: boolean;
}

export const CalendarIntegration = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    duration: 60,
    stressLevel: 3
  });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCalendarEvents();
    checkForUpcomingEvents();
  }, []);

  const loadCalendarEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: calendarEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('event_start', new Date().toISOString())
        .order('event_start', { ascending: true })
        .limit(10);

      if (calendarEvents && calendarEvents.length > 0) {
        setEvents(calendarEvents);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  const checkForUpcomingEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const oneHourFromNow = addMinutes(now, 60);
      
      const { data: upcomingEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('event_start', now.toISOString())
        .lte('event_start', oneHourFromNow.toISOString())
        .eq('is_stressful', true)
        .eq('break_scheduled', false);

      if (upcomingEvents && upcomingEvents.length > 0) {
        for (const event of upcomingEvents) {
          await scheduleBreak(event);
        }
      }
    } catch (error) {
      console.error('Error checking upcoming events:', error);
    }
  };

  const scheduleBreak = async (event: CalendarEvent) => {
    try {
      // Mark break as scheduled
      await supabase
        .from('calendar_events')
        .update({ 
          break_scheduled: true,
          break_recommended: true 
        })
        .eq('id', event.id);

      // Create recommendation for break
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('wellness_recommendations').insert({
        user_id: user.id,
        recommendation_type: 'break',
        title: `Micropause antes de: ${event.event_title}`,
        description: 'Tienes un evento estresante próximamente. Te recomendamos tomar una pausa de 5 minutos para relajarte.',
        priority: 1,
        trigger_data: { event_id: event.id, event_title: event.event_title }
      });

      toast({
        title: "Micropause programada",
        description: `Se recomienda un descanso antes de: ${event.event_title}`,
      });
    } catch (error) {
      console.error('Error scheduling break:', error);
    }
  };

  const addEvent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!newEvent.title || !newEvent.date || !newEvent.time) {
        toast({
          title: "Campos requeridos",
          description: "Por favor completa todos los campos",
          variant: "destructive"
        });
        return;
      }

      const eventStart = new Date(`${newEvent.date}T${newEvent.time}`);
      const eventEnd = addMinutes(eventStart, newEvent.duration);
      const isStressful = newEvent.stressLevel >= 4;

      const { data, error } = await supabase.from('calendar_events').insert({
        user_id: user.id,
        event_title: newEvent.title,
        event_start: eventStart.toISOString(),
        event_end: eventEnd.toISOString(),
        is_stressful: isStressful,
        stress_level: newEvent.stressLevel,
        break_recommended: false,
        break_scheduled: false
      }).select();

      if (error) throw error;

      // Reset form
      setNewEvent({
        title: "",
        date: "",
        time: "",
        duration: 60,
        stressLevel: 3
      });
      setShowAddEvent(false);
      
      await loadCalendarEvents();
      
      toast({
        title: "Evento agregado",
        description: "El evento se ha agregado exitosamente",
      });

      // If stressful event, suggest break
      if (isStressful && data && data[0]) {
        await scheduleBreak(data[0] as CalendarEvent);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el evento",
        variant: "destructive"
      });
    }
  };

  const simulateGoogleCalendarSync = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simulate some calendar events
      const mockEvents = [
        {
          user_id: user.id,
          event_title: "Reunión de equipo",
          event_start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          event_end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
          is_stressful: true,
          stress_level: 4,
          break_recommended: false,
          break_scheduled: false
        },
        {
          user_id: user.id,
          event_title: "Presentación cliente",
          event_start: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
          event_end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
          is_stressful: true,
          stress_level: 5,
          break_recommended: false,
          break_scheduled: false
        }
      ];

      await supabase.from('calendar_events').insert(mockEvents);
      await loadCalendarEvents();
      setIsConnected(true);

      toast({
        title: "Calendario sincronizado",
        description: "Se han importado eventos desde Google Calendar (demo)",
      });
    } catch (error) {
      console.error('Error syncing calendar:', error);
    }
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 2) return "bg-green-500";
    if (level <= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStressLevelText = (level: number) => {
    if (level <= 2) return "Bajo";
    if (level <= 3) return "Medio";
    return "Alto";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Integración de Calendario
        </CardTitle>
        <CardDescription>
          Sincroniza tu calendario para recibir recomendaciones de micropausas antes de eventos estresantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Conectar Calendario</h3>
              <p className="text-muted-foreground mb-4">
                Conecta tu calendario para recibir sugerencias de bienestar personalizadas
              </p>
              <Button onClick={simulateGoogleCalendarSync}>
                Conectar Google Calendar (Demo)
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-green-500">
                Calendario Conectado
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddEvent(!showAddEvent)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Evento
              </Button>
            </div>

            {showAddEvent && (
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título del evento</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ej: Reunión importante"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Hora</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duración (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newEvent.duration}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Nivel de estrés esperado: {newEvent.stressLevel}</Label>
                    <Slider
                      value={[newEvent.stressLevel]}
                      onValueChange={([value]) => setNewEvent(prev => ({ ...prev, stressLevel: value }))}
                      min={1}
                      max={5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Muy bajo</span>
                      <span>Muy alto</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addEvent}>
                      Agregar Evento
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {events.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Próximos eventos</h4>
                <div className="space-y-2">
                  {events.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{event.event_title}</h5>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(event.event_start), 'MMM dd, HH:mm')}
                              </div>
                              {event.is_stressful && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <Badge className={getStressLevelColor(event.stress_level || 3)} variant="secondary">
                                    Estrés {getStressLevelText(event.stress_level || 3)}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          {event.break_recommended && (
                            <Badge variant="secondary" className="bg-blue-500">
                              <Coffee className="h-3 w-3 mr-1" />
                              Pausa sugerida
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};