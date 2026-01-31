'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReturnToMenu = () => {
    // Clear any corrupted state and return to menu
    try {
      // Don't clear all storage, just reset the view
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.glitchLines} />
            <h1 className={styles.title}>
              <span className={styles.errorCode}>ERROR 0x74494E</span>
              CRITICAL SYSTEM FAILURE
            </h1>
            <div className={styles.message}>
              <p>An unexpected error has occurred in the terminal session.</p>
              <p className={styles.subtext}>
                The system encountered a critical fault and must restart.
              </p>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.details}>
                <summary>Technical Details</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className={styles.actions}>
              <button onClick={this.handleReturnToMenu} className={styles.button}>
                Return to Main Menu
              </button>
              <button onClick={this.handleReload} className={styles.buttonSecondary}>
                Force Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
