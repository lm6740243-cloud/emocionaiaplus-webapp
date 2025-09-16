import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  LogIn, 
  User, 
  UserCheck, 
  Users, 
  BookOpen, 
  Settings,
  Home,
  Menu,
  X,
  BarChart3,
  Crown
} from 'lucide-react';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/login', icon: LogIn, label: 'Iniciar sesión' },
    { path: '/onboarding', icon: Heart, label: 'Comenzar' },
    { path: '/paciente', icon: User, label: 'Paciente' },
    { path: '/psicologo', icon: UserCheck, label: 'Psicólogo' },
    { path: '/grupos', icon: Users, label: 'Grupos' },
    { path: '/recursos', icon: BookOpen, label: 'Recursos' },
    { path: '/evaluaciones', icon: BarChart3, label: 'Evaluaciones' },
    { path: '/suscripcion', icon: Crown, label: 'Suscripción' },
    { path: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/80 backdrop-blur-sm shadow-soft"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <Card className={`
        fixed top-0 left-0 h-full w-64 z-40 bg-gradient-card shadow-card border-r
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-8">
          {/* Logo/Brand */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EmocionalIA+
            </h1>
            <Badge variant="secondary" className="text-xs">
              Plataforma de Bienestar
            </Badge>
          </div>

          {/* Notification Center */}
          <div className="flex justify-center">
            <NotificationCenter />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300
                    ${active 
                      ? 'bg-primary text-primary-foreground shadow-glow' 
                      : 'hover:bg-primary/10 hover:text-primary text-muted-foreground'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Tu bienestar es nuestra prioridad
              </p>
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs">
                  v1.0.0
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Navigation;