// Simple logger utility for extensibility
export const logError = (error, context = "") => {
  // eslint-disable-next-line no-console
  console.error(`[Error]${context ? " [" + context + "]" : ""}:`, error);
  // TODO: Integrate with Sentry or another error tracking service here
};

export const logWarn = (warning, context = "") => {
  // eslint-disable-next-line no-console
  console.warn(`[Warn]${context ? " [" + context + "]" : ""}:`, warning);
}; 