import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from '@tanstack/react-router';

interface GDPRConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function GDPRConsent({ checked, onCheckedChange }: GDPRConsentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      <h3 className="font-semibold">{t('gdpr.title')}</h3>
      <div className="flex items-start space-x-2">
        <Checkbox id="gdpr-consent" checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor="gdpr-consent" className="text-sm leading-relaxed">
          {t('gdpr.consent')}{' '}
          <Link to="/privacy" className="text-primary underline">
            {t('gdpr.privacyPolicy')}
          </Link>{' '}
          {t('gdpr.and')}{' '}
          <Link to="/terms" className="text-primary underline">
            {t('gdpr.terms')}
          </Link>
          .
        </Label>
      </div>
    </div>
  );
}
