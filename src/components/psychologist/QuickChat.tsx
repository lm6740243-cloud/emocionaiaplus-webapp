import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Send,
  User,
  Clock
} from "lucide-react";

interface QuickChatMessage {
  id: string;
  message: string;
  sender_type: string;
  is_read: boolean;
  created_at: string;
  patient_name?: string;
  psychologist_name?: string;
}

interface ChatConversation {
  patient_id: string;
  patient_name: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export const QuickChat = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [messages, setMessages] = useState<QuickChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [selectedPatientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      // Mock conversations for now
      setConversations([
        {
          patient_id: "patient1",
          patient_name: "María González",
          last_message: "Hola doctor, ¿cómo está?",
          last_message_time: new Date().toISOString(),
          unread_count: 2
        },
        {
          patient_id: "patient2", 
          patient_name: "Carlos Ruiz",
          last_message: "Gracias por la sesión",
          last_message_time: new Date(Date.now() - 3600000).toISOString(),
          unread_count: 0
        }
      ]);

    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Error al cargar las conversaciones",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedPatientId) return;

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

      const { data, error } = await supabase
        .from('quick_chats')
        .select('*')
        .or(`and(psychologist_id.eq.${psychProfile.id},patient_id.eq.${selectedPatientId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Error al cargar los mensajes",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPatientId) return;

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

      const { error } = await supabase
        .from('quick_chats')
        .insert({
          psychologist_id: psychProfile.id,
          patient_id: selectedPatientId,
          message: newMessage,
          sender_type: 'psychologist'
        });

      if (error) throw error;

      setNewMessage("");
      fetchMessages();
      fetchConversations();

      toast({
        title: "Éxito",
        description: "Mensaje enviado"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Error al enviar el mensaje",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedPatientId) return;

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

      // Mark messages from patient as read
      await supabase
        .from('quick_chats')
        .update({ is_read: true })
        .eq('patient_id', selectedPatientId)
        .eq('psychologist_id', psychProfile.id)
        .eq('sender_type', 'patient')
        .eq('is_read', false);

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedPatientName = conversations.find(c => c.patient_id === selectedPatientId)?.patient_name;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Chat Rápido con Pacientes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground p-4">
                  No hay conversaciones activas
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.patient_id}
                      className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                        selectedPatientId === conversation.patient_id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedPatientId(conversation.patient_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.patient_name}`} />
                            <AvatarFallback>
                              {conversation.patient_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{conversation.patient_name}</h4>
                            {conversation.last_message && (
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.last_message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {conversation.last_message_time && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.last_message_time).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedPatientName ? (
                <>
                  <User className="h-5 w-5" />
                  {selectedPatientName}
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  Selecciona una conversación
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!selectedPatientId ? (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Selecciona un paciente para iniciar la conversación
              </div>
            ) : (
              <>
                {/* Messages */}
                <ScrollArea className="h-[400px] p-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay mensajes en esta conversación
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_type === 'psychologist' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender_type === 'psychologist'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-accent'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 opacity-70" />
                              <span className="text-xs opacity-70">
                                {new Date(message.created_at).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={loading || !newMessage.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};