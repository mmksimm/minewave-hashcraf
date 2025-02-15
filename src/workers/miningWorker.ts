
import CryptoJS from 'crypto-js';

let isRunning = false;
let hashCount = 0;
let lastHashRate = Date.now();
let difficulty = '0000'; // Начальная сложность

const calculateHashRate = () => {
  const now = Date.now();
  const hashRate = (hashCount / (now - lastHashRate)) * 1000;
  hashCount = 0;
  lastHashRate = now;
  return hashRate;
};

const mine = () => {
  if (!isRunning) return;

  const data = Math.random().toString();
  const hash = CryptoJS.SHA256(data).toString();
  
  hashCount++;

  if (hash.startsWith(difficulty)) {
    self.postMessage({ type: 'share_found', data: hash });
  }

  if (hashCount % 100 === 0) {
    self.postMessage({ type: 'hash_rate', data: calculateHashRate() });
  }

  setTimeout(mine, 0);
};

self.onmessage = (e) => {
  if (e.data.type === 'start') {
    isRunning = true;
    difficulty = e.data.difficulty || '0000';
    mine();
  } else if (e.data.type === 'stop') {
    isRunning = false;
  }
};
