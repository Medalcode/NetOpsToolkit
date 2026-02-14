/**
 * Módulo de Estadísticas
 * Calcula métricas de utilización de red
 * @module statistics
 */

/**
 * Calcula estadísticas completas de utilización de red
 * @param {Array<Object>} subnets - Array de subredes calculadas
 * @param {number} totalAvailable - Total de IPs disponibles en la red principal
 * @returns {Object} Objeto con estadísticas detalladas
 * @example
 * calculateStatistics(subnets, 256)
 * // { totalUsed: 192, utilizationPercent: "75.00", ... }
 */
export function calculateStatistics(subnets, totalAvailable) {
  // Calcular totales
  const totalUsed = subnets.reduce((sum, s) => sum + s.blockSize, 0);
  const totalHosts = subnets.reduce((sum, s) => sum + s.hostsRequested, 0);
  const totalAllocated = subnets.reduce((sum, s) => sum + s.hostsAvailable, 0);
  const totalWasted = totalAllocated - totalHosts;
  const totalRemaining = totalAvailable - totalUsed;

  // Calcular porcentajes
  const utilizationPercent = ((totalUsed / totalAvailable) * 100).toFixed(2);
  const efficiencyPercent =
    totalAllocated > 0 ? ((totalHosts / totalAllocated) * 100).toFixed(2) : "0.00";

  return {
    // Totales
    totalAvailable,
    totalUsed,
    totalRemaining,
    totalHosts,
    totalAllocated,
    totalWasted,

    // Porcentajes
    utilizationPercent,
    efficiencyPercent,
    wastePercent: (100 - parseFloat(efficiencyPercent)).toFixed(2),

    // Metadata
    subnetsCount: subnets.length,
    averageUtilization:
      subnets.length > 0
        ? (
            subnets.reduce((sum, s) => sum + parseFloat(s.utilizationPercent), 0) / subnets.length
          ).toFixed(2)
        : "0.00",
  };
}

/**
 * Genera un resumen textual de las estadísticas
 * @param {Object} stats - Objeto de estadísticas
 * @returns {string[]} Array de strings con información formateada
 */
export function formatStatisticsSummary(stats) {
  return [
    `Subredes creadas: ${stats.subnetsCount}`,
    `Espacio total disponible: ${stats.totalAvailable} IPs`,
    `Espacio usado: ${stats.totalUsed} IPs (${stats.utilizationPercent}%)`,
    `Espacio restante: ${stats.totalRemaining} IPs`,
    `Hosts requeridos: ${stats.totalHosts}`,
    `Hosts asignados: ${stats.totalAllocated}`,
    `IPs desperdiciadas: ${stats.totalWasted} (${stats.wastePercent}%)`,
    `Eficiencia: ${stats.efficiencyPercent}%`,
    `Utilización promedio: ${stats.averageUtilization}%`,
  ];
}
