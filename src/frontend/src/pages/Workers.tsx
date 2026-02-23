import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import WorkerCard from '../components/WorkerCard';
import { HumanWorkerProfile } from '../backend';
import { useState } from 'react';

// Mock data for demonstration - in production this would come from backend
const MOCK_WORKERS: Array<HumanWorkerProfile & { completedTasks: number; totalEarnings: number; lastTask?: { title: string; completedAt: string } }> = [
  {
    principal: { toString: () => 'mock-principal-1' } as any,
    name: 'João Silva',
    photo: undefined,
    skills: [{ __kind__: 'photography', photography: null }, { __kind__: 'delivery', delivery: null }, { __kind__: 'verification', verification: null }],
    location: { lat: 38.5667, lon: -7.9, radius: 5 },
    price: 12,
    available: true,
    rating: 4.8,
    createdAt: BigInt(Date.now() * 1000000),
    completedTasks: 23,
    totalEarnings: 320,
    lastTask: {
      title: 'Foto loja X',
      completedAt: '2h',
    },
  },
  {
    principal: { toString: () => 'mock-principal-2' } as any,
    name: 'Maria Santos',
    photo: undefined,
    skills: [{ __kind__: 'verification', verification: null }, { __kind__: 'photography', photography: null }],
    location: { lat: 38.5667, lon: -7.9, radius: 10 },
    price: 15,
    available: true,
    rating: 4.9,
    createdAt: BigInt(Date.now() * 1000000),
    completedTasks: 45,
    totalEarnings: 680,
    lastTask: {
      title: 'Verificação morada',
      completedAt: '1h',
    },
  },
  {
    principal: { toString: () => 'mock-principal-3' } as any,
    name: 'Pedro Costa',
    photo: undefined,
    skills: [{ __kind__: 'delivery', delivery: null }, { __kind__: 'custom', custom: 'Entregas urgentes' }],
    location: { lat: 38.5667, lon: -7.9, radius: 15 },
    price: 10,
    available: true,
    rating: 4.7,
    createdAt: BigInt(Date.now() * 1000000),
    completedTasks: 67,
    totalEarnings: 890,
    lastTask: {
      title: 'Entrega documento',
      completedAt: '30min',
    },
  },
];

export default function Workers() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkers = MOCK_WORKERS.filter(worker =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.skills.some(skill => {
      if (typeof skill === 'object' && 'custom' in skill) {
        return skill.custom.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    })
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t('workers.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('workers.subtitle')}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('workers.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredWorkers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('workers.noResults')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.principal.toString()}
              worker={worker}
              completedTasks={worker.completedTasks}
              totalEarnings={worker.totalEarnings}
              lastTask={worker.lastTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
