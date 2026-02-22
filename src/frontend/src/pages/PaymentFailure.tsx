import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PaymentFailure() {
  const { t } = useTranslation();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">{t('payment.failure')}</CardTitle>
          <CardDescription>Ocorreu um erro ao processar o pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Por favor, tente novamente ou contacte o suporte se o problema persistir.
          </p>
          <Link to="/">
            <Button className="w-full">Voltar ao Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
