const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals) => {
      webVitals.getCLS?.(onPerfEntry);
      webVitals.getFID?.(onPerfEntry);
      webVitals.getFCP?.(onPerfEntry);
      webVitals.getLCP?.(onPerfEntry);
      webVitals.getTTFB?.(onPerfEntry);
    });
  }
};

export default reportWebVitals; 