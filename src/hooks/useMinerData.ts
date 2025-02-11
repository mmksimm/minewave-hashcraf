
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Miner, MinerStats } from '@/types/miner';
import { useTelegramApp } from './useTelegramApp';

export const useMinerData = () => {
  const [miner, setMiner] = useState<Miner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { webApp } = useTelegramApp();

  const initializeMiner = async () => {
    if (!webApp?.initDataUnsafe?.user?.id) {
      console.error('No Telegram user ID found');
      return;
    }

    const telegramId = webApp.initDataUnsafe.user.id.toString();

    try {
      // Проверяем существует ли майнер
      let { data: existingMiner } = await supabase
        .from('miners')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (!existingMiner) {
        // Создаем нового майнера
        const { data: newMiner, error } = await supabase
          .from('miners')
          .insert([
            {
              telegram_id: telegramId,
              tokens: 0,
              total_shares: 0,
              total_hash_rate: 0,
              last_seen: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) throw error;
        existingMiner = newMiner;
      }

      setMiner(existingMiner);
    } catch (error) {
      console.error('Error initializing miner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMinerStats = async (stats: Partial<MinerStats>) => {
    if (!miner?.telegram_id) return;

    try {
      const { data, error } = await supabase
        .from('miners')
        .update({
          ...stats,
          last_seen: new Date().toISOString()
        })
        .eq('telegram_id', miner.telegram_id)
        .select()
        .single();

      if (error) throw error;
      setMiner(data);
    } catch (error) {
      console.error('Error updating miner stats:', error);
    }
  };

  useEffect(() => {
    initializeMiner();
  }, [webApp?.initDataUnsafe?.user?.id]);

  return {
    miner,
    isLoading,
    updateMinerStats
  };
};
