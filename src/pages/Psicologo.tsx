import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientList } from "@/components/psychologist/PatientList";
import { AppointmentScheduler } from "@/components/psychologist/AppointmentScheduler";
import { TaskManager } from "@/components/psychologist/TaskManager";
import { QuickChat } from "@/components/psychologist/QuickChat";
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare,
  AlertCircle,
  CheckSquare
} from "lucide-react";

const Psicologo = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const todayAppointments = [
    { name: "María González", time: "09:00", status: "confirmada", type: "Primera consulta" },
    { name: "Carlos Ruiz", time: "10:30", status: "pendiente", type: "Seguimiento" },
    { name: "Ana López", time: "14:00", status: "confirmada", type: "Terapia grupal" },
    { name: "Roberto Silva", time: "16:00", status: "cancelada", type: "Consulta regular" },
  ];

  const patientStats = {
    total: 45,
    active: 32,
    newThisWeek: 3,
    criticalAlerts: 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel Profesional</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus pacientes y sesiones de manera eficiente
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <UserCheck className="h-4 w-4 mr-1" />
              Dr. Profesional
            </Badge>
            {patientStats.criticalAlerts > 0 && (
              <Badge variant="destructive" className="text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {patientStats.criticalAlerts} Alertas
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{patientStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {patientStats.active} activos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 confirmadas, 1 pendiente
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos esta semana</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{patientStats.newThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +50% respecto semana anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{patientStats.criticalAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Citas de Hoy
              </CardTitle>
              <CardDescription>
                Agenda del {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.name}`} />
                      <AvatarFallback>{appointment.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </p>
                      <Badge 
                        variant={
                          appointment.status === 'confirmada' ? 'default' :
                          appointment.status === 'pendiente' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Herramientas y funciones principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start bg-gradient-primary hover:shadow-glow transition-all duration-300" 
                size="lg"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Nuevo paciente
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all duration-300" 
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar cita
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all duration-300" 
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar reporte
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all duration-300" 
                size="lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensajes pacientes
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground transition-all duration-300" 
                size="lg"
              >
                <Users className="h-4 w-4 mr-2" />
                Gestionar grupos
              </Button>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="patients">
            <PatientList onSelectPatient={setSelectedPatient} />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentScheduler />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>

          <TabsContent value="chat">
            <QuickChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Psicologo;