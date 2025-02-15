
import CryptoJS from 'crypto-js';

let isRunning = false;
let hashCount = 0;
let lastHashRate = Date.now();
let wasmModule: any = null;

const calculateHashRate = () => {
  const now = Date.now();
  const hashRate = (hashCount / (now - lastHashRate)) * 1000;
  hashCount = 0;
  lastHashRate = now;
  return hashRate;
};

async function initWasm() {
  try {
    // Загружаем WebAssembly модуль
    const response = await fetch('/sha256.wasm');
    const wasmBuffer = await response.arrayBuffer();
    const wasmInstance = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
        consoleLog: (value: number) => console.log(value)
      }
    });
    wasmModule = wasmInstance.instance.exports;
    return true;
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    return false;
  }
}

const mine = async (difficulty: string) => {
  if (!wasmModule) {
    // Если WASM не загрузился, используем CryptoJS как fallback
    const data = Math.random().toString();
    const hash = CryptoJS.SHA256(data).toString();
    
    hashCount++;

    if (hash.startsWith(difficulty)) {
      self.postMessage({ type: 'share_found', data: hash });
    }
  } else {
    // Используем WASM для вычисления хэша
    const data = new TextEncoder().encode(Math.random().toString());
    const dataPtr = wasmModule.allocate(data.length);
    
    // Копируем данные в память WASM
    const memory = new Uint8Array(wasmModule.memory.buffer);
    memory.set(data, dataPtr);
    
    // Вычисляем хэш
    const hashPtr = wasmModule.sha256(dataPtr, data.length);
    const hash = new Uint8Array(wasmModule.memory.buffer, hashPtr, 32);
    
    // Конвертируем хэш в hex строку
    const hashHex = Array.from(hash)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    hashCount++;

    if (hashHex.startsWith(difficulty)) {
      self.postMessage({ type: 'share_found', data: hashHex });
    }
    
    // Освобождаем память
    wasmModule.deallocate(dataPtr);
    wasmModule.deallocate(hashPtr);
  }

  if (hashCount % 100 === 0) {
    self.postMessage({ type: 'hash_rate', data: calculateHashRate() });
  }

  if (isRunning) {
    setTimeout(() => mine(difficulty), 0);
  }
};

self.onmessage = async (e) => {
  if (e.data.type === 'start') {
    isRunning = true;
    
    // Инициализируем WASM при первом старте
    if (!wasmModule) {
      await initWasm();
    }
    
    mine(e.data.difficulty);
  } else if (e.data.type === 'stop') {
    isRunning = false;
  }
};
