import { css } from '@emotion/react';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { GlobalPortal } from '../GlobalPortal';

type ToastType = 'success' | 'error';

interface ToastState {
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (toast: ToastState) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (toast === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  const value = useMemo(
    () => ({
      showToast(nextToast: ToastState) {
        setToast(nextToast);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <GlobalPortal.Consumer>
        {toast ? (
          <div
            css={css`
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 9999;
              width: min(calc(100vw - 32px), 420px);
            `}
          >
            <div
              css={css`
                padding: 12px 14px;
                border-radius: 12px;
                background: ${toast.type === 'success' ? colors.blue600 : colors.red500};
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
              `}
            >
              <Text typography="t7" fontWeight="medium" color={colors.white}>
                {toast.message}
              </Text>
            </div>
          </div>
        ) : null}
      </GlobalPortal.Consumer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
