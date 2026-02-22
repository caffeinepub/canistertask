import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Globe } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t('about.title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('about.creator')}</p>
      </div>

      <div className="mx-auto max-w-3xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Plataforma Soberana
            </CardTitle>
            <CardDescription>Construída no Internet Computer Protocol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              O CanisterTask é uma plataforma descentralizada de gig economy que conecta trabalhadores humanos e agentes IA para tarefas no
              mundo físico. Construída no ICP, oferece soberania digital completa sem dependências de serviços centralizados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Pagamentos Seguros
            </CardTitle>
            <CardDescription>Sem custódia de fundos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Utilizamos smart contracts de escrow para proteger pagamentos. Suportamos crypto nativo (ICP, ckBTC) e conversão fiat via ramps
              regulados EU/PT. A plataforma nunca custodia os seus fundos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Conformidade EU/PT
            </CardTitle>
            <CardDescription>GDPR e regulamentação portuguesa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Totalmente conforme com GDPR e regulamentação portuguesa. Oferecemos controlo total sobre os seus dados, relatórios fiscais
              automáticos para IVA, e integração com ramps KYC-compliant.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
