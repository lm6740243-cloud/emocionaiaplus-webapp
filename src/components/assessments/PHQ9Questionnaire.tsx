import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const PHQ9_QUESTIONS = [
  "Poco interés o placer en hacer las cosas",
  "Se ha sentido desanimado/a, deprimido/a, o sin esperanza",
  "Ha tenido dificultad para quedarse o permanecer dormido/a, o ha dormido demasiado",
  "Se ha sentido cansado/a o con poca energía",
  "Sin apetito o ha comido en exceso",
  "Se ha sentido mal con usted mismo/a o que es un fracaso o que ha quedado mal con usted mismo/a o con su familia",
  "Ha tenido dificultad para concentrarse en cosas, tales como leer el periódico o ver la televisión",
  "¿Se ha movido o hablado tan lento que otras personas podrían haberlo notado? o lo contrario - muy inquieto/a o agitado/a que ha estado moviéndose mucho más de lo normal",
  "Pensamientos de que estaría mejor muerto/a, o de lastimarse de alguna manera"
];

const RESPONSE_OPTIONS = [
  { value: 0, label: "Para nada" },
  { value: 1, label: "Varios días" },
  { value: 2, label: "Más de la mitad de los días" },
  { value: 3, label: "Casi todos los días" }
];

interface PHQ9QuestionnaireProps {
  onComplete?: () => void;
}

export function PHQ9Questionnaire({ onComplete }: PHQ9QuestionnaireProps) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentQuestion = Object.keys(responses).length;
  const isComplete = currentQuestion === PHQ9_QUESTIONS.length;
  const progress = (currentQuestion / PHQ9_QUESTIONS.length) * 100;

  const handleResponse = (questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, value) => sum + value, 0);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) return { level: "Mínimo", color: "text-green-600", description: "Síntomas mínimos de depresión" };
    if (score <= 9) return { level: "Leve", color: "text-yellow-600", description: "Depresión leve" };
    if (score <= 14) return { level: "Moderado", color: "text-orange-600", description: "Depresión moderada" };
    if (score <= 19) return { level: "Moderadamente severo", color: "text-red-600", description: "Depresión moderadamente severa" };
    return { level: "Severo", color: "text-red-800", description: "Depresión severa" };
  };

  const handleSubmit = async () => {
    if (!isComplete) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const score = calculateScore();
      const interpretation = getScoreInterpretation(score);

      const { error } = await supabase
        .from('assessments')
        .insert({
          patient_id: user.id,
          psychologist_id: user.id, // Self-assessment, no psychologist assigned
          title: 'PHQ-9 - Cuestionario de Salud del Paciente',
          questions: PHQ9_QUESTIONS,
          responses: {
            answers: responses,
            score,
            interpretation: interpretation.level,
            completedAt: new Date().toISOString()
          },
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Cuestionario completado",
        description: `Puntuación: ${score}/27 - ${interpretation.level}`,
      });

      onComplete?.();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el cuestionario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>PHQ-9 Completado</CardTitle>
          <CardDescription>
            Cuestionario de Salud del Paciente - Resultados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}/27</div>
            <div className={`text-xl font-semibold ${interpretation.color}`}>
              {interpretation.level}
            </div>
            <p className="text-muted-foreground mt-2">
              {interpretation.description}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Este cuestionario es una herramienta de evaluación y no constituye un diagnóstico médico. 
              Si tienes preocupaciones sobre tu salud mental, consulta con un profesional de la salud.
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Resultados'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>PHQ-9 - Cuestionario de Salud del Paciente</CardTitle>
        <CardDescription>
          Durante las últimas 2 semanas, ¿qué tan seguido le han molestado los siguientes problemas?
        </CardDescription>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          Pregunta {currentQuestion + 1} de {PHQ9_QUESTIONS.length}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">
              {PHQ9_QUESTIONS[currentQuestion]}
            </h3>
            
            <RadioGroup
              value={responses[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleResponse(currentQuestion, parseInt(value))}
            >
              {RESPONSE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`option-${option.value}`}
                  />
                  <Label htmlFor={`option-${option.value}`} className="flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                const newResponses = { ...responses };
                delete newResponses[currentQuestion - 1];
                setResponses(newResponses);
              }}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            
            <Button
              onClick={() => {
                if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
                  // Continue to next question
                } else {
                  // This is the last question, show results
                }
              }}
              disabled={responses[currentQuestion] === undefined}
            >
              {currentQuestion === PHQ9_QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}