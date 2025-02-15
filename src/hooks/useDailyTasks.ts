
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DailyTask } from '@/types/miner';
import { useTelegramApp } from './useTelegramApp';

export const useDailyTasks = (minerId: number | null) => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hapticFeedback } = useTelegramApp();

  const fetchTasks = async () => {
    if (!minerId) return;

    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('miner_id', minerId)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create new daily tasks if none exist
        const { data: newTasks, error: createError } = await supabase
          .from('daily_tasks')
          .insert([
            {
              miner_id: minerId,
              date: new Date().toISOString().split('T')[0],
              mining_time_minutes: 0,
              shares_found: 0,
              completed: false,
              tokens_rewarded: 0
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        setTasks([newTasks]);
      } else {
        setTasks([data]);
      }
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: number, updates: Partial<DailyTask>) => {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...data } : task
      ));

      if (data.completed && !tasks[0]?.completed) {
        hapticFeedback.success();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      hapticFeedback.error();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [minerId]);

  return {
    tasks,
    isLoading,
    updateTask,
    refreshTasks: fetchTasks
  };
};
