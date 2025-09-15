import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Monitor, 
  Users, 
  Plus,
  ExternalLink,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isAfter, isBefore, addHours } from 'date-fns';
import { es } from 'date-fns/locale';

interface Meeting {
  id: string;
  grupo_id: string;
  titulo: string;
  descripcion?: string;
  fecha_hora: string;
  duracion: number;
  modalidad: 'virtual' | 'presencial' | 'hibrida';
  enlace_virtual?: string;
  ubicacion_presencial?: string;
  cupo_max: number;
  creado_por: string;
  total_asistentes: number;
  user_registered: boolean;
  spaces_available: number;
}

interface MeetingsListProps {
  groupId: string;
  currentUserId: string;
  canCreateMeetings: boolean;
}

export const MeetingsList: React.FC<MeetingsListProps> = ({ 
  groupId, 
  currentUserId, 
  canCreateMeetings 
}) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadMeetings();
    
    // Real-time subscription for meetings
    const meetingsChannel = supabase
      .channel(`grupo_reuniones:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grupo_reuniones',
          filter: `grupo_id=eq.${groupId}`
        },
        () => {
          loadMeetings();
        }
      )
      .subscribe();

    // Real-time subscription for attendees
    const attendeesChannel = supabase
      .channel(`reunion_asistentes:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'reunion_asistentes'
        },
        () => {
          loadMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsChannel);
      supabase.removeChannel(attendeesChannel);
    };
  }, [groupId]);

  const loadMeetings = async () => {
    try {
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('grupo_reuniones')
        .select('*')
        .eq('grupo_id', groupId)
        .eq('activo', true)
        .order('fecha_hora', { ascending: true });

      if (meetingsError) throw meetingsError;

      const meetingsWithAttendance = await Promise.all(
        meetingsData.map(async (meeting) => {
          const { data: attendanceData } = await supabase.rpc('get_meeting_with_attendance', {
            p_meeting_id: meeting.id,
            p_user_id: currentUserId
          });

          return {
            ...meeting,
            modalidad: meeting.modalidad as 'virtual' | 'presencial' | 'hibrida',
            total_asistentes: attendanceData?.[0]?.total_asistentes || 0,
            user_registered: attendanceData?.[0]?.user_registered || false,
            spaces_available: attendanceData?.[0]?.spaces_available || meeting.cupo_max
          };
        })
      );

      setMeetings(meetingsWithAttendance);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Error al cargar las reuniones');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('reunion_asistentes')
        .insert({
          reunion_id: meetingId,
          user_id: currentUserId
        });

      if (error) throw error;

      toast.success('Te has inscrito a la reunión correctamente');
      loadMeetings();
    } catch (error: any) {
      console.error('Error registering for meeting:', error);
      if (error.code === '23505') {
        toast.error('Ya estás inscrito en esta reunión');
      } else {
        toast.error('Error al inscribirse en la reunión');
      }
    }
  };

  const handleUnregister = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('reunion_asistentes')
        .delete()
        .eq('reunion_id', meetingId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      toast.success('Te has desinscrito de la reunión');
      loadMeetings();
    } catch (error) {
      console.error('Error unregistering from meeting:', error);
      toast.error('Error al desinscribirse de la reunión');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return {
      date: format(date, 'EEEE, d MMMM yyyy', { locale: es }),
      time: format(date, 'HH:mm', { locale: es }),
      timezone: userTimezone
    };
  };

  const getMeetingStatus = (meeting: Meeting) => {
    const now = new Date();
    const meetingDate = new Date(meeting.fecha_hora);
    const meetingEnd = addHours(meetingDate, Math.floor(meeting.duracion / 60));

    if (isBefore(now, meetingDate)) {
      return { status: 'upcoming', label: 'Próximamente', color: 'bg-blue-500' };
    } else if (isAfter(now, meetingDate) && isBefore(now, meetingEnd)) {
      return { status: 'ongoing', label: 'En curso', color: 'bg-green-500' };
    } else {
      return { status: 'finished', label: 'Finalizada', color: 'bg-gray-500' };
    }
  };

  const getModalityIcon = (modalidad: string) => {
    switch (modalidad) {
      case 'virtual':
        return <Monitor className="h-4 w-4" />;
      case 'presencial':
        return <MapPin className="h-4 w-4" />;
      case 'hibrida':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reuniones del Grupo</h2>
        {canCreateMeetings && (
          <CreateMeetingDialog
            groupId={groupId}
            onMeetingCreated={loadMeetings}
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
          >
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </CreateMeetingDialog>
        )}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay reuniones programadas</p>
            {canCreateMeetings && (
              <p className="text-sm mt-2">¡Crea la primera reunión del grupo!</p>
            )}
          </div>
        ) : (
          meetings.map((meeting) => {
            const { date, time, timezone } = formatDateTime(meeting.fecha_hora);
            const statusInfo = getMeetingStatus(meeting);
            const isUpcoming = statusInfo.status === 'upcoming';
            const isOngoing = statusInfo.status === 'ongoing';
            const canJoin = (isUpcoming || isOngoing) && meeting.user_registered;

            return (
              <Card key={meeting.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{meeting.titulo}</CardTitle>
                      {meeting.descripcion && (
                        <p className="text-sm text-muted-foreground">
                          {meeting.descripcion}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${statusInfo.color} text-white`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{time}</span>
                    <span className="text-muted-foreground">
                      ({meeting.duracion} min) - {timezone}
                    </span>
                  </div>

                  {/* Modality */}
                  <div className="flex items-center gap-2 text-sm">
                    {getModalityIcon(meeting.modalidad)}
                    <span className="capitalize">{meeting.modalidad}</span>
                    {meeting.modalidad === 'virtual' && meeting.enlace_virtual && canJoin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 h-6"
                        onClick={() => window.open(meeting.enlace_virtual, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Unirse
                      </Button>
                    )}
                    {meeting.modalidad === 'presencial' && meeting.ubicacion_presencial && (
                      <span className="text-muted-foreground ml-1">
                        - {meeting.ubicacion_presencial}
                      </span>
                    )}
                  </div>

                  {/* Attendance */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {meeting.total_asistentes} / {meeting.cupo_max} asistentes
                    </span>
                    {meeting.spaces_available === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Completo
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {isUpcoming && (
                      <>
                        {meeting.user_registered ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnregister(meeting.id)}
                          >
                            Cancelar inscripción
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRegister(meeting.id)}
                            disabled={meeting.spaces_available === 0}
                          >
                            {meeting.spaces_available === 0 ? 'Sin cupos' : 'Inscribirme'}
                          </Button>
                        )}
                      </>
                    )}

                    {meeting.user_registered && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        Inscrito
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

// Create Meeting Dialog Component
const CreateMeetingDialog: React.FC<{
  groupId: string;
  onMeetingCreated: () => void;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ groupId, onMeetingCreated, children, open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    duracion: 60,
    modalidad: 'virtual' as 'virtual' | 'presencial' | 'hibrida',
    enlace_virtual: '',
    ubicacion_presencial: '',
    cupo_max: 50
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fecha_hora = new Date(`${formData.fecha}T${formData.hora}`).toISOString();

      const meetingData: any = {
        grupo_id: groupId,
        titulo: formData.titulo,
        descripcion: formData.descripcion || null,
        fecha_hora,
        duracion: formData.duracion,
        modalidad: formData.modalidad,
        cupo_max: formData.cupo_max,
        creado_por: user.id
      };

      if (formData.modalidad === 'virtual' && formData.enlace_virtual) {
        meetingData.enlace_virtual = formData.enlace_virtual;
      }

      if (formData.modalidad === 'presencial' && formData.ubicacion_presencial) {
        meetingData.ubicacion_presencial = formData.ubicacion_presencial;
      }

      const { error } = await supabase
        .from('grupo_reuniones')
        .insert(meetingData);

      if (error) throw error;

      toast.success('Reunión creada correctamente');
      onMeetingCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: '',
        duracion: 60,
        modalidad: 'virtual',
        enlace_virtual: '',
        ubicacion_presencial: '',
        cupo_max: 50
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Error al crear la reunión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Reunión</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título de la reunión</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: Sesión de apoyo grupal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el propósito de la reunión..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración (minutos)</Label>
              <Input
                id="duracion"
                type="number"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: parseInt(e.target.value) })}
                min="15"
                max="480"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cupo_max">Cupo máximo</Label>
              <Input
                id="cupo_max"
                type="number"
                value={formData.cupo_max}
                onChange={(e) => setFormData({ ...formData, cupo_max: parseInt(e.target.value) })}
                min="2"
                max="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modalidad">Modalidad</Label>
            <Select 
              value={formData.modalidad} 
              onValueChange={(value: 'virtual' | 'presencial' | 'hibrida') => 
                setFormData({ ...formData, modalidad: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="hibrida">Híbrida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.modalidad === 'virtual' && (
            <div className="space-y-2">
              <Label htmlFor="enlace_virtual">Enlace de la reunión virtual</Label>
              <Input
                id="enlace_virtual"
                type="url"
                value={formData.enlace_virtual}
                onChange={(e) => setFormData({ ...formData, enlace_virtual: e.target.value })}
                placeholder="https://meet.google.com/xxx-xxx-xxx"
              />
            </div>
          )}

          {formData.modalidad === 'presencial' && (
            <div className="space-y-2">
              <Label htmlFor="ubicacion_presencial">Ubicación</Label>
              <Input
                id="ubicacion_presencial"
                value={formData.ubicacion_presencial}
                onChange={(e) => setFormData({ ...formData, ubicacion_presencial: e.target.value })}
                placeholder="Dirección del lugar de encuentro"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Reunión'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};