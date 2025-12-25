/**
 * Módulo de Exportación
 * Funciones para exportar datos a diferentes formatos
 * @module exporters
 */

/**
 * Convierte array de objetos a CSV
 * @param {Array<Object>} data - Datos a convertir
 * @param {Array<string>} headers - Headers del CSV
 * @returns {string} Contenido CSV
 */
function arrayToCSV(data, headers) {
  const csvHeaders = headers.join(",");
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header] || "";
      // Escapar comillas y envolver en comillas si contiene coma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(",") ? `"${escaped}"` : escaped;
    }).join(",")
  );
  return [csvHeaders, ...csvRows].join("\n");
}

/**
 * Descarga un archivo con el contenido especificado
 * @param {string} content - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME del archivo
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prepara datos de subredes para exportación
 * @param {Array<Object>} subnets - Array de subredes
 * @returns {Array<Object>} Datos preparados para CSV
 */
function prepareSubnetsData(subnets) {
  return subnets.map(subnet => ({
    "Subred": subnet.index,
    "Red": `${subnet.network}/${subnet.prefix}`,
    "Máscara": subnet.mask,
    "Primer Host": subnet.firstHost,
    "Último Host": subnet.lastHost,
    "Broadcast": subnet.broadcast,
    "Hosts Solicitados": subnet.hostsRequested,
    "Hosts Disponibles": subnet.hostsAvailable,
    "Hosts Desperdiciados": subnet.hostsWasted,
    "Utilización %": subnet.utilizationPercent
  }));
}

/**
 * Prepara estadísticas para exportación
 * @param {Object} stats - Estadísticas
 * @returns {Array<Object>} Datos preparados para CSV
 */
function prepareStatsData(stats) {
  return [{
    "Métrica": "Subredes Creadas",
    "Valor": stats.subnetsCount
  }, {
    "Métrica": "Espacio Total Disponible (IPs)",
    "Valor": stats.totalAvailable
  }, {
    "Métrica": "Espacio Usado (IPs)",
    "Valor": stats.totalUsed
  }, {
    "Métrica": "Utilización (%)",
    "Valor": stats.utilizationPercent
  }, {
    "Métrica": "Espacio Restante (IPs)",
    "Valor": stats.totalRemaining
  }, {
    "Métrica": "Hosts Requeridos",
    "Valor": stats.totalHosts
  }, {
    "Métrica": "Hosts Asignados",
    "Valor": stats.totalAllocated
  }, {
    "Métrica": "IPs Desperdiciadas",
    "Valor": stats.totalWasted
  }, {
    "Métrica": "Eficiencia (%)",
    "Valor": stats.efficiencyPercent
  }];
}

/**
 * Exporta subredes a formato CSV
 * @param {Array<Object>} subnets - Array de subredes
 * @param {Object} stats - Estadísticas (opcional)
 * @param {string} filename - Nombre del archivo (opcional)
 * @returns {boolean} True si la exportación fue exitosa
 */
export function exportToCSV(subnets, stats = null, filename = null) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    const defaultFilename = `vlsm-calculos-${timestamp}.csv`;
    const finalFilename = filename || defaultFilename;

    let csvContent = "";

    // Si hay estadísticas, agregarlas primero
    if (stats) {
      csvContent += "ESTADÍSTICAS DE UTILIZACIÓN\n";
      const statsData = prepareStatsData(stats);
      csvContent += arrayToCSV(statsData, ["Métrica", "Valor"]);
      csvContent += "\n\n";
    }

    // Agregar datos de subredes
    csvContent += "SUBREDES\n";
    const subnetsData = prepareSubnetsData(subnets);
    const subnetsHeaders = [
      "Subred",
      "Red",
      "Máscara",
      "Primer Host",
      "Último Host",
      "Broadcast",
      "Hosts Solicitados",
      "Hosts Disponibles",
      "Hosts Desperdiciados",
      "Utilización %"
    ];
    csvContent += arrayToCSV(subnetsData, subnetsHeaders);

    // Agregar footer
    csvContent += "\n\nGenerado por: Calculadora VLSM - https://luxury-dango-9d7cff.netlify.app\n";
    csvContent += `Fecha: ${new Date().toLocaleString()}\n`;

    // Descargar archivo
    downloadFile(csvContent, finalFilename, "text/csv;charset=utf-8;");

    return true;
  } catch (error) {
    console.error("Error al exportar a CSV:", error);
    return false;
  }
}

