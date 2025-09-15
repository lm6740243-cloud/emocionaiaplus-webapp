import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AssessmentData {
  date: string;
  phq9_score?: number;
  gad7_score?: number;
  phq9_level?: string;
  gad7_level?: string;
}

const chartConfig = {
  phq9_score: {
    label: "PHQ-9 (Depresión)",
    color: "hsl(var(--chart-1))",
  },
  gad7_score: {
    label: "GAD-7 (Ansiedad)",
    color: "hsl(var(--chart-2))",
  },
};

export function ProgressChart() {
  const [data, setData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessmentData();
  }, []);

  const fetchAssessmentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data: assessments, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('patient_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group assessments by date and type
      const groupedData: Record<string, AssessmentData> = {};

      assessments?.forEach((assessment) => {
        const date = format(new Date(assessment.created_at), 'yyyy-MM-dd');
        
        if (!groupedData[date]) {
          groupedData[date] = { date };
        }

        const responses = assessment.responses as any;
        
        if (assessment.title.includes('PHQ-9')) {
          groupedData[date].phq9_score = responses?.score || 0;
          groupedData[date].phq9_level = responses?.interpretation || '';
        } else if (assessment.title.includes('GAD-7')) {
          groupedData[date].gad7_score = responses?.score || 0;
          groupedData[date].gad7_level = responses?.interpretation || '';
        }
      });

      const chartData = Object.values(groupedData).map(item => ({
        ...item,
        displayDate: format(new Date(item.date), 'dd MMM', { locale: es })
      }));

      setData(chartData);
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      setError('No se pudieron cargar los datos de evaluación');
    } finally {
      setLoading(false);
    }
  };

  const getLatestScores = () => {
    if (data.length === 0) return null;
    
    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;
    
    return { latest, previous };
  };

  const calculateTrend = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous) return null;
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { change, percentage: parseFloat(percentage) };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Cargando datos de progreso...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Evaluaciones</CardTitle>
          <CardDescription>
            Progreso en cuestionarios PHQ-9 y GAD-7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            {error || 'No hay datos de evaluaciones disponibles. Completa algunos cuestionarios para ver tu progreso.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const scores = getLatestScores();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de Evaluaciones</CardTitle>
        <CardDescription>
          Progreso en cuestionarios PHQ-9 (Depresión) y GAD-7 (Ansiedad)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Latest Scores Summary */}
          {scores && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scores.latest.phq9_score !== undefined && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">PHQ-9 (Depresión)</div>
                  <div className="text-2xl font-bold">{scores.latest.phq9_score}/27</div>
                  <div className="text-sm text-blue-800">{scores.latest.phq9_level}</div>
                  {scores.previous?.phq9_score && (
                    <div className="text-xs text-blue-600 mt-1">
                      {(() => {
                        const trend = calculateTrend(scores.latest.phq9_score, scores.previous.phq9_score);
                        return trend ? (
                          <span className={trend.change < 0 ? 'text-green-600' : 'text-red-600'}>
                            {trend.change < 0 ? '↓' : '↑'} {Math.abs(trend.change)} puntos
                          </span>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
              
              {scores.latest.gad7_score !== undefined && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">GAD-7 (Ansiedad)</div>
                  <div className="text-2xl font-bold">{scores.latest.gad7_score}/21</div>
                  <div className="text-sm text-green-800">{scores.latest.gad7_level}</div>
                  {scores.previous?.gad7_score && (
                    <div className="text-xs text-green-600 mt-1">
                      {(() => {
                        const trend = calculateTrend(scores.latest.gad7_score, scores.previous.gad7_score);
                        return trend ? (
                          <span className={trend.change < 0 ? 'text-green-600' : 'text-red-600'}>
                            {trend.change < 0 ? '↓' : '↑'} {Math.abs(trend.change)} puntos
                          </span>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Progress Chart */}
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {data.some(d => d.phq9_score !== undefined) && (
                  <Line
                    type="monotone"
                    dataKey="phq9_score"
                    stroke="var(--color-phq9_score)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                )}
                {data.some(d => d.gad7_score !== undefined) && (
                  <Line
                    type="monotone"
                    dataKey="gad7_score"
                    stroke="var(--color-gad7_score)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="text-xs text-muted-foreground">
            * Puntuaciones más bajas indican menor sintomatología. 
            Los cuestionarios son herramientas de evaluación, no diagnósticos médicos.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}