import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function AgeGate() {
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const verified = sessionStorage.getItem('ageVerified');
    if (!verified) {
      setShowAgeGate(true);
    } else {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = () => {
    sessionStorage.setItem('ageVerified', 'true');
    setIsVerified(true);
    setShowAgeGate(false);
  };

  if (isVerified) return null;

  return (
    <Dialog open={showAgeGate} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-2xl">{t('age.title')}</DialogTitle>
          <DialogDescription className="text-center">{t('age.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            {t('age.requirement')}
          </div>
          <Button onClick={handleVerify} className="w-full" size="lg">
            {t('age.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
