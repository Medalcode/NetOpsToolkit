/**
 * Módulo Principal - Calculadora VLSM
 * Orchestration de todos los módulos y manejo de eventos
 * @module main
 * @author MedalCode
 * @version 1.6.0
 */

// Importar validadores
import {
  validateIPAddress,
  validateCIDRPrefix,
  validateNetworkAddress,
  validateHosts,
  validateNetworkCapacity
} from './validators.js';

// Importar conversores
import { ipToDecimal, getNetworkAddress } from './converters.js';

// Importar calculador
import {
  calculateVLSM,
  calculateTotalRequired,
  calculateTotalAvailable
} from './calculator.js';

// Importar estadísticas
import { calculateStatistics } from './statistics.js';

// Importar UI
import {
  clearResults,
  showError,
  showWarning,
  displayStatistics,
  createActionsBar,
  addCopyButtonToSubnet,
  showToast,
  createHistoryPanel,
  updateHistoryPanel,
  showInputError, // New
  showInputSuccess, // New
  resetInputValidation // New
} from './ui.js';

// Importar exportación
import { exportToCSV, exportToJSON } from './exporters.js';

// Importar portapapeles
import { copyAllResults, copySubnet } from './clipboard.js';

// Importar analytics
import {
  trackCalculation,
  trackExport,
  trackCopy,
  trackValidationError
} from './analytics.js';

// Importar tema
import { initTheme, createThemeToggle } from './theme.js';

// Importar visualización
import { renderAllocationChart } from './visualization.js';

// Importar tools
import { initTabs } from './tabs.js';
import { initConverter } from './converter.js';
import { initStandardCalc } from './standard_calc.js';

// Importar historial
import {
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getHistoryStats
} from './history.js';

// Variables globales para cache de los últimos resultados
let lastSubnets = null;
let lastStats = null;
let historyPanelElements = null;

/**
 * Maneja el evento de submit del formulario
 * @param {Event} e - Evento de submit
 */
function handleFormSubmit(e) {
  e.preventDefault();

  try {
    // Obtener valores del formulario
    const network = document.getElementById("network").value.trim();
    const hostsInput = document.getElementById("hosts").value.trim();
    const resultsDiv = document.getElementById("results");

    // Limpiar resultados previos
    clearResults(resultsDiv);

    // Parsear input
    const [baseIP, prefixStr] = network.split("/");
    const prefix = Number(prefixStr);

    // ===== VALIDACIONES =====

    // 1. Validar IP
    if (!validateIPAddress(baseIP)) {
      trackValidationError('invalid_ip', 'network');
      showError(
        resultsDiv,
        "Dirección IP inválida. Debe tener formato xxx.xxx.xxx.xxx donde cada octeto está entre 0-255."
      );
      return;
    }

    // 2. Validar prefijo CIDR
    if (!validateCIDRPrefix(prefix)) {
      trackValidationError('invalid_cidr', 'prefix');
      showError(resultsDiv, "Prefijo CIDR inválido. Debe estar entre 0 y 32 (ej: /24).");
      return;
    }

    // 3. Parsear y validar hosts
    const hosts = hostsInput
      .split(",")
      .map(h => Number(h.trim()))
      .sort((a, b) => b - a); // Ordenar descendente

    const hostsValidation = validateHosts(hosts);
    if (!hostsValidation.isValid) {
      trackValidationError('invalid_hosts', 'hosts');
      showError(resultsDiv, hostsValidation.error);
      return;
    }

    // 4. Validar que la IP base coincida con el prefijo
    if (!validateNetworkAddress(baseIP, prefix, ipToDecimal)) {
      const correctNetwork = getNetworkAddress(baseIP, prefix);
      showWarning(
        resultsDiv,
        `Advertencia: La dirección IP no coincide con el prefijo /${prefix}. Se ajustará automáticamente a ${correctNetwork}.`
      );
    }

    // 5. Validar capacidad de la red
    const totalAvailable = calculateTotalAvailable(prefix);
    const totalRequired = calculateTotalRequired(hosts);

    const capacityValidation = validateNetworkCapacity(totalAvailable, totalRequired);
    if (!capacityValidation.isValid) {
      trackValidationError('insufficient_capacity', 'network');
      showError(resultsDiv, capacityValidation.error);
      return;
    }

    // ===== CÁLCULOS =====

    // Calcular subredes VLSM
    const subnets = calculateVLSM(baseIP, prefix, hosts);

    // Calcular estadísticas
    const stats = calculateStatistics(subnets, totalAvailable);

    // Guardar en cache para exportación
    lastSubnets = subnets;
    lastStats = stats;

    // Track successful calculation
    trackCalculation(subnets.length, network, totalRequired);

    // Guardar en historial
    addToHistory(network, hostsInput, subnets, stats);
    
    // Actualizar panel de historial si está abierto
    refreshHistoryPanel();

    // ===== MOSTRAR RESULTADOS =====
    displayResultsWithActions(subnets, stats, resultsDiv);

  } catch (error) {
    console.error("Error en cálculo VLSM:", error);
    showError(
      document.getElementById("results"),
      `Error inesperado: ${error.message}. Por favor, verifica los datos ingresados.`
    );
  }
}

