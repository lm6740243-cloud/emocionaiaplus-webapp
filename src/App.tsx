import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Paciente from "./pages/Paciente";
import Psicologo from "./pages/Psicologo";
import Configuracion from "./pages/Configuracion";
import Evaluaciones from "./pages/Evaluaciones";
import Recursos from "./pages/Recursos";
import Grupos from "./pages/Grupos";
import CrearGrupo from "./pages/CrearGrupo";
import AIChatPage from "./pages/AIChat";
import Suscripcion from "./pages/Suscripcion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen bg-background transition-colors duration-500">
              <Navigation />
              <main className="flex-1 transition-all duration-300">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/paciente" element={<Paciente />} />
                  <Route path="/psicologo" element={<Psicologo />} />
                  <Route path="/configuracion" element={<Configuracion />} />
                  <Route path="/recursos" element={<Recursos />} />
                  <Route path="/grupos" element={<Grupos />} />
                  <Route path="/grupos/crear" element={<CrearGrupo />} />
                  <Route path="/evaluaciones" element={<Evaluaciones />} />
                  <Route path="/ai-chat" element={<AIChatPage />} />
                  <Route path="/suscripcion" element={<Suscripcion />} />
                  <Route path="/subscription-success" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-2xl font-bold text-green-600 mb-4">¡Suscripción Exitosa!</h1><p className="text-muted-foreground mb-4">Gracias por suscribirte a EmocionalIA+</p><button onClick={() => window.location.href = '/'} className="bg-primary text-primary-foreground px-4 py-2 rounded">Ir al Inicio</button></div></div>} />
                  <Route path="/subscription-canceled" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-2xl font-bold text-muted-foreground mb-4">Suscripción Cancelada</h1><p className="text-muted-foreground mb-4">Puedes intentar nuevamente cuando gustes</p><button onClick={() => window.location.href = '/suscripcion'} className="bg-primary text-primary-foreground px-4 py-2 rounded">Ver Planes</button></div></div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
