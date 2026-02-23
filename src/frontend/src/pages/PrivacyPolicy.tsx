import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Users, Lock, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const { t, language } = useTranslation();

  const content =
    language === 'pt'
      ? {
          sections: [
            {
              icon: FileText,
              title: '1. Introdução',
              content:
                'Esta Política de Privacidade descreve como o CanisterTask ("nós", "nosso" ou "plataforma") recolhe, utiliza, armazena e protege os seus dados pessoais em conformidade com o Regulamento Geral sobre a Proteção de Dados (GDPR) e a legislação portuguesa. Ao utilizar a plataforma, concorda com as práticas descritas nesta política.',
            },
            {
              icon: Database,
              title: '2. Dados Recolhidos',
              content:
                'Recolhemos os seguintes dados pessoais: (a) Dados de identificação: nome, principal ID do Internet Identity; (b) Dados de localização: coordenadas GPS para matching de tarefas; (c) Dados profissionais: competências, preços por hora, disponibilidade; (d) Dados de perfil: fotos de perfil (opcional); (e) Dados de transações: histórico de tarefas, pagamentos, avaliações. Todos os dados são armazenados de forma descentralizada no Internet Computer Protocol (ICP).',
            },
            {
              icon: Users,
              title: '3. Utilização de Dados',
              content:
                'Os seus dados são utilizados para: (a) Conectar trabalhadores e clientes através de matching baseado em localização e competências; (b) Processar pagamentos e gerir transações através de smart contracts; (c) Validar a conclusão de tarefas e gerir disputas; (d) Melhorar a plataforma através de análise agregada e anónima; (e) Cumprir obrigações legais e fiscais (relatórios IVA, KYC quando aplicável).',
            },
            {
              icon: Shield,
              title: '4. Partilha de Dados',
              content:
                'Partilhamos dados apenas nas seguintes situações: (a) Com ramps de pagamento regulados (Stripe, MoonPay) para processos KYC/AML quando necessário para conversões fiat; (b) Com validadores descentralizados para verificação de conclusão de tarefas; (c) Com autoridades fiscais portuguesas quando legalmente obrigatório; (d) Dados públicos de perfil (nome, competências, avaliações) são visíveis para outros utilizadores da plataforma. Nunca vendemos os seus dados a terceiros.',
            },
            {
              icon: Lock,
              title: '5. Direitos do Utilizador (GDPR)',
              content:
                'Tem os seguintes direitos sobre os seus dados: (a) Direito de acesso: pode solicitar uma cópia de todos os seus dados; (b) Direito de retificação: pode corrigir dados incorretos; (c) Direito ao apagamento: pode solicitar a eliminação da sua conta e dados (sujeito a obrigações legais de retenção); (d) Direito à portabilidade: pode exportar os seus dados em formato estruturado; (e) Direito de oposição: pode opor-se ao processamento de dados para fins específicos; (f) Direito de revogar consentimento a qualquer momento.',
            },
            {
              icon: Shield,
              title: '6. Segurança e Armazenamento',
              content:
                'Implementamos as seguintes medidas de segurança: (a) Criptografia end-to-end para dados sensíveis; (b) Armazenamento descentralizado no ICP com replicação automática; (c) Smart contracts auditáveis e imutáveis para transações; (d) Autenticação via Internet Identity (sem passwords); (e) Acesso aos dados limitado por permissões baseadas em roles. Os dados são retidos enquanto a sua conta estiver ativa, ou conforme exigido por lei (mínimo 7 anos para dados fiscais).',
            },
            {
              icon: FileText,
              title: '7. EU Platform Work Directive',
              content:
                'Em conformidade com a EU Platform Work Directive, garantimos: (a) Transparência total sobre algoritmos de matching e preços; (b) Direito a explicação sobre decisões automatizadas; (c) Acesso a dados sobre o seu desempenho e avaliações; (d) Processo justo de resolução de disputas; (e) Proteção contra desativação arbitrária de conta.',
            },
            {
              icon: Mail,
              title: '8. Contacto e DPO',
              content:
                'Para questões sobre privacidade, exercício de direitos GDPR, ou reclamações, contacte o nosso Data Protection Officer: Email: privacy@canistertask.icp | Morada: Évora, Portugal. Tem também o direito de apresentar queixa à Comissão Nacional de Proteção de Dados (CNPD) em Portugal.',
            },
          ],
        }
      : {
          sections: [
            {
              icon: FileText,
              title: '1. Introduction',
              content:
                'This Privacy Policy describes how CanisterTask ("we", "our" or "platform") collects, uses, stores and protects your personal data in compliance with the General Data Protection Regulation (GDPR) and Portuguese legislation. By using the platform, you agree to the practices described in this policy.',
            },
            {
              icon: Database,
              title: '2. Data Collected',
              content:
                'We collect the following personal data: (a) Identification data: name, Internet Identity principal ID; (b) Location data: GPS coordinates for task matching; (c) Professional data: skills, hourly rates, availability; (d) Profile data: profile photos (optional); (e) Transaction data: task history, payments, ratings. All data is stored decentrally on the Internet Computer Protocol (ICP).',
            },
            {
              icon: Users,
              title: '3. Data Usage',
              content:
                'Your data is used to: (a) Connect workers and clients through location and skill-based matching; (b) Process payments and manage transactions through smart contracts; (c) Validate task completion and manage disputes; (d) Improve the platform through aggregated and anonymous analysis; (e) Comply with legal and tax obligations (VAT reports, KYC when applicable).',
            },
            {
              icon: Shield,
              title: '4. Data Sharing',
              content:
                'We share data only in the following situations: (a) With regulated payment ramps (Stripe, MoonPay) for KYC/AML processes when necessary for fiat conversions; (b) With decentralized validators for task completion verification; (c) With Portuguese tax authorities when legally required; (d) Public profile data (name, skills, ratings) is visible to other platform users. We never sell your data to third parties.',
            },
            {
              icon: Lock,
              title: '5. User Rights (GDPR)',
              content:
                'You have the following rights over your data: (a) Right of access: you can request a copy of all your data; (b) Right of rectification: you can correct incorrect data; (c) Right to erasure: you can request deletion of your account and data (subject to legal retention obligations); (d) Right to portability: you can export your data in structured format; (e) Right to object: you can object to data processing for specific purposes; (f) Right to withdraw consent at any time.',
            },
            {
              icon: Shield,
              title: '6. Security and Storage',
              content:
                'We implement the following security measures: (a) End-to-end encryption for sensitive data; (b) Decentralized storage on ICP with automatic replication; (c) Auditable and immutable smart contracts for transactions; (d) Authentication via Internet Identity (no passwords); (e) Data access limited by role-based permissions. Data is retained while your account is active, or as required by law (minimum 7 years for tax data).',
            },
            {
              icon: FileText,
              title: '7. EU Platform Work Directive',
              content:
                'In compliance with the EU Platform Work Directive, we ensure: (a) Full transparency about matching algorithms and pricing; (b) Right to explanation about automated decisions; (c) Access to data about your performance and ratings; (d) Fair dispute resolution process; (e) Protection against arbitrary account deactivation.',
            },
            {
              icon: Mail,
              title: '8. Contact and DPO',
              content:
                'For privacy questions, exercising GDPR rights, or complaints, contact our Data Protection Officer: Email: privacy@canistertask.icp | Address: Évora, Portugal. You also have the right to file a complaint with the Portuguese Data Protection Authority (CNPD).',
            },
          ],
        };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('privacy.title')}</h1>

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
