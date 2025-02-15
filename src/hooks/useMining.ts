
import { useState, useEffect, useCallback } from 'react';
import { useMinerData } from './useMinerData';
import { useTelegramApp } from './useTelegramApp';
import { supabase } from '@/lib/supabase';

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
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const { miner, updateMinerStats } = useMinerData();
  const { hapticFeedback } = useTelegramApp();

  const startMiningSession = async () => {
    if (!miner?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('mining_sessions')
        .insert([{
          miner_id: miner.id,
          shares_found: 0,
          avg_hash_rate: 0,
          tokens_earned: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error starting mining session:', error);
      return null;
    }
  };

  const endMiningSession = async () => {
    if (!currentSessionId || !miner?.id) return;

    try {
      await supabase
        .from('mining_sessions')
        .update({
          end_time: new Date().toISOString(),
          shares_found: state.shares,
          avg_hash_rate: state.hashRate,
          tokens_earned: state.shares * 0.01 // 0.01 токена за каждый шар
        })
        .eq('id', currentSessionId)
        .eq('miner_id', miner.id);

      // Обновляем ежедневное задание
      const miningTimeMinutes = Math.floor((600 - state.timeRemaining) / 60);
      await supabase
        .from('daily_tasks')
        .upsert([
          {
            miner_id: miner.id,
            date: new Date().toISOString().split('T')[0],
            mining_time_minutes: miningTimeMinutes,
            shares_found: state.shares,
            tokens_rewarded: state.shares * 0.01
          }
        ]);

    } catch (error) {
      console.error('Error ending mining session:', error);
    }
  };

  const startMining = useCallback(async () => {
    if (worker || !miner?.id) return;

    const sessionId = await startMiningSession();
    if (!sessionId) {
      hapticFeedback.error();
      return;
    }
    setCurrentSessionId(sessionId);

    const newWorker = new Worker(
      new URL('../workers/miningWorker.ts', import.meta.url),
      { type: 'module' }
    );

    hapticFeedback.impact('medium');

    newWorker.onmessage = async (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'hash_rate':
          setState(prev => ({ ...prev, hashRate: data }));
          break;
        case 'share_found':
          setState(prev => ({ ...prev, shares: prev.shares + 1 }));
          hapticFeedback.success();
          await updateMinerStats({
            total_shares: (miner.total_shares || 0) + 1,
            total_hash_rate: state.hashRate,
            tokens: (miner.tokens || 0) + 0.01
          });
          break;
      }
    };

    newWorker.postMessage({ 
      type: 'start',
      difficulty: state.difficulty
    });

    setWorker(newWorker);
    setState(prev => ({ ...prev, isRunning: true }));
  }, [worker, miner?.id, state.difficulty, state.hashRate, hapticFeedback, updateMinerStats]);

  const stopMining = useCallback(async () => {
    if (worker) {
      worker.postMessage({ type: 'stop' });
      worker.terminate();
      setWorker(null);
      setState(prev => ({ ...prev, isRunning: false }));
      hapticFeedback.impact('rigid');
      await endMiningSession();
      setCurrentSessionId(null);
    }
  }, [worker, hapticFeedback]);

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

  useEffect(() => {
    if (state.timeRemaining === 0 && state.isRunning) {
      stopMining();
      hapticFeedback.warning();
    }
  }, [state.timeRemaining, state.isRunning, stopMining, hapticFeedback]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, [worker]);

  return {
    ...state,
    startMining,
    stopMining,
  };
};
