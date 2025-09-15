import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Play, 
  Download, 
  Heart, 
  Brain, 
  Headphones,
  FileText,
  Video,
  Lightbulb,
  Star
} from "lucide-react";

const Recursos = () => {
  const categories = [
    { id: "articulos", name: "Artículos", icon: FileText, count: 45 },
    { id: "videos", name: "Videos", icon: Video, count: 23 },
    { id: "audios", name: "Audios", icon: Headphones, count: 18 },
    { id: "ejercicios", name: "Ejercicios", icon: Brain, count: 32 },
  ];

  const featuredResources = [
    {
      title: "Técnicas de Respiración para la Ansiedad",
      type: "Video",
      duration: "12 min",
      rating: 4.8,
      category: "Ansiedad",
      description: "Aprende técnicas efectivas de respiración para controlar los episodios de ansiedad."
    },
    {
      title: "Meditación Guiada para Principiantes",
      type: "Audio",
      duration: "20 min",
      rating: 4.9,
      category: "Mindfulness",
      description: "Una introducción completa a la meditación con ejercicios prácticos."
    },
    {
      title: "Entendiendo la Depresión",
      type: "Artículo",
      duration: "8 min lectura",
      rating: 4.7,
      category: "Depresión",
      description: "Guía completa sobre los síntomas, causas y tratamientos de la depresión."
    },
    {
      title: "Ejercicios de Autoestima",
      type: "Ejercicio",
      duration: "15 min",
      rating: 4.6,
      category: "Autoestima",
      description: "Actividades prácticas para fortalecer tu autoestima y confianza personal."
    },
  ];

  const popularTopics = [
    "Ansiedad", "Depresión", "Estrés", "Autoestima", "Mindfulness", 
    "Relaciones", "Sueño", "Trauma", "Duelo", "Adicciones"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Biblioteca de Recursos
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre herramientas, guías y contenido especializado para tu bienestar emocional
          </p>
        </div>

        {/* Search Bar */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar recursos, temas o técnicas..."
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <category.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-muted-foreground text-sm">{category.count} recursos</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="destacados" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="destacados">Destacados</TabsTrigger>
            <TabsTrigger value="recientes">Recientes</TabsTrigger>
            <TabsTrigger value="populares">Populares</TabsTrigger>
          </TabsList>

          <TabsContent value="destacados" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredResources.map((resource, index) => (
                <Card key={index} className="group hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge variant="secondary">{resource.category}</Badge>
                        <CardTitle className="group-hover:text-primary transition-colors duration-300">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {resource.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {resource.type === 'Video' && <Video className="h-4 w-4" />}
                          {resource.type === 'Audio' && <Headphones className="h-4 w-4" />}
                          {resource.type === 'Artículo' && <FileText className="h-4 w-4" />}
                          {resource.type === 'Ejercicio' && <Brain className="h-4 w-4" />}
                          {resource.type}
                        </span>
                        <span>{resource.duration}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Guardar
                        </Button>
                        <Button size="sm" className="bg-gradient-primary">
                          <Play className="h-4 w-4 mr-1" />
                          {resource.type === 'Artículo' ? 'Leer' : 'Reproducir'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recientes" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Contenido Reciente</CardTitle>
                <CardDescription>Últimos recursos añadidos a la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Contenido reciente en desarrollo...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="populares" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Más Populares</CardTitle>
                <CardDescription>Los recursos más valorados por la comunidad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Contenido popular en desarrollo...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Popular Topics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Temas Populares
            </CardTitle>
            <CardDescription>
              Explora los temas más buscados en nuestra biblioteca
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((topic, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recursos;