/**
 * Exporta subredes a formato JSON
 * @param {Array<Object>} subnets - Array de subredes
 * @param {Object} stats - Estadísticas (opcional)
 * @param {string} filename - Nombre del archivo (opcional)
 * @returns {boolean} True si la exportación fue exitosa
 */
export function exportToJSON(subnets, stats = null, filename = null) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    const defaultFilename = `vlsm-calculos-${timestamp}.json`;
    const finalFilename = filename || defaultFilename;

    const data = {
      metadata: {
        generatedBy: "Calculadora VLSM",
        url: "https://luxury-dango-9d7cff.netlify.app",
        timestamp: new Date().toISOString(),
        version: "1.2.0"
      },
      statistics: stats,
      subnets: subnets
    };

    const jsonContent = JSON.stringify(data, null, 2);

    // Descargar archivo
    downloadFile(jsonContent, finalFilename, "application/json;charset=utf-8;");

    return true;
  } catch (error) {
    console.error("Error al exportar a JSON:", error);
    return false;
  }
}

/**
 * Exporta subredes a formato de texto plano
 * @param {Array<Object>} subnets - Array de subredes
 * @param {Object} stats - Estadísticas (opcional)
 * @param {string} filename - Nombre del archivo (opcional)
 * @returns {boolean} True si la exportación fue exitosa
 */
export function exportToText(subnets, stats = null, filename = null) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    const defaultFilename = `vlsm-calculos-${timestamp}.txt`;
    const finalFilename = filename || defaultFilename;

    let textContent = "CALCULADORA VLSM - RESULTADOS\n";
    textContent += "================================\n\n";

    // Estadísticas
    if (stats) {
      textContent += "ESTADÍSTICAS DE UTILIZACIÓN\n";
      textContent += "----------------------------\n";
      textContent += `Subredes creadas: ${stats.subnetsCount}\n`;
      textContent += `Espacio total disponible: ${stats.totalAvailable} IPs\n`;
      textContent += `Espacio usado: ${stats.totalUsed} IPs (${stats.utilizationPercent}%)\n`;
      textContent += `Espacio restante: ${stats.totalRemaining} IPs\n`;
      textContent += `Hosts requeridos: ${stats.totalHosts}\n`;
      textContent += `Hosts asignados: ${stats.totalAllocated}\n`;
      textContent += `IPs desperdiciadas: ${stats.totalWasted}\n`;
      textContent += `Eficiencia: ${stats.efficiencyPercent}%\n\n`;
    }

    // Subredes
    textContent += "SUBREDES\n";
    textContent += "--------\n\n";

    subnets.forEach(subnet => {
      textContent += `Subred ${subnet.index}\n`;
      textContent += `  Red: ${subnet.network}/${subnet.prefix}\n`;
      textContent += `  Máscara: ${subnet.mask}\n`;
      textContent += `  Rango de Hosts: ${subnet.firstHost} - ${subnet.lastHost}\n`;
      textContent += `  Broadcast: ${subnet.broadcast}\n`;
      textContent += `  Hosts solicitados: ${subnet.hostsRequested}\n`;
      textContent += `  Hosts disponibles: ${subnet.hostsAvailable}\n`;
      textContent += `  Utilización: ${subnet.utilizationPercent}% (${subnet.hostsWasted} IPs sin usar)\n\n`;
    });

    textContent += `\nGenerado por: https://luxury-dango-9d7cff.netlify.app\n`;
    textContent += `Fecha: ${new Date().toLocaleString()}\n`;

    // Descargar archivo
    downloadFile(textContent, finalFilename, "text/plain;charset=utf-8;");

    return true;
  } catch (error) {
    console.error("Error al exportar a texto:", error);
    return false;
  }
}
