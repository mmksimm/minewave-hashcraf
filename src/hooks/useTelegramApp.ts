
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        isExpanded: boolean;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          isActive: boolean;
          isVisible: boolean;
          color: string;
          textColor: string;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          isVisible: boolean;
        };
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          button_color: string;
          button_text_color: string;
          secondary_bg_color: string;
        };
        headerColor: string;
        backgroundColor: string;
        sendData: (data: any) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
      };
    };
  }
}

export const useTelegramApp = () => {
  const [isReady, setIsReady] = useState(false);
  const webApp = window.Telegram?.WebApp;

  useEffect(() => {
    if (!webApp) {
      console.error('Telegram WebApp is not available');
      return;
    }

    try {
      // Initialize the WebApp
      webApp.ready();
      setIsReady(true);

      // Expand app to full height
      if (!webApp.isExpanded) {
        webApp.expand();
      }

      // Enable closing confirmation
      webApp.enableClosingConfirmation();

      // Apply theme colors
      document.body.style.backgroundColor = webApp.backgroundColor;

      return () => {
        webApp.disableClosingConfirmation();
      };
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }, [webApp]);

  const showMainButton = (text: string, callback: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text.toUpperCase());
      webApp.MainButton.onClick(callback);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
      webApp.MainButton.offClick(() => {});
    }
  };

  const setMainButtonProgress = (inProgress: boolean) => {
    if (webApp?.MainButton) {
      if (inProgress) {
        webApp.MainButton.showProgress(true);
      } else {
        webApp.MainButton.hideProgress();
      }
    }
  };

  const closeApp = () => {
    webApp?.close();
  };

  const sendData = (data: any) => {
    webApp?.sendData(JSON.stringify(data));
  };

  return {
    isReady,
    showMainButton,
    hideMainButton,
    setMainButtonProgress,
    closeApp,
    sendData,
    themeParams: webApp?.themeParams,
  };
};
