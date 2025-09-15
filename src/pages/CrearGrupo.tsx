import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, MapPin, Calendar, Shield, Plus, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState as useAuthState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'La descripción no puede exceder 500 caracteres'),
  tematicas: z.array(z.string()).min(1, 'Debe seleccionar al menos una temática'),
  meeting_type: z.enum(['presencial', 'virtual'], { required_error: 'La modalidad es requerida' }),
  city: z.string().min(1, 'La ciudad es requerida'),
  region: z.string().min(1, 'La provincia es requerida'),
  ubicacion_detalle: z.string().optional(),
  capacidad_max: z.number().min(3, 'La capacidad mínima es 3 personas').max(200, 'La capacidad máxima es 200 personas'),
  privacidad: z.enum(['publico', 'requiere_aprobacion', 'privado_por_invitacion'], { required_error: 'La privacidad es requerida' }),
  reglas_personalizadas: z.string().optional(),
  codeOfConductAccepted: z.boolean().refine((val) => val === true, 'Debe aceptar el Código de Conducta')
});

type FormData = z.infer<typeof formSchema>;

const availableTopics = [
  'ansiedad', 'depresión', 'duelo', 'estrés', 'adicciones', 'autoestima', 
  'trastorno bipolar', 'trastornos alimentarios', 'trauma', 'mindfulness',
  'terapia familiar', 'apoyo juvenil', 'tercera edad', 'diversidad sexual'
];

const provinces = [
  'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos',
  'Salta', 'Chaco', 'Corrientes', 'Santiago del Estero', 'San Juan', 'Jujuy',
  'Río Negro', 'Formosa', 'Neuquén', 'Chubut', 'San Luis', 'Catamarca',
  'La Rioja', 'La Pampa', 'Santa Cruz', 'Tierra del Fuego', 'Misiones', 'CABA'
];

const CodeOfConductModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Código de Conducta - Grupos de Apoyo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base mb-2">1. Respeto y Dignidad</h3>
            <p className="text-muted-foreground">Todos los miembros deben tratarse con respeto mutuo, sin discriminación por género, edad, orientación sexual, religión, raza o condición socioeconómica.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">2. Confidencialidad</h3>
            <p className="text-muted-foreground">Lo que se comparte en el grupo permanece en el grupo. Está prohibido divulgar información personal de otros miembros fuera del espacio seguro del grupo.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">3. No Dar Consejos Médicos</h3>
            <p className="text-muted-foreground">Los miembros no deben dar consejos médicos o recomendaciones sobre medicamentos. El grupo es de apoyo emocional, no sustituto de tratamiento profesional.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">4. Escucha Activa</h3>
            <p className="text-muted-foreground">Practicar la escucha sin juzgar. Evitar interrumpir cuando alguien comparte su experiencia.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">5. Participación Voluntaria</h3>
            <p className="text-muted-foreground">Nadie está obligado a compartir. Cada miembro participa según su comodidad y disposición.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">6. Puntualidad y Compromiso</h3>
            <p className="text-muted-foreground">Respetar los horarios de las reuniones y avisar con anticipación si no se puede asistir.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">7. Prohibiciones</h3>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li>Comportamientos agresivos o violentos</li>
              <li>Promoción de autolesiones o suicidio</li>
              <li>Contenido sexual inapropiado</li>
              <li>Promoción de sustancias ilegales</li>
              <li>Spam o promoción comercial</li>
            </ul>
          </div>
          
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <p className="text-destructive font-medium">
              ⚠️ El incumplimiento de estas normas puede resultar en la expulsión del grupo.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function CrearGrupo() {
  const navigate = useNavigate();
  const [user, setUser] = useAuthState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      tematicas: [],
      meeting_type: 'virtual',
      city: '',
      region: '',
      ubicacion_detalle: '',
      capacidad_max: 20,
      privacidad: 'publico',
      reglas_personalizadas: '',
      codeOfConductAccepted: false
    }
  });

  const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const meeting_type = watch('meeting_type');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const toggleTopic = (topic: string) => {
    const updatedTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    
    setSelectedTopics(updatedTopics);
    setValue('tematicas', updatedTopics);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Debe iniciar sesión para crear un grupo');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('support_groups')
        .insert({
          name: data.name,
          description: data.description,
          tematicas: data.tematicas,
          meeting_type: data.meeting_type,
          city: data.city,
          region: data.region,
          country: 'Argentina',
          ubicacion_detalle: data.ubicacion_detalle,
          capacidad_max: data.capacidad_max,
          privacidad: data.privacidad,
          reglas_personalizadas: data.reglas_personalizadas,
          owner_id: user.id
        });

      if (error) throw error;

      toast.success('¡Grupo creado exitosamente!');
      navigate('/grupos');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Error al crear el grupo. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/grupos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Crear Grupo de Apoyo</h1>
              <p className="text-muted-foreground">Crea un espacio seguro para compartir y apoyarse mutuamente</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Información del Grupo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Grupo *</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ej: Grupo de Apoyo para Ansiedad - Centro"
                          className={errors.name ? 'border-destructive' : ''}
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Describe el propósito del grupo, metodología y lo que pueden esperar los participantes..."
                          rows={4}
                          className={errors.description ? 'border-destructive' : ''}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Temáticas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Temáticas *</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableTopics.map((topic) => (
                      <div
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`
                          p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedTopics.includes(topic)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                          }
                        `}
                      >
                        <span className="text-sm font-medium capitalize">{topic}</span>
                      </div>
                    ))}
                  </div>
                  {errors.tematicas && (
                    <p className="text-sm text-destructive">{errors.tematicas.message}</p>
                  )}
                </div>

                {/* Modalidad y Ubicación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Modalidad y Ubicación
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Modalidad *</Label>
                      <Controller
                        name="meeting_type"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona modalidad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="virtual">Virtual (Online)</SelectItem>
                              <SelectItem value="presencial">Presencial</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Capacidad Máxima *</Label>
                      <Controller
                        name="capacidad_max"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            min={3}
                            max={200}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ciudad *</Label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Ciudad"
                            className={errors.city ? 'border-destructive' : ''}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Provincia *</Label>
                      <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Selecciona provincia" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {meeting_type === 'presencial' && (
                    <div className="space-y-2">
                      <Label>Ubicación Detallada</Label>
                      <Controller
                        name="ubicacion_detalle"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder="Dirección completa, referencias, indicaciones para llegar..."
                            rows={3}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Privacidad */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configuración de Privacidad
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Privacidad *</Label>
                    <Controller
                      name="privacidad"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="publico">
                              <div>
                                <div className="font-medium">Público</div>
                                <div className="text-sm text-muted-foreground">Cualquiera puede unirse</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="requiere_aprobacion">
                              <div>
                                <div className="font-medium">Requiere Aprobación</div>
                                <div className="text-sm text-muted-foreground">Los miembros deben ser aprobados</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="privado_por_invitacion">
                              <div>
                                <div className="font-medium">Solo por Invitación</div>
                                <div className="text-sm text-muted-foreground">Solo miembros invitados pueden unirse</div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reglas Personalizadas (Opcional)</Label>
                    <Controller
                      name="reglas_personalizadas"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Reglas específicas adicionales para tu grupo..."
                          rows={4}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Código de Conducta */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Código de Conducta</h3>
                  
                  <div className="flex items-start space-x-2">
                    <Controller
                      name="codeOfConductAccepted"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="codeOfConductAccepted"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={errors.codeOfConductAccepted ? 'border-destructive' : ''}
                        />
                      )}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="codeOfConductAccepted" className="text-sm">
                        Acepto el{' '}
                        <CodeOfConductModal>
                          <Button type="button" variant="link" className="p-0 h-auto text-primary">
                            Código de Conducta
                          </Button>
                        </CodeOfConductModal>
                        {' '}y me comprometo a crear un ambiente seguro y respetuoso *
                      </Label>
                      {errors.codeOfConductAccepted && (
                        <p className="text-sm text-destructive">{errors.codeOfConductAccepted.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/grupos')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Grupo'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}