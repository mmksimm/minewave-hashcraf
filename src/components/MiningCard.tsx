
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Hash, Clock, Share2, Signal, Users, Database, Wallet, Trophy, ListTodo } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState<'mining' | 'wallet' | 'top' | 'tasks'>('mining');

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [shares]);

  const renderSection = () => {
    switch (activeSection) {
      case 'wallet':
        return (
          <div className="space-y-4">
            <pre className="text-xs opacity-70">
              {`
╔════════════════════════════════════════════╗
║               WALLET STATUS                ║
╚════════════════════════════════════════════╝`}
            </pre>
            <div className="ascii-box">
              <div className="flex justify-between items-center">
                <span>Available Balance:</span>
                <span className="text-lg status-green">125.45 COINS</span>
              </div>
            </div>
            <div className="ascii-box">
              <div className="flex justify-between items-center">
                <span>Pending Rewards:</span>
                <span className="text-lg status-yellow">12.33 COINS</span>
              </div>
            </div>
          </div>
        );
      case 'top':
        return (
          <div className="space-y-4">
            <pre className="text-xs opacity-70">
              {`
╔════════════════════════════════════════════╗
║              TOP MINERS                    ║
╚════════════════════════════════════════════╝`}
            </pre>
            {[1, 2, 3].map((rank) => (
              <div key={rank} className="ascii-box">
                <div className="flex justify-between items-center">
                  <span>#{rank} Miner_{rank}232</span>
                  <span className={`text-lg ${rank === 1 ? 'status-yellow' : ''}`}>{1234 - (rank * 100)} H/s</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-4">
            <pre className="text-xs opacity-70">
              {`
╔════════════════════════════════════════════╗
║              DAILY TASKS                   ║
╚════════════════════════════════════════════╝`}
            </pre>
            <div className="ascii-box">
              <div className="flex justify-between items-center">
                <span>Mine for 1 hour</span>
                <span className="text-sm status-orange">45/60 min</span>
              </div>
            </div>
            <div className="ascii-box">
              <div className="flex justify-between items-center">
                <span>Find 10 shares</span>
                <span className="text-sm status-green">{shares}/10</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
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
                  <span className={`text-lg ${isRunning ? 'status-green' : ''}`}>{formatHashRate(hashRate)}</span>
                  <span className="text-xs opacity-70">HASH/SEC</span>
                </div>
              </div>
              
              <div className="ascii-box">
                <div className="flex flex-col items-center">
                  <Share2 className="w-4 h-4 mb-2 opacity-70" />
                  <span className={`text-lg ${animate ? 'animate-bounce status-yellow' : ''}`}>
                    {shares}
                  </span>
                  <span className="text-xs opacity-70">SHARES</span>
                </div>
              </div>
              
              <div className="ascii-box">
                <div className="flex flex-col items-center">
                  <Signal className="w-4 h-4 mb-2 opacity-70" />
                  <span className="text-lg status-orange">172.50</span>
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
              <Progress value={progress} className="h-2 bg-gray-950 [&>div]:bg-gray-500" />
              <div className="flex justify-between text-xs opacity-70">
                <span>RATE: 0.1 kW/s</span>
                <span>ETA: {formatTime(timeRemaining)}</span>
              </div>
              {isRunning && (
                <div className="text-center text-sm status-green animate-mining">
                  .. :. .: ::
                </div>
              )}
            </div>

            <div className="ascii-box">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 opacity-70" />
                  <span className="text-sm opacity-70">REWARD POOL</span>
                </div>
                <span className="text-lg status-yellow">240.00</span>
              </div>
            </div>

            <Button
              onClick={isRunning ? stopMining : startMining}
              className={`w-full h-12 text-lg font-mono tracking-wider transition-all terminal-border ${
                isRunning 
                  ? 'bg-red-950/20 hover:bg-red-950/30 text-red-500 border-red-500/30' 
                  : 'bg-gray-950/20 hover:bg-gray-950/30'
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-mono text-gray-300">
      <Card className="w-full max-w-2xl terminal-card space-y-6">
        <div className="terminal-header">
          <div className="flex items-center space-x-2">
            <span className="animate-blink">█</span>
            <span className="uppercase tracking-wider">HASHPOWER TERMINAL v1.0</span>
          </div>
          <span className="text-sm opacity-70">BLOCK #359619</span>
        </div>

        <div className="terminal-header space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('mining')}
            className={`${activeSection === 'mining' ? 'text-white' : 'text-gray-500'}`}
          >
            <Hash className="w-4 h-4 mr-2" /> MINING
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('wallet')}
            className={`${activeSection === 'wallet' ? 'text-white' : 'text-gray-500'}`}
          >
            <Wallet className="w-4 h-4 mr-2" /> WALLET
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('top')}
            className={`${activeSection === 'top' ? 'text-white' : 'text-gray-500'}`}
          >
            <Trophy className="w-4 h-4 mr-2" /> TOP
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('tasks')}
            className={`${activeSection === 'tasks' ? 'text-white' : 'text-gray-500'}`}
          >
            <ListTodo className="w-4 h-4 mr-2" /> TASKS
          </Button>
        </div>

        <div className="terminal-content">
          {renderSection()}
          
          <pre className="text-xs opacity-70">
            {`> Ready for next command...█`}
          </pre>
        </div>
      </Card>
    </div>
  );
};
