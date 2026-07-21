import { browser } from '$app/environment';

const LOGGING_ENDPOINT = '/api/log'; // Optional endpoint for centralized logging

export function captureError(error, context = {}) {
  if (!browser) return;

  const errorData = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    context,
    timestamp: new Date().toISOString(),
    type: 'error'
  };

  console.group('%c Error Captured', 'color: red; font-weight: bold;');
  console.log('Timestamp:', errorData.timestamp);
  console.log('Message:', errorData.message);
  console.log('Context:', errorData.context);
  console.error(error);
  console.groupEnd();

  // Optional beacon to logging endpoint
  if (navigator.sendBeacon) {
    // navigator.sendBeacon(LOGGING_ENDPOINT, JSON.stringify(errorData));
  }
}

export function captureMessage(message, level = 'info') {
  if (!browser) return;
  
  const colors = {
    info: 'blue',
    warning: 'orange',
    error: 'red'
  };

  console.group(`%c ${level.toUpperCase()}: ${message}`, `color: ${colors[level] || 'black'}; font-weight: bold;`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('URL:', window.location.href);
  console.groupEnd();
}

export function initErrorTracking() {
  if (!browser) return;

  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), { source: 'window.error' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureError(event.reason, { source: 'unhandledrejection' });
  });
}
