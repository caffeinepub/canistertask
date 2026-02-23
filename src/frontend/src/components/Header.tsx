import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Globe, Menu, LogOut, LogIn, Loader2, Shield, Users } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '../hooks/useTranslation';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NotificationBell from './NotificationBell';

export default function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
        Tasks
      </Link>
      <Link to="/perfil" className="text-sm font-medium hover:text-primary transition-colors">
        {t('nav.myProfile')}
      </Link>
      <Link to="/workers" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
        <Users className="h-4 w-4" />
        Workers
      </Link>
      {isAdmin && (
        <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
          <Shield className="h-4 w-4" />
          Admin
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/generated/canistertask-icon.dim_512x512.png" 
                alt="CanisterTask" 
                className="h-8 w-8"
              />
              <span className="font-bold text-xl">CanisterTask</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationBell />}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('pt')}>
                🇵🇹 Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="hidden md:flex"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.loggingIn')}
              </>
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.logout')}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t('auth.login')}
              </>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                <Button
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  className="w-full"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('auth.loggingIn')}
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.logout')}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t('auth.login')}
                    </>
                  )}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
