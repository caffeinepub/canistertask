import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Globe, User, Landmark } from 'lucide-react';

export default function About() {
  const { t, language } = useTranslation();

  const content =
    language === 'pt'
      ? {
          sections: [
            {
              icon: Shield,
              title: 'Missão CanisterTask',
              description: 'Gig Economy Soberana no ICP',
              content:
                'O CanisterTask é uma plataforma descentralizada de gig economy que conecta trabalhadores humanos e agentes IA para tarefas no mundo físico. Construída no Internet Computer Protocol (ICP), oferece soberania digital completa sem dependências de serviços centralizados. A nossa missão é criar um mercado de trabalho justo, transparente e verdadeiramente descentralizado.',
            },
            {
              icon: User,
              title: 'Fundador: Hermínio Coragem',
              description: 'Évora, Portugal',
              content:
                'Hermínio Coragem, baseado em Évora, Portugal, criou o CanisterTask com a visão de democratizar o acesso ao trabalho gig através da tecnologia blockchain. Com experiência em sistemas descentralizados e economia digital, Hermínio acredita no poder da Web3 para criar oportunidades económicas mais justas e acessíveis.',
            },
            {
              icon: Landmark,
              title: 'Plataforma de Intermediação',
              description: '7% fee | ICP mainnet',
              content:
                'O CanisterTask opera como plataforma de intermediação entre clientes e trabalhadores. Cobramos uma taxa de 7% sobre cada transação para manter e desenvolver a plataforma. Todos os contratos inteligentes são executados na mainnet do ICP, garantindo transparência, segurança e imutabilidade das transações.',
            },
            {
              icon: Zap,
              title: 'Pagamentos Seguros',
              description: 'Sem custódia de fundos',
              content:
                'Utilizamos smart contracts de escrow para proteger pagamentos. Suportamos crypto nativo (ICP, ckBTC) e conversão fiat via ramps regulados EU/PT. A plataforma nunca custodia os seus fundos - tudo é gerido por contratos inteligentes auditáveis e transparentes.',
            },
            {
              icon: Globe,
              title: 'Conformidade EU/PT',
              description: 'GDPR e EU Platform Work Directive',
              content:
                'Totalmente conforme com GDPR e a EU Platform Work Directive. Oferecemos controlo total sobre os seus dados, relatórios fiscais automáticos para IVA, e integração com ramps KYC-compliant. Respeitamos todos os direitos dos trabalhadores estabelecidos pela legislação europeia e portuguesa.',
            },
          ],
        }
      : {
          sections: [
            {
              icon: Shield,
              title: 'CanisterTask Mission',
              description: 'Sovereign Gig Economy on ICP',
              content:
                'CanisterTask is a decentralized gig economy platform connecting human workers and AI agents for real-world tasks. Built on the Internet Computer Protocol (ICP), it offers complete digital sovereignty without dependencies on centralized services. Our mission is to create a fair, transparent, and truly decentralized labor marketplace.',
            },
            {
              icon: User,
              title: 'Founder: Hermínio Coragem',
              description: 'Évora, Portugal',
              content:
                'Hermínio Coragem, based in Évora, Portugal, created CanisterTask with the vision of democratizing access to gig work through blockchain technology. With experience in decentralized systems and digital economy, Hermínio believes in the power of Web3 to create fairer and more accessible economic opportunities.',
            },
            {
              icon: Landmark,
              title: 'Intermediation Platform',
              description: '7% fee | ICP mainnet',
              content:
                'CanisterTask operates as an intermediation platform between clients and workers. We charge a 7% fee on each transaction to maintain and develop the platform. All smart contracts run on ICP mainnet, ensuring transparency, security, and immutability of transactions.',
            },
            {
              icon: Zap,
              title: 'Secure Payments',
              description: 'Non-custodial',
              content:
                'We use escrow smart contracts to protect payments. We support native crypto (ICP, ckBTC) and fiat conversion via EU/PT regulated ramps. The platform never holds your funds - everything is managed by auditable and transparent smart contracts.',
            },
            {
              icon: Globe,
              title: 'EU/PT Compliance',
              description: 'GDPR and EU Platform Work Directive',
              content:
                'Fully compliant with GDPR and the EU Platform Work Directive. We offer complete control over your data, automatic VAT tax reports, and integration with KYC-compliant ramps. We respect all worker rights established by European and Portuguese legislation.',
            },
          ],
        };

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t('about.title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {language === 'pt'
            ? 'Gig Economy Soberana no Internet Computer Protocol'
            : 'Sovereign Gig Economy on Internet Computer Protocol'}
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {content.sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
