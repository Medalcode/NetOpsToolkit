/**
 * Módulo de Portapapeles
 * Funciones para copiar datos al portapapeles
 * @module clipboard
 */

/**
 * Copia texto al portapapeles usando la API moderna
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export async function copyToClipboard(text) {
  try {
    // Intentar usar la API moderna del portapapeles
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antiguos o conexiones no seguras
      return copyToClipboardFallback(text);
    }
  } catch (error) {
    console.error("Error al copiar al portapapeles:", error);
    return copyToClipboardFallback(text);
  }
}

/**
 * Método fallback para copiar al portapapeles (navegadores antiguos)
 * @param {string} text - Texto a copiar
 * @returns {boolean} True si se copió exitosamente
 */
function copyToClipboardFallback(text) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error("Error en fallback de portapapeles:", error);
    return false;
  }
}

/**
 * Formatea una subred para copiar al portapapeles
 * @param {Object} subnet - Objeto de subred
 * @returns {string} Texto formateado
 */
export function formatSubnetForClipboard(subnet) {
  return `Subred ${subnet.index}
Red: ${subnet.network}/${subnet.prefix}
Máscara: ${subnet.mask}
Rango de Hosts: ${subnet.firstHost} - ${subnet.lastHost}
Broadcast: ${subnet.broadcast}
Hosts solicitados: ${subnet.hostsRequested}
Hosts disponibles: ${subnet.hostsAvailable}
Utilización: ${subnet.utilizationPercent}% (${subnet.hostsWasted} IPs sin usar)`;
}

/**
 * Formatea todas las subredes y estadísticas para copiar
 * @param {Array<Object>} subnets - Array de subredes
 * @param {Object} stats - Estadísticas
 * @returns {string} Texto formateado completo
 */
export function formatAllDataForClipboard(subnets, stats) {
  let text = "CALCULADORA VLSM - RESULTADOS\n";
  text += "================================\n\n";

  // Estadísticas
  text += "ESTADÍSTICAS DE UTILIZACIÓN\n";
  text += "----------------------------\n";
  text += `Subredes creadas: ${stats.subnetsCount}\n`;
  text += `Espacio total disponible: ${stats.totalAvailable} IPs\n`;
  text += `Espacio usado: ${stats.totalUsed} IPs (${stats.utilizationPercent}%)\n`;
  text += `Espacio restante: ${stats.totalRemaining} IPs\n`;
  text += `Hosts requeridos: ${stats.totalHosts}\n`;
  text += `Hosts asignados: ${stats.totalAllocated}\n`;
  text += `IPs desperdiciadas: ${stats.totalWasted} (${stats.wastePercent}%)\n`;
  text += `Eficiencia: ${stats.efficiencyPercent}%\n\n`;

  // Subredes
  text += "SUBREDES\n";
  text += "--------\n\n";

  subnets.forEach(subnet => {
    text += formatSubnetForClipboard(subnet);
    text += "\n\n";
  });

  text += "Generado por: https://luxury-dango-9d7cff.netlify.app\n";
  text += `Fecha: ${new Date().toLocaleString()}\n`;

  return text;
}

/**
 * Copia una subred específica al portapapeles
 * @param {Object} subnet - Subred a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export async function copySubnet(subnet) {
  const text = formatSubnetForClipboard(subnet);
  return await copyToClipboard(text);
}

/**
 * Copia todas las subredes y estadísticas al portapapeles
 * @param {Array<Object>} subnets - Array de subredes
 * @param {Object} stats - Estadísticas
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export async function copyAllResults(subnets, stats) {
  const text = formatAllDataForClipboard(subnets, stats);
  return await copyToClipboard(text);
}

/**
 * Formatea subredes como tabla Markdown
 * @param {Array<Object>} subnets
 * @returns {string}
 */
export function formatMarkdownTableForClipboard(subnets) {
  let text = "| Subred | Red | Máscara | Rango de Hosts | Broadcast | Requeridos | Disponibles |\n";
  text += "|---|---|---|---|---|---|---|\n";
  subnets.forEach(s => {
    text += `| ${s.index} | ${s.network}/${s.prefix} | ${s.mask} | ${s.firstHost} - ${s.lastHost} | ${s.broadcast} | ${s.hostsRequested} | ${s.hostsAvailable} |\n`;
  });
  return text;
}

/**
 * Formatea subredes como configuración Cisco IOS
 * @param {Array<Object>} subnets
 * @returns {string}
 */
export function formatCiscoConfigForClipboard(subnets) {
  let text = "! Configuración generada por NetOps Toolkit\n!\n";
  subnets.forEach((s, i) => {
    const vlanId = (i + 1) * 10;
    text += `vlan ${vlanId}\n`;
    text += ` name Subred_${s.index}\n`;
    text += "!\n";
    text += `interface Vlan${vlanId}\n`;
    text += ` description Gateway for Subred_${s.index}\n`;
    // Usamos el primer host como gateway por convención
    text += ` ip address ${s.firstHost} ${s.mask}\n`;
    text += " no shutdown\n!\n";
  });
  return text;
}

/**
 * Formatea subredes como configuración Mikrotik
 * @param {Array<Object>} subnets
 * @returns {string}
 */
export function formatMikrotikConfigForClipboard(subnets) {
  let text = "# Configuración generada por NetOps Toolkit\n";
  subnets.forEach((s, i) => {
    const vlanId = (i + 1) * 10;
    text += `/interface vlan add name=vlan${vlanId} vlan-id=${vlanId} interface=ether1\n`;
    text += `/ip address add address=${s.firstHost}/${s.prefix} interface=vlan${vlanId} comment="Gateway Subred_${s.index}"\n`;
  });
  return text;
}

export async function copyMarkdownTable(subnets) {
  return await copyToClipboard(formatMarkdownTableForClipboard(subnets));
}

export async function copyCiscoConfig(subnets) {
  return await copyToClipboard(formatCiscoConfigForClipboard(subnets));
}

export async function copyMikrotikConfig(subnets) {
  return await copyToClipboard(formatMikrotikConfigForClipboard(subnets));
}
