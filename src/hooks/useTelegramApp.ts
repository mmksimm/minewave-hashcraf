
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          button_color: string;
          button_text_color: string;
        };
      };
    };
  }
}

export const useTelegramApp = () => {
  const [isReady, setIsReady] = useState(false);
  const webApp = window.Telegram?.WebApp;

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      setIsReady(true);

      // Expand app to full height
      webApp.expand();
    }
  }, [webApp]);

  const showMainButton = (text: string, callback: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(callback);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    webApp?.MainButton?.hide();
  };

  const closeApp = () => {
    webApp?.close();
  };

  return {
    isReady,
    showMainButton,
    hideMainButton,
    closeApp,
    themeParams: webApp?.themeParams,
  };
};
