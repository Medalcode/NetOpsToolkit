/**
 * Módulo Calculadora Estándar IPv4
 * @module standard_calc
 */

import { ipToDecimal, decimalToIP, prefixToMask } from './converters.js';
import { validateIPAddress, validateCIDRPrefix } from './validators.js';
import { showToast } from './ui.js';

export function initStandardCalc() {
  const btn = document.getElementById('std-btn');
  const input = document.getElementById('std-ip');
  
  if (!btn || !input) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    calculateStandard(input.value);
  });
  
  // Calculate on Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateStandard(input.value);
    }
  });
}

function calculateStandard(inputValue) {
  const resultsDiv = document.getElementById('std-results');
  
  if (!inputValue) {
    showToast("Ingresa una dirección IP", "error");
    return;
  }

  // Parse Input: allows "192.168.1.1" or "192.168.1.1/24"
  const parts = inputValue.split('/');
  const ip = parts[0].trim();
  let prefix = parts.length > 1 ? parseInt(parts[1]) : null;

  if (!validateIPAddress(ip)) {
     showToast("Dirección IP inválida", "error");
     return;
  }

  const octets = ip.split('.').map(Number);
  const firstOctet = octets[0];
  const ipClass = getClass(firstOctet);

  // If prefix not provided, deduce from class
  if (prefix === null) {
      if (ipClass.startsWith('A')) prefix = 8;
      else if (ipClass.startsWith('B')) prefix = 16;
      else if (ipClass.startsWith('C')) prefix = 24;
      else prefix = 24; // Default fallback
  }

  if (!validateCIDRPrefix(prefix)) {
      showToast("Prefijo CIDR inválido", "error");
      return;
  }

  // Calculations
  const ipDec = ipToDecimal(ip);
  const maskDec = (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const networkDec = (ipDec & maskDec) >>> 0;
  const broadcastDec = (networkDec | (~maskDec)) >>> 0;
  const wildcardDec = (~maskDec) >>> 0;
  
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

  // Display details
  document.getElementById('out-ip').textContent = ip;
  document.getElementById('out-mask').textContent = `${decimalToIP(maskDec)} (/${prefix})`;
  document.getElementById('out-wildcard').textContent = decimalToIP(wildcardDec);
  document.getElementById('out-network').textContent = `${decimalToIP(networkDec)}/${prefix}`;
  document.getElementById('out-broadcast').textContent = decimalToIP(broadcastDec);
  document.getElementById('out-class').textContent = ipClass;
  document.getElementById('out-range').textContent = usableHosts > 0 
      ? `${decimalToIP(networkDec + 1)} - ${decimalToIP(broadcastDec - 1)}`
      : 'N/A';
  document.getElementById('out-hosts').textContent = `${usableHosts.toLocaleString()} hosts`;
  document.getElementById('out-type').textContent = getIPType(octets);

  // Binary Visualization
  const binContainer = document.getElementById('out-binary');
  binContainer.innerHTML = '';
  binContainer.appendChild(createBinaryRow("IP Address", ipDec));
  binContainer.appendChild(createBinaryRow("Subnet Mask", maskDec));
  binContainer.appendChild(createBinaryRow("Network", networkDec));

  resultsDiv.style.display = 'block';
}

function getClass(firstOctet) {
    if (firstOctet < 128) return 'A';
    if (firstOctet < 192) return 'B';
    if (firstOctet < 224) return 'C';
    if (firstOctet < 240) return 'D (Multicast)';
    return 'E (Experimental)';
}

function getIPType(octets) {
    // Private Ranges:
    // 10.0.0.0/8
    // 172.16.0.0/12 (172.16 - 172.31)
    // 192.168.0.0/16
    // 127.0.0.0/8 (Loopback)
    
    const [o1, o2] = octets;
    
    if (o1 === 10) return "Privada (Clase A)";
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return "Privada (Clase B)";
    if (o1 === 192 && o2 === 168) return "Privada (Clase C)";
    if (o1 === 127) return "Loopback (Localhost)";
    if (o1 >= 224) return "Reservada/Multicast";
    
    return "Pública";
}

function createBinaryRow(label, decValue) {
    const row = document.createElement('div');
    row.style.marginBottom = "5px";
    
    // Format: 11000000.10101000.00000001.00000001
    const binStr = decimalToIP(decValue).split('.').map(octet => {
        return parseInt(octet).toString(2).padStart(8, '0');
    }).join('.');
    
    row.innerHTML = `<span style="display:inline-block; width:120px; color:#666;">${label}:</span> <span style="font-family:monospace; color:#007BFF;">${binStr}</span>`;
    return row;
}
