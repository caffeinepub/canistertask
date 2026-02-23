import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import GDPRConsent from './GDPRConsent';
import type { UserProfile } from '../backend';
import { Variant_aiAgent_humanWorker } from '../backend';

interface ProfileSetupProps {
  children: ReactNode;
}

export default function ProfileSetup({ children }: ProfileSetupProps) {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);

  const showProfileSetup = isFetched && userProfile === null;

  const handleCreateWorkerProfile = async () => {
    if (!name.trim() || !gdprConsent) return;

    const profile: UserProfile = {
      profileType: Variant_aiAgent_humanWorker.humanWorker,
      humanWorker: {
        principal: '' as any,
        name: name.trim(),
        photo: undefined,
        skills: [],
        location: { lat: 38.5714, lon: -7.9087, radius: 50 },
        price: 10.0,
        available: true,
        rating: 0.0,
        createdAt: BigInt(Date.now() * 1000000),
      },
      aiAgent: undefined,
    };

    await saveProfile.mutateAsync(profile);
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Dialog open={showProfileSetup} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">{t('profile.setup.title')}</DialogTitle>
            <DialogDescription className="text-center">{t('profile.setup.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.name')}</Label>
              <Input
                id="name"
                placeholder={t('profile.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <GDPRConsent checked={gdprConsent} onCheckedChange={setGdprConsent} />

            <Button
              onClick={handleCreateWorkerProfile}
              disabled={!name.trim() || !gdprConsent || saveProfile.isPending}
              className="w-full"
              size="lg"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('profile.saving')}
                </>
              ) : (
                t('profile.type.humanWorker')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {!showProfileSetup && children}
    </>
  );
}
