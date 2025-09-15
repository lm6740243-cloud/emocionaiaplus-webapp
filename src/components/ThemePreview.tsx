import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Palette, Sun, Moon } from "lucide-react";

const ThemePreview = () => {
  const { theme, isDark, toggleDarkMode } = useTheme();

  const getThemeInfo = () => {
    switch (theme) {
      case 'masculino':
        return {
          name: 'Masculino',
          description: 'Paleta azul inspiradora y confiable',
          colors: ['#2DA0FA', '#89BFFB', '#46D3F0']
        };
      case 'femenino':
        return {
          name: 'Femenino',
          description: 'Paleta fucsia-morado vibrante y empoderada',
          colors: ['#FF4FC1', '#7A2BEB', '#B565D8']
        };
      case 'no-binario':
        return {
          name: 'No Binario',
          description: 'Paleta neutra con verdes y lilas suaves',
          colors: ['#4ADE80', '#A78BFA', '#34D399']
        };
      default:
        return {
          name: 'Por defecto',
          description: 'Colores neutros y equilibrados',
          colors: ['#3B82F6', '#10B981', '#8B5CF6']
        };
    }
  };

  const themeInfo = getThemeInfo();

  return (
    <Card className="bg-gradient-card border-primary/20 transition-all duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Tema Actual</CardTitle>
              <CardDescription>{themeInfo.description}</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="transition-all duration-300"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Oscuro
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="animate-fade-in">
              {themeInfo.name}
            </Badge>
            {isDark && (
              <Badge variant="outline" className="animate-fade-in">
                Modo oscuro
              </Badge>
            )}
          </div>
          
          {/* Vista previa de colores */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Paleta de colores:</p>
            <div className="flex gap-2">
              {themeInfo.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-background shadow-md transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Ejemplo de gradiente */}
          <div className="h-16 rounded-lg bg-gradient-primary transition-all duration-500 flex items-center justify-center">
            <p className="text-primary-foreground font-semibold">Gradiente personalizado</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;