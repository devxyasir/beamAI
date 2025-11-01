import { useEffect } from 'react';
import { vscode } from '../vscode';

export function useVSCodeMessage(handler: (message: any) => void) {
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      handler(message);
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [handler]);

  return {
    postMessage: (type: string, data?: any) => {
      vscode.postMessage({ type, ...data });
    }
  };
}
