
import { useEffect, useState } from 'react';

interface TelegramWebApp {
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  MainButton: {
    text: string;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    showProgress: () => void;
    hideProgress: () => void;
  };
  close: () => void;
  sendData: (data: string) => void;
  themeParams: Record<string, any>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegramApp = () => {
  const [isReady, setIsReady] = useState(false);
  const webApp = window.Telegram?.WebApp;

  useEffect(() => {
    if (webApp) {
      setIsReady(true);
    }
  }, [webApp]);

  const showMainButton = (text: string, callback: () => void) => {
    if (webApp) {
      webApp.MainButton.text = text;
      webApp.MainButton.onClick(callback);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp) {
      webApp.MainButton.hide();
    }
  };

  const setMainButtonProgress = (inProgress: boolean) => {
    if (webApp) {
      if (inProgress) {
        webApp.MainButton.showProgress();
      } else {
        webApp.MainButton.hideProgress();
      }
    }
  };

  const closeApp = () => {
    if (webApp) {
      webApp.close();
    }
  };

  const sendData = (data: any) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
    }
  };

  return {
    isReady,
    webApp,
    showMainButton,
    hideMainButton,
    setMainButtonProgress,
    closeApp,
    sendData,
    themeParams: webApp?.themeParams || {}
  };
};
