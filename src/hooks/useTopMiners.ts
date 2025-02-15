
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TopMiner } from '@/types/miner';

export const useTopMiners = () => {
  const [topMiners, setTopMiners] = useState<TopMiner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopMiners = async () => {
    try {
      const { data, error } = await supabase
        .from('top_miners')
        .select('*')
        .order('rank', { ascending: true })
        .limit(10);

      if (error) throw error;
      setTopMiners(data || []);
    } catch (error) {
      console.error('Error fetching top miners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopMiners();
    // Обновляем список каждые 5 минут
    const interval = setInterval(fetchTopMiners, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    topMiners,
    isLoading,
    refreshTopMiners: fetchTopMiners
  };
};
