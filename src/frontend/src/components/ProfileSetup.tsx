import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Bot } from 'lucide-react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Variant_aiAgent_humanWorker } from '../backend';
import type { UserProfile, Skill } from '../backend';
import GDPRConsent from './GDPRConsent';

export default function ProfileSetup() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { t } = useTranslation();

  const [showSetup, setShowSetup] = useState(false);
  const [profileType, setProfileType] = useState<'humanWorker' | 'aiAgent' | null>(null);
  const [name, setName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [lat, setLat] = useState('38.5667');
  const [lon, setLon] = useState('-7.9000');
  const [radius, setRadius] = useState('20');
  const [price, setPrice] = useState('25');
  const [gdprConsent, setGdprConsent] = useState(false);

  useEffect(() => {
    if (isFetched && userProfile === null && !profileLoading) {
      setShowSetup(true);
    }
  }, [userProfile, profileLoading, isFetched]);

  const handleSubmit = async () => {
    if (!profileType || !gdprConsent) return;

    const profile: UserProfile = {
      profileType: profileType === 'humanWorker' ? Variant_aiAgent_humanWorker.humanWorker : Variant_aiAgent_humanWorker.aiAgent,
      humanWorker:
        profileType === 'humanWorker'
          ? {
              principal: '' as any,
              name,
              photo: undefined,
              skills: selectedSkills.map((s) => {
                if (s === 'photography') return { __kind__: 'photography', photography: null };
                if (s === 'delivery') return { __kind__: 'delivery', delivery: null };
                if (s === 'verification') return { __kind__: 'verification', verification: null };
                if (s === 'arCaptures') return { __kind__: 'arCaptures', arCaptures: null };
                return { __kind__: 'custom', custom: s };
              }) as Skill[],
              location: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                radius: parseFloat(radius),
              },
              price: parseFloat(price),
              available: true,
              rating: 0,
              createdAt: BigInt(Date.now()),
            }
          : undefined,
      aiAgent:
        profileType === 'aiAgent'
          ? {
              principal: '' as any,
              agentName,
              description,
              createdAt: BigInt(Date.now()),
            }
          : undefined,
    };

    await saveProfile.mutateAsync(profile);
    setShowSetup(false);
  };

  const predefinedSkills = [
    { value: 'photography', label: t('profile.skills.photography') },
    { value: 'delivery', label: t('profile.skills.delivery') },
    { value: 'verification', label: t('profile.skills.verification') },
    { value: 'arCaptures', label: t('profile.skills.arCaptures') },
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  if (profileLoading || !showSetup) return null;

  return (
    <Dialog open={showSetup} onOpenChange={() => {}}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('profile.setup.title')}</DialogTitle>
          <DialogDescription>{t('profile.setup.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!profileType && (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setProfileType('humanWorker')}
                className="flex flex-col items-center gap-3 rounded-lg border-2 border-border p-6 transition-all hover:border-primary hover:bg-accent"
              >
                <User className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="font-semibold">{t('profile.type.humanWorker')}</h3>
                  <p className="text-sm text-muted-foreground">{t('profile.type.humanWorkerDesc')}</p>
                </div>
              </button>

              <button
                onClick={() => setProfileType('aiAgent')}
                className="flex flex-col items-center gap-3 rounded-lg border-2 border-border p-6 transition-all hover:border-primary hover:bg-accent"
              >
                <Bot className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="font-semibold">{t('profile.type.aiAgent')}</h3>
                  <p className="text-sm text-muted-foreground">{t('profile.type.aiAgentDesc')}</p>
                </div>
              </button>
            </div>
          )}

          {profileType === 'humanWorker' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('profile.name')}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('profile.namePlaceholder')} />
              </div>

              <div>
                <Label>{t('profile.skills.label')}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {predefinedSkills.map((skill) => (
                    <Button
                      key={skill.value}
                      type="button"
                      variant={selectedSkills.includes(skill.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleSkill(skill.value)}
                    >
                      {skill.label}
                    </Button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder={t('profile.skills.customPlaceholder')}
                  />
                  <Button type="button" onClick={addCustomSkill} variant="outline">
                    {t('profile.skills.add')}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="lat">{t('profile.location.lat')}</Label>
                  <Input id="lat" type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lon">{t('profile.location.lon')}</Label>
                  <Input id="lon" type="number" step="0.0001" value={lon} onChange={(e) => setLon(e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="radius">{t('profile.location.radius')}</Label>
                <Input id="radius" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="price">{t('profile.price')}</Label>
                <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
          )}

          {profileType === 'aiAgent' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="agentName">{t('profile.agentName')}</Label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder={t('profile.agentNamePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="description">{t('profile.description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('profile.descriptionPlaceholder')}
                  rows={4}
                />
              </div>
            </div>
          )}

          {profileType && <GDPRConsent checked={gdprConsent} onCheckedChange={setGdprConsent} />}

          {profileType && (
            <Button onClick={handleSubmit} disabled={saveProfile.isPending || !gdprConsent} className="w-full" size="lg">
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('profile.saving')}
                </>
              ) : (
                t('profile.save')
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
