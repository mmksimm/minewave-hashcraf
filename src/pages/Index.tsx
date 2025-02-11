
import { useEffect } from "react";
import { MiningCard } from "@/components/MiningCard";
import { useTelegramApp } from "@/hooks/useTelegramApp";

const Index = () => {
  const { isReady } = useTelegramApp();

  useEffect(() => {
    // Check if app is running inside Telegram Web App
    const isTelegramWebApp = window.Telegram?.WebApp;
    if (!isTelegramWebApp) {
      alert("This application can only be accessed through Telegram Web App");
      return;
    }

    // Set viewport meta tag for mobile devices
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-300 animate-pulse">Initializing...</div>
      </div>
    );
  }

  return <MiningCard />;
};

export default Index;
