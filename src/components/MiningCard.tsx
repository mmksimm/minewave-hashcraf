
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Hash, Clock, Share2, Signal, Users, Database } from "lucide-react";
import { useMining } from "@/hooks/useMining";
import { useState, useEffect } from "react";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatHashRate = (hashRate: number) => {
  if (hashRate < 1000) return `${hashRate.toFixed(2)} H/s`;
  if (hashRate < 1000000) return `${(hashRate / 1000).toFixed(2)} KH/s`;
  return `${(hashRate / 1000000).toFixed(2)} MH/s`;
};

export const MiningCard = () => {
  const { isRunning, hashRate, shares, timeRemaining, progress, startMining, stopMining } = useMining();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [shares]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-mono text-green-500">
      <Card className="w-full max-w-2xl terminal-card space-y-6">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <span className="animate-blink">█</span>
            <span className="uppercase tracking-wider">HASHPOWER TERMINAL v1.0</span>
          </div>
          <span className="text-sm opacity-70">BLOCK #359619</span>
        </div>

        <div className="terminal-content">
          <pre className="text-xs opacity-70">
            {`
╔════════════════════════════════════════════╗
║             MINING STATISTICS              ║
╚════════════════════════════════════════════╝`}
          </pre>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="ascii-box">
              <div className="flex flex-col items-center">
                <Hash className="w-4 h-4 mb-2 opacity-70" />
                <span className="text-lg">{formatHashRate(hashRate)}</span>
                <span className="text-xs opacity-70">HASH/SEC</span>
              </div>
            </div>
            
            <div className="ascii-box">
              <div className="flex flex-col items-center">
                <Share2 className="w-4 h-4 mb-2 opacity-70" />
                <span className={`text-lg ${animate ? 'animate-bounce' : ''}`}>
                  {shares}
                </span>
                <span className="text-xs opacity-70">SHARES</span>
              </div>
            </div>
            
            <div className="ascii-box">
              <div className="flex flex-col items-center">
                <Signal className="w-4 h-4 mb-2 opacity-70" />
                <span className="text-lg">172.50</span>
                <span className="text-xs opacity-70">DIFFICULTY</span>
              </div>
            </div>

            <div className="ascii-box">
              <div className="flex flex-col items-center">
                <Users className="w-4 h-4 mb-2 opacity-70" />
                <span className="text-lg">9,146</span>
                <span className="text-xs opacity-70">MINERS</span>
              </div>
            </div>
          </div>

          <div className="ascii-box space-y-2">
            <div className="flex justify-between text-xs">
              <span className="opacity-70">MINING POWER</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-green-950 [&>div]:bg-green-500" />
            <div className="flex justify-between text-xs opacity-70">
              <span>RATE: 0.1 kW/s</span>
              <span>ETA: {formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="ascii-box">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 opacity-70" />
                <span className="text-sm opacity-70">REWARD POOL</span>
              </div>
              <span className="text-lg">240.00</span>
            </div>
          </div>

          <Button
            onClick={isRunning ? stopMining : startMining}
            className={`w-full h-12 text-lg font-mono tracking-wider transition-all terminal-border ${
              isRunning 
                ? 'bg-red-950/20 hover:bg-red-950/30 text-red-500 border-red-500/30' 
                : 'bg-green-950/20 hover:bg-green-950/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> ABORT_MINING
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> EXECUTE_MINING
              </>
            )}
          </Button>
          
          <pre className="text-xs opacity-70 animate-blink">
            {`> Ready for next command...█`}
          </pre>
        </div>
      </Card>
    </div>
  );
};
