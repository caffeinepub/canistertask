import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  const { t, language } = useTranslation();

  const content =
    language === 'pt'
      ? {
          sections: [
            {
              title: '1. Introdução',
              content:
                'Esta Política de Privacidade descreve como o CanisterTask recolhe, utiliza e protege os seus dados pessoais em conformidade com o GDPR.',
            },
            {
              title: '2. Dados Recolhidos',
              content:
                'Recolhemos: nome, localização GPS, competências, preços, fotos de perfil, e dados de transações. Todos os dados são armazenados de forma descentralizada no ICP.',
            },
            {
              title: '3. Utilização de Dados',
              content:
                'Os seus dados são utilizados para: conectar trabalhadores e clientes, processar pagamentos, validar tarefas, e melhorar a plataforma.',
            },
            {
              title: '4. Partilha de Dados',
              content:
                'Partilhamos dados apenas com: ramps de pagamento regulados (Stripe/MoonPay) para KYC, e validadores descentralizados para verificação de tarefas.',
            },
            {
              title: '5. Direitos do Utilizador',
              content:
                'Tem direito a: aceder aos seus dados, exportar dados, eliminar a sua conta, e revogar consentimentos a qualquer momento.',
            },
            {
              title: '6. Segurança',
              content:
                'Utilizamos criptografia end-to-end, armazenamento descentralizado no ICP, e smart contracts auditáveis para proteger os seus dados.',
            },
            {
              title: '7. Contacto',
              content: 'Para questões sobre privacidade, contacte: privacy@canistertask.icp',
            },
          ],
        }
      : {
          sections: [
            {
              title: '1. Introduction',
              content:
                'This Privacy Policy describes how CanisterTask collects, uses, and protects your personal data in compliance with GDPR.',
            },
            {
              title: '2. Data Collected',
              content:
                'We collect: name, GPS location, skills, prices, profile photos, and transaction data. All data is stored decentrally on ICP.',
            },
            {
              title: '3. Data Usage',
              content:
                'Your data is used to: connect workers and clients, process payments, validate tasks, and improve the platform.',
            },
            {
              title: '4. Data Sharing',
              content:
                'We share data only with: regulated payment ramps (Stripe/MoonPay) for KYC, and decentralized validators for task verification.',
            },
            {
              title: '5. User Rights',
              content:
                'You have the right to: access your data, export data, delete your account, and revoke consents at any time.',
            },
            {
              title: '6. Security',
              content:
                'We use end-to-end encryption, decentralized ICP storage, and auditable smart contracts to protect your data.',
            },
            {
              title: '7. Contact',
              content: 'For privacy questions, contact: privacy@canistertask.icp',
            },
          ],
        };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('privacy.title')}</h1>

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
