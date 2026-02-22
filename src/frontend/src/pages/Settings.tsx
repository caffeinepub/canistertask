import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t('settings.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Definições da Conta
          </CardTitle>
          <CardDescription>Gerir as suas preferências</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            As definições de privacidade e controlo de dados serão implementadas em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
