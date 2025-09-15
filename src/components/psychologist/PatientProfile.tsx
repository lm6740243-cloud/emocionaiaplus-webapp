import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Heart,
  MessageSquare,
  FileText,
  AlertTriangle,
  Calendar,
  Phone,
  MapPin,
  Save
} from "lucide-react";

interface Patient {
  id: string;
  profile: {
    full_name: string;
    email: string;
    phone?: string;
  };
  birth_date?: string;
  gender?: string;
  current_conditions?: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  address?: string;
  clinical_history?: string;
  created_at: string;
}

interface MoodEntry {
  id: string;
  mood_level: number;
  emotions: string[];
  notes?: string;
  created_at: string;
}

interface RiskAlert {
  id: string;
  mensaje_detectado: string;
  palabras_clave: string[];
  timestamp: string;
  profesional_notificado: boolean;
  atendida: boolean;
}

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
}

export const PatientProfile = ({ patient, onBack }: PatientProfileProps) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [privateNotes, setPrivateNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatientData();
  }, [patient.id]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Mock data for now since we need proper user relationships
      setMoodHistory([
        {
          id: "1",
          mood_level: 7,
          emotions: ["happy", "energetic"],
          notes: "Buen día en general",
          created_at: new Date().toISOString()
        }
      ]);
      
      setRiskAlerts([]);
      setPrivateNotes("");

    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast({
        title: "Error",
        description: "Error al cargar datos del paciente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivateNotes = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('private_notes')
        .upsert({
          patient_id: patient.id,
          psychologist_id: user.user.id,
          content: privateNotes
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Notas privadas guardadas correctamente"
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Error al guardar las notas",
        variant: "destructive"
      });
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getMoodColor = (level: number) => {
    if (level <= 2) return "text-red-500";
    if (level <= 4) return "text-orange-500";
    if (level <= 6) return "text-yellow-500";
    if (level <= 8) return "text-green-500";
    return "text-emerald-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                ← Volver
              </Button>
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.profile?.full_name}`} />
                <AvatarFallback className="text-lg">
                  {patient.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{patient.profile?.full_name}</h2>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{patient.profile?.email}</span>
                  {patient.birth_date && (
                    <span>{calculateAge(patient.birth_date)} años</span>
                  )}
                  {patient.gender && (
                    <span className="capitalize">{patient.gender}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat rápido
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-1" />
                Agendar cita
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="mood">Historial de Ánimo</TabsTrigger>
          <TabsTrigger value="alerts">Alertas de Riesgo</TabsTrigger>
          <TabsTrigger value="notes">Notas Clínicas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.profile?.phone || "No disponible"}</span>
                </div>
                {patient.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.address}</span>
                  </div>
                )}
                <div>
                  <h5 className="font-medium mb-2">Condiciones Actuales</h5>
                  {patient.current_conditions && patient.current_conditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.current_conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No especificadas</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Contacto de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">{patient.emergency_contact_name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({patient.emergency_contact_relation})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.emergency_contact_phone}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical History */}
          {patient.clinical_history && (
            <Card>
              <CardHeader>
                <CardTitle>Historial Clínico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{patient.clinical_history}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Historial de Estados de Ánimo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : moodHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay registros de ánimo disponibles
                </div>
              ) : (
                <div className="space-y-4">
                  {moodHistory.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl ${getMoodColor(entry.mood_level)}`}>
                            {entry.mood_level}/10
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                      </div>
                      {entry.emotions.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {entry.emotions.map((emotion, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alertas de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {riskAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay alertas de riesgo registradas
                </div>
              ) : (
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-red-900">Mensaje Detectado</p>
                          <p className="text-sm text-red-800 mt-1">{alert.mensaje_detectado}</p>
                        </div>
                        <Badge variant={alert.atendida ? "secondary" : "destructive"}>
                          {alert.atendida ? "Atendida" : "Pendiente"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-red-700">
                        <span>
                          {new Date(alert.timestamp).toLocaleString('es-ES')}
                        </span>
                        {alert.palabras_clave.length > 0 && (
                          <div className="flex gap-1">
                            <span>Palabras clave:</span>
                            {alert.palabras_clave.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas Clínicas Privadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Escribe tus notas clínicas privadas aquí..."
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button onClick={savePrivateNotes}>
                  <Save className="h-4 w-4 mr-1" />
                  Guardar Notas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};