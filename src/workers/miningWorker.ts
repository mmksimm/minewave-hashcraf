
import CryptoJS from 'crypto-js';

let isRunning = false;
let hashCount = 0;
let lastHashRate = Date.now();

const calculateHashRate = () => {
  const now = Date.now();
  const hashRate = (hashCount / (now - lastHashRate)) * 1000;
  hashCount = 0;
  lastHashRate = now;
  return hashRate;
};

const mine = (difficulty: string) => {
  const data = Math.random().toString();
  const hash = CryptoJS.SHA256(data).toString();
  
  hashCount++;

  if (hash.startsWith(difficulty)) {
    self.postMessage({ type: 'share_found', data: hash });
  }

  if (hashCount % 100 === 0) {
    self.postMessage({ type: 'hash_rate', data: calculateHashRate() });
  }

  if (isRunning) {
    setTimeout(() => mine(difficulty), 0);
  }
};

self.onmessage = (e) => {
  if (e.data.type === 'start') {
    isRunning = true;
    mine(e.data.difficulty);
  } else if (e.data.type === 'stop') {
    isRunning = false;
  }
};
