
export interface Miner {
  id: number;
  telegram_id: string;
  tokens: number;
  total_shares: number;
  total_hash_rate: number;
  created_at: string;
  last_seen: string;
}

export interface MinerStats {
  tokens: number;
  total_shares: number;
  total_hash_rate: number;
}
