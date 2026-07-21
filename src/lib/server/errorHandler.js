const RATE_LIMIT_MS = 10000;
const errorLogMap = new Map();

export function handleServerError(error, event) {
  const errorId = crypto.randomUUID();
  const statusCode = error?.status || 500;
  const isExpected = statusCode >= 400 && statusCode < 500;
  
  const errorContext = {
    errorId,
    path: event.url.pathname,
    method: event.request.method,
    userAgent: event.request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
    isExpected
  };

  if (!isExpected) {
    const errorKey = `${event.url.pathname}-${error?.message}`;
    const lastLogTime = errorLogMap.get(errorKey) || 0;
    const now = Date.now();

    if (now - lastLogTime > RATE_LIMIT_MS) {
      errorLogMap.set(errorKey, now);
      
      console.group('🔥 Server Error Captured');
      console.log('ID:', errorId);
      console.log('Context:', errorContext);
      console.error(error);
      console.groupEnd();
    }
  }

  return {
    message: isExpected ? error.message : 'Internal Server Error',
    errorId,
    status: statusCode
  };
}

export const handleError = ({ error, event }) => {
  return handleServerError(error, event);
};
