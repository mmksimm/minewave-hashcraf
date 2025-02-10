
import { useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';

interface MiningState {
  isRunning: boolean;
  hashRate: number;
  shares: number;
  timeRemaining: number;
  difficulty: string;
  progress: number;
}

export const useMining = () => {
  const [state, setState] = useState<MiningState>({
    isRunning: false,
    hashRate: 0,
    shares: 0,
    timeRemaining: 600, // 10 minutes in seconds
    difficulty: '0000',
    progress: 0,
  });

  const [worker, setWorker] = useState<Worker | null>(null);

  const startMining = useCallback(() => {
    if (worker) return;

    const newWorker = new Worker(
      new URL('../workers/miningWorker.ts', import.meta.url),
      { type: 'module' }
    );

    newWorker.onmessage = (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'hash_rate':
          setState(prev => ({ ...prev, hashRate: data }));
          break;
        case 'share_found':
          setState(prev => ({ ...prev, shares: prev.shares + 1 }));
          break;
        case 'progress':
          setState(prev => ({ ...prev, progress: data }));
          break;
      }
    };

    setWorker(newWorker);
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const stopMining = useCallback(() => {
    if (worker) {
      worker.terminate();
      setWorker(null);
      setState(prev => ({ ...prev, isRunning: false }));
    }
  }, [worker]);

  useEffect(() => {
    let timer: number;
    
    if (state.isRunning && state.timeRemaining > 0) {
      timer = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          progress: ((600 - prev.timeRemaining + 1) / 600) * 100,
        }));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isRunning, state.timeRemaining]);

  return {
    ...state,
    startMining,
    stopMining,
  };
};
