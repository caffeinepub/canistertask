import { useEffect, useRef, useState } from 'react';
import { useGetDashboardStats } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

export default function TaskHeatmap() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatLayersRef = useRef<{ [key: string]: any }>({});
  const [activeLayer, setActiveLayer] = useState<'active' | 'completed' | 'earnings'>('active');
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [leafletError, setLeafletError] = useState(false);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        const heatScript = document.createElement('script');
        heatScript.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
        heatScript.onload = () => setLeafletLoaded(true);
        heatScript.onerror = () => setLeafletError(true);
        document.head.appendChild(heatScript);
      };
      script.onerror = () => setLeafletError(true);
      document.head.appendChild(script);
    } else if (window.L) {
      setLeafletLoaded(true);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Initialize map centered on Portugal
    const map = L.map(mapRef.current).setView([39.5, -8.0], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Generate mock task location data based on stats
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !stats) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing heat layers
    Object.values(heatLayersRef.current).forEach((layer) => {
      if (layer) map.removeLayer(layer);
    });
    heatLayersRef.current = {};

    // Generate mock data for Évora and Lisboa regions
    const evoraCenter = [38.5714, -7.9087];
    const lisboaCenter = [38.7223, -9.1393];

    const generatePoints = (center: number[], count: number, spread: number) => {
      const points: [number, number, number][] = [];
      for (let i = 0; i < count; i++) {
        const lat = center[0] + (Math.random() - 0.5) * spread;
        const lon = center[1] + (Math.random() - 0.5) * spread;
        const intensity = Math.random() * 0.8 + 0.2;
        points.push([lat, lon, intensity]);
      }
      return points;
    };

    const completedCount = Number(stats.completedTasks);
    const activeCount = Number(stats.totalTasks) - completedCount;

    // Generate active tasks (blue)
    const activePoints = [
      ...generatePoints(evoraCenter, Math.floor(activeCount * 0.6), 0.15),
      ...generatePoints(lisboaCenter, Math.floor(activeCount * 0.4), 0.2),
    ];

    // Generate completed tasks (green)
    const completedPoints = [
      ...generatePoints(evoraCenter, Math.floor(completedCount * 0.6), 0.15),
      ...generatePoints(lisboaCenter, Math.floor(completedCount * 0.4), 0.2),
    ];

    // Generate earnings heat (red)
    const earningsPoints = [
      ...generatePoints(evoraCenter, Math.floor(completedCount * 0.5), 0.12),
      ...generatePoints(lisboaCenter, Math.floor(completedCount * 0.5), 0.18),
    ];

    // Create heat layers
    heatLayersRef.current.active = L.heatLayer(activePoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.0: 'blue', 0.5: 'cyan', 1.0: 'lime' },
    });

    heatLayersRef.current.completed = L.heatLayer(completedPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.0: 'green', 0.5: 'yellow', 1.0: 'red' },
    });

    heatLayersRef.current.earnings = L.heatLayer(earningsPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.0: 'orange', 0.5: 'red', 1.0: 'darkred' },
    });

    // Add initial layer
    if (heatLayersRef.current[activeLayer]) {
      heatLayersRef.current[activeLayer].addTo(map);
    }
  }, [leafletLoaded, stats, activeLayer]);

  // Switch layers
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    const map = mapInstanceRef.current;

    // Remove all layers
    Object.values(heatLayersRef.current).forEach((layer) => {
      if (layer) map.removeLayer(layer);
    });

    // Add selected layer
    if (heatLayersRef.current[activeLayer]) {
      heatLayersRef.current[activeLayer].addTo(map);
    }
  }, [activeLayer, leafletLoaded]);

  if (leafletError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t('analytics.mapLoadError')}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !leafletLoaded) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  if (!stats || stats.totalTasks === 0n) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center p-8">
        <MapPin className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium">{t('analytics.noTaskData')}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('analytics.noTaskDataDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeLayer} onValueChange={(v) => setActiveLayer(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">{t('analytics.activeTasks')}</TabsTrigger>
          <TabsTrigger value="completed">{t('analytics.completedTasks')}</TabsTrigger>
          <TabsTrigger value="earnings">{t('analytics.earningsHeat')}</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div ref={mapRef} className="h-[600px] w-full rounded-lg overflow-hidden" />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div ref={mapRef} className="h-[600px] w-full rounded-lg overflow-hidden" />
        </TabsContent>
        <TabsContent value="earnings" className="mt-4">
          <div ref={mapRef} className="h-[600px] w-full rounded-lg overflow-hidden" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
