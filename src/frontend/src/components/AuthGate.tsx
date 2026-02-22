import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import ProfileSetup from './ProfileSetup';
import AgeGate from './AgeGate';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, login, isInitializing, isLoggingIn } = useInternetIdentity();
  const { t } = useTranslation();
  const isAuthenticated = !!identity;

  if (isInitializing || isLoggingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">{t('auth.initializing')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <img
              src="/assets/generated/canistertask-icon.dim_512x512.png"
              alt="CanisterTask"
              className="mx-auto h-24 w-24 rounded-2xl shadow-lg"
            />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">CanisterTask</h1>
            <p className="text-lg text-muted-foreground">{t('auth.tagline')}</p>
          </div>

          <div className="space-y-4 rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">{t('auth.welcome')}</h2>
            <p className="text-sm text-muted-foreground">{t('auth.loginRequired')}</p>
            <Button onClick={login} size="lg" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.loggingIn')}
                </>
              ) : (
                t('auth.login')
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{t('auth.disclaimer')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AgeGate />
      <ProfileSetup />
      {children}
    </>
  );
}
