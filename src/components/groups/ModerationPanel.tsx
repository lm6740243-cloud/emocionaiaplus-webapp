import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Ban, 
  VolumeX, 
  UserX, 
  Trash2, 
  MessageCircle,
  AlertTriangle,
  Clock,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface Member {
  id: string;
  user_id: string;
  alias: string;
  rol: 'miembro' | 'moderador' | 'propietario';
  silenciado_hasta?: string;
  baneado?: boolean;
  activo: boolean;
}

interface ReportedMessage {
  id: string;
  contenido: string;
  autor_alias: string;
  fecha_creacion: string;
  reportes_count: number;
  motivo: string;
}

interface ModerationPanelProps {
  groupId: string;
  currentUserRole: 'miembro' | 'moderador' | 'propietario';
  members: Member[];
  onMemberModerated?: () => void;
  children: React.ReactNode;
}

export function ModerationPanel({ 
  groupId, 
  currentUserRole, 
  members, 
  onMemberModerated,
  children 
}: ModerationPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [moderationAction, setModerationAction] = useState<'silence' | 'kick' | 'ban'>('silence');
  const [duration, setDuration] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [reportedMessages, setReportedMessages] = useState<ReportedMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const canModerate = currentUserRole === 'moderador' || currentUserRole === 'propietario';

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && canModerate) {
      loadReportedMessages();
    }
  };

  const loadReportedMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('grupo_reportes')
        .select(`
          id,
          motivo,
          descripcion,
          fecha_reporte,
          grupo_mensajes!inner(
            id,
            contenido,
            fecha_creacion,
            autor_id
          )
        `)
        .eq('resuelto', false)
        .eq('grupo_mensajes.grupo_id', groupId)
        .order('fecha_reporte', { ascending: false });

      if (error) throw error;

      // Group messages by message ID and count reports
      const messageMap = new Map();
      
      data?.forEach((report: any) => {
        const messageId = report.grupo_mensajes.id;
        if (!messageMap.has(messageId)) {
          messageMap.set(messageId, {
            id: messageId,
            contenido: report.grupo_mensajes.contenido,
            fecha_creacion: report.grupo_mensajes.fecha_creacion,
            reportes_count: 0,
            motivo: report.motivo,
            reportes: []
          });
        }
        const message = messageMap.get(messageId);
        message.reportes_count += 1;
        message.reportes.push(report);
      });

      setReportedMessages(Array.from(messageMap.values()));
    } catch (error) {
      console.error('Error loading reported messages:', error);
      toast.error('Error al cargar mensajes reportados');
    }
  };

  const handleModerateMember = async () => {
    if (!selectedMember || !canModerate) return;

    setLoading(true);
    try {
      const { error } = await supabase.rpc('moderate_member', {
        p_grupo_id: groupId,
        p_target_user_id: selectedMember.user_id,
        p_action: moderationAction,
        p_duration_hours: moderationAction === 'silence' ? duration : null,
        p_reason: reason || null
      });

      if (error) throw error;

      const actionLabels = {
        silence: 'silenciado',
        kick: 'expulsado',
        ban: 'baneado'
      };

      toast.success(`${selectedMember.alias} ha sido ${actionLabels[moderationAction]}`);
      setSelectedMember(null);
      setReason('');
      onMemberModerated?.();
      
    } catch (error) {
      console.error('Error moderating member:', error);
      toast.error('Error al aplicar moderación');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('grupo_mensajes')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Mark all reports for this message as resolved
      await supabase
        .from('grupo_reportes')
        .update({ resuelto: true })
        .eq('mensaje_id', messageId);

      toast.success('Mensaje eliminado');
      loadReportedMessages();
      
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Error al eliminar mensaje');
    }
  };

  const handleResolveReport = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('grupo_reportes')
        .update({ resuelto: true })
        .eq('mensaje_id', messageId);

      if (error) throw error;

      toast.success('Reporte marcado como resuelto');
      loadReportedMessages();
      
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Error al resolver reporte');
    }
  };

  const startPrivateChat = async (memberId: string) => {
    // This would open a private chat with the member
    toast.success('Chat privado iniciado');
    setOpen(false);
  };

  if (!canModerate) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Panel de Moderación
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Miembros</TabsTrigger>
            <TabsTrigger value="reports">
              Reportes
              {reportedMessages.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {reportedMessages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {members.filter(m => m.activo && m.rol !== 'propietario').map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.alias}</span>
                          <Badge variant="outline">{member.rol}</Badge>
                          {member.silenciado_hasta && new Date(member.silenciado_hasta) > new Date() && (
                            <Badge variant="destructive">
                              <VolumeX className="h-3 w-3 mr-1" />
                              Silenciado
                            </Badge>
                          )}
                          {member.baneado && (
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Baneado
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startPrivateChat(member.user_id)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMember(member)}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Moderar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 max-h-[60vh] overflow-y-auto">
            {reportedMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay reportes pendientes
              </div>
            ) : (
              <div className="space-y-3">
                {reportedMessages.map((message) => (
                  <Card key={message.id} className="border-orange-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Mensaje Reportado
                        </CardTitle>
                        <Badge variant="destructive">
                          {message.reportes_count} reporte{message.reportes_count > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <CardDescription>
                        Motivo principal: {message.motivo}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{message.contenido}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.fecha_creacion).toLocaleString('es-ES')}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveReport(message.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Resolver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Moderation Action Dialog */}
        {selectedMember && (
          <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Moderar a {selectedMember.alias}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Acción</Label>
                  <Select value={moderationAction} onValueChange={(value: any) => setModerationAction(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silence">
                        <div className="flex items-center gap-2">
                          <VolumeX className="h-4 w-4" />
                          Silenciar temporalmente
                        </div>
                      </SelectItem>
                      <SelectItem value="kick">
                        <div className="flex items-center gap-2">
                          <UserX className="h-4 w-4" />
                          Expulsar del grupo
                        </div>
                      </SelectItem>
                      <SelectItem value="ban">
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4" />
                          Banear permanentemente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {moderationAction === 'silence' && (
                  <div className="space-y-2">
                    <Label>Duración (horas)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Razón (opcional)</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explica brevemente el motivo de la moderación..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMember(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleModerateMember}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Aplicando...' : 'Aplicar Moderación'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}