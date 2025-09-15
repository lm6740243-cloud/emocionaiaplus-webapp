import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Heart, Brain } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart className="h-8 w-8" />
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EmocionalIA+
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Inicia sesión para acceder a tu espacio de bienestar
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="tu@email.com"
              className="transition-all duration-300 focus:shadow-soft"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="transition-all duration-300 focus:shadow-soft"
            />
          </div>
          <Button 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            Iniciar sesión
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/onboarding" className="text-primary hover:underline font-medium">
                Comienza aquí
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              ¿Olvidaste tu contraseña?{" "}
              <a href="#" className="text-primary hover:underline">
                Recupérala
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;