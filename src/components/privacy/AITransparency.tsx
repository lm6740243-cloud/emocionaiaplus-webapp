import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Clock, 
  Globe, 
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

export const AITransparency = () => {
  const aiCapabilities = [
    {
      title: "Conversación Natural",
      description: "Puede mantener conversaciones coherentes sobre bienestar emocional",
      status: "available",
      accuracy: "85-90%"
    },
    {
      title: "Detección de Crisis",
      description: "Identifica patrones de texto que sugieren crisis emocionales",
      status: "available", 
      accuracy: "75-80%"
    },
    {
      title: "Recomendaciones Personalizadas",
      description: "Sugiere ejercicios basados en tu historial y estado actual",
      status: "available",
      accuracy: "70-75%"
    },
    {
      title: "Análisis de Patrones",
      description: "Identifica tendencias en tu estado de ánimo y comportamiento",
      status: "available",
      accuracy: "80-85%"
    }
  ];

  const aiLimitations = [
    {
      title: "NO es un sustituto de terapia profesional",
      description: "La IA no puede reemplazar el juicio clínico de un psicólogo licenciado",
      severity: "high"
    },
    {
      title: "NO puede diagnosticar condiciones médicas",
      description: "No está capacitada para realizar diagnósticos de salud mental",
      severity: "high"
    },
    {
      title: "Puede generar respuestas incorrectas",
      description: "Las respuestas están basadas en patrones y pueden no ser siempre precisas",
      severity: "medium"
    },
    {
      title: "Limitaciones en crisis complejas",
      description: "Situaciones complejas requieren intervención humana especializada",
      severity: "medium"
    },
    {
      title: "Sesgo en datos de entrenamiento",
      description: "Los modelos pueden reflejar sesgos presentes en sus datos de entrenamiento",
      severity: "low"
    }
  ];

  const dataFlow = [
    {
      step: "1. Entrada del Usuario",
      description: "Tu mensaje se procesa y anonimiza antes del análisis"
    },
    {
      step: "2. Análisis de IA", 
      description: "OpenAI GPT-4 analiza el contexto y genera una respuesta"
    },
    {
      step: "3. Filtros de Seguridad",
      description: "Se aplican filtros para detectar contenido sensible o crisis"
    },
    {
      step: "4. Personalización",
      description: "La respuesta se personaliza basada en tu historial y preferencias"
    },
    {
      step: "5. Entrega Segura",
      description: "La respuesta se cifra y entrega a través de conexiones seguras"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Transparencia de la Inteligencia Artificial
          </CardTitle>
          <CardDescription>
            Información detallada sobre cómo funciona nuestro asistente de IA y sus limitaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Model Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Modelo de IA Utilizado
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <h5 className="font-medium">OpenAI GPT-4</h5>
                    <Badge variant="secondary">Actual</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Modelo de lenguaje avanzado</li>
                    <li>• Entrenado hasta abril 2024</li>
                    <li>• Especializado en conversación empática</li>
                    <li>• Cumple estándares de seguridad</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <h5 className="font-medium">Configuraciones de Seguridad</h5>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Filtros de contenido activados</li>
                    <li>• Detección de crisis automática</li>
                    <li>• Límites de conversación establecidos</li>
                    <li>• Monitoreo continuo de calidad</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* AI Capabilities */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Capacidades del Asistente
            </h4>
            
            <div className="space-y-3">
              {aiCapabilities.map((capability, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">{capability.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {capability.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          {capability.accuracy}
                        </Badge>
                        <div className="text-xs text-muted-foreground">precisión</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* AI Limitations */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              Limitaciones Importantes
            </h4>
            
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Aviso Importante:</strong> Este asistente de IA es una herramienta de apoyo, 
                no un sustituto de atención médica profesional. En situaciones de crisis, 
                busca ayuda inmediata de profesionales de la salud.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {aiLimitations.map((limitation, index) => (
                <Card key={index} className={`border-l-4 ${getSeverityColor(limitation.severity)}`}>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-1 text-red-700 dark:text-red-400">
                      {limitation.title}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {limitation.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* How It Works */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Cómo Funciona el Procesamiento
            </h4>
            
            <div className="space-y-3">
              {dataFlow.map((flow, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">{flow.step}</h5>
                    <p className="text-sm text-muted-foreground">{flow.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Response Time & Availability */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Disponibilidad y Rendimiento
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Disponibilidad</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">2-5s</div>
                <div className="text-sm text-muted-foreground">Tiempo de respuesta</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime objetivo</div>
              </div>
            </div>
          </div>

          {/* Updates and Improvements */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Mejora Continua:</strong> Nuestro sistema de IA se actualiza regularmente 
              para mejorar la precisión y seguridad. Los cambios significativos son comunicados 
              a los usuarios con antelación.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};