import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Loader2, X } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

interface ProfileSetupProps {
  children: ReactNode;
}

export default function ProfileSetup({ children }: ProfileSetupProps) {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(true);

  const showProfileSetup = isFetched && userProfile === null && open;

  const handleCreateWorkerProfile = async () => {
    if (!actor) return;
    
    setIsCreating(true);
    try {
      // Call registerHumanWorker with default values for Évora
      await actor.registerHumanWorker(
        'Trabalhador', // Default name
        [], // Empty skills array
        { lat: 38.5714, lon: -7.9087, radius: 50 }, // Évora coordinates with 50km radius
        15 // Default price €15
      );
      
      // Invalidate the profile query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      
      // Close modal
      setOpen(false);
      
      // Navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
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
      <Dialog open={showProfileSetup} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">{t('profile.setup.title')}</DialogTitle>
            <DialogDescription className="text-center">{t('profile.setup.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={handleCreateWorkerProfile}
              disabled={isCreating}
              className="w-full"
              size="lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('profile.saving')}
                </>
              ) : (
                t('profile.type.humanWorker')
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('gdpr.consent')}{' '}
              <Link to="/privacy" className="text-primary underline hover:text-primary/80">
                {t('gdpr.privacyPolicy')}
              </Link>{' '}
              {t('gdpr.and')}{' '}
              <Link to="/terms" className="text-primary underline hover:text-primary/80">
                {t('gdpr.terms')}
              </Link>
              .
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {!showProfileSetup && children}
    </>
  );
}
