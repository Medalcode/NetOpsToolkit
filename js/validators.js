/**
 * Módulo de Validación
 * Contiene todas las funciones de validación de inputs
 * @module validators
 */

/**
 * Valida si una dirección IP tiene formato válido IPv4
 * @param {string} ip - Dirección IP en formato decimal punteado
 * @returns {boolean} True si la IP es válida
 * @example
 * validateIPAddress("192.168.1.1") // true
 * validateIPAddress("256.1.1.1") // false
 */
export function validateIPAddress(ip) {
  if (!ip) return false;
  const octets = ip.split(".");
  return octets.length === 4 && octets.every(o => {
    const num = Number(o);
    return !isNaN(num) && num >= 0 && num <= 255 && o === num.toString();
  });
}

/**
 * Valida que el prefijo CIDR esté en el rango válido (0-32)
 * @param {number} prefix - Prefijo CIDR
 * @returns {boolean} True si el prefijo es válido
 * @example
 * validateCIDRPrefix(24) // true
 * validateCIDRPrefix(33) // false
 */
export function validateCIDRPrefix(prefix) {
  return !isNaN(prefix) && prefix >= 0 && prefix <= 32;
}

/**
 * Valida que la dirección de red coincida con el prefijo CIDR
 * @param {string} ip - Dirección IP
 * @param {number} prefix - Prefijo CIDR
 * @param {Function} ipToDecimal - Función para convertir IP a decimal
 * @returns {boolean} True si la dirección coincide con el prefijo
 * @example
 * validateNetworkAddress("192.168.1.0", 24, ipToDecimal) // true
 * validateNetworkAddress("192.168.1.1", 24, ipToDecimal) // false
 */
export function validateNetworkAddress(ip, prefix, ipToDecimal) {
  const ipDecimal = ipToDecimal(ip);
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const networkAddress = (ipDecimal & mask) >>> 0;
  return ipDecimal === networkAddress;
}

/**
 * Valida que una lista de hosts sea válida
 * @param {number[]} hosts - Array de requisitos de hosts
 * @returns {Object} Objeto con isValid y error message
 * @example
 * validateHosts([50, 30, 10]) // { isValid: true, error: null }
 * validateHosts([0, -5]) // { isValid: false, error: "..." }
 */
export function validateHosts(hosts) {
  if (!Array.isArray(hosts) || hosts.length === 0) {
    return { isValid: false, error: "Debes especificar al menos una subred." };
  }

  if (hosts.some(isNaN) || hosts.some(h => h < 0)) {
    return { isValid: false, error: "Lista de hosts inválida. Ingresa números positivos separados por comas." };
  }

  if (hosts.some(h => h === 0)) {
    return { isValid: false, error: "Los hosts deben ser mayor a 0." };
  }

  return { isValid: true, error: null };
}

/**
 * Valida que la red tenga suficiente espacio para las subredes solicitadas
 * @param {number} totalAvailable - Total de IPs disponibles en la red
 * @param {number} totalRequired - Total de IPs requeridas
 * @returns {Object} Objeto con isValid y error message
 */
export function validateNetworkCapacity(totalAvailable, totalRequired) {
  if (totalRequired > totalAvailable) {
    return {
      isValid: false,
      error: `Error: Espacio de red insuficiente. La red tiene ${totalAvailable} direcciones disponibles, pero se requieren ${totalRequired} direcciones.`
    };
  }
  return { isValid: true, error: null };
}
