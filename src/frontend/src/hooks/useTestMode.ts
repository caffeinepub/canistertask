import { useState } from 'react';

interface TestModeSimulation {
  workerEarnings: number;
  platformFee: number;
  taskPrice: number;
  timestamp: number;
}

interface TestModeStats {
  totalTasks: number;
  totalEarnings: number;
}

export function useTestMode() {
  const [lastSimulation, setLastSimulation] = useState<TestModeSimulation | null>(null);
  const [stats, setStats] = useState<TestModeStats>({ totalTasks: 0, totalEarnings: 0 });

  const simulateTaskCompletion = (taskPrice: number): TestModeSimulation => {
    const platformFee = taskPrice * 0.07;
    const workerEarnings = taskPrice * 0.93;

    const simulation: TestModeSimulation = {
      workerEarnings: Number(workerEarnings.toFixed(2)),
      platformFee: Number(platformFee.toFixed(2)),
      taskPrice,
      timestamp: Date.now(),
    };

    setLastSimulation(simulation);
    
    // Update accumulated stats
    setStats(prev => ({
      totalTasks: prev.totalTasks + 1,
      totalEarnings: Number((prev.totalEarnings + workerEarnings).toFixed(2)),
    }));

    return simulation;
  };

  return {
    simulateTaskCompletion,
    lastSimulation,
    stats,
  };
}
