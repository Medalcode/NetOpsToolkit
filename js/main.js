/**
 * Módulo Principal - Calculadora VLSM
 * Orchestration de todos los módulos y manejo de eventos
 * @module main
 * @author MedalCode
 * @version 1.2.0
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
  displayResults
} from './ui.js';

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
      showError(
        resultsDiv,
        "Dirección IP inválida. Debe tener formato xxx.xxx.xxx.xxx donde cada octeto está entre 0-255."
      );
      return;
    }

    // 2. Validar prefijo CIDR
    if (!validateCIDRPrefix(prefix)) {
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
      showError(resultsDiv, capacityValidation.error);
      return;
    }

    // ===== CÁLCULOS =====

    // Calcular subredes VLSM
    const subnets = calculateVLSM(baseIP, prefix, hosts);

    // Calcular estadísticas
    const stats = calculateStatistics(subnets, totalAvailable);

    // ===== MOSTRAR RESULTADOS =====
    displayResults(subnets, stats, resultsDiv);

  } catch (error) {
    console.error("Error en cálculo VLSM:", error);
    showError(
      document.getElementById("results"),
      `Error inesperado: ${error.message}. Por favor, verifica los datos ingresados.`
    );
  }
}

/**
 * Inicializa la aplicación
 */
function init() {
  // Agregar event listener al formulario
  const form = document.getElementById("vlsm-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
    console.log("✅ Calculadora VLSM v1.2.0 inicializada correctamente");
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
