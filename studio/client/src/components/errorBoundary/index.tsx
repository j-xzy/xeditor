// tslint:disable: no-console
import * as React from 'react';

export class ErrorBoundary extends React.Component {

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public state = { hasError: false };

  public componentDidCatch(error: any, info: any) {
    console.error(error);
    console.error(info);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>发生错误</h1>;
    }

    return this.props.children;
  }
}
