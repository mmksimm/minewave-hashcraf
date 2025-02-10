
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Hash, Clock, Share2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="glass-card w-full max-w-2xl p-8 space-y-8">
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-500">Mining Status</span>
          <h2 className="text-3xl font-bold tracking-tight">Hash Power</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <Hash className="w-6 h-6 mb-2 text-gray-600" />
            <span className="text-2xl font-bold">{formatHashRate(hashRate)}</span>
            <span className="text-sm text-gray-500">Hash Rate</span>
          </div>
          
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <Share2 className="w-6 h-6 mb-2 text-gray-600" />
            <span className={`text-2xl font-bold ${animate ? 'animate-bounce' : ''}`}>
              {shares}
            </span>
            <span className="text-sm text-gray-500">Shares Found</span>
          </div>
          
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 mb-2 text-gray-600" />
            <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
            <span className="text-sm text-gray-500">Time Remaining</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Mining Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Button
          onClick={isRunning ? stopMining : startMining}
          className="w-full h-12 text-lg font-medium transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white"
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
