import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  User,
  BookOpen
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
  patient_name?: string;
}

interface Resource {
  id: string;
  title: string;
  description?: string;
  resource_type: string;
  url?: string;
  content?: string;
}

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskForm, setTaskForm] = useState({
    patient_id: "",
    title: "",
    description: "",
    priority: "medium",
    due_date: ""
  });
  const [resourceForm, setResourceForm] = useState({
    patient_id: "",
    resource_id: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchResources();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('psychologist_id', psychProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mock patient names for now
      const transformedData = (data || []).map(task => ({
        ...task,
        patient_name: 'Paciente'
      }));

      setTasks(transformedData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Error al cargar las tareas",
        variant: "destructive"
      });
    }
  };

  const fetchResources = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) return;

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('psychologist_id', psychProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Error al cargar los recursos",
        variant: "destructive"
      });
    }
  };

  const createTask = async () => {
    if (!taskForm.patient_id || !taskForm.title) {
      toast({
        title: "Error",
        description: "Completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // Get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) throw new Error('Psychologist profile not found');

      const { error } = await supabase
        .from('tasks')
        .insert({
          psychologist_id: psychProfile.id,
          patient_id: taskForm.patient_id,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          due_date: taskForm.due_date ? new Date(taskForm.due_date).toISOString() : null
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Tarea asignada correctamente"
      });

      setIsTaskDialogOpen(false);
      setTaskForm({
        patient_id: "",
        title: "",
        description: "",
        priority: "medium",
        due_date: ""
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Error al asignar la tarea",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const assignResource = async () => {
    if (!resourceForm.patient_id || !resourceForm.resource_id) {
      toast({
        title: "Error",
        description: "Selecciona un paciente y un recurso",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // Get psychologist profile
      const { data: psychProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .single();

      if (!psychProfile) throw new Error('Psychologist profile not found');

      const { error } = await supabase
        .from('patient_resources')
        .insert({
          psychologist_id: psychProfile.id,
          patient_id: resourceForm.patient_id,
          resource_id: resourceForm.resource_id,
          notes: resourceForm.notes
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso asignado correctamente"
      });

      setIsResourceDialogOpen(false);
      setResourceForm({
        patient_id: "",
        resource_id: "",
        notes: ""
      });
    } catch (error) {
      console.error('Error assigning resource:', error);
      toast({
        title: "Error",
        description: "Error al asignar el recurso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'in_progress': return 'default';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return BookOpen;
      case 'exercise': return CheckSquare;
      case 'worksheet': return BookOpen;
      case 'audio': return BookOpen;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Tareas y Recursos</h2>
        <div className="flex gap-2">
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-1" />
                Asignar Tarea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Nueva Tarea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Paciente *</label>
                  <Select 
                    value={taskForm.patient_id} 
                    onValueChange={(value) => setTaskForm({...taskForm, patient_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient1">María González</SelectItem>
                      <SelectItem value="patient2">Carlos Ruiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Título *</label>
                  <Input
                    placeholder="Título de la tarea"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    placeholder="Descripción detallada de la tarea"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select 
                    value={taskForm.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => setTaskForm({...taskForm, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Fecha límite</label>
                  <Input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={createTask} disabled={loading} className="flex-1">
                    {loading ? "Asignando..." : "Asignar Tarea"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-1" />
                Asignar Recurso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Recurso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Paciente *</label>
                  <Select 
                    value={resourceForm.patient_id} 
                    onValueChange={(value) => setResourceForm({...resourceForm, patient_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient1">María González</SelectItem>
                      <SelectItem value="patient2">Carlos Ruiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Recurso *</label>
                  <Select 
                    value={resourceForm.resource_id} 
                    onValueChange={(value) => setResourceForm({...resourceForm, resource_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar recurso" />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.title} ({resource.resource_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Notas</label>
                  <Textarea
                    placeholder="Notas adicionales sobre el recurso"
                    value={resourceForm.notes}
                    onChange={(e) => setResourceForm({...resourceForm, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={assignResource} disabled={loading} className="flex-1">
                    {loading ? "Asignando..." : "Asignar Recurso"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tasks Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Tareas Asignadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay tareas asignadas
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Alta' : 
                           task.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status === 'pending' ? 'Pendiente' :
                           task.status === 'in_progress' ? 'En progreso' : 'Completada'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{task.patient_name}</span>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Fecha límite: {new Date(task.due_date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Mis Recursos ({resources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes recursos creados
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => {
                const IconComponent = getResourceIcon(resource.resource_type);
                return (
                  <div key={resource.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {resource.resource_type}
                        </Badge>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {resource.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};