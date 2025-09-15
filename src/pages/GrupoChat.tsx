import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Paperclip, 
  Users, 
  Pin, 
  Reply, 
  MoreVertical,
  Flag,
  Shield,
  Crown,
  Circle,
  Clock,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CrisisHelpModal } from '@/components/groups/CrisisHelpModal';
import { ModerationPanel } from '@/components/groups/ModerationPanel';

interface Message {
  id: string;
  contenido: string;
  tipo_mensaje: 'texto' | 'imagen' | 'audio' | 'archivo';
  archivo_url?: string;
  respondiendo_a?: string;
  fijado: boolean;
  reportado: boolean;
  editado: boolean;
  fecha_creacion: string;
  fecha_edicion?: string;
  autor_id: string;
  autor_alias: string;
  autor_rol: 'miembro' | 'moderador' | 'propietario';
  metadata?: any;
}

interface Member {
  id: string;
  user_id: string;
  alias: string;
  rol: 'miembro' | 'moderador' | 'propietario';
  fecha_union: string;
  activo: boolean;
  en_linea?: boolean;
  ultima_actividad?: string;
  silenciado_hasta?: string;
  baneado?: boolean;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  modo_lento_segundos: number;
  configuracion_chat?: any;
}

const roleIcons = {
  propietario: Crown,
  moderador: Shield,
  miembro: Circle
};

const roleColors = {
  propietario: 'text-yellow-500',
  moderador: 'text-blue-500',
  miembro: 'text-muted-foreground'
};

const emojis = ['😊', '😂', '❤️', '👍', '👏', '🙌', '💪', '🤗', '😢', '😮', '🔥', '✨'];

