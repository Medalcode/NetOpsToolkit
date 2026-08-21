/**
 * Módulo de utilidades generales para sanitización y formateo
 * @module utils
 */

/**
 * Escapa entidades HTML peligrosas en cadenas de texto para prevenir DOM XSS
 * @param {string} str - Cadena de texto a sanitizar
 * @returns {string} Cadena sanitizada
 */
export function escapeHtml(str) {
  if (typeof str !== "string" || !str) return "";
  return str.replace(
    /[&<>"']/g,
    match =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;",
      })[match]
  );
}
