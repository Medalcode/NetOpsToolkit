/**
 * Módulo Calculador VLSM
 * Contiene la lógica core para calcular subredes usando VLSM
 * @module calculator
 */

import { ipToDecimal, decimalToIP, prefixToMask } from './converters.js';

/**
 * Calcula subredes utilizando el algoritmo VLSM (Variable Length Subnet Mask)
 * @param {string} baseIP - Dirección IP base de la red principal
 * @param {number} prefix - Prefijo CIDR de la red principal
 * @param {number[]} hosts - Array de requisitos de hosts (debe estar ordenado descendente)
 * @returns {Array<Object>} Array de objetos con información de cada subred
 * @example
 * calculateVLSM("192.168.1.0", 24, [50, 30, 10])
 * // Retorna array con 3 subredes optimizadas
 */
export function calculateVLSM(baseIP, prefix, hosts) {
  const subnets = [];
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  let networkStart = (ipToDecimal(baseIP) & mask) >>> 0;

  hosts.forEach((hostCount, index) => {
    // Calcular bits necesarios para la cantidad de hosts
    // +2 para dirección de red y broadcast
    const bitsNeeded = Math.ceil(Math.log2(hostCount + 2));
    const newPrefix = 32 - bitsNeeded;
    const blockSize = Math.pow(2, bitsNeeded);

    // Crear objeto de subred con toda la información
    const subnet = {
      index: index + 1,
      network: decimalToIP(networkStart),
      prefix: newPrefix,
      mask: prefixToMask(newPrefix),
      broadcast: decimalToIP(networkStart + blockSize - 1),
      firstHost: decimalToIP(networkStart + 1),
      lastHost: decimalToIP(networkStart + blockSize - 2),
      hostsAvailable: blockSize - 2,
      hostsRequested: hostCount,
      hostsWasted: (blockSize - 2) - hostCount,
      utilizationPercent: ((hostCount / (blockSize - 2)) * 100).toFixed(2),
      blockSize: blockSize
    };

    subnets.push(subnet);
    networkStart += blockSize;
  });

  return subnets;
}

/**
 * Calcula el total de direcciones IP requeridas para una lista de hosts
 * @param {number[]} hosts - Array de requisitos de hosts
 * @returns {number} Total de IPs requeridas
 */
export function calculateTotalRequired(hosts) {
  return hosts.reduce((sum, h) => {
    const bitsNeeded = Math.ceil(Math.log2(h + 2));
    return sum + Math.pow(2, bitsNeeded);
  }, 0);
}

/**
 * Calcula el total de direcciones disponibles en una red
 * @param {number} prefix - Prefijo CIDR
 * @returns {number} Total de IPs disponibles
 */
export function calculateTotalAvailable(prefix) {
  return Math.pow(2, 32 - prefix);
}
