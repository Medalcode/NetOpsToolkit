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

/**
 * Crea un botón de acción
 * @param {string} text - Texto del botón
 * @param {string} icon - Emoji o icono
 * @param {Function} onClick - Función a ejecutar al hacer click
 * @param {string} className - Clase CSS adicional
 * @returns {HTMLButtonElement} Elemento botón
 */
export function createActionButton(text, icon, onClick, className = "") {
  const button = document.createElement("button");
  button.className = `action-btn ${className}`;
  button.innerHTML = `${icon} ${text}`;
  button.addEventListener("click", onClick);
  return button;
}

/**
 * Crea la barra de acciones con botones de exportación y copiar
 * @param {Function} onCopyAll - Función para copiar todo
 * @param {Function} onExportCSV - Función para exportar CSV
 * @param {Function} onExportJSON - Función para exportar JSON
 * @returns {HTMLElement} Contenedor con botones
 */
export function createActionsBar(onCopyAll, onExportCSV, onExportJSON) {
  const actionsBar = document.createElement("div");
  actionsBar.className = "actions-bar";
  actionsBar.setAttribute("role", "toolbar");
  actionsBar.setAttribute("aria-label", "Acciones de exportación");

  const title = document.createElement("h3");
  title.textContent = "📥 Exportar Resultados";
  title.style.marginBottom = "12px";
  actionsBar.appendChild(title);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "actions-buttons";

  // Botón copiar todo
  const copyBtn = createActionButton("Copiar Todo", "📋", onCopyAll, "copy-btn");
  copyBtn.setAttribute("aria-label", "Copiar todos los resultados al portapapeles");
  buttonsContainer.appendChild(copyBtn);

  // Botón exportar CSV
  const csvBtn = createActionButton("Exportar CSV", "📊", onExportCSV, "export-csv-btn");
  csvBtn.setAttribute("aria-label", "Exportar resultados a formato CSV");
  buttonsContainer.appendChild(csvBtn);

  // Botón exportar JSON
  const jsonBtn = createActionButton("Exportar JSON", "📄", onExportJSON, "export-json-btn");
  jsonBtn.setAttribute("aria-label", "Exportar resultados a formato JSON");
  buttonsContainer.appendChild(jsonBtn);

  actionsBar.appendChild(buttonsContainer);
  return actionsBar;
}

/**
 * Agrega botón de copiar a una subred específica
 * @param {Object} subnet - Datos de la subred
 * @param {HTMLElement} subnetDiv - Contenedor de la subred
 * @param {Function} onCopy - Función para copiar
 */
export function addCopyButtonToSubnet(subnet, subnetDiv, onCopy) {
  const copyBtn = document.createElement("button");
  copyBtn.className = "subnet-copy-btn";
  copyBtn.textContent = "📋 Copiar";
  copyBtn.setAttribute("aria-label", `Copiar información de subred ${subnet.index}`);
  copyBtn.addEventListener("click", () => onCopy(subnet));
  
  // Insertar botón después del título
  const title = subnetDiv.querySelector("h4");
  title.appendChild(copyBtn);
}

/**
 * Muestra un toast/notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'info'
 * @param {number} duration - Duración en ms (default: 3000)
 */
export function showToast(message, type = "success", duration = 3000) {
  // Crear toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  toast.textContent = `${icon} ${message}`;
  
  // Agregar al body
  document.body.appendChild(toast);
  
  // Animación de entrada
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Remover después de la duración
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
}

/**
 * Crea el panel de historial
 * @param {Function} onLoadItem - Callback cuando se carga un item
 * @param {Function} onDeleteItem - Callback cuando se elimina un item
 * @param {Function} onClearHistory - Callback cuando se limpia el historial
 * @returns {Object} Panel y botón toggle
 */
export function createHistoryPanel(onLoadItem, onDeleteItem, onClearHistory) {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "history-overlay";
  
  // Crear panel
  const panel = document.createElement("div");
  panel.className = "history-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Historial de cálculos");
  
  // Header del panel
  const header = document.createElement("div");
  header.className = "history-panel-header";
  
  const title = document.createElement("h2");
  title.textContent = "📜 Historial";
  
  const closeBtn = document.createElement("button");
  closeBtn.className = "history-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.setAttribute("aria-label", "Cerrar historial");
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("open");
    overlay.classList.remove("active");
  });
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);
  
  // Contenedor de contenido
  const content = document.createElement("div");
  content.className = "history-content";
  panel.appendChild(content);
  
  // Botón toggle
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "history-toggle";
  toggleBtn.innerHTML = "📜 Historial";
  toggleBtn.setAttribute("aria-label", "Abrir historial de cálculos");
  toggleBtn.addEventListener("click", () => {
    panel.classList.add("open");
    overlay.classList.add("active");
  });
  
  // Cerrar al hacer click en overlay
  overlay.addEventListener("click", () => {
    panel.classList.remove("open");
    overlay.classList.remove("active");
  });
  
  return { panel, overlay, toggleBtn, content, closeBtn };
}

