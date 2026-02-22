import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  const { t, language } = useTranslation();

  const content =
    language === 'pt'
      ? {
          disclaimer: 'Não é emprego formal. Gig economy. Consulte fiscalista PT.',
          sections: [
            {
              title: '1. Aceitação dos Termos',
              content:
                'Ao utilizar o CanisterTask, aceita estes Termos de Serviço. Se não concordar, não utilize a plataforma.',
            },
            {
              title: '2. Natureza da Relação',
              content:
                'O CanisterTask é uma plataforma de gig economy. Não existe relação de emprego entre trabalhadores e clientes. Cada utilizador é responsável pelas suas obrigações fiscais.',
            },
            {
              title: '3. Obrigações dos Utilizadores',
              content:
                'Deve: ter 18+ anos, fornecer informações verdadeiras, cumprir as leis locais, e respeitar outros utilizadores.',
            },
            {
              title: '4. Pagamentos',
              content:
                'Os pagamentos são processados via smart contracts de escrow. A plataforma não custodia fundos fiat. Ramps regulados EU/PT gerem conversões fiat.',
            },
            {
              title: '5. Limitação de Responsabilidade',
              content:
                'A plataforma não é responsável por: disputas entre utilizadores, perdas financeiras, ou danos resultantes do uso da plataforma.',
            },
            {
              title: '6. Resolução de Disputas',
              content:
                'Disputas são resolvidas via sistema de votação descentralizado. Decisões são finais e vinculativas.',
            },
            {
              title: '7. Terminação',
              content:
                'Pode eliminar a sua conta a qualquer momento. Reservamo-nos o direito de suspender contas que violem estes termos.',
            },
          ],
        }
      : {
          disclaimer: 'Not formal employment. Gig economy. Consult PT tax advisor.',
          sections: [
            {
              title: '1. Acceptance of Terms',
              content:
                'By using CanisterTask, you accept these Terms of Service. If you disagree, do not use the platform.',
            },
            {
              title: '2. Nature of Relationship',
              content:
                'CanisterTask is a gig economy platform. No employment relationship exists between workers and clients. Each user is responsible for their tax obligations.',
            },
            {
              title: '3. User Obligations',
              content:
                'You must: be 18+ years old, provide truthful information, comply with local laws, and respect other users.',
            },
            {
              title: '4. Payments',
              content:
                'Payments are processed via escrow smart contracts. The platform does not custody fiat funds. EU/PT regulated ramps handle fiat conversions.',
            },
            {
              title: '5. Limitation of Liability',
              content:
                'The platform is not responsible for: disputes between users, financial losses, or damages resulting from platform use.',
            },
            {
              title: '6. Dispute Resolution',
              content:
                'Disputes are resolved via decentralized voting system. Decisions are final and binding.',
            },
            {
              title: '7. Termination',
              content:
                'You may delete your account at any time. We reserve the right to suspend accounts that violate these terms.',
            },
          ],
        };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('terms.title')}</h1>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-semibold">{content.disclaimer}</AlertDescription>
        </Alert>

        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {language === 'pt' ? 'Última atualização: Fevereiro 2026' : 'Last updated: February 2026'}
        </p>
      </div>
    </div>
  );
}
