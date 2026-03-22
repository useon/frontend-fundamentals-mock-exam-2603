import { ReactNode, Suspense, SuspenseProps } from 'react';
import { ApiErrorBoundary } from './ApiErrorBoundary';

type FallbackProps = {
  error: Error;
  reset: () => void;
};

type Props = {
  children: ReactNode;
  pendingFallback: SuspenseProps['fallback'];
  rejectedFallback: (props: FallbackProps) => ReactNode;
};

export function AsyncBoundary({ children, pendingFallback, rejectedFallback }: Props) {
  return (
    <ApiErrorBoundary fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ApiErrorBoundary>
  );
}