/**
 * Actualiza el contenido del panel de historial
 * @param {HTMLElement} container - Contenedor del historial
 * @param {Array} history - Array de items del historial
 * @param {Object} stats - Estadísticas del historial
 * @param {Function} onLoadItem - Callback para cargar item
 * @param {Function} onDeleteItem - Callback para eliminar item
 * @param {Function} onClearHistory - Callback para limpiar historial
 */
export function updateHistoryPanel(container, history, stats, onLoadItem, onDeleteItem, onClearHistory) {
  // Limpiar contenido
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  // Si no hay historial
  if (!history || history.length === 0) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.innerHTML = "<p>📭</p><p>No hay cálculos en el historial</p><p>Realiza un cálculo para ver aquí tu historial</p>";
    container.appendChild(empty);
    return;
  }
  
  // Mostrar estadísticas
  if (stats) {
    const statsDiv = document.createElement("div");
    statsDiv.className = "history-stats";
    statsDiv.innerHTML = `
      <p><strong>📊 Estadísticas del Historial</strong></p>
      <p>Total de cálculos: ${stats.totalCalculations}</p>
      <p>Subredes creadas: ${stats.totalSubnets}</p>
      <p>Promedio: ${stats.averageSubnets} subredes/cálculo</p>
      ${stats.mostUsedNetwork ? `<p>Red más usada: ${stats.mostUsedNetwork}</p>` : ""}
    `;
    container.appendChild(statsDiv);
  }
  
  // Botón limpiar historial
  const clearBtn = document.createElement("button");
  clearBtn.className = "history-clear-btn";
  clearBtn.textContent = "🗑️ Limpiar Historial";
  clearBtn.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres limpiar todo el historial?")) {
      onClearHistory();
    }
  });
  container.appendChild(clearBtn);
  
  // Mostrar items
  history.forEach(item => {
    const itemDiv = createHistoryItem(item, onLoadItem, onDeleteItem);
    container.appendChild(itemDiv);
  });
}

/**
 * Crea un item del historial
 * @param {Object} item - Item del historial
 * @param {Function} onLoad - Callback para cargar
 * @param {Function} onDelete - Callback para eliminar
 * @returns {HTMLElement} Elemento del item
 */
function createHistoryItem(item, onLoad, onDelete) {
  const div = document.createElement("div");
  div.className = "history-item";
  div.setAttribute("role", "button");
  div.setAttribute("tabindex", "0");
  
  // Header con red y botón eliminar
  const header = document.createElement("div");
  header.className = "history-item-header";
  
  const network = document.createElement("div");
  network.className = "history-item-network";
  network.textContent = item.network;
  
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "history-item-delete";
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.setAttribute("aria-label", "Eliminar este cálculo");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onDelete(item.id);
  });
  
  header.appendChild(network);
  header.appendChild(deleteBtn);
  div.appendChild(header);
  
  // Hosts
  const hosts = document.createElement("div");
  hosts.className = "history-item-hosts";
  hosts.textContent = `Hosts: ${item.hosts}`;
  div.appendChild(hosts);
  
  // Resumen
  const summary = document.createElement("div");
  summary.className = "history-item-summary";
  const subnetsCount = item.subnets?.length || 0;
  summary.textContent = `${subnetsCount} ${subnetsCount === 1 ? "subred" : "subredes"} calculada${subnetsCount === 1 ? "" : "s"}`;
  div.appendChild(summary);
  
  // Timestamp
  const time = document.createElement("div");
  time.className = "history-item-time";
  // La función formatTimestamp viene del módulo history
  time.textContent = formatHistoryTimestamp(item.timestamp);
  div.appendChild(time);
  
  // Click para cargar
  div.addEventListener("click", () => onLoad(item));
  
  return div;
}

/**
 * Formatea timestamp para historial (simplificado)
 * @param {string} timestamp - Timestamp ISO
 * @returns {string} Fecha formateada
 */
function formatHistoryTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins}min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    return date.toLocaleDateString("es-ES", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return timestamp;
  }
}


