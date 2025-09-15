import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Trash2, 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle,
  Download,
  UserX,
  HardDrive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AccountDeletion = () => {
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmationChecks, setConfirmationChecks] = useState({
    understand_permanent: false,
    downloaded_data: false,
    no_recovery: false,
    alternative_considered: false
  });
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const deletionSteps = [
    {
      step: "Exportación de datos",
      description: "Descarga automática de todos tus datos antes de la eliminación",
      duration: "1-2 minutos",
      icon: Download
    },
    {
      step: "Eliminación de datos personales",
      description: "Eliminación segura de mensajes, registros de ánimo y datos médicos",
      duration: "5-10 minutos", 
      icon: HardDrive
    },
    {
      step: "Desvinculación de servicios",
      description: "Cancelación de integraciones y servicios conectados",
      duration: "2-3 minutos",
      icon: UserX
    },
    {
      step: "Confirmación final",
      description: "Verificación de eliminación completa y envío de confirmación",
      duration: "1 minuto",
      icon: CheckCircle
    }
  ];

  const dataRetention = [
    {
      category: "Datos médicos críticos",
      retention: "7 años",
      reason: "Requisito legal de historia clínica",
      status: "Anonimizados"
    },
    {
      category: "Registros de facturación",
      retention: "10 años", 
      reason: "Requisito fiscal y contable",
      status: "Datos mínimos"
    },
    {
      category: "Logs de seguridad",
      retention: "2 años",
      reason: "Auditoría de seguridad y prevención de fraude",
      status: "Sin datos personales"
    },
    {
      category: "Datos de investigación",
      retention: "Indefinido",
      reason: "Solo si diste consentimiento previo",
      status: "Completamente anonimizado"
    }
  ];

  const alternatives = [
    {
      title: "Pausa temporal",
      description: "Desactiva tu cuenta por 30-90 días sin perder datos",
      icon: "⏸️",
      action: "Pausar cuenta"
    },
    {
      title: "Eliminar solo conversaciones",
      description: "Mantén tu perfil pero elimina el historial de chat",
      icon: "💬",
      action: "Limpiar chat"
    },
    {
      title: "Cambiar a cuenta básica", 
      description: "Reduce funcionalidades pero mantén datos esenciales",
      icon: "📱",
      action: "Degradar cuenta"
    },
    {
      title: "Transferir datos",
      description: "Transfiere tu información a otro profesional",
      icon: "📤",
      action: "Iniciar transferencia"
    }
  ];

  const isConfirmationValid = () => {
    return confirmationText === "ELIMINAR MI CUENTA" && 
           Object.values(confirmationChecks).every(check => check);
  };

  const handleAccountDeletion = async () => {
    if (!isConfirmationValid()) {
      toast({
        title: "Confirmación incompleta",
        description: "Por favor, completa todos los pasos de confirmación",
        variant: "destructive"
      });
      return;
    }

    setDeleting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simulate deletion process
      for (let i = 0; i < deletionSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Completed step ${i + 1}: ${deletionSteps[i].step}`);
      }

      // In a real implementation, this would:
      // 1. Export all user data
      // 2. Delete user data from all tables
      // 3. Anonymize retained data
      // 4. Cancel subscriptions
      // 5. Send confirmation email
      // 6. Sign out user

      toast({
        title: "Cuenta eliminada exitosamente",
        description: "Tu cuenta y datos han sido eliminados de forma segura",
      });

      // Sign out user
      await supabase.auth.signOut();
      
    } catch (error) {
      console.error('Error during account deletion:', error);
      toast({
        title: "Error en la eliminación",
        description: "Hubo un problema al eliminar tu cuenta. Contacta soporte.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setShowDeletionDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Eliminación de Cuenta y Datos
          </CardTitle>
          <CardDescription>
            Información sobre el proceso de eliminación permanente de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Atención!</strong> La eliminación de cuenta es un proceso permanente e irreversible. 
              Asegúrate de haber descargado todos los datos que desees conservar.
            </AlertDescription>
          </Alert>

          {/* Alternatives Section */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              ¿Consideras otras opciones?
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternatives.map((alt, index) => (
                <Card key={index} className="border-dashed hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{alt.icon}</span>
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">{alt.title}</h5>
                        <p className="text-sm text-muted-foreground mb-3">
                          {alt.description}
                        </p>
                        <Button variant="outline" size="sm">
                          {alt.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Deletion Process */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Proceso de Eliminación
            </h4>
            
            <div className="space-y-3">
              {deletionSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium mb-1">{step.step}</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Duración: {step.duration}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Data Retention */}
          <div className="space-y-4">
            <h4 className="font-semibold">Datos que se Conservan (Anonimizados)</h4>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Por requisitos legales y médicos, algunos datos deben conservarse de forma anonimizada. 
                Estos datos no pueden vincularse a tu identidad personal.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              {dataRetention.map((retention, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium text-sm">{retention.category}</h5>
                    <p className="text-xs text-muted-foreground">{retention.reason}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs mb-1">
                      {retention.retention}
                    </Badge>
                    <div className="text-xs text-muted-foreground">{retention.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Deletion Button */}
          <div className="space-y-4">
            <h4 className="font-semibold text-red-600">Zona de Peligro</h4>
            
            <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-red-700 dark:text-red-400 mb-2">
                    Eliminar cuenta permanentemente
                  </h5>
                  <p className="text-sm text-red-600/80 mb-4">
                    Esta acción no se puede deshacer. Se eliminarán todos tus datos personales, 
                    conversaciones, y se cancelarán todos los servicios asociados.
                  </p>
                  
                  <Dialog open={showDeletionDialog} onOpenChange={setShowDeletionDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar mi cuenta
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                          Confirmar eliminación de cuenta
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>¡Última advertencia!</strong> Esta acción es irreversible y eliminará 
                            permanentemente toda tu información personal.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Confirma que entiendes las consecuencias:</h4>
                          
                          {[
                            { 
                              key: 'understand_permanent', 
                              text: 'Entiendo que esta acción es permanente e irreversible' 
                            },
                            { 
                              key: 'downloaded_data', 
                              text: 'He descargado todos los datos que deseo conservar' 
                            },
                            { 
                              key: 'no_recovery', 
                              text: 'Entiendo que no podré recuperar mi cuenta ni mis datos' 
                            },
                            { 
                              key: 'alternative_considered', 
                              text: 'He considerado las alternativas a la eliminación completa' 
                            }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center space-x-2">
                              <Checkbox
                                id={item.key}
                                checked={confirmationChecks[item.key as keyof typeof confirmationChecks]}
                                onCheckedChange={(checked) => 
                                  setConfirmationChecks(prev => ({
                                    ...prev,
                                    [item.key]: checked
                                  }))
                                }
                              />
                              <Label htmlFor={item.key} className="text-sm">
                                {item.text}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmation">
                            Escribe "ELIMINAR MI CUENTA" para confirmar:
                          </Label>
                          <Input
                            id="confirmation"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="ELIMINAR MI CUENTA"
                            className="font-mono"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowDeletionDialog(false)}
                          disabled={deleting}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleAccountDeletion}
                          disabled={!isConfirmationValid() || deleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Eliminando...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Confirmar eliminación
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};