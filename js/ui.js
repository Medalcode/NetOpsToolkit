/**
 * Módulo de Interfaz de Usuario
 * Funciones para manipular el DOM y renderizar resultados
 * @module ui
 */

import { formatStatisticsSummary } from './statistics.js';

/**
 * Limpia todos los resultados previos del contenedor
 * @param {HTMLElement} container - Contenedor de resultados
 */
export function clearResults(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Muestra un mensaje de error en el contenedor
 * @param {HTMLElement} container - Contenedor donde mostrar el error
 * @param {string} message - Mensaje de error a mostrar
 */
export function showError(container, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.setAttribute("role", "alert");
  errorDiv.setAttribute("aria-live", "polite");

  const icon = document.createElement("strong");
  icon.textContent = "❌ Error: ";
  icon.setAttribute("aria-label", "Error");

  const text = document.createTextNode(message);

  errorDiv.appendChild(icon);
  errorDiv.appendChild(text);
  container.appendChild(errorDiv);
}

/**
 * Muestra un mensaje de advertencia en el contenedor
 * @param {HTMLElement} container - Contenedor donde mostrar la advertencia
 * @param {string} message - Mensaje de advertencia a mostrar
 */
export function showWarning(container, message) {
  const warningDiv = document.createElement("div");
  warningDiv.className = "warning-message";
  warningDiv.setAttribute("role", "alert");
  warningDiv.setAttribute("aria-live", "polite");

  const icon = document.createElement("strong");
  icon.textContent = "⚠️ Advertencia: ";
  icon.setAttribute("aria-label", "Advertencia");

  const text = document.createTextNode(message);

  warningDiv.appendChild(icon);
  warningDiv.appendChild(text);
  container.appendChild(warningDiv);
}

/**
 * Muestra las estadísticas de utilización de red
 * @param {Object} stats - Objeto con estadísticas calculadas
 * @param {HTMLElement} container - Contenedor donde mostrar las estadísticas
 */
export function displayStatistics(stats, container) {
  const statsDiv = document.createElement("div");
  statsDiv.className = "statistics";
  statsDiv.setAttribute("role", "region");
  statsDiv.setAttribute("aria-label", "Estadísticas de utilización");

  const title = document.createElement("h3");
  title.textContent = "📊 Estadísticas de Utilización";
  statsDiv.appendChild(title);

  const statsInfo = formatStatisticsSummary(stats);

  statsInfo.forEach(info => {
    const p = document.createElement("p");
    p.textContent = info;
    statsDiv.appendChild(p);
  });

  container.appendChild(statsDiv);
}

/**
 * Muestra una subred individual
 * @param {Object} subnet - Objeto con información de la subred
 * @param {HTMLElement} container - Contenedor donde mostrar la subred
 */
export function displaySubnet(subnet, container) {
  const subnetDiv = document.createElement("div");
  subnetDiv.className = "subnet-result";
  subnetDiv.setAttribute("role", "article");
  subnetDiv.setAttribute("aria-label", `Subred ${subnet.index}`);

  const title = document.createElement("h4");
  title.textContent = `Subred ${subnet.index}`;
  subnetDiv.appendChild(title);

  const details = [
    { label: "Red", value: `${subnet.network}/${subnet.prefix}` },
    { label: "Máscara", value: subnet.mask },
    { label: "Rango de Hosts", value: `${subnet.firstHost} - ${subnet.lastHost}` },
    { label: "Broadcast", value: subnet.broadcast },
    { label: "Hosts solicitados", value: subnet.hostsRequested },
    { label: "Hosts disponibles", value: subnet.hostsAvailable },
    { label: "Utilización", value: `${subnet.utilizationPercent}% (${subnet.hostsWasted} IPs sin usar)` }
  ];

  details.forEach(detail => {
    const p = document.createElement("p");

    const label = document.createElement("strong");
    label.textContent = `${detail.label}: `;

    const value = document.createTextNode(detail.value);

    p.appendChild(label);
    p.appendChild(value);
    subnetDiv.appendChild(p);
  });

  container.appendChild(subnetDiv);
}

/**
 * Muestra los resultados completos del cálculo VLSM
 * @param {Array<Object>} subnets - Array de subredes calculadas
 * @param {Object} stats - Estadísticas de utilización
 * @param {HTMLElement} container - Contenedor donde mostrar los resultados
 */
export function displayResults(subnets, stats, container) {
  // Limpiar resultados previos
  clearResults(container);

  // Mostrar estadísticas generales
  displayStatistics(stats, container);

  // Mostrar cada subred
  subnets.forEach(subnet => {
    displaySubnet(subnet, container);
  });
}

/**
 * Muestra un mensaje de éxito
 * @param {HTMLElement} container - Contenedor donde mostrar el mensaje
 * @param {string} message - Mensaje de éxito
 */
export function showSuccess(container, message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.setAttribute("role", "status");
  successDiv.setAttribute("aria-live", "polite");

  const icon = document.createElement("strong");
  icon.textContent = "✅ Éxito: ";

  const text = document.createTextNode(message);

  successDiv.appendChild(icon);
  successDiv.appendChild(text);
  container.appendChild(successDiv);
}
