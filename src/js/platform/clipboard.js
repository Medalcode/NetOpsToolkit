// Plataforma: wrapper para el portapapeles con fallback
export async function writeText(text) {
  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback: prompt (non-ideal, but preserves behavior in old browsers)
    if (window && window.prompt) {
      window.prompt('Copy to clipboard: Ctrl+C, Enter', text);
      return Promise.resolve();
    }
    return Promise.reject(new Error('Clipboard not available'));
  } catch (err) {
    return Promise.reject(err);
  }
}
