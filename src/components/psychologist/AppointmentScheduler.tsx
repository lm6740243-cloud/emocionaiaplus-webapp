import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit3,
  Trash2,
  User
} from "lucide-react";

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  duration: number;
  status: string;
  notes?: string;
  patient_name?: string;
}

export const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    date: "",
    time: "",
    duration: 60,
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) return;

      // Get appointments for selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *
        `)
        .eq('psychologist_id', psychProfile.id)
        .gte('appointment_date', startOfDay.toISOString())
        .lte('appointment_date', endOfDay.toISOString())
        .order('appointment_date');

      if (error) throw error;

      // For now, add mock patient names since relations need to be fixed
      const transformedData = (data || []).map(apt => ({
        ...apt,
        patient_name: 'Paciente'
      }));

      setAppointments(transformedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Error al cargar las citas",
        variant: "destructive"
      });
    }
  };

  const createAppointment = async () => {
    if (!formData.patient_id || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // Get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) throw new Error('Psychologist profile not found');

      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);

      const { error } = await supabase
        .from('appointments')
        .insert({
          psychologist_id: psychProfile.id,
          patient_id: formData.patient_id,
          appointment_date: appointmentDateTime.toISOString(),
          duration: formData.duration,
          status: 'scheduled',
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Cita agendada correctamente"
      });

      setIsDialogOpen(false);
      setFormData({
        patient_id: "",
        date: "",
        time: "",
        duration: 60,
        notes: ""
      });
      
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Error al agendar la cita",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Estado de la cita actualizado"
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la cita",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'confirmed': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Citas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-1" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Paciente *</label>
                <Select 
                  value={formData.patient_id} 
                  onValueChange={(value) => setFormData({...formData, patient_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient1">María González</SelectItem>
                    <SelectItem value="patient2">Carlos Ruiz</SelectItem>
                    <SelectItem value="patient3">Ana López</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Fecha *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Hora *</label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({...formData, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Duración (minutos)</label>
                <Select 
                  value={formData.duration.toString()} 
                  onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  placeholder="Notas adicionales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={createAppointment} disabled={loading} className="flex-1">
                  {loading ? "Agendando..." : "Agendar Cita"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Citas del {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay citas programadas para este día
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {new Date(appointment.appointment_date).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="text-muted-foreground">
                            ({appointment.duration} min)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.patient_name}</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    
                    {appointment.status === 'scheduled' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};