import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  RotateCcw,
  AlertTriangle,
  MessageSquare,
  Crown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/contexts/SubscriptionContext";
import EmergencyModal from "./EmergencyModal";
import VoiceInput from "./VoiceInput";
import PremiumFeature from "../premium/PremiumFeature";
import FeatureLimit from "../premium/FeatureLimit";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  tone?: string;
}

type ToneType = 'profesional' | 'motivador' | 'relajado';

const AIChat = () => {
  const { toast } = useToast();
  const { isPremium, tier, hasFeature } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneType>('profesional');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [crisisData, setCrisisData] = useState<{ detectedKeywords: string[] } | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Free tier limits
  const FREE_DAILY_MESSAGES = 10;
  const canSendMessage = isPremium() || dailyMessageCount < FREE_DAILY_MESSAGES;
  const canUseVoice = isPremium() || hasFeature('Chat IA con voz');

  const toneOptions = {
    profesional: {
      label: "Profesional",
      description: "Tono serio y clínico",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    motivador: {
      label: "Motivador", 
      description: "Entusiasta y positivo",
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    relajado: {
      label: "Relajado",
      description: "Tranquilo y sereno", 
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []); // Remove sessionId dependency to prevent re-fetching on every render

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          content: msg.message,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.timestamp),
          tone: msg.tone
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend) return;

    // Check message limits for free users
    if (!canSendMessage) {
      toast({
        title: "Límite alcanzado",
        description: `Has alcanzado el límite de ${FREE_DAILY_MESSAGES} mensajes diarios. Actualiza a Premium para mensajes ilimitados.`,
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: messageToSend,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Increment message count for free users
    if (!isPremium()) {
      setDailyMessageCount(prev => prev + 1);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para usar el chat",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageToSend,
          tone: selectedTone,
          sessionId: sessionId
        }
      });

      if (error) throw error;

      const response = await data;

      // Verificar si se detectó crisis
      if (response.crisisDetected) {
        setCrisisData({ detectedKeywords: response.detectedKeywords });
        setShowEmergencyModal(true);
      }

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        tone: response.tone
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Reproducir respuesta si está habilitado el audio
      if (isVoiceEnabled && response.response) {
        await playTextToSpeech(response.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playTextToSpeech = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'nova' }
      });

      if (error) throw error;

      const response = await data;
      if (response?.audioContent) {
        const audioBlob = new Blob([
          Uint8Array.from(atob(response.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mp3' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          URL.revokeObjectURL(audioUrl);
        });
        
        audio.onended = () => URL.revokeObjectURL(audioUrl);
        audio.onerror = () => URL.revokeObjectURL(audioUrl);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript.trim()) {
      sendMessage(transcript);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat limpiado",
      description: "Se ha iniciado una nueva conversación"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card className="flex flex-col h-full max-h-[600px] bg-gradient-card border-primary/20">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary animate-pulse-gentle" />
              Asistente IA EmocionalIA+
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isPremium() && (
                <FeatureLimit 
                  used={dailyMessageCount}
                  limit={FREE_DAILY_MESSAGES}
                  feature="mensajes"
                  unit="hoy"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={isVoiceEnabled ? "text-primary" : "text-muted-foreground"}
                disabled={!canUseVoice}
              >
                {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {!canUseVoice && <Crown className="h-3 w-3 ml-1" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={clearChat}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Selector de tono */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Tono:</span>
            <Select value={selectedTone} onValueChange={(value: ToneType) => setSelectedTone(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(toneOptions).map(([key, option]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className={toneOptions[selectedTone].color}>
              {toneOptions[selectedTone].description}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 min-h-0 p-4 gap-4">
          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p className="text-lg font-medium mb-2">¡Hola! Soy tu asistente de bienestar emocional</p>
                <p className="text-sm">Estoy aquí para apoyarte. Puedes hablar conmigo sobre cómo te sientes o cualquier inquietud que tengas.</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => sendMessage("Hola, ¿cómo puedes ayudarme?")}
                  >
                    "¿Cómo puedes ayudarme?"
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => sendMessage("Me siento ansioso")}
                  >
                    "Me siento ansioso"
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => sendMessage("Necesito técnicas de relajación")}
                  >
                    "Necesito relajarme"
                  </Badge>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className={`text-xs text-muted-foreground mt-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatTime(message.timestamp)}
                    {message.tone && (
                      <span className="ml-2">
                        • {toneOptions[message.tone as ToneType]?.label}
                      </span>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="flex-shrink-0 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje o usa el micrófono..."
                  className="resize-none pr-20"
                  rows={2}
                  disabled={isLoading}
                 />
                 <div className="absolute right-2 top-2 flex gap-1">
                   {canUseVoice ? (
                     <VoiceInput
                       onTranscript={handleVoiceInput}
                       isRecording={isRecording}
                       onRecordingChange={setIsRecording}
                     />
                   ) : (
                     <Button
                       size="sm"
                       variant="outline"
                       disabled
                       className="h-8 w-8 p-0"
                       title="Función premium"
                     >
                       <Mic className="h-4 w-4" />
                       <Crown className="h-2 w-2 absolute -top-1 -right-1" />
                     </Button>
                   )}
                   <Button
                     size="sm"
                     onClick={() => sendMessage()}
                     disabled={!inputMessage.trim() || isLoading || !canSendMessage}
                     className="h-8 w-8 p-0"
                   >
                     <Send className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Presiona Enter para enviar • Shift+Enter para nueva línea
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de emergencia */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        detectedKeywords={crisisData?.detectedKeywords || []}
      />
    </>
  );
};

export default AIChat;