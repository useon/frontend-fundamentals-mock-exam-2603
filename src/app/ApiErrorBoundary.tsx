import { Component, ReactNode } from 'react';

type FallbackProps = {
  error: Error;
  reset: () => void;
};

type Props = {
  children: ReactNode;
  fallback: (props: FallbackProps) => ReactNode;
};

type State = {
  error: Error | null;
};

export class ApiErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error !== null) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      });
    }

    return this.props.children;
  }
}
