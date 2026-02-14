/**
 * Global Error Handler
 * Catches and handles all unhandled errors and promise rejections
 * @module error-handler
 */

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES = {
  NETWORK: "Error de conexión. Por favor verifica tu conexión a internet.",
  VALIDATION: "Los datos ingresados no son válidos. Por favor verifica e intenta nuevamente.",
  CALCULATION: "Error al realizar el cálculo. Por favor verifica los datos ingresados.",
  EXPORT: "Error al exportar los datos. Por favor intenta nuevamente.",
  CLIPBOARD: "Error al copiar al portapapeles. Por favor intenta nuevamente.",
  GENERIC: "Ha ocurrido un error inesperado. Por favor recarga la página e intenta nuevamente.",
};

/**
 * Shows a user-friendly error notification
 * @param {string} message - Error message to display
 * @param {string} type - Error type (error, warning, info)
 */
export function showErrorNotification(message, type = "error") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border transition-all duration-300 ${
    type === "error"
      ? "bg-red-500/10 border-red-500/30 text-red-300"
      : type === "warning"
        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
        : "bg-blue-500/10 border-blue-500/30 text-blue-300"
  }`;

  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined !text-xl">${
  type === "error" ? "error" : type === "warning" ? "warning" : "info"
}</span>
      <div class="flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
        <span class="material-symbols-outlined !text-sm">close</span>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Shows a success notification
 * @param {string} message - Success message to display
 */
export function showSuccessNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border bg-green-500/10 border-green-500/30 text-green-300 transition-all duration-300";

  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined !text-xl">check_circle</span>
      <div class="flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
        <span class="material-symbols-outlined !text-sm">close</span>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Logs error to console in development
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
function logError(error, context = "Unknown") {
  console.error(`[${context}]`, error);

  // In production, you could send to error tracking service like Sentry
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { tags: { context } });
  // }
}

/**
 * Handles errors gracefully
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {boolean} showNotification - Whether to show user notification
 */
export function handleError(error, context = "Unknown", showNotification = true) {
  logError(error, context);

  if (!showNotification) return;

  // Determine user-friendly message
  let message = ERROR_MESSAGES.GENERIC;

  if (error.message) {
    if (error.message.includes("network") || error.message.includes("fetch")) {
      message = ERROR_MESSAGES.NETWORK;
    } else if (error.message.includes("validation") || error.message.includes("invalid")) {
      message = ERROR_MESSAGES.VALIDATION;
    } else if (error.message.includes("calculation") || error.message.includes("calculate")) {
      message = ERROR_MESSAGES.CALCULATION;
    } else if (error.message.includes("export")) {
      message = ERROR_MESSAGES.EXPORT;
    } else if (error.message.includes("clipboard")) {
      message = ERROR_MESSAGES.CLIPBOARD;
    }
  }

  showErrorNotification(message);
}

/**
 * Wraps an async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} context - Context for error logging
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(fn, context = "Unknown") {
  return async function (...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      handleError(error, context);
      throw error; // Re-throw for caller to handle if needed
    }
  };
}

/**
 * Initialize global error handlers
 */
export function initGlobalErrorHandlers() {
  // Handle uncaught errors
  window.addEventListener("error", event => {
    handleError(event.error, "Global Error Handler");
    event.preventDefault();
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", event => {
    handleError(event.reason, "Unhandled Promise Rejection");
    event.preventDefault();
  });

  console.log("✓ Global error handlers initialized");
}
