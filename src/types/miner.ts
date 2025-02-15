
export interface Miner {
  id: number;
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  tokens: number;
  total_shares: number;
  total_hash_rate: number;
  last_seen: string;
  created_at: string;
}

export interface MinerStats {
  tokens: number;
  total_shares: number;
  total_hash_rate: number;
}

export interface TopMiner extends Miner {
  rank: number;
}

export interface DailyTask {
  id: number;
  miner_id: number;
  date: string;
  mining_time_minutes: number;
  shares_found: number;
  completed: boolean;
  tokens_rewarded: number;
}

export interface MiningSession {
  id: number;
  miner_id: number;
  start_time: string;
  end_time?: string;
  shares_found: number;
  avg_hash_rate: number;
  tokens_earned: number;
}