/**
 * Muestra resultados con barra de acciones
 * @param {Array<Object>} subnets - Subredes calculadas
 * @param {Object} stats - Estadísticas
 * @param {HTMLElement} container - Contenedor
 */
function displayResultsWithActions(subnets, stats, container) {
  // Limpiar
  clearResults(container);

  // Agregar barra de acciones
  const actionsBar = createActionsBar(
    handleCopyAll,
    handleExportCSV,
    handleExportJSON
  );
  container.appendChild(actionsBar);

  // Mostrar estadísticas
  displayStatistics(stats, container);

  // Mostrar visualización
  const vizContainer = document.createElement("div");
  const networkInput = document.getElementById("network");
  if (networkInput && networkInput.value) {
    renderAllocationChart(subnets, networkInput.value, vizContainer);
    container.appendChild(vizContainer);
  }

  // Mostrar cada subred con botón de copiar
  subnets.forEach(subnet => {
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

    // Agregar botón de copiar a la subred
    addCopyButtonToSubnet(subnet, subnetDiv, handleCopySubnet);

    container.appendChild(subnetDiv);
  });
}

/**
 * Handler para copiar todo
 */
async function handleCopyAll() {
  if (!lastSubnets || !lastStats) {
    showToast("No hay resultados para copiar", "error");
    return;
  }

  const success = await copyAllResults(lastSubnets, lastStats);
  if (success) {
    trackCopy('all');
    showToast("✅ Resultados copiados al portapapeles");
  } else {
    showToast("❌ Error al copiar al portapapeles", "error");
  }
}

/**
 * Handler para copiar una subred
 * @param {Object} subnet - Subred a copiar
 */
async function handleCopySubnet(subnet) {
  const success = await copySubnet(subnet);
  if (success) {
    trackCopy('subnet', subnet.index);
    showToast(`✅ Subred ${subnet.index} copiada al portapapeles`);
  } else {
    showToast("❌ Error al copiar al portapapeles", "error");
  }
}

/**
 * Handler para exportar a CSV
 */
function handleExportCSV() {
  if (!lastSubnets || !lastStats) {
    showToast("No hay resultados para exportar", "error");
    return;
  }

  const success = exportToCSV(lastSubnets, lastStats);
  if (success) {
    trackExport('csv', lastSubnets.length);
    showToast("✅ Archivo CSV descargado");
  } else {
    showToast("❌ Error al exportar CSV", "error");
  }
}

/**
 * Handler para exportar a JSON
 */
function handleExportJSON() {
  if (!lastSubnets || !lastStats) {
    showToast("No hay resultados para exportar", "error");
    return;
  }

  const success = exportToJSON(lastSubnets, lastStats);
  if (success) {
    trackExport('json', lastSubnets.length);
    showToast("✅ Archivo JSON descargado");
  } else {
    showToast("❌ Error al exportar JSON", "error");
  }
}

/**
 * Handler para cargar un item del historial
 * @param {Object} item - Item del historial a cargar
 */
function handleLoadHistoryItem(item) {
  // Cerrar panel de historial
  if (historyPanelElements) {
    historyPanelElements.panel.classList.remove("open");
    historyPanelElements.overlay.classList.remove("active");
  }

  // Llenar formulario
  document.getElementById("network").value = item.network;
  document.getElementById("hosts").value = item.hosts;

  // Guardar en cache
  lastSubnets = item.subnets;
  lastStats = item.stats;

  // Mostrar resultados
  const resultsDiv = document.getElementById("results");
  displayResultsWithActions(item.subnets, item.stats, resultsDiv);

  // Scroll a resultados
  resultsDiv.scrollIntoView({ behavior: "smooth" });

  showToast("✅ Cálculo cargado desde historial");
}

/**
 * Handler para eliminar un item del historial
 * @param {string} id - ID del item a eliminar
 */
function handleDeleteHistoryItem(id) {
  const success = removeFromHistory(id);
  if (success) {
    refreshHistoryPanel();
    showToast("✅ Cálculo eliminado del historial");
  } else {
    showToast("❌ Error al eliminar", "error");
  }
}

