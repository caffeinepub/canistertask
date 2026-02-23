import { Link } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const getAppIdentifier = () => {
    try {
      return encodeURIComponent(window.location.hostname);
    } catch {
      return 'canistertask-app';
    }
  };

  const caffeineUrl = `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${getAppIdentifier()}`;

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/assets/generated/canistertask-icon.dim_512x512.png" alt="CanisterTask" className="h-8 w-8 rounded-lg" />
              <span className="font-bold">CanisterTask</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('footer.navigation')}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
              <Link to="/analytics" className="text-muted-foreground transition-colors hover:text-foreground">
                Tasks
              </Link>
              <Link to="/perfil" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.myProfile')}
              </Link>
              <Link to="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
                Admin
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('footer.legal')}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/sobre" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.about')}
              </Link>
              <Link to="/privacidade" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.privacy')}
              </Link>
              <Link to="/termos" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.terms')}
              </Link>
              <Link to="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.cookies')}
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('footer.platform')}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('footer.intermediation')}</p>
              <p className="font-semibold text-primary">7% fee</p>
              <p>ICP mainnet</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
            <p>© {currentYear} Hermínio Coragem, Évora PT</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 fill-primary text-primary" /> using{' '}
              <a 
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
