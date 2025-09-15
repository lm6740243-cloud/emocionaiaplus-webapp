import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  MessageSquare, 
  AlertCircle, 
  Calendar,
  Phone,
  Mail,
  Eye
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
  created_at: string;
}

interface PatientListProps {
  onSelectPatient: (patient: Patient) => void;
}

export const PatientList = ({ onSelectPatient }: PatientListProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Get current user (psychologist)
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // First get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) throw new Error('Psychologist profile not found');

      // Get patients assigned to this psychologist
      const { data, error } = await supabase
        .from('patients')
        .select(`
          id,
          birth_date,
          gender,
          current_conditions,
          emergency_contact_name,
          emergency_contact_phone,
          created_at,
          profiles!patients_profile_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .eq('psychologist_id', psychProfile.id);

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = (data || []).map(patient => ({
        ...patient,
        profile: patient.profiles
      }));
      
      setPatients(transformedData);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pacientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Mis Pacientes ({patients.length})
        </CardTitle>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No se encontraron pacientes" : "No tienes pacientes asignados"}
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 cursor-pointer"
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.profile?.full_name}`} 
                  />
                  <AvatarFallback>
                    {patient.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{patient.profile?.full_name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {patient.profile?.email}
                    </span>
                    {patient.birth_date && (
                      <span>{calculateAge(patient.birth_date)} años</span>
                    )}
                    {patient.gender && (
                      <span className="capitalize">{patient.gender}</span>
                    )}
                  </div>
                  {patient.current_conditions && patient.current_conditions.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {patient.current_conditions.slice(0, 2).map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {patient.current_conditions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{patient.current_conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {patient.profile?.phone && (
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver perfil
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};