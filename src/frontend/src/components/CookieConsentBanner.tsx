import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import { Cookie } from 'lucide-react';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleConfigure = () => {
    navigate({ to: '/cookies' });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="mx-auto max-w-3xl border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('cookies.bannerTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('cookies.bannerMessage')}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleConfigure}>
                {t('cookies.configure')}
              </Button>
              <Button size="sm" onClick={handleAccept}>
                {t('cookies.accept')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