/**
 * Handler para limpiar todo el historial
 */
function handleClearHistory() {
  const success = clearHistory();
  if (success) {
    refreshHistoryPanel();
    showToast("✅ Historial limpiado");
  } else {
    showToast("❌ Error al limpiar historial", "error");
  }
}

/**
 * Refresca el contenido del panel de historial
 */
function refreshHistoryPanel() {
  if (!historyPanelElements) return;

  const history = getHistory();
  const stats = getHistoryStats();

  updateHistoryPanel(
    historyPanelElements.content,
    history,
    stats,
    handleLoadHistoryItem,
    handleDeleteHistoryItem,
    handleClearHistory
  );
}

/**
 * Inicializa el sistema de historial
 */
function initHistory() {
  // Crear panel de historial
  historyPanelElements = createHistoryPanel(
    handleLoadHistoryItem,
    handleDeleteHistoryItem,
    handleClearHistory
  );

  // Agregar al DOM
  document.body.appendChild(historyPanelElements.overlay);
  document.body.appendChild(historyPanelElements.panel);
  document.body.appendChild(historyPanelElements.toggleBtn);

  // Cargar historial inicial
  refreshHistoryPanel();

  console.log("✅ Sistema de historial inicializado");
}

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// REAL-TIME VALIDATION LOGIC
function setupRealTimeValidation() {
  const networkInput = document.getElementById("network");
  const hostsInput = document.getElementById("hosts");

  if (networkInput) {
    networkInput.addEventListener("input", debounce(() => {
      validateNetworkInput(networkInput.value);
    }, 500));
  }

  if (hostsInput) {
    hostsInput.addEventListener("input", debounce(() => {
      validateHostsInput(hostsInput.value);
    }, 500));
  }
}

function validateNetworkInput(value) {
  if (!value) {
    resetInputValidation("network");
    return;
  }

  const parts = value.split("/");
  const baseIP = parts[0];
  
  // 1. Validate IP format
  if (!validateIPAddress(baseIP)) {
    showInputError("network", "IP inválida (ej: 192.168.1.0)");
    return false;
  }

  // 2. Validate CIDR if present
  if (parts.length > 1 && parts[1] !== "") {
    const prefix = Number(parts[1]);
    if (!validateCIDRPrefix(prefix)) {
      showInputError("network", "Prefijo inválido (0-32)");
      return false;
    }
  } else {
     showInputError("network", "Falta prefijo CIDR (ej: /24)");
     return false;
  }

  showInputSuccess("network");
  return true;
}

function validateHostsInput(value) {
  if (!value) {
    resetInputValidation("hosts");
    return;
  }

  // Basic format check
  if (!/^[\d,\s]+$/.test(value)) {
    showInputError("hosts", "Solo números y comas");
    return false;
  }

  const hosts = value.split(",").map(h => Number(h.trim())).filter(n => !isNaN(n));
  
  if (hosts.length === 0) {
    showInputError("hosts", "Ingresa al menos un host");
    return false;
  }

  const validation = validateHosts(hosts);
  if (!validation.isValid) {
    showInputError("hosts", validation.error);
    return false;
  }

  showInputSuccess("hosts");
  return true;
}

// KEYBOARD SHORTCUTS LOGIC
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Only if no modal is open
    const historyOverlay = document.querySelector(".history-overlay");
    if (historyOverlay && historyOverlay.classList.contains("active")) return;

    // ESC to clear
    if (e.key === "Escape") {
      document.getElementById("vlsm-form").reset();
      resetInputValidation("network");
      resetInputValidation("hosts");
      clearResults(document.getElementById("results"));
      showToast("🧹 Formulario limpiado", "info");
    }
    
    // Slash '/' to focus network input
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      document.getElementById("network").focus();
    }
  });
}

/**
 * Inicializa la aplicación
 */
function init() {
  // Inicializar tema PRIMERO (para evitar flash)
  initTheme();

  // Agregar botón de tema
  const themeToggle = createThemeToggle();
  document.body.appendChild(themeToggle);

  // Inicializar historial
  initHistory();
  
  // Inicializar UX Pro
  setupRealTimeValidation();
  setupKeyboardShortcuts();
  
  // Inicializar Tabs y Herramientas Nuevas
  initTabs();
  initConverter();
  initStandardCalc();

  // Agregar event listener al formulario
  const form = document.getElementById("vlsm-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
    console.log("✅ Calculadora VLSM v1.6.0 inicializada correctamente");
    console.log("✨ Nuevas features: Visualización + UX Pro + Analytics");
  } else {
    console.error("❌ No se encontró el formulario #vlsm-form");
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Exportar para testing
export { handleFormSubmit, init };
