import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, User } from "lucide-react";

const formSchema = z.object({
  rol: z.enum(["paciente", "psicologo"], {
    required_error: "Por favor selecciona tu rol",
  }),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  sexo: z.enum(["masculino", "femenino", "otro", "prefiero_no_decir"], {
    required_error: "Por favor selecciona una opción",
  }),
  fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
  pais: z.string().min(2, "El país es requerido"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  calle: z.string().min(5, "La dirección debe ser más específica"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: z.string().email("Por favor ingresa un email válido"),
  motivacion: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  onComplete: (data: FormData) => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rol: undefined,
      nombre: "",
      apellidos: "",
      sexo: undefined,
      fecha_nacimiento: "",
      pais: "",
      ciudad: "",
      calle: "",
      telefono: "",
      email: "",
      motivacion: "",
    },
  });

  const watchedRole = form.watch("rol");

  const onSubmit = (data: FormData) => {
    onComplete(data);
  };

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {watchedRole === "psicologo" ? (
            <div className="p-3 rounded-full bg-accent/20">
              <User className="h-8 w-8 text-accent-foreground" />
            </div>
          ) : (
            <div className="p-3 rounded-full bg-primary/20">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl text-foreground">
          Completa tu perfil
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Estos datos nos ayudarán a personalizar tu experiencia en EmocionalIA+
        </CardDescription>
        {watchedRole && (
          <Badge variant="secondary" className="mx-auto mt-2 animate-fade-in">
            {watchedRole === "paciente" ? "Paciente" : "Psicólogo Profesional"}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rol */}
            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">¿Cuál es tu rol?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paciente">Paciente - Busco apoyo emocional</SelectItem>
                      <SelectItem value="psicologo">Psicólogo - Soy un profesional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Información Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder="Tus apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                        <SelectItem value="prefiero_no_decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_nacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. España" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ciudad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Madrid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Calle Mayor 123, 2º A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+34 600 123 456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Motivación opcional */}
            <FormField
              control={form.control}
              name="motivacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ¿Qué te motivó a unirte a EmocionalIA+? (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Comparte brevemente qué esperas de esta plataforma..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Completar registro
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;