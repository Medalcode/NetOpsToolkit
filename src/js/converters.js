/**
 * Módulo de Conversiones
 * Funciones para convertir entre formatos de direcciones IP
 * @module converters
 */

/**
 * Convierte una dirección IP en formato decimal punteado a número decimal de 32 bits
 * @param {string} ip - Dirección IP en formato decimal punteado (ej: "192.168.1.1")
 * @returns {number} Valor decimal de 32 bits sin signo
 * @example
 * ipToDecimal("192.168.1.1") // 3232235777
 * ipToDecimal("10.0.0.1") // 167772161
 */
export function ipToDecimal(ip) {
  return ip.split(".").reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0;
}

/**
 * Convierte un número decimal de 32 bits a dirección IP en formato decimal punteado
 * @param {number} decimal - Valor decimal de 32 bits sin signo
 * @returns {string} Dirección IP en formato decimal punteado
 * @example
 * decimalToIP(3232235777) // "192.168.1.1"
 * decimalToIP(167772161) // "10.0.0.1"
 */
export function decimalToIP(decimal) {
  return [24, 16, 8, 0].map(shift => (decimal >>> shift) & 255).join(".");
}

/**
 * Calcula la máscara de subred en formato decimal punteado a partir de un prefijo CIDR
 * @param {number} prefix - Prefijo CIDR (0-32)
 * @returns {string} Máscara de subred en formato decimal punteado
 * @example
 * prefixToMask(24) // "255.255.255.0"
 * prefixToMask(16) // "255.255.0.0"
 */
export function prefixToMask(prefix) {
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  return decimalToIP(mask);
}

/**
 * Calcula la dirección de red base a partir de una IP y prefijo
 * @param {string} ip - Dirección IP
 * @param {number} prefix - Prefijo CIDR
 * @returns {string} Dirección de red base
 * @example
 * getNetworkAddress("192.168.1.100", 24) // "192.168.1.0"
 */
export function getNetworkAddress(ip, prefix) {
  const ipDecimal = ipToDecimal(ip);
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const networkAddress = (ipDecimal & mask) >>> 0;
  return decimalToIP(networkAddress);
}
