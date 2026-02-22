import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { SiX, SiTelegram } from 'react-icons/si';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'canistertask');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/assets/generated/canistertask-icon.dim_512x512.png" alt="CanisterTask" className="h-8 w-8 rounded-lg" />
              <span className="font-bold">CanisterTask</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t('footer.shareText'))}&hashtags=CanisterTask,ICPSoberano`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border p-2 transition-colors hover:bg-accent"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(t('footer.shareText'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border p-2 transition-colors hover:bg-accent"
              >
                <SiTelegram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.links')}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.about')}
              </Link>
              <Link to="/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.terms')}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.legal')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.legalText')}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            CanisterTask © {currentYear} Hermínio Coragem (HCoragem)
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            {t('footer.builtWith')} <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {t('footer.using')}{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
