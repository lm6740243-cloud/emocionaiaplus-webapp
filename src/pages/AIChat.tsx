import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIChat from "@/components/ai-assistant/AIChat";

const AIChatPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Asistente IA - EmocionalIA+
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Chat Interface */}
        <div className="h-[calc(100vh-120px)]">
          <AIChat />
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>
            Asistente IA con tecnología OpenAI • Detección de crisis activada • 
            Conversaciones guardadas de forma segura
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;