import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Globe, Menu, LogOut, LogIn, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '../hooks/useTranslation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();

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

  const navLinks = [
    { to: '/', label: t('nav.dashboard') },
    { to: '/analytics', label: t('nav.analytics') },
    { to: '/settings', label: t('nav.settings') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/generated/canistertask-icon.dim_512x512.png" alt="CanisterTask" className="h-10 w-10 rounded-lg" />
            <span className="hidden text-xl font-bold sm:inline-block">CanisterTask</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {({ isActive }) => (
                  <Button variant={isActive ? 'default' : 'ghost'} size="sm">
                    {link.label}
                  </Button>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('pt')}>Português</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button onClick={handleAuth} disabled={isLoggingIn} variant={isAuthenticated ? 'outline' : 'default'} className="hidden sm:flex">
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
            <SheetContent>
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}>
                    {({ isActive }) => (
                      <Button variant={isActive ? 'default' : 'ghost'} className="w-full justify-start">
                        {link.label}
                      </Button>
                    )}
                  </Link>
                ))}
                <Button onClick={handleAuth} disabled={isLoggingIn} variant={isAuthenticated ? 'outline' : 'default'} className="w-full">
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
