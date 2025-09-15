import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

const VoiceInput = ({ onTranscript, isRecording, onRecordingChange }: VoiceInputProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioBlob(audioBlob);
        
        // Limpiar streams
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      onRecordingChange(true);

      toast({
        title: "Grabando",
        description: "Habla ahora... Presiona nuevamente para enviar.",
      });

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error de micrófono",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive"
      });
    }
  }, [onRecordingChange, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
    }
  }, [onRecordingChange]);

  const processAudioBlob = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convertir blob a base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      const base64Audio = btoa(binary);

      // Enviar a speech-to-text
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: {
          audio: base64Audio,
          language: 'es'
        }
      });

      if (error) throw error;

      const response = await data;
      
      if (response.text && response.text.trim()) {
        onTranscript(response.text.trim());
        toast({
          title: "Transcripción completada",
          description: `"${response.text.substring(0, 50)}${response.text.length > 50 ? '...' : ''}"`
        });
      } else {
        toast({
          title: "No se detectó audio",
          description: "Intenta hablar más claro o acércate al micrófono",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error de transcripción",
        description: "No se pudo convertir el audio a texto. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getButtonState = () => {
    if (isProcessing) {
      return {
        icon: Loader2,
        className: "h-8 w-8 p-0 animate-spin",
        disabled: true,
        variant: "secondary" as const
      };
    }
    
    if (isRecording) {
      return {
        icon: MicOff,
        className: "h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white animate-pulse",
        disabled: false,
        variant: "destructive" as const
      };
    }
    
    return {
      icon: Mic,
      className: "h-8 w-8 p-0",
      disabled: false,
      variant: "outline" as const
    };
  };

  const buttonState = getButtonState();
  const Icon = buttonState.icon;

  return (
    <Button
      size="sm"
      variant={buttonState.variant}
      className={buttonState.className}
      onClick={handleClick}
      disabled={buttonState.disabled}
      title={
        isProcessing 
          ? "Procesando audio..." 
          : isRecording 
            ? "Detener grabación y enviar" 
            : "Presiona para hablar"
      }
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export default VoiceInput;