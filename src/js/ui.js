/**
 * Módulo de Interfaz de Usuario
 * Funciones para manipular el DOM y renderizar resultados
 * @module ui
 */

import { formatStatisticsSummary } from "./statistics.js";

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
 * Muestra error en un input específico
 * @param {string} inputId - ID del input
 * @param {string} message - Mensaje de error
 */
export function showInputError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const feedbackId = `${inputId}-feedback`;
  const feedback = document.getElementById(feedbackId);

  // Update input state
  input.classList.remove("input-valid");
  input.classList.add("input-invalid");

  // Update feedback message
  if (feedback) {
    feedback.textContent = message;
    feedback.classList.remove("success");
    feedback.classList.add("error", "show");
  }
}

/**
 * Muestra éxito en un input específico
 * @param {string} inputId - ID del input
 */
export function showInputSuccess(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const feedbackId = `${inputId}-feedback`;
  const feedback = document.getElementById(feedbackId);

  // Update input state
  input.classList.remove("input-invalid");
  input.classList.add("input-valid");

  // Update feedback message
  if (feedback) {
    feedback.textContent = "Válido";
    feedback.classList.remove("error");
    feedback.classList.add("success", "show");
  }
}

/**
 * Resetea el estado de validación de un input
 * @param {string} inputId - ID del input
 */
export function resetInputValidation(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const feedbackId = `${inputId}-feedback`;
  const feedback = document.getElementById(feedbackId);

  input.classList.remove("input-valid", "input-invalid");

  if (feedback) {
    feedback.textContent = "";
    feedback.classList.remove("show", "error", "success");
  }
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
    {
      label: "Utilización",
      value: `${subnet.utilizationPercent}% (${subnet.hostsWasted} IPs sin usar)`,
    },
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
 * Muestra los resultados completos del cálculo VLSM (Tailwind Grid Version)
 * @param {Array<Object>} subnets - Array de subredes calculadas
 * @param {Object} stats - Estadísticas de utilización
 * @param {HTMLElement} container - Contenedor principal (para tabla)
 * @param {HTMLElement} [visualizerContainer] - Contenedor opcional para el gráfico
 */
export function displayResults(subnets, stats, container, visualizerContainer) {
  // Limpiar resultados previos
  clearResults(container);
  if (visualizerContainer) clearResults(visualizerContainer);

  // 1. Mostrar Visualizador Gráfico
  if (stats.networkPrefix && visualizerContainer) {
    renderNetworkVisualizer(subnets, stats.networkPrefix, visualizerContainer);
  } else if (stats.networkPrefix) {
    // Fallback if no specific container passed
    renderNetworkVisualizer(subnets, stats.networkPrefix, container);
  }

  // 2. Renderizar Tabla Tailwind
  const tableWrapper = document.createElement("div");
  tableWrapper.className = "bg-surface-dark cyber-border rounded overflow-hidden";
  tableWrapper.innerHTML = `
    <div class="px-6 py-4 border-b border-border-dark flex items-center justify-between">
        <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-white">Subnet Calculation Results</h3>
        <button class="text-slate-500 hover:text-white transition-colors" title="Export CSV" id="btn-export-csv-new">
            <span class="material-symbols-outlined">download</span>
        </button>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead class="bg-black/50 text-[10px] text-slate-500 uppercase tracking-widest border-b border-border-dark">
                <tr>
                    <th class="px-6 py-3 font-bold">Name</th>
                    <th class="px-6 py-3 font-bold">Network ID</th>
                    <th class="px-6 py-3 font-bold">Mask</th>
                    <th class="px-6 py-3 font-bold">Range</th>
                    <th class="px-6 py-3 font-bold">Broadcast</th>
                    <th class="px-6 py-3 font-bold">Hosts</th>
                    <th class="px-6 py-3 font-bold text-right">Utilization</th>
                </tr>
            </thead>
            <tbody class="text-sm" id="vlsm-table-body">
                <!-- Rows injected below -->
            </tbody>
        </table>
    </div>
  `;

  const tbody = tableWrapper.querySelector("#vlsm-table-body");

  subnets.forEach((subnet, index) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-border-dark hover:bg-white/5 transition-colors cursor-default";

    // Utilization Bar Logic
    const utilPercent = subnet.utilizationPercent;
    let barColor = "bg-primary";
    if (utilPercent > 90) barColor = "bg-red-500/80";
    else if (utilPercent > 75) barColor = "bg-signal-green";

    tr.innerHTML = `
        <td class="px-6 py-4 text-white font-medium">Subnet ${index + 1}</td>
        <td class="px-6 py-4 mono-data text-signal-green">${subnet.network}</td>
        <td class="px-6 py-4 mono-data text-slate-300">/${subnet.prefix} <span class="text-slate-600 text-[10px]">(${subnet.mask})</span></td>
        <td class="px-6 py-4 mono-data text-slate-300">${subnet.firstHost} - ${subnet.lastHost}</td>
        <td class="px-6 py-4 mono-data text-slate-300">${subnet.broadcast}</td>
        <td class="px-6 py-4 mono-data text-slate-300">${subnet.hostsAvailable} <span class="text-slate-600 text-[10px]">(Req: ${subnet.hostsRequested})</span></td>
        <td class="px-6 py-4 text-right">
            <div class="inline-flex items-center gap-2">
                <div class="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full ${barColor}" style="width: ${utilPercent}%;"></div>
                </div>
                <span class="mono-data text-[10px] text-slate-400">${utilPercent}%</span>
            </div>
        </td>
    `;
    tbody.appendChild(tr);
  });

  container.appendChild(tableWrapper);
}

