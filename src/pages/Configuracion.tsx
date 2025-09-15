import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataTransparency } from "@/components/privacy/DataTransparency";
import { AITransparency } from "@/components/privacy/AITransparency";
import { ConsentManagement } from "@/components/privacy/ConsentManagement";
import { AccountDeletion } from "@/components/privacy/AccountDeletion";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  Brain,
  UserCheck,
  Trash2
} from "lucide-react";

const Configuracion = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground">
              Personaliza tu experiencia y gestiona tu privacidad en EmocionalIA+
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Privacidad
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              IA
            </TabsTrigger>
            <TabsTrigger value="consent" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Consentimientos
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Cuenta
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Settings */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Perfil Personal
                    </CardTitle>
                    <CardDescription>
                      Información básica de tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo</Label>
                        <Input 
                          id="nombre" 
                          placeholder="Tu nombre completo"
                          defaultValue="Usuario EmocionalIA+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="tu@email.com"
                          defaultValue="usuario@emocionalIA.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono de contacto</Label>
                      <Input 
                        id="telefono" 
                        type="tel" 
                        placeholder="+34 600 000 000"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline">Guardar cambios</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notificaciones
                    </CardTitle>
                    <CardDescription>
                      Controla cómo y cuándo recibir notificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Recordatorios de actividades</p>
                        <p className="text-sm text-muted-foreground">
                          Notificaciones para tus rutinas diarias
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Notificaciones por email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Resúmenes semanales y actualizaciones importantes
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Notificaciones push
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Alertas instantáneas en tu dispositivo
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy & Security */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Privacidad y Seguridad Básica
                    </CardTitle>
                    <CardDescription>
                      Configuración básica de seguridad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Autenticación de dos factores</p>
                        <p className="text-sm text-muted-foreground">
                          Añade una capa extra de seguridad a tu cuenta
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Lock className="h-4 w-4 mr-2" />
                        Activar
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <p className="font-medium">Cambiar contraseña</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="password" placeholder="Contraseña actual" />
                        <Input type="password" placeholder="Nueva contraseña" />
                      </div>
                      <Button variant="outline" size="sm">
                        Actualizar contraseña
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                {/* Appearance */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Apariencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <p className="font-medium">Tema</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sun className="h-4 w-4 mr-2" />
                          Claro
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Moon className="h-4 w-4 mr-2" />
                          Oscuro
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <p className="font-medium">Tamaño de fuente</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">A</Button>
                        <Button variant="default" size="sm">A</Button>
                        <Button variant="outline" size="sm" className="text-lg">A</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Language & Region */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Idioma y Región
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Idioma de la interfaz</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">🇪🇸 Español</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Zona horaria</Label>
                      <p className="text-sm text-muted-foreground">
                        Europa/Madrid (GMT+1)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Estado de la cuenta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Plan actual</p>
                      <Badge variant="secondary">Gratuito</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Miembro desde</p>
                      <p className="text-sm text-muted-foreground">Enero 2024</p>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      size="sm"
                    >
                      Actualizar plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <DataTransparency />
          </TabsContent>

          {/* AI Transparency Tab */}
          <TabsContent value="ai">
            <AITransparency />
          </TabsContent>

          {/* Consent Management Tab */}
          <TabsContent value="consent">
            <ConsentManagement />
          </TabsContent>

          {/* Account Deletion Tab */}
          <TabsContent value="account">
            <AccountDeletion />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuracion;