import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PHQ9Questionnaire } from '@/components/assessments/PHQ9Questionnaire';
import { GAD7Questionnaire } from '@/components/assessments/GAD7Questionnaire';
import { ProgressChart } from '@/components/assessments/ProgressChart';
import { GlobalImpactStats } from '@/components/assessments/GlobalImpactStats';
import { FileText, TrendingUp, Users, Calendar, Brain, Heart, BarChart3 } from 'lucide-react';

export default function Evaluaciones() {
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<'phq9' | 'gad7' | null>(null);

  const handleQuestionnaireComplete = () => {
    setActiveQuestionnaire(null);
    // Refresh the page components to show updated data
    window.location.reload();
  };

  if (activeQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setActiveQuestionnaire(null)}
              className="mb-4"
            >
              ← Volver a evaluaciones
            </Button>
          </div>
          
          {activeQuestionnaire === 'phq9' && (
            <PHQ9Questionnaire onComplete={handleQuestionnaireComplete} />
          )}
          
          {activeQuestionnaire === 'gad7' && (
            <GAD7Questionnaire onComplete={handleQuestionnaireComplete} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Evaluaciones de Bienestar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitorea tu progreso con cuestionarios validados científicamente y 
            observa el impacto positivo en nuestra comunidad.
          </p>
        </div>

        <Tabs defaultValue="questionnaires" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questionnaires" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Cuestionarios
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mi Progreso
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Impacto Comunitario
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questionnaires" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* PHQ-9 Card */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
                <CardHeader className="relative">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">PHQ-9</CardTitle>
                      <CardDescription className="text-sm">
                        Cuestionario de Salud del Paciente - Depresión
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      9 preguntas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Evalúa la presencia y severidad de síntomas depresivos durante las últimas 2 semanas. 
                    Es un instrumento validado utilizado mundialmente por profesionales de la salud.
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Tiempo estimado: 3-5 minutos</span>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveQuestionnaire('phq9')}
                  >
                    Comenzar PHQ-9
                  </Button>
                </CardContent>
              </Card>

              {/* GAD-7 Card */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
                <CardHeader className="relative">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">GAD-7</CardTitle>
                      <CardDescription className="text-sm">
                        Trastorno de Ansiedad Generalizada
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      7 preguntas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Mide la severidad de los síntomas de ansiedad generalizada durante las últimas 2 semanas. 
                    Herramienta estándar en la práctica clínica y de investigación.
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Tiempo estimado: 2-4 minutos</span>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveQuestionnaire('gad7')}
                  >
                    Comenzar GAD-7
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Information Card */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">¿Por qué son importantes estas evaluaciones?</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• <strong>Seguimiento objetivo:</strong> Miden tu progreso con herramientas validadas científicamente</p>
                      <p>• <strong>Detección temprana:</strong> Identifican cambios en tu bienestar que podrían necesitar atención</p>
                      <p>• <strong>Comunicación con profesionales:</strong> Proporcionan datos precisos para compartir con tu psicólogo</p>
                      <p>• <strong>Motivación personal:</strong> Te ayudan a ver mejoras que podrían no ser obvias día a día</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <ProgressChart />
          </TabsContent>

          <TabsContent value="community">
            <GlobalImpactStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}