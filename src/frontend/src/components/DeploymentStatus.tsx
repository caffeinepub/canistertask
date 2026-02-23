import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DeploymentStatus() {
  const canisters = [
    {
      name: 'canistertask_main',
      id: 'hvqen-viaaa-aaaah-qsznq-cai',
      description: 'Main backend canister',
    },
    {
      name: 'canistertask_escrow',
      id: 'ijyzg-zaaaa-aaaao-qnzzq-cai',
      description: 'Payment escrow canister',
    },
    {
      name: 'canistertask_stats',
      id: 'dzmpl-3yaaa-aaaae-aexya-cai',
      description: 'Statistics canister',
    },
  ];

  return (
    <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-lg">Canisters Mainnet Ativos</CardTitle>
        </div>
        <CardDescription>3 canisters implantados na Internet Computer mainnet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {canisters.map((canister) => (
          <div key={canister.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">{canister.name}</span>
                <Badge variant="outline" className="text-xs">
                  MAINNET
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{canister.description}</p>
              <a
                href={`https://${canister.id}.icp0.io/`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <span className="font-mono">{canister.id}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
