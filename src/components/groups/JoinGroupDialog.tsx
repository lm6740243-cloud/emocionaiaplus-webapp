import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, Users, Globe, Video } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description?: string;
  tematicas?: string[];
  meeting_type: string;
  city: string;
  region: string;
  privacidad: string;
  current_members?: number;
  capacidad_max?: number;
}

interface JoinGroupDialogProps {
  group: Group;
  children: React.ReactNode;
  onJoinSuccess?: () => void;
}

export function JoinGroupDialog({ group, children, onJoinSuccess }: JoinGroupDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [alias, setAlias] = useState('');
  const [motivacion, setMotivacion] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [step, setStep] = useState(1);

  const handleJoin = async () => {
    if (!alias.trim()) {
      toast.error('Por favor ingresa un alias para el grupo');
      return;
    }

    if (alias.length < 2 || alias.length > 50) {
      toast.error('El alias debe tener entre 2 y 50 caracteres');
      return;
    }

    setIsJoining(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debe iniciar sesión para unirse a un grupo');
        setOpen(false);
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('grupo_miembros')
        .select('*')
        .eq('grupo_id', group.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('Ya eres miembro de este grupo');
        navigate(`/grupos/${group.id}`);
        setOpen(false);
        return;
      }

      // Check if alias is already taken in this group
      const { data: aliasCheck } = await supabase
        .from('grupo_miembros')
        .select('id')
        .eq('grupo_id', group.id)
        .eq('alias', alias.trim())
        .single();

      if (aliasCheck) {
        toast.error('Este alias ya está en uso en el grupo. Por favor elige otro.');
        return;
      }

      // Join the group
      const { error } = await supabase
        .from('grupo_miembros')
        .insert({
          grupo_id: group.id,
          user_id: user.id,
          alias: alias.trim(),
          rol: 'miembro'
        });

      if (error) throw error;

      // Send welcome message if motivation provided
      if (motivacion.trim()) {
        await supabase
          .from('grupo_mensajes')
          .insert({
            grupo_id: group.id,
            autor_id: user.id,
            contenido: `¡Hola! Me uno al grupo. ${motivacion.trim()}`,
            tipo_mensaje: 'texto',
            metadata: { is_welcome: true }
          });
      }

      toast.success('¡Te has unido al grupo exitosamente!');
      setOpen(false);
      onJoinSuccess?.();
      navigate(`/grupos/${group.id}`);

    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Error al unirse al grupo. Inténtalo de nuevo.');
    } finally {
      setIsJoining(false);
    }
  };

  const resetForm = () => {
    setAlias('');
    setMotivacion('');
    setStep(1);
    setIsJoining(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Unirse al Grupo
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            {/* Group Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {group.meeting_type === 'virtual' ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  {group.name}
                </CardTitle>
                <CardDescription>
                  {group.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Modalidad:</span>
                  <Badge variant={group.meeting_type === 'virtual' ? 'default' : 'secondary'}>
                    {group.meeting_type === 'virtual' ? 'Virtual' : 'Presencial'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ubicación:</span>
                  <span>{group.city}, {group.region}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Miembros:</span>
                  <span>{group.current_members || 0}/{group.capacidad_max || 50}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Privacidad:</span>
                  <div className="flex items-center gap-1">
                    {group.privacidad === 'publico' ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Shield className="h-3 w-3" />
                    )}
                    <span className="capitalize">{group.privacidad}</span>
                  </div>
                </div>
                
                {group.tematicas && group.tematicas.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Temáticas:</span>
                    <div className="flex flex-wrap gap-1">
                      {group.tematicas.map((tema, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs capitalize">
                          {tema}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1">
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alias">Alias en el grupo *</Label>
              <Input
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej: Ana, Carlos, etc."
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                Este será tu nombre visible en el chat del grupo (2-50 caracteres)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivacion">Presentación (Opcional)</Label>
              <Textarea
                id="motivacion"
                value={motivacion}
                onChange={(e) => setMotivacion(e.target.value)}
                placeholder="Cuéntanos brevemente por qué te unes al grupo..."
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Este mensaje se compartirá como tu presentación en el grupo
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="flex-1"
                disabled={isJoining}
              >
                Atrás
              </Button>
              <Button 
                onClick={handleJoin}
                className="flex-1"
                disabled={isJoining || !alias.trim()}
              >
                {isJoining ? 'Uniéndose...' : 'Unirse al Grupo'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}