import { ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { AsyncBoundary } from './AsyncBoundary';
import { QueryPendingFallback } from './QueryPendingFallback';
import { QueryRejectedFallback } from './QueryRejectedFallback';

type Props = {
  children: ReactNode;
  pendingMessage: string;
  rejectedMessage: string;
};

export function QueryAsyncBoundary({ children, pendingMessage, rejectedMessage }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <AsyncBoundary
          pendingFallback={<QueryPendingFallback message={pendingMessage} />}
          rejectedFallback={({ reset: resetError }) => (
            <QueryRejectedFallback
              message={rejectedMessage}
              onRetry={() => {
                reset();
                resetError();
              }}
            />
          )}
        >
          {children}
        </AsyncBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
