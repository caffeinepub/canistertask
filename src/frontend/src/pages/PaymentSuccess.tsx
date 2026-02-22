import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PaymentSuccess() {
  const { t } = useTranslation();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">{t('payment.success')}</CardTitle>
          <CardDescription>O seu pagamento foi processado com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            A tarefa foi atribuída e pode começar a trabalhar nela.
          </p>
          <Link to="/">
            <Button className="w-full">Voltar ao Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
