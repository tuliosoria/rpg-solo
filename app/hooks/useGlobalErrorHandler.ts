'use client';

import { useEffect } from 'react';

/**
 * Hook to set up global handlers for unhandled promise rejections
 * and uncaught errors that occur outside of React's error boundary.
 */
export function useGlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent the default browser behavior (logging to console)
      // We'll handle it ourselves
      event.preventDefault();

      const error = event.reason;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled Promise Rejection:', error);
      }

      // For critical errors that would break the app, we could show a toast
      // or notification. For now, we log and suppress to prevent crashes.
      // The error boundary will catch React-specific errors.

      // Check if this is a critical error that needs user attention
      const criticalPatterns = ['localStorage', 'IndexedDB', 'QuotaExceeded', 'SecurityError'];

      const isCritical = criticalPatterns.some(pattern => errorMessage.includes(pattern));

      if (isCritical) {
        // Could dispatch to a global state or show a notification
        // For now, just ensure we don't crash
        console.warn('Critical async error occurred, but app should continue:', errorMessage);
      }
    };

    // Handle global errors that slip through
    const handleError = (event: ErrorEvent) => {
      // Don't prevent default - let React's error boundary handle React errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Global error caught:', event.error);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
}

export default useGlobalErrorHandler;
