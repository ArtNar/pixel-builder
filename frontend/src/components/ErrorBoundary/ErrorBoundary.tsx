import React from 'react';

export default class ErrorBoundary extends React.PureComponent {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    return (
      (error && (
        <>
          Возникла ошибка:
          <br />
          {error}
        </>
      )) ||
      children
    );
  }
}
