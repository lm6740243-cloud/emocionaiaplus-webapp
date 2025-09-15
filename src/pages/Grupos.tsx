import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Plus, 
  Star,
  Globe,
  Video,
  UserPlus,
  Filter,
  Search,
  Heart,
  Brain,
  Shield,
  Zap,
  Coffee,
  Target
} from "lucide-react";
import { JoinGroupDialog } from '@/components/groups/JoinGroupDialog';
import { NearbyGroups } from '@/components/groups/NearbyGroups';
import { LocalResources } from '@/components/groups/LocalResources';

const topicIcons = {
  ansiedad: Brain,
  depresion: Heart,
  duelo: Shield,
  estres: Zap,
  adicciones: Coffee,
  autoestima: Target
};

const topics = [
  { value: 'ansiedad', label: 'Ansiedad', icon: Brain },
  { value: 'depresion', label: 'Depresión', icon: Heart },
  { value: 'duelo', label: 'Duelo', icon: Shield },
  { value: 'estres', label: 'Estrés', icon: Zap },
  { value: 'adicciones', label: 'Adicciones', icon: Coffee },
  { value: 'autoestima', label: 'Autoestima', icon: Target }
];

const Grupos = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    province: '',
    modality: '',
    topic: '',
    schedule: ''
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const form = useForm();

  // Fetch user profile and groups
  useEffect(() => {
    fetchUserProfile();
    fetchGroups();
  }, []);

  // Filter groups when filters change
  useEffect(() => {
    filterGroups();
  }, [groups, filters]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los grupos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = [...groups];

    // Text search
    if (filters.search) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        group.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(group => 
        group.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Province filter
    if (filters.province) {
      filtered = filtered.filter(group => 
        group.region?.toLowerCase().includes(filters.province.toLowerCase())
      );
    }

    // Modality filter
    if (filters.modality) {
      filtered = filtered.filter(group => 
        group.meeting_type === filters.modality
      );
    }

    // Topic filter
    if (filters.topic) {
      filtered = filtered.filter(group => 
        group.tematicas && group.tematicas.includes(filters.topic)
      );
    }

    // Sort by user location proximity if available
    if (userProfile?.city) {
      filtered.sort((a, b) => {
        const aLocal = a.city?.toLowerCase() === userProfile.city.toLowerCase();
        const bLocal = b.city?.toLowerCase() === userProfile.city.toLowerCase();
        if (aLocal && !bLocal) return -1;
        if (!aLocal && bLocal) return 1;
        return 0;
      });
    }

    setFilteredGroups(filtered);
  };

  const handleCreateGroup = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('support_groups')
        .insert({
          name: data.name,
          description: data.description,
          condition_type: data.topic,
          meeting_type: data.modality,
          city: data.city,
          region: data.province,
          country: 'Ecuador',
          whatsapp_link: data.whatsapp_link,
          owner_id: user.id
        });

      if (error) throw error;

      toast({
        title: "¡Grupo creado exitosamente!",
        description: "Tu grupo ha sido creado y estará disponible para otros usuarios"
      });

      setShowCreateDialog(false);
      form.reset();
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el grupo. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debe iniciar sesión para unirse a un grupo",
          variant: "destructive"
        });
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('grupo_miembros')
        .select('*')
        .eq('grupo_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        // Already a member, navigate to chat
        navigate(`/grupos/${groupId}`);
        return;
      }

      // Get user's profile for default alias
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      const defaultAlias = profile?.full_name?.split(' ')[0] || 'Miembro';

      // Join the group
      const { error } = await supabase
        .from('grupo_miembros')
        .insert({
          grupo_id: groupId,
          user_id: user.id,
          alias: defaultAlias,
          rol: 'miembro'
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Error",
            description: "Ya eres miembro de este grupo",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "¡Te has unido al grupo!",
        description: "Ahora puedes participar en las conversaciones"
      });

      // Navigate to the chat
      navigate(`/grupos/${groupId}`);
      
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "No se pudo unir al grupo. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const getTopicIcon = (topic) => {
    const IconComponent = topicIcons[topic] || Brain;
    return <IconComponent className="h-4 w-4" />;
  };

  const getModalityBadge = (modality) => {
    if (modality === 'virtual' || modality === 'online') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Video className="h-3 w-3" />
          Virtual
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        Presencial
      </Badge>
    );
  };

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

        {/* Tabs for different sections */}
        <Tabs defaultValue="nearby" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="nearby">Cerca de Mí</TabsTrigger>
              <TabsTrigger value="directory">Directorio</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>
          </div>

          {/* Nearby Groups Tab */}
          <TabsContent value="nearby">
            <NearbyGroups 
              userCity={userProfile?.city} 
              userProvince={userProfile?.province} 
            />
          </TabsContent>

          {/* Local Resources Tab */}
          <TabsContent value="resources">
            <LocalResources 
              userCity={userProfile?.city} 
              userProvince={userProfile?.province} 
            />
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory">
            {/* Search and Filters */}
            <Card className="bg-gradient-card shadow-soft">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar grupos por nombre o descripción..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las ciudades</SelectItem>
                        <SelectItem value="quito">Quito</SelectItem>
                        <SelectItem value="guayaquil">Guayaquil</SelectItem>
                        <SelectItem value="cuenca">Cuenca</SelectItem>
                        <SelectItem value="ambato">Ambato</SelectItem>
                        <SelectItem value="machala">Machala</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.province} onValueChange={(value) => setFilters(prev => ({ ...prev, province: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las provincias</SelectItem>
                        <SelectItem value="pichincha">Pichincha</SelectItem>
                        <SelectItem value="guayas">Guayas</SelectItem>
                        <SelectItem value="azuay">Azuay</SelectItem>
                        <SelectItem value="tungurahua">Tungurahua</SelectItem>
                        <SelectItem value="el oro">El Oro</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.modality} onValueChange={(value) => setFilters(prev => ({ ...prev, modality: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="online">Virtual</SelectItem>
                        <SelectItem value="presencial">Presencial</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filters.topic} onValueChange={(value) => setFilters(prev => ({ ...prev, topic: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Temática" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las temáticas</SelectItem>
                        {topics.map(topic => (
                          <SelectItem key={topic.value} value={topic.value}>
                            <div className="flex items-center gap-2">
                              <topic.icon className="h-4 w-4" />
                              {topic.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filters.schedule} onValueChange={(value) => setFilters(prev => ({ ...prev, schedule: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Horario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los horarios</SelectItem>
                        <SelectItem value="morning">Mañana (9:00-12:00)</SelectItem>
                        <SelectItem value="afternoon">Tarde (12:00-18:00)</SelectItem>
                        <SelectItem value="evening">Noche (18:00-21:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{filteredGroups.length}</div>
                  <p className="text-sm text-muted-foreground">Grupos disponibles</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {filteredGroups.filter(g => g.meeting_type === 'online').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Grupos virtuales</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {filteredGroups.filter(g => g.meeting_type === 'presencial').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Grupos presenciales</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {userProfile?.city ? filteredGroups.filter(g => g.city?.toLowerCase() === userProfile.city.toLowerCase()).length : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">En tu ciudad</p>
                </CardContent>
              </Card>
            </div>

            {/* Groups Directory */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Directorio de Grupos de Apoyo</h2>
                <Button 
                  onClick={() => navigate('/grupos/crear')}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear grupo
                </Button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="shadow-card">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <Card key={group.id} className="shadow-card hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {group.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getModalityBadge(group.meeting_type)}
                                {userProfile?.city && group.city?.toLowerCase() === userProfile.city.toLowerCase() && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    Tu ciudad
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <CardDescription className="text-sm line-clamp-3">
                            {group.description || "Grupo de apoyo mutuo para compartir experiencias y encontrar apoyo en un ambiente seguro."}
                          </CardDescription>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{group.city || 'Ciudad no especificada'}, {group.region || group.country}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{group.current_members || 0} miembros</span>
                            </div>
                            
                            {group.whatsapp_link && (
                              <div className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>WhatsApp disponible</span>
                              </div>
                            )}
                          </div>
                          
                          {group.tematicas && group.tematicas.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {group.tematicas.slice(0, 3).map((topic, index) => (
                                <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                                  {getTopicIcon(topic)}
                                  {topics.find(t => t.value === topic)?.label || topic}
                                </Badge>
                              ))}
                              {group.tematicas.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{group.tematicas.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <JoinGroupDialog
                              group={group}
                              onJoinSuccess={() => handleJoinGroup(group.id)}
                            >
                              <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Unirse al grupo
                              </Button>
                            </JoinGroupDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <Card className="bg-gradient-card">
                        <CardContent className="py-12 text-center">
                          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">No se encontraron grupos</h3>
                          <p className="text-muted-foreground mb-6">
                            No hay grupos que coincidan con tus filtros de búsqueda.
                          </p>
                          <div className="space-y-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setFilters({
                                search: '',
                                city: '',
                                province: '',
                                modality: '',
                                topic: '',
                                schedule: ''
                              })}
                            >
                              Limpiar filtros
                            </Button>
                            <div className="text-sm text-muted-foreground">o</div>
                            <Button 
                              onClick={() => navigate('/grupos/crear')}
                              className="bg-gradient-primary hover:shadow-glow"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Crear un nuevo grupo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Grupos;