export default function GrupoChat() {
  const { id: grupoId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMembersSidebar, setShowMembersSidebar] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState<Message | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize data and real-time subscriptions
  useEffect(() => {
    if (!grupoId) return;

    const initializeChat = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setCurrentUser(user);

        // Check if user is member of this group
        const { data: membership } = await supabase
          .from('grupo_miembros')
          .select('*')
          .eq('grupo_id', grupoId)
          .eq('user_id', user.id)
          .eq('activo', true)
          .single();

        if (!membership) {
          toast.error('No tienes acceso a este grupo');
          navigate('/grupos');
          return;
        }

        setCurrentMember(membership as Member);

        // Load user profile for emergency contact
        const { data: profile } = await supabase
          .from('profiles')
          .select('emergency_contact_name, emergency_contact_phone')
          .eq('user_id', user.id)
          .single();

        setUserProfile(profile);

        // Load group info
        await loadGroup();
        await loadMembers();
        await loadMessages();
        
        // Update user presence
        await updatePresence(true);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Error al cargar el chat');
        navigate('/grupos');
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      if (grupoId && currentUser) {
        updatePresence(false);
      }
    };
  }, [grupoId, navigate]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!grupoId || !currentUser) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`grupo_mensajes:${grupoId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'grupo_mensajes',
          filter: `grupo_id=eq.${grupoId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          loadMessages(); // Reload to get author info
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'grupo_mensajes',
          filter: `grupo_id=eq.${grupoId}`
        },
        (payload) => {
          console.log('Message updated:', payload);
          loadMessages();
        }
      )
      .subscribe();

    // Subscribe to presence updates
    const presenceChannel = supabase
      .channel(`grupo_presencia:${grupoId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grupo_presencia',
          filter: `grupo_id=eq.${grupoId}`
        },
        (payload) => {
          console.log('Presence updated:', payload);
          loadMembers(); // Reload to update online status
        }
      )
      .subscribe();

    // Presence heartbeat
    const heartbeatInterval = setInterval(() => {
      updatePresence(true);
    }, 30000); // Update every 30 seconds

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(presenceChannel);
      clearInterval(heartbeatInterval);
    };
  }, [grupoId, currentUser]);

  const loadGroup = async () => {
    if (!grupoId) return;

    const { data, error } = await supabase
      .from('support_groups')
      .select('id, name, description, modo_lento_segundos, configuracion_chat')
      .eq('id', grupoId)
      .single();

    if (error) {
      console.error('Error loading group:', error);
      return;
    }

    setGroup(data as Group);
  };

  const loadMembers = async () => {
    if (!grupoId) return;

    // First load members
    const { data: membersData, error: membersError } = await supabase
      .from('grupo_miembros')
      .select('*')
      .eq('grupo_id', grupoId)
      .eq('activo', true);

    if (membersError) {
      console.error('Error loading members:', membersError);
      return;
    }

    // Then load presence data
    const { data: presenceData, error: presenceError } = await supabase
      .from('grupo_presencia')
      .select('*')
      .eq('grupo_id', grupoId);

    if (presenceError) {
      console.error('Error loading presence:', presenceError);
    }

    // Combine the data
    const membersWithPresence = membersData.map(member => {
      const presence = presenceData?.find(p => p.user_id === member.user_id);
      return {
        ...member,
        rol: member.rol as 'miembro' | 'moderador' | 'propietario',
        en_linea: presence?.en_linea || false,
        ultima_actividad: presence?.ultima_actividad
      };
    });

    setMembers(membersWithPresence);
  };

  const loadMessages = async () => {
    if (!grupoId) return;

    const { data, error } = await supabase
      .from('grupo_mensajes')
      .select(`
        *
      `)
      .eq('grupo_id', grupoId)
      .order('fecha_creacion', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    // Get author info for each message
    const messagesWithAuthors = await Promise.all(
      data.map(async (msg) => {
        const { data: authorData } = await supabase
          .from('grupo_miembros')
          .select('alias, rol')
          .eq('grupo_id', grupoId)
          .eq('user_id', msg.autor_id)
          .single();

        return {
          ...msg,
          tipo_mensaje: msg.tipo_mensaje as 'texto' | 'imagen' | 'audio' | 'archivo',
          autor_alias: authorData?.alias || 'Usuario',
          autor_rol: (authorData?.rol as 'miembro' | 'moderador' | 'propietario') || 'miembro'
        };
      })
    );

    setMessages(messagesWithAuthors);
  };

  const updatePresence = async (enLinea: boolean) => {
    if (!grupoId) return;

    try {
      await supabase.rpc('update_user_presence', {
        p_grupo_id: grupoId,
        p_en_linea: enLinea
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  const checkSlowMode = (): boolean => {
    if (!group?.modo_lento_segundos || group.modo_lento_segundos === 0) return true;
    
    if (currentMember?.rol === 'moderador' || currentMember?.rol === 'propietario') {
      return true; // Moderators and owners bypass slow mode
    }

    if (!lastMessageTime) return true;

    const timeSinceLastMessage = Date.now() - lastMessageTime.getTime();
    const slowModeMs = group.modo_lento_segundos * 1000;

    if (timeSinceLastMessage < slowModeMs) {
      const remainingSeconds = Math.ceil((slowModeMs - timeSinceLastMessage) / 1000);
      toast.error(`Modo lento activo. Espera ${remainingSeconds} segundos para enviar otro mensaje.`);
      return false;
    }

    return true;
  };

  const sendMessage = async () => {
    if (!grupoId || !currentUser || !newMessage.trim()) return;

    if (!checkSlowMode()) return;

    // Check if user is silenced
    if (currentMember?.silenciado_hasta && new Date(currentMember.silenciado_hasta) > new Date()) {
      const remainingTime = Math.ceil((new Date(currentMember.silenciado_hasta).getTime() - Date.now()) / (1000 * 60));
      toast.error(`Estás silenciado. Podrás escribir nuevamente en ${remainingTime} minutos.`);
      return;
    }

    try {
      const messageData: any = {
        grupo_id: grupoId,
        autor_id: currentUser.id,
        contenido: newMessage.trim(),
        tipo_mensaje: 'texto'
      };

      if (replyingTo) {
        messageData.respondiendo_a = replyingTo.id;
      }

      // Check for @moderador mentions
      if (newMessage.includes('@moderador') || newMessage.includes('@moderadores')) {
        messageData.metadata = { 
          mentions: ['moderadores'],
          highlight: true 
        };
      }

      const { data: messageResult, error } = await supabase
        .from('grupo_mensajes')
        .insert(messageData)
        .select('id')
        .single();

      if (error) throw error;

      // Check for crisis keywords after message is sent
      if (messageResult?.id) {
        try {
          const { data: hasCrisis } = await supabase.rpc('detect_crisis_in_message', {
            mensaje_contenido: newMessage.trim(),
            p_grupo_id: grupoId,
            p_mensaje_id: messageResult.id,
            p_user_id: currentUser.id
          });

          if (hasCrisis) {
            setShowCrisisModal(true);
          }
        } catch (crisisError) {
          console.error('Error detecting crisis:', crisisError);
          // Don't block message sending if crisis detection fails
        }
      }

      setNewMessage('');
      setReplyingTo(null);
      setLastMessageTime(new Date());
      
      // Focus back to input
      messageInputRef.current?.focus();

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje');
    }
  };

  const togglePinMessage = async (message: Message) => {
    if (currentMember?.rol === 'miembro') {
      toast.error('Solo los moderadores pueden fijar mensajes');
      return;
    }

    try {
      const { error } = await supabase
        .from('grupo_mensajes')
        .update({ fijado: !message.fijado })
        .eq('id', message.id);

      if (error) throw error;

      toast.success(message.fijado ? 'Mensaje desfijado' : 'Mensaje fijado');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Error al fijar/desfijar mensaje');
    }
  };

  const reportMessage = async (message: Message, motivo: string, descripcion?: string) => {
    try {
      const { error } = await supabase
        .from('grupo_reportes')
        .insert({
          mensaje_id: message.id,
          reportado_por: currentUser?.id,
          motivo,
          descripcion
        });

      if (error) throw error;

      toast.success('Mensaje reportado. Los moderadores lo revisarán.');
      setShowReportDialog(null);
    } catch (error) {
      console.error('Error reporting message:', error);
      toast.error('Error al reportar el mensaje');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };

  const formatJoinDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const onlineMembers = members.filter(m => m.en_linea);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Grupo no encontrado</h2>
          <Button onClick={() => navigate('/grupos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Grupos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/grupos')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{group.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                {onlineMembers.length} en línea
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {group.modo_lento_segundos > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Modo lento: {group.modo_lento_segundos}s
              </Badge>
            )}
            
            {(currentMember?.rol === 'moderador' || currentMember?.rol === 'propietario') && (
              <ModerationPanel
                groupId={grupoId!}
                currentUserRole={currentMember.rol}
                members={members}
                onMemberModerated={loadMembers}
              >
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Moderación
                </Button>
              </ModerationPanel>
            )}
            
            <Sheet open={showMembersSidebar} onOpenChange={setShowMembersSidebar}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  {members.length}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Miembros del Grupo</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-4">
                    En línea ({onlineMembers.length})
                  </div>
                  
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-3">
                      {members.map((member) => {
                        const RoleIcon = roleIcons[member.rol];
                        return (
                          <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {member.alias.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                                member.en_linea ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium truncate">{member.alias}</span>
                                <RoleIcon className={`h-4 w-4 ${roleColors[member.rol]}`} />
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Miembro desde {formatJoinDate(member.fecha_union)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Pinned Messages */}
            {messages.filter(msg => msg.fijado).length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Pin className="h-4 w-4 text-yellow-600" />
                    Mensajes Fijados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {messages.filter(msg => msg.fijado).map((message) => (
                    <div key={message.id} className="text-sm p-2 rounded bg-background/50">
                      <span className="font-medium">{message.autor_alias}: </span>
                      {message.contenido}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Chat Messages */}
            {messages.map((message) => {
              const RoleIcon = roleIcons[message.autor_rol];
              const isHighlighted = message.metadata?.highlight;
              
              return (
                <div
                  key={message.id}
                  className={`group flex gap-3 ${isHighlighted ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200' : ''}`}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-xs">
                      {message.autor_alias.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{message.autor_alias}</span>
                      <RoleIcon className={`h-3 w-3 ${roleColors[message.autor_rol]}`} />
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(message.fecha_creacion)}
                      </span>
                      {message.editado && (
                        <span className="text-xs text-muted-foreground">(editado)</span>
                      )}
                    </div>
                    
                    {message.respondiendo_a && (
                      <div className="text-xs text-muted-foreground mb-2 pl-3 border-l-2 border-muted">
                        Respondiendo a un mensaje
                      </div>
                    )}
                    
                    <div className="text-sm break-words">{message.contenido}</div>
                    
                    {/* Message Actions */}
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => setReplyingTo(message)}
                      >
                        <Reply className="h-3 w-3" />
                      </Button>
                      
                      {(currentMember?.rol !== 'miembro') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => togglePinMessage(message)}
                        >
                          <Pin className={`h-3 w-3 ${message.fijado ? 'text-yellow-600' : ''}`} />
                        </Button>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Flag className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reportar Mensaje</DialogTitle>
                          </DialogHeader>
                          
                          <ReportForm
                            message={message}
                            onReport={reportMessage}
                            onCancel={() => setShowReportDialog(null)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4 bg-card">
          <div className="max-w-4xl mx-auto">
            {replyingTo && (
              <div className="flex items-center justify-between mb-3 p-2 bg-muted rounded text-sm">
                <div>
                  <span className="text-muted-foreground">Respondiendo a </span>
                  <span className="font-medium">{replyingTo.autor_alias}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  ×
                </Button>
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Escribe un mensaje como ${currentMember?.alias}...`}
                  className="min-h-[44px] max-h-32 resize-none pr-16"
                  rows={1}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-full mb-2 bg-popover border rounded-lg p-3 shadow-lg">
                    <div className="grid grid-cols-6 gap-1">
                      {emojis.map((emoji, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => addEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="h-11"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Help Modal */}
      {currentUser && (
        <CrisisHelpModal
          open={showCrisisModal}
          onOpenChange={setShowCrisisModal}
          userEmergencyContact={
            currentMember ? {
              name: userProfile?.emergency_contact_name || 'Contacto de Emergencia',
              phone: userProfile?.emergency_contact_phone || ''
            } : undefined
          }
        />
      )}
    </div>
  );
}

// Report Form Component
const ReportForm = ({ message, onReport, onCancel }: {
  message: Message;
  onReport: (message: Message, motivo: string, descripcion?: string) => void;
  onCancel: () => void;
}) => {
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = () => {
    if (!motivo) return;
    onReport(message, motivo, descripcion);
  };

  return (
    <div className="space-y-4">
      <Select value={motivo} onValueChange={setMotivo}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona el motivo del reporte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spam">Spam</SelectItem>
          <SelectItem value="acoso">Acoso</SelectItem>
          <SelectItem value="contenido_inapropiado">Contenido inapropiado</SelectItem>
          <SelectItem value="desinformacion">Desinformación</SelectItem>
          <SelectItem value="violacion_normas">Violación de normas</SelectItem>
          <SelectItem value="otro">Otro</SelectItem>
        </SelectContent>
      </Select>
      
      <Textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción adicional (opcional)"
        rows={3}
      />
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!motivo}>
          Reportar
        </Button>
      </div>
    </div>
  );
};