import React, { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyResultsDisplay = lazy(() => 
  import('../components/ResultsDisplay')
);

export const LazyVirtualizedResultsDisplay = lazy(() => 
  import('../components/VirtualizedResultsDisplay')
);

export const LazyHelpModal = lazy(() => 
  import('../components/HelpModal')
);

export const LazyErrorDisplay = lazy(() => 
  import('../components/ErrorDisplay')
);

// Preload components that are likely to be used
export const preloadComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload components after initial page load
    setTimeout(() => {
      import('../components/ResultsDisplay');
      import('../components/HelpModal');
    }, 2000);
  }
};

// Component wrapper with loading fallback
export function withSuspense<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  const defaultFallback = <div className="animate-pulse bg-gray-200 h-20 rounded"></div>;
  return (props: T) => (
    <React.Suspense fallback={fallback || defaultFallback}>
      <Component {...props} />
    </React.Suspense>
  );
}

export default {
  LazyResultsDisplay,
  LazyVirtualizedResultsDisplay,
  LazyHelpModal,
  LazyErrorDisplay,
  preloadComponents,
  withSuspense,
};