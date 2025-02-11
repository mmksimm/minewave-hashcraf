
import { useEffect } from "react";
import { MiningCard } from "@/components/MiningCard";
import { useTelegramApp } from "@/hooks/useTelegramApp";

const Index = () => {
  const { isReady } = useTelegramApp();

  useEffect(() => {
    // Check if app is running inside Telegram Web App
    const isTelegramWebApp = window.Telegram?.WebApp;
    if (!isTelegramWebApp) {
      alert("This app can only be accessed through Telegram Web App");
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-300 animate-pulse">Loading...</div>
      </div>
    );
  }

  return <MiningCard />;
};

export default Index;
