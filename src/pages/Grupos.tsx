import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Plus, 
  Star,
  Globe,
  Lock,
  Video,
  UserPlus
} from "lucide-react";

const Grupos = () => {
  const myGroups = [
    {
      name: "Ansiedad y Mindfulness",
      members: 12,
      nextSession: "Hoy 18:00",
      type: "Presencial",
      status: "active",
      facilitator: "Dr. María González",
      location: "Sala A - Centro EmocionalIA+"
    },
    {
      name: "Apoyo en Duelo",
      members: 8,
      nextSession: "Mañana 16:30",
      type: "Virtual",
      status: "active",
      facilitator: "Lic. Carlos Ruiz",
      location: "Zoom"
    },
  ];

  const availableGroups = [
    {
      name: "Gestión del Estrés Laboral",
      description: "Grupo enfocado en técnicas para manejar el estrés en el ambiente de trabajo",
      members: 15,
      maxMembers: 18,
      schedule: "Martes 19:00",
      type: "Híbrido",
      facilitator: "Lic. Ana López",
      rating: 4.8,
      tags: ["Estrés", "Trabajo", "Técnicas"],
      nextStart: "15 de Enero"
    },
    {
      name: "Autoestima y Confianza",
      description: "Desarrolla una imagen positiva de ti mismo y fortalece tu confianza personal",
      members: 10,
      maxMembers: 12,
      schedule: "Jueves 17:30",
      type: "Presencial",
      facilitator: "Dr. Roberto Silva",
      rating: 4.9,
      tags: ["Autoestima", "Confianza", "Crecimiento"],
      nextStart: "22 de Enero"
    },
    {
      name: "Mindfulness para Principiantes",
      description: "Introducción a la práctica del mindfulness y meditación consciente",
      members: 8,
      maxMembers: 15,
      schedule: "Sábados 10:00",
      type: "Virtual",
      facilitator: "Lic. Elena Martín",
      rating: 4.7,
      tags: ["Mindfulness", "Meditación", "Principiantes"],
      nextStart: "20 de Enero"
    },
  ];

  const upcomingSessions = [
    {
      group: "Ansiedad y Mindfulness",
      time: "18:00 - 19:30",
      date: "Hoy",
      type: "Presencial",
      topic: "Técnicas de respiración consciente"
    },
    {
      group: "Apoyo en Duelo",
      time: "16:30 - 18:00",
      date: "Mañana",
      type: "Virtual",
      topic: "Procesando las etapas del duelo"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Grupos de Apoyo
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conecta con personas que comparten experiencias similares en un ambiente seguro y de apoyo
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">2</div>
              <p className="text-sm text-muted-foreground">Grupos activos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-sm text-muted-foreground">Sesiones esta semana</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">24</div>
              <p className="text-sm text-muted-foreground">Mensajes nuevos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">4.8</div>
              <p className="text-sm text-muted-foreground">Valoración promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="mis-grupos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mis-grupos">Mis Grupos</TabsTrigger>
            <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
            <TabsTrigger value="sesiones">Próximas Sesiones</TabsTrigger>
          </TabsList>

          {/* My Groups */}
          <TabsContent value="mis-grupos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mis Grupos Activos</h2>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Crear grupo
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myGroups.map((group, index) => (
                <Card key={index} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4" />
                          {group.members} miembros
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={group.type === 'Virtual' ? 'secondary' : 'default'}
                        className="flex items-center gap-1"
                      >
                        {group.type === 'Virtual' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {group.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Facilitador:</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.facilitator}`} />
                          <AvatarFallback>{group.facilitator.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{group.facilitator}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {group.nextSession}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {group.location}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat grupal
                      </Button>
                      <Button variant="outline">
                        Ver detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Available Groups */}
          <TabsContent value="disponibles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Grupos Disponibles</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Virtual
                </Button>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Presencial
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableGroups.map((group, index) => (
                <Card key={index} className="group hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {group.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{group.type}</Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {group.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{group.description}</CardDescription>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Participantes:</span>
                        <span>{group.members}/{group.maxMembers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Horario:</span>
                        <span>{group.schedule}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Facilitador:</span>
                        <span>{group.facilitator}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Inicia:</span>
                        <span className="font-medium text-primary">{group.nextStart}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        disabled={group.members >= group.maxMembers}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {group.members >= group.maxMembers ? 'Completo' : 'Unirse'}
                      </Button>
                      <Button variant="outline" size="sm">
                        Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Sessions */}
          <TabsContent value="sesiones" className="space-y-6">
            <h2 className="text-2xl font-bold">Próximas Sesiones</h2>
            
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{session.group}</h3>
                          <Badge variant={session.type === 'Virtual' ? 'secondary' : 'default'}>
                            {session.type === 'Virtual' ? <Video className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                            {session.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          <strong>Tema:</strong> {session.topic}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          Recordar
                        </Button>
                        <Button className="bg-gradient-primary">
                          {session.type === 'Virtual' ? 'Unirse' : 'Ver ubicación'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Grupos;