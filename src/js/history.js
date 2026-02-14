/**
 * Módulo de Historial
 * Manejo del historial de cálculos con LocalStorage
 * @module history
 */

import { storage } from "./platform/storage.js";

const HISTORY_KEY = "vlsm-history";
const MAX_HISTORY_ITEMS = 10;

/**
 * Estructura de un item del historial
 * @typedef {Object} HistoryItem
 * @property {string} id - ID único del cálculo
 * @property {string} timestamp - Timestamp ISO del cálculo
 * @property {string} network - Red ingresada (ej: "192.168.1.0/24")
 * @property {string} hosts - Hosts ingresados (ej: "50,30,10")
 * @property {Array<Object>} subnets - Subredes calculadas
 * @property {Object} stats - Estadísticas del cálculo
 */

/**
 * Obtiene el historial desde LocalStorage
 * @returns {Array<HistoryItem>} Array de items del historial
 */
export function getHistory() {
  try {
    const history = storage.get(HISTORY_KEY);
    if (!history) return [];
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error("Error al leer historial:", error);
    return [];
  }
}

/**
 * Guarda el historial en LocalStorage
 * @param {Array<HistoryItem>} history - Historial a guardar
 * @returns {boolean} True si se guardó exitosamente
 */
function saveHistory(history) {
  try {
    storage.set(HISTORY_KEY, history);
    return true;
  } catch (error) {
    console.error("Error al guardar historial:", error);
    return false;
  }
}

/**
 * Agrega un cálculo al historial
 * @param {string} network - Red (ej: "192.168.1.0/24")
 * @param {string} hosts - Hosts (ej: "50,30,10")
 * @param {Array<Object>} subnets - Subredes calculadas
 * @param {Object} stats - Estadísticas
 * @returns {HistoryItem} Item agregado
 */
export function addToHistory(network, hosts, subnets, stats) {
  const history = getHistory();

  const item = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    network,
    hosts,
    subnets,
    stats,
  };

  // Agregar al inicio del array
  history.unshift(item);

  // Mantener solo los últimos MAX_HISTORY_ITEMS
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  saveHistory(history);
  return item;
}

/**
 * Elimina un item del historial por ID
 * @param {string} id - ID del item a eliminar
 * @returns {boolean} True si se eliminó exitosamente
 */
export function removeFromHistory(id) {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);

  if (newHistory.length === history.length) {
    return false; // No se encontró el item
  }

  return saveHistory(newHistory);
}

/**
 * Limpia todo el historial
 * @returns {boolean} True si se limpió exitosamente
 */
export function clearHistory() {
  try {
    storage.remove(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("Error al limpiar historial:", error);
    return false;
  }
}

/**
 * Obtiene un item del historial por ID
 * @param {string} id - ID del item
 * @returns {HistoryItem|null} Item encontrado o null
 */
export function getHistoryItem(id) {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
}

/**
 * Genera un ID único para un item del historial
 * @returns {string} ID único
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formatea un timestamp para mostrar
 * @param {string} timestamp - Timestamp ISO
 * @returns {string} Fecha formateada
 */
export function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Hace menos de 1 minuto
    if (diffMins < 1) {
      return "Hace un momento";
    }

    // Hace menos de 1 hora
    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
    }

    // Hace menos de 24 horas
    if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    }

    // Hace menos de 7 días
    if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    }

    // Fecha completa
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
}

/**
 * Crea un resumen corto de un cálculo
 * @param {HistoryItem} item - Item del historial
 * @returns {string} Resumen
 */
export function getSummary(item) {
  const subnetsCount = item.subnets?.length || 0;
  return `${item.network} → ${subnetsCount} ${subnetsCount === 1 ? "subred" : "subredes"}`;
}

/**
 * Obtiene estadísticas del historial
 * @returns {Object} Estadísticas
 */
export function getHistoryStats() {
  const history = getHistory();

  if (history.length === 0) {
    return {
      totalCalculations: 0,
      totalSubnets: 0,
      mostUsedNetwork: null,
      averageSubnets: 0,
    };
  }

  const totalSubnets = history.reduce((sum, item) => sum + (item.subnets?.length || 0), 0);

  // Contar redes más usadas
  const networkCounts = {};
  history.forEach(item => {
    const baseNetwork = item.network.split("/")[0];
    networkCounts[baseNetwork] = (networkCounts[baseNetwork] || 0) + 1;
  });

  const mostUsedNetwork = Object.keys(networkCounts).reduce(
    (a, b) => (networkCounts[a] > networkCounts[b] ? a : b),
    null
  );

  return {
    totalCalculations: history.length,
    totalSubnets,
    mostUsedNetwork,
    averageSubnets: (totalSubnets / history.length).toFixed(1),
  };
}

/**
 * Exporta el historial a JSON
 * @returns {string} JSON del historial
 */
export function exportHistory() {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * Importa historial desde JSON
 * @param {string} jsonString - JSON con el historial
 * @returns {boolean} True si se importó exitosamente
 */
export function importHistory(jsonString) {
  try {
    const history = JSON.parse(jsonString);
    if (!Array.isArray(history)) {
      throw new Error("El JSON no contiene un array válido");
    }

    return saveHistory(history);
  } catch (error) {
    console.error("Error al importar historial:", error);
    return false;
  }
}
