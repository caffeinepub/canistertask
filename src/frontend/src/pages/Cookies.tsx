import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { Cookie, Shield, Settings } from 'lucide-react';

export default function Cookies() {
  const { t, language } = useTranslation();

  const content =
    language === 'pt'
      ? {
          sections: [
            {
              icon: Cookie,
              title: '1. O que são cookies?',
              content:
                'Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website. Utilizamos apenas cookies essenciais para o funcionamento da plataforma CanisterTask.',
            },
            {
              icon: Shield,
              title: '2. Cookies Essenciais',
              content:
                'Utilizamos cookies estritamente necessários para: autenticação via Internet Identity, manter a sua sessão ativa, preferências de idioma e tema, e consentimento de cookies. Estes cookies não podem ser desativados pois são essenciais para o funcionamento da plataforma.',
            },
            {
              icon: Settings,
              title: '3. Gestão de Cookies',
              content:
                'Pode gerir as suas preferências de cookies através das configurações do seu navegador. Note que desativar cookies essenciais pode afetar a funcionalidade da plataforma. Não utilizamos cookies de marketing, analytics ou terceiros.',
            },
            {
              icon: Cookie,
              title: '4. Armazenamento Local',
              content:
                'Além de cookies, utilizamos localStorage do navegador para armazenar: preferências de utilizador, estado de autenticação, e configurações da interface. Estes dados permanecem apenas no seu dispositivo.',
            },
          ],
        }
      : {
          sections: [
            {
              icon: Cookie,
              title: '1. What are cookies?',
              content:
                'Cookies are small text files stored on your device when you visit a website. We only use essential cookies for the CanisterTask platform to function.',
            },
            {
              icon: Shield,
              title: '2. Essential Cookies',
              content:
                'We use strictly necessary cookies for: Internet Identity authentication, maintaining your active session, language and theme preferences, and cookie consent. These cookies cannot be disabled as they are essential for the platform to function.',
            },
            {
              icon: Settings,
              title: '3. Cookie Management',
              content:
                'You can manage your cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality. We do not use marketing, analytics, or third-party cookies.',
            },
            {
              icon: Cookie,
              title: '4. Local Storage',
              content:
                'In addition to cookies, we use browser localStorage to store: user preferences, authentication state, and interface settings. This data remains only on your device.',
            },
          ],
        };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('cookies.title')}</h1>

        <div className="space-y-6">
          {content.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">{t('cookies.moreInfo')}</CardTitle>
              <CardDescription>
                {language === 'pt'
                  ? 'Para mais informações sobre como tratamos os seus dados, consulte a nossa '
                  : 'For more information about how we handle your data, see our '}
                <Link to="/privacidade" className="text-primary hover:underline font-medium">
                  {t('footer.privacy')}
                </Link>
                .
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {language === 'pt' ? 'Última atualização: Fevereiro 2026' : 'Last updated: February 2026'}
        </p>
      </div>
    </div>
  );
}
