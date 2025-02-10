
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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-gray-900/50 border-gray-800 backdrop-blur-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100">HashPower</h2>
            <span className="text-sm font-medium text-gray-400">Block #359619</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
            <Hash className="w-5 h-5 mb-2 text-gray-400" />
            <span className="text-xl font-bold text-gray-100">{formatHashRate(hashRate)}</span>
            <span className="text-xs text-gray-400">Hash Rate</span>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
            <Share2 className="w-5 h-5 mb-2 text-gray-400" />
            <span className={`text-xl font-bold text-gray-100 ${animate ? 'animate-bounce' : ''}`}>
              {shares}
            </span>
            <span className="text-xs text-gray-400">Shares Found</span>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
            <Signal className="w-5 h-5 mb-2 text-gray-400" />
            <span className="text-xl font-bold text-gray-100">172.50</span>
            <span className="text-xs text-gray-400">Difficulty</span>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
            <Users className="w-5 h-5 mb-2 text-gray-400" />
            <span className="text-xl font-bold text-gray-100">9,146</span>
            <span className="text-xs text-gray-400">Active Miners</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Mining Energy</span>
            <span className="text-gray-300">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Recovery: 0.1 kW/s</span>
            <span>{formatTime(timeRemaining)} remaining</span>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Mining Reward</span>
            </div>
            <span className="text-lg font-bold text-gray-100">240.00</span>
          </div>
        </div>

        <Button
          onClick={isRunning ? stopMining : startMining}
          className={`w-full h-12 text-lg font-medium transition-all duration-300 ${
            isRunning 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-5 w-5" /> Stop Mining
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" /> Start Mining
            </>
          )}
        </Button>
      </Card>
    </div>
  );
};
