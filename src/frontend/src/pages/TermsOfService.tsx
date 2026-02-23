import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, FileText, Users, Euro, Scale, Shield, Ban } from 'lucide-react';

export default function TermsOfService() {
  const { t, language } = useTranslation();

  const content =
    language === 'pt'
      ? {
          disclaimer: 'AVISO IMPORTANTE: O CanisterTask é uma plataforma de gig economy. Não existe relação de emprego formal. Consulte um fiscalista para obrigações fiscais em Portugal.',
          sections: [
            {
              icon: FileText,
              title: '1. Aceitação dos Termos',
              content:
                'Ao utilizar o CanisterTask, aceita estes Termos de Serviço na íntegra. Se não concordar com qualquer parte destes termos, não utilize a plataforma. Estes termos constituem um acordo legal vinculativo entre você e o CanisterTask.',
            },
            {
              icon: Users,
              title: '2. Natureza da Relação - Plataforma de Intermediação',
              content:
                'O CanisterTask é uma plataforma de intermediação de gig economy. NÃO existe relação de emprego entre trabalhadores e clientes, nem entre trabalhadores e a plataforma. Cada utilizador é um prestador de serviços independente, responsável pelas suas próprias obrigações fiscais, segurança social, e seguros. A plataforma apenas facilita a conexão entre partes.',
            },
            {
              icon: Euro,
              title: '3. Pagamentos e Taxa da Plataforma (7%)',
              content:
                'O CanisterTask cobra uma taxa de 7% sobre o valor de cada transação concluída. Esta taxa é deduzida automaticamente do pagamento total. Exemplo: Task de €100 → Trabalhador recebe €93, Plataforma recebe €7. Os pagamentos são processados através de smart contracts no ICP. Suportamos ICP, ckBTC, e conversões fiat via ramps regulados (Stripe, MoonPay). Todos os valores são finais após confirmação on-chain.',
            },
            {
              icon: Scale,
              title: '4. Obrigações dos Utilizadores',
              content:
                'Trabalhadores devem: (a) Fornecer informações precisas e atualizadas; (b) Cumprir prazos e requisitos das tasks aceites; (c) Declarar rendimentos às autoridades fiscais portuguesas; (d) Manter seguros adequados (responsabilidade civil, acidentes de trabalho). Clientes devem: (a) Descrever tasks de forma clara e precisa; (b) Pagar o valor acordado após conclusão satisfatória; (c) Fornecer feedback honesto e construtivo.',
            },
            {
              icon: Shield,
              title: '5. Responsabilidade e Garantias',
              content:
                'A plataforma é fornecida "AS IS" sem garantias. O CanisterTask não é responsável por: (a) Qualidade ou resultado das tasks executadas; (b) Disputas entre trabalhadores e clientes; (c) Danos, perdas ou lesões durante a execução de tasks; (d) Incumprimento de obrigações fiscais ou legais por utilizadores; (e) Perdas financeiras resultantes de flutuações de crypto. Responsabilidade máxima limitada ao valor da taxa de plataforma da transação em questão.',
            },
            {
              icon: Scale,
              title: '6. Resolução de Disputas',
              content:
                'Em caso de disputa: (1) Tente resolver diretamente com a outra parte através do chat da plataforma; (2) Se não resolver, pode solicitar mediação da plataforma (não vinculativa); (3) Disputas legais serão resolvidas nos tribunais de Évora, Portugal, sob lei portuguesa. Para disputas de consumo, pode recorrer ao Centro de Arbitragem de Conflitos de Consumo.',
            },
            {
              icon: FileText,
              title: '7. Conformidade EU Platform Work Directive',
              content:
                'Em conformidade com a EU Platform Work Directive: (a) Transparência total sobre algoritmos de matching e preços; (b) Direito a explicação sobre decisões automatizadas; (c) Processo justo de desativação de conta (com aviso prévio e direito de recurso); (d) Acesso a dados sobre desempenho e avaliações; (e) Proteção de dados conforme GDPR.',
            },
            {
              icon: Ban,
              title: '8. Suspensão e Terminação',
              content:
                'Podemos suspender ou terminar contas em caso de: (a) Violação destes Termos de Serviço; (b) Atividade fraudulenta ou ilegal; (c) Comportamento abusivo ou assédio; (d) Múltiplas reclamações fundamentadas. Você pode encerrar a sua conta a qualquer momento através das configurações. Dados serão retidos conforme Política de Privacidade e obrigações legais.',
            },
          ],
        }
      : {
          disclaimer: 'IMPORTANT NOTICE: CanisterTask is a gig economy platform. There is no formal employment relationship. Consult a tax advisor for tax obligations in Portugal.',
          sections: [
            {
              icon: FileText,
              title: '1. Acceptance of Terms',
              content:
                'By using CanisterTask, you accept these Terms of Service in full. If you do not agree with any part of these terms, do not use the platform. These terms constitute a legally binding agreement between you and CanisterTask.',
            },
            {
              icon: Users,
              title: '2. Nature of Relationship - Intermediation Platform',
              content:
                'CanisterTask is a gig economy intermediation platform. There is NO employment relationship between workers and clients, nor between workers and the platform. Each user is an independent service provider, responsible for their own tax obligations, social security, and insurance. The platform only facilitates connections between parties.',
            },
            {
              icon: Euro,
              title: '3. Payments and Platform Fee (7%)',
              content:
                'CanisterTask charges a 7% fee on the value of each completed transaction. This fee is automatically deducted from the total payment. Example: €100 task → Worker receives €93, Platform receives €7. Payments are processed through smart contracts on ICP. We support ICP, ckBTC, and fiat conversions via regulated ramps (Stripe, MoonPay). All amounts are final after on-chain confirmation.',
            },
            {
              icon: Scale,
              title: '4. User Obligations',
              content:
                'Workers must: (a) Provide accurate and up-to-date information; (b) Meet deadlines and requirements of accepted tasks; (c) Declare income to Portuguese tax authorities; (d) Maintain adequate insurance (liability, work accidents). Clients must: (a) Describe tasks clearly and accurately; (b) Pay the agreed amount after satisfactory completion; (c) Provide honest and constructive feedback.',
            },
            {
              icon: Shield,
              title: '5. Liability and Warranties',
              content:
                'The platform is provided "AS IS" without warranties. CanisterTask is not responsible for: (a) Quality or outcome of executed tasks; (b) Disputes between workers and clients; (c) Damages, losses or injuries during task execution; (d) Non-compliance with tax or legal obligations by users; (e) Financial losses from crypto fluctuations. Maximum liability limited to the platform fee amount of the transaction in question.',
            },
            {
              icon: Scale,
              title: '6. Dispute Resolution',
              content:
                'In case of dispute: (1) Try to resolve directly with the other party through platform chat; (2) If unresolved, you can request platform mediation (non-binding); (3) Legal disputes will be resolved in Évora courts, Portugal, under Portuguese law. For consumer disputes, you can use the Consumer Arbitration Center.',
            },
            {
              icon: FileText,
              title: '7. EU Platform Work Directive Compliance',
              content:
                'In compliance with the EU Platform Work Directive: (a) Full transparency about matching algorithms and pricing; (b) Right to explanation about automated decisions; (c) Fair account deactivation process (with prior notice and right of appeal); (d) Access to performance and rating data; (e) Data protection according to GDPR.',
            },
            {
              icon: Ban,
              title: '8. Suspension and Termination',
              content:
                'We may suspend or terminate accounts in case of: (a) Violation of these Terms of Service; (b) Fraudulent or illegal activity; (c) Abusive behavior or harassment; (d) Multiple substantiated complaints. You can close your account at any time through settings. Data will be retained according to Privacy Policy and legal obligations.',
            },
          ],
        };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('terms.title')}</h1>

        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{content.disclaimer}</AlertDescription>
        </Alert>

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
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{section.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {language === 'pt' ? 'Última atualização: Fevereiro 2026' : 'Last updated: February 2026'}
        </p>
      </div>
    </div>
  );
}
