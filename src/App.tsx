import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import GrupoChat from "./pages/GrupoChat";
import AIChatPage from "./pages/AIChat";
import Suscripcion from "./pages/Suscripcion";
import NotificationSettings from "./pages/NotificationSettings";
import Web3Dashboard from "./pages/Web3Dashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <AuthProvider>
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
                  <Route path="/paciente" element={<ProtectedRoute><Paciente /></ProtectedRoute>} />
                  <Route path="/psicologo" element={<ProtectedRoute><Psicologo /></ProtectedRoute>} />
                  <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
                  <Route path="/configuracion/notificaciones" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
                  <Route path="/recursos" element={<ProtectedRoute><Recursos /></ProtectedRoute>} />
                  <Route path="/grupos" element={<ProtectedRoute><Grupos /></ProtectedRoute>} />
                  <Route path="/grupos/crear" element={<ProtectedRoute><CrearGrupo /></ProtectedRoute>} />
                  <Route path="/grupos/:id" element={<ProtectedRoute><GrupoChat /></ProtectedRoute>} />
                  <Route path="/evaluaciones" element={<ProtectedRoute><Evaluaciones /></ProtectedRoute>} />
                  <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
                  <Route path="/suscripcion" element={<ProtectedRoute><Suscripcion /></ProtectedRoute>} />
                  <Route path="/web3" element={<ProtectedRoute><Web3Dashboard /></ProtectedRoute>} />
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
    </AuthProvider>
  </ThemeProvider>
);

export default App;
