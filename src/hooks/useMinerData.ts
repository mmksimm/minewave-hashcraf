
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Miner, MinerStats } from '@/types/miner';
import { useTelegramApp } from './useTelegramApp';

export const useMinerData = () => {
  const [miner, setMiner] = useState<Miner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { webApp, hapticFeedback } = useTelegramApp();

  const initializeMiner = async () => {
    if (!webApp?.initDataUnsafe?.user?.id) {
      console.error('No Telegram user ID found');
      return;
    }

    const telegramId = webApp.initDataUnsafe.user.id.toString();
    const user = webApp.initDataUnsafe.user;

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
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
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
        hapticFeedback.success();
      }

      setMiner(existingMiner);

      // Подписываемся на обновления майнера
      const channel = supabase
        .channel('miner_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'miners',
            filter: `telegram_id=eq.${telegramId}`
          },
          (payload) => {
            console.log('Miner updated:', payload);
            if (payload.new) {
              setMiner(payload.new as Miner);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error initializing miner:', error);
      hapticFeedback.error();
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
      hapticFeedback.error();
    }
  };

  useEffect(() => {
    const cleanup = initializeMiner();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [webApp?.initDataUnsafe?.user?.id]);

  return {
    miner,
    isLoading,
    updateMinerStats
  };
};