/**
 * Renderiza una barra visual de ocupación de la red (Tailwind Version)
 */
function renderNetworkVisualizer(subnets, parentPrefix, container) {
  const wrapper = document.createElement("div");
  wrapper.className = "bg-surface-dark cyber-border rounded p-6 mb-6";

  // Header
  const header = document.createElement("div");
  header.className = "flex items-center justify-between mb-4";
  header.innerHTML = `
        <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-white">Address Space Allocation</h3>
        <div class="flex items-center gap-4 text-[10px]">
            <div class="flex items-center gap-1.5"><div class="size-2 bg-primary rounded-sm"></div><span class="text-slate-400">ALLOCATED</span></div>
            <div class="flex items-center gap-1.5"><div class="size-2 bg-slate-800 rounded-sm"></div><span class="text-slate-400">AVAILABLE</span></div>
        </div>
    `;
  wrapper.appendChild(header);

  // Bar Container
  const barContainer = document.createElement("div");
  barContainer.className = "h-8 w-full bg-slate-900 rounded-sm overflow-hidden flex";

  let totalUsedPercent = 0;
  const colors = ["bg-primary", "bg-signal-green", "bg-purple-500", "bg-yellow-500", "bg-pink-500"];

  subnets.forEach((subnet, index) => {
    const subnetSize = Math.pow(2, 32 - parseInt(subnet.prefix));
    const parentSize = Math.pow(2, 32 - parentPrefix);
    const percent = (subnetSize / parentSize) * 100;
    totalUsedPercent += percent;

    const bar = document.createElement("div");
    // Use inline width for precision, Tailwind classes for style
    bar.style.width = `${percent}%`;
    bar.className = `h-full ${colors[index % colors.length]} border-l border-black relative group cursor-pointer`;
    bar.title = `${subnet.network}/${subnet.prefix}`;

    // Hover effect overlay
    bar.innerHTML =
      "<div class=\"absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity\"></div>";

    barContainer.appendChild(bar);
  });

  // Free Space
  const freePercent = 100 - totalUsedPercent;
  if (freePercent > 0.1) {
    const freeBar = document.createElement("div");
    freeBar.style.width = `${freePercent}%`;
    freeBar.className = "h-full bg-slate-800 border-l border-black flex-1";
    freeBar.title = `Available Space (${freePercent.toFixed(1)}%)`;
    barContainer.appendChild(freeBar);
  }

  wrapper.appendChild(barContainer);

  // Footer Labels
  const footer = document.createElement("div");
  footer.className = "flex justify-between mt-2 mono-data text-[10px] text-slate-500";
  footer.innerHTML = `
        <span>Network Start</span>
        <span>Usage: ${totalUsedPercent.toFixed(1)}%</span>
        <span>Network End</span>
    `;
  wrapper.appendChild(footer);

  container.appendChild(wrapper);
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
/**
 * Show toast notification with enhanced styling
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = "success", duration = 3000) {
  // Icon mapping
  const icons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
  };

  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  toast.innerHTML = `
    <span class="material-symbols-outlined !text-lg">${icons[type] || "info"}</span>
    <span class="flex-1">${message}</span>
    <button class="text-current opacity-50 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined !text-sm">close</span>
    </button>
  `;

  // Add to container
  toastContainer.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
      // Remove container if empty
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 300);
  }, duration);
}

// Add slide out animation
if (!document.getElementById("toast-animations")) {
  const style = document.createElement("style");
  style.id = "toast-animations";
  style.textContent = `
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  `;
  document.head.appendChild(style);
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
export function updateHistoryPanel(
  container,
  history,
  stats,
  onLoadItem,
  onDeleteItem,
  onClearHistory
) {
  // Limpiar contenido
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Si no hay historial
  if (!history || history.length === 0) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.innerHTML =
      "<p>📭</p><p>No hay cálculos en el historial</p><p>Realiza un cálculo para ver aquí tu historial</p>";
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
  deleteBtn.addEventListener("click", e => {
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
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
}
