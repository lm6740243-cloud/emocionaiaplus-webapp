import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Music, Headphones, Download, Play, Clock, Star } from "lucide-react";

const LibraryCard = () => {
  const [selectedTab, setSelectedTab] = useState("pdfs");

  const pdfs = [
    {
      title: "Guía de Mindfulness para Principiantes",
      author: "Dr. María González",
      pages: 24,
      category: "Mindfulness",
      rating: 4.8,
      downloaded: true
    },
    {
      title: "Técnicas de Respiración Avanzadas",
      author: "Centro de Bienestar",
      pages: 18,
      category: "Respiración",
      rating: 4.6,
      downloaded: false
    },
    {
      title: "Manejo de la Ansiedad en el Día a Día",
      author: "Dra. Ana Ruiz",
      pages: 32,
      category: "Ansiedad",
      rating: 4.9,
      downloaded: true
    }
  ];

  const audios = [
    {
      title: "Meditación de la Calma Interior",
      duration: "15:30",
      category: "Meditación",
      type: "Guiado",
      rating: 4.7,
      downloaded: true
    },
    {
      title: "Sonidos de la Naturaleza - Bosque",
      duration: "30:00",
      category: "Relajación",
      type: "Ambiental",
      rating: 4.5,
      downloaded: false
    },
    {
      title: "Respiración Consciente - Sesión Corta",
      duration: "8:45",
      category: "Respiración",
      type: "Ejercicio",
      rating: 4.8,
      downloaded: true
    }
  ];

  const audiobooks = [
    {
      title: "El Poder del Ahora",
      author: "Eckhart Tolle",
      duration: "7h 37min",
      progress: 45,
      category: "Crecimiento Personal",
      rating: 4.9
    },
    {
      title: "Inteligencia Emocional",
      author: "Daniel Goleman",
      duration: "12h 15min",
      progress: 0,
      category: "Psicología",
      rating: 4.7
    }
  ];

  const readings = [
    {
      title: "Artículo: Cómo Manejar el Estrés Laboral",
      author: "Revista Bienestar",
      readTime: "8 min",
      category: "Estrés",
      type: "Artículo"
    },
    {
      title: "Blog: 10 Técnicas de Relajación Rápida",
      author: "Centro Mindful",
      readTime: "5 min",
      category: "Relajación",
      type: "Blog"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Mindfulness": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Respiración": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Ansiedad": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "Meditación": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      "Relajación": "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
      "Estrés": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:shadow-card transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Biblioteca de Recursos
        </CardTitle>
        <CardDescription>
          Accede a contenido educativo y terapéutico personalizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="pdfs" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              PDFs
            </TabsTrigger>
            <TabsTrigger value="audios" className="text-xs">
              <Music className="h-3 w-3 mr-1" />
              Audios
            </TabsTrigger>
            <TabsTrigger value="audiobooks" className="text-xs">
              <Headphones className="h-3 w-3 mr-1" />
              Audiolibros
            </TabsTrigger>
            <TabsTrigger value="readings" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Lecturas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdfs" className="space-y-3 mt-4">
            {pdfs.map((pdf, index) => (
              <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-foreground">{pdf.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">por {pdf.author}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <Badge variant="outline" className={getCategoryColor(pdf.category)}>
                        {pdf.category}
                      </Badge>
                      <span className="text-muted-foreground">{pdf.pages} páginas</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{pdf.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {pdf.downloaded ? <BookOpen className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="audios" className="space-y-3 mt-4">
            {audios.map((audio, index) => (
              <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-foreground">{audio.title}</h5>
                    <div className="flex items-center gap-3 text-xs mt-2">
                      <Badge variant="outline" className={getCategoryColor(audio.category)}>
                        {audio.category}
                      </Badge>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {audio.duration}
                      </span>
                      <span className="text-muted-foreground">{audio.type}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{audio.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {audio.downloaded ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="audiobooks" className="space-y-3 mt-4">
            {audiobooks.map((book, index) => (
              <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-foreground">{book.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">por {book.author}</p>
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <Badge variant="outline" className={getCategoryColor(book.category)}>
                        {book.category}
                      </Badge>
                      <span className="text-muted-foreground">{book.duration}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                    {book.progress > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 bg-muted rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full" 
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground">{book.progress}%</span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="readings" className="space-y-3 mt-4">
            {readings.map((reading, index) => (
              <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-foreground">{reading.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">{reading.author}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <Badge variant="outline" className={getCategoryColor(reading.category)}>
                        {reading.category}
                      </Badge>
                      <span className="text-muted-foreground">{reading.readTime} lectura</span>
                      <Badge variant="secondary" className="text-xs">
                        {reading.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Estadísticas de la biblioteca */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-primary font-semibold text-sm">12</div>
            <div className="text-xs text-muted-foreground">Recursos guardados</div>
          </div>
          <div className="text-center">
            <div className="text-primary font-semibold text-sm">3.2h</div>
            <div className="text-xs text-muted-foreground">Tiempo de estudio</div>
          </div>
          <div className="text-center">
            <div className="text-primary font-semibold text-sm">85%</div>
            <div className="text-xs text-muted-foreground">Completado</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LibraryCard;