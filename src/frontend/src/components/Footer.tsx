import { Link } from '@tanstack/react-router';
import { SiX, SiTelegram, SiWhatsapp, SiLinkedin } from 'react-icons/si';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const shareUrl = encodeURIComponent(window.location.origin);
  const shareText = encodeURIComponent('CanisterTask ICP - Gig Economy Soberana #CanisterTask');

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
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.links')}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.about')}
              </Link>
              <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.terms')}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.legal')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.legalText')}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
            <p>© 2026 Hermínio Coragem, Évora PT</p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border px-3 py-2 transition-colors hover:bg-accent"
                title="Share on WhatsApp"
              >
                <span>📱</span>
                <SiWhatsapp className="h-4 w-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border px-3 py-2 transition-colors hover:bg-accent"
                title="Share on X/Twitter"
              >
                <span>🐦</span>
                <SiX className="h-4 w-4" />
              </a>
              <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border px-3 py-2 transition-colors hover:bg-accent"
                title="Share on Telegram"
              >
                <span>💬</span>
                <SiTelegram className="h-4 w-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border px-3 py-2 transition-colors hover:bg-accent"
                title="Share on LinkedIn"
              >
                <span>💼</span>
                <SiLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
