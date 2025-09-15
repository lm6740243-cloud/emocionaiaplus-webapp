import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WearableIntegration } from "./WearableIntegration";
import { RecommendationEngine } from "./RecommendationEngine";
import { CalendarIntegration } from "./CalendarIntegration";
import { Activity, Lightbulb, Calendar } from "lucide-react";

export const ExternalDataDashboard = () => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integración de Datos Externos</h2>
        <p className="text-muted-foreground">
          Conecta tus dispositivos y servicios para un seguimiento integral de tu bienestar
        </p>
      </div>
      
      <Tabs defaultValue="wearables" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wearables" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dispositivos Wearables
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recomendaciones
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wearables" className="space-y-6">
          <WearableIntegration />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationEngine />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};