
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
    color: string;
    textColor: string;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    showProgress: () => void;
    hideProgress: () => void;
    enable: () => void;
    disable: () => void;
    setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
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
      webApp.MainButton.setParams({
        text: text,
        color: '#1c1c1e',
        text_color: '#ffffff',
        is_active: true,
        is_visible: true
      });
      webApp.MainButton.onClick(callback);
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
        webApp.HapticFeedback.impactOccurred('medium');
      } else {
        webApp.MainButton.hideProgress();
      }
    }
  };

  const hapticFeedback = {
    success: () => webApp?.HapticFeedback.notificationOccurred('success'),
    error: () => webApp?.HapticFeedback.notificationOccurred('error'),
    warning: () => webApp?.HapticFeedback.notificationOccurred('warning'),
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => 
      webApp?.HapticFeedback.impactOccurred(style),
    selection: () => webApp?.HapticFeedback.selectionChanged()
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
    hapticFeedback,
    themeParams: webApp?.themeParams || {}
  };
};
