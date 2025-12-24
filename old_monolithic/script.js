/**
 * Calculadora VLSM (Variable Length Subnet Mask)
 * @author MedalCode
 * @version 1.1.0
 */

// Event listener principal con manejo de errores
document.getElementById("vlsm-form").addEventListener("submit", function (e) {
  e.preventDefault();

  try {
    const network = document.getElementById("network").value.trim();
    const hostsInput = document.getElementById("hosts").value.trim();

    const resultsDiv = document.getElementById("results");
    clearResults(resultsDiv);

    // Validar la red principal
    const [baseIP, prefixStr] = network.split("/");
    const prefix = Number(prefixStr);

    // Validación mejorada de IP y prefijo CIDR
    if (!validateIPAddress(baseIP)) {
      showError(
        resultsDiv,
        "Dirección IP inválida. Debe tener formato xxx.xxx.xxx.xxx donde cada octeto está entre 0-255."
      );
      return;
    }

    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      showError(
        resultsDiv,
        "Prefijo CIDR inválido. Debe estar entre 0 y 32 (ej: /24)."
      );
      return;
    }

    // Obtener los requerimientos de hosts
    const hosts = hostsInput
      .split(",")
      .map((h) => Number(h.trim()))
      .sort((a, b) => b - a);

    if (hosts.some(isNaN) || hosts.some((h) => h < 0)) {
      showError(
        resultsDiv,
        "Lista de hosts inválida. Ingresa números positivos separados por comas."
      );
      return;
    }

    if (hosts.some((h) => h === 0)) {
      showError(resultsDiv, "Los hosts deben ser mayor a 0.");
      return;
    }

    if (hosts.length === 0) {
      showError(resultsDiv, "Debes especificar al menos una subred.");
      return;
    }

    // Validar que la IP base coincida con el prefijo
    if (!validateNetworkAddress(baseIP, prefix)) {
      showWarning(
        resultsDiv,
        `Advertencia: La dirección IP no coincide con el prefijo /${prefix}. Se ajustará automáticamente.`
      );
    }

    // Calcular espacio total disponible
    const totalAvailableIPs = Math.pow(2, 32 - prefix);
    const totalRequiredIPs = hosts.reduce(
      (sum, h) => sum + Math.pow(2, Math.ceil(Math.log2(h + 2))),
      0
    );

    // Detectar agotamiento de espacio de red
    if (totalRequiredIPs > totalAvailableIPs) {
      showError(
        resultsDiv,
        `Error: Espacio de red insuficiente. La red /${prefix} tiene ${totalAvailableIPs} direcciones disponibles, pero se requieren ${totalRequiredIPs} direcciones.`
      );
      return;
    }

    // Realizar los cálculos de VLSM
    const subnets = calculateVLSM(baseIP, prefix, hosts);

    // Calcular estadísticas
    const stats = calculateStatistics(subnets, totalAvailableIPs);

    // Mostrar resultados
    displayResults(subnets, stats, resultsDiv);
  } catch (error) {
    console.error("Error en cálculo VLSM:", error);
    showError(
      document.getElementById("results"),
      `Error inesperado: ${error.message}. Por favor, verifica los datos ingresados.`
    );
  }
});

/**
 * Valida si una dirección IP tiene formato válido IPv4
 * @param {string} ip - Dirección IP en formato decimal punteado
 * @returns {boolean} True si la IP es válida
 */
function validateIPAddress(ip) {
  if (!ip) return false;
  const octets = ip.split(".");
  return (
    octets.length === 4 &&
    octets.every((o) => {
      const num = Number(o);
      return !isNaN(num) && num >= 0 && num <= 255 && o === num.toString();
    })
  );
}

/**
 * Valida que la dirección de red coincida con el prefijo CIDR
 * @param {string} ip - Dirección IP
 * @param {number} prefix - Prefijo CIDR
 * @returns {boolean} True si coincide
 */
function validateNetworkAddress(ip, prefix) {
  const ipDecimal = ipToDecimal(ip);
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  const networkAddress = (ipDecimal & mask) >>> 0;
  return ipDecimal === networkAddress;
}

/**
 * Calcular subredes usando VLSM
 * @param {string} baseIP - Dirección IP base
 * @param {number} prefix - Prefijo CIDR
 * @param {number[]} hosts - Array de requisitos de hosts (ordenado desc)
 * @returns {Array} Array de objetos con información de subredes
 */
function calculateVLSM(baseIP, prefix, hosts) {
  let subnets = [];
  let currentIP = ipToDecimal(baseIP);
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  let networkStart = (currentIP & mask) >>> 0;

  hosts.forEach((hostCount, index) => {
    const bitsNeeded = Math.ceil(Math.log2(hostCount + 2));
    const newPrefix = 32 - bitsNeeded;
    const blockSize = Math.pow(2, bitsNeeded);

    const subnet = {
      index: index + 1,
      network: decimalToIP(networkStart),
      prefix: newPrefix,
      mask: decimalToIP((0xffffffff << (32 - newPrefix)) >>> 0),
      broadcast: decimalToIP(networkStart + blockSize - 1),
      firstHost: decimalToIP(networkStart + 1),
      lastHost: decimalToIP(networkStart + blockSize - 2),
      hostsAvailable: blockSize - 2,
      hostsRequested: hostCount,
      hostsWasted: blockSize - 2 - hostCount,
      utilizationPercent: ((hostCount / (blockSize - 2)) * 100).toFixed(2),
    };

    subnets.push(subnet);
    networkStart += blockSize;
  });

  return subnets;
}

/**
 * Calcular estadísticas de utilización de red
 * @param {Array} subnets - Array de subredes
 * @param {number} totalAvailable - Total de IPs disponibles
 * @returns {Object} Objeto con estadísticas
 */
function calculateStatistics(subnets, totalAvailable) {
  const totalUsed = subnets.reduce(
    (sum, s) => sum + Math.pow(2, 32 - s.prefix),
    0
  );
  const totalHosts = subnets.reduce((sum, s) => sum + s.hostsRequested, 0);
  const totalAllocated = subnets.reduce((sum, s) => sum + s.hostsAvailable, 0);
  const totalWasted = totalAllocated - totalHosts;

  return {
    totalAvailable,
    totalUsed,
    totalRemaining: totalAvailable - totalUsed,
    totalHosts,
    totalAllocated,
    totalWasted,
    utilizationPercent: ((totalUsed / totalAvailable) * 100).toFixed(2),
    efficiencyPercent: ((totalHosts / totalAllocated) * 100).toFixed(2),
    subnetsCount: subnets.length,
  };
}

/**
 * Convertir IP a decimal
 * @param {string} ip - IP en formato decimal punteado
 * @returns {number} Valor decimal de 32 bits
 */
function ipToDecimal(ip) {
  return (
    ip.split(".").reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0
  );
}

/**
 * Convertir decimal a IP
 * @param {number} decimal - Valor decimal de 32 bits
 * @returns {string} IP en formato decimal punteado
 */
function decimalToIP(decimal) {
  return [24, 16, 8, 0].map((shift) => (decimal >>> shift) & 255).join(".");
}

/**
 * Limpiar resultados previos
 * @param {HTMLElement} container - Contenedor de resultados
 */
function clearResults(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Mostrar mensaje de error
 * @param {HTMLElement} container - Contenedor
 * @param {string} message - Mensaje de error
 */
function showError(container, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#d32f2f";
  errorDiv.style.backgroundColor = "#ffebee";
  errorDiv.style.padding = "12px";
  errorDiv.style.borderRadius = "4px";
  errorDiv.style.marginBottom = "16px";
  errorDiv.style.border = "1px solid #ef5350";

  const icon = document.createElement("strong");
  icon.textContent = "❌ Error: ";

  const text = document.createTextNode(message);

  errorDiv.appendChild(icon);
  errorDiv.appendChild(text);
  container.appendChild(errorDiv);
}

/**
 * Mostrar mensaje de advertencia
 * @param {HTMLElement} container - Contenedor
 * @param {string} message - Mensaje de advertencia
 */
function showWarning(container, message) {
  const warningDiv = document.createElement("div");
  warningDiv.className = "warning-message";
  warningDiv.style.color = "#f57c00";
  warningDiv.style.backgroundColor = "#fff3e0";
  warningDiv.style.padding = "12px";
  warningDiv.style.borderRadius = "4px";
  warningDiv.style.marginBottom = "16px";
  warningDiv.style.border = "1px solid #ffb74d";

  const icon = document.createElement("strong");
  icon.textContent = "⚠️ Advertencia: ";

  const text = document.createTextNode(message);

  warningDiv.appendChild(icon);
  warningDiv.appendChild(text);
  container.appendChild(warningDiv);
}

/**
 * Mostrar resultados de cálculo VLSM
 * @param {Array} subnets - Array de subredes calculadas
 * @param {Object} stats - Estadísticas de utilización
 * @param {HTMLElement} container - Contenedor de resultados
 */
function displayResults(subnets, stats, container) {
  // Mostrar estadísticas generales
  const statsDiv = document.createElement("div");
  statsDiv.className = "statistics";
  statsDiv.style.backgroundColor = "#e3f2fd";
  statsDiv.style.padding = "16px";
  statsDiv.style.borderRadius = "4px";
  statsDiv.style.marginBottom = "20px";
  statsDiv.style.border = "1px solid #90caf9";

  const statsTitle = document.createElement("h3");
  statsTitle.textContent = "📊 Estadísticas de Utilización";
  statsTitle.style.marginTop = "0";
  statsTitle.style.color = "#1976d2";
  statsDiv.appendChild(statsTitle);

  const statsInfo = [
    `Subredes creadas: ${stats.subnetsCount}`,
    `Espacio total disponible: ${stats.totalAvailable} IPs`,
    `Espacio usado: ${stats.totalUsed} IPs (${stats.utilizationPercent}%)`,
    `Espacio restante: ${stats.totalRemaining} IPs`,
    `Hosts requeridos: ${stats.totalHosts}`,
    `Hosts asignados: ${stats.totalAllocated}`,
    `IPs desperdiciadas: ${stats.totalWasted} (${(
      100 - stats.efficiencyPercent
    ).toFixed(2)}%)`,
    `Eficiencia: ${stats.efficiencyPercent}%`,
  ];

  statsInfo.forEach((info) => {
    const p = document.createElement("p");
    p.textContent = info;
    p.style.margin = "4px 0";
    statsDiv.appendChild(p);
  });

  container.appendChild(statsDiv);

  // Mostrar cada subred
  subnets.forEach((subnet) => {
    const subnetDiv = document.createElement("div");
    subnetDiv.className = "subnet-result";
    subnetDiv.style.backgroundColor = "#f5f5f5";
    subnetDiv.style.padding = "16px";
    subnetDiv.style.borderRadius = "4px";
    subnetDiv.style.marginBottom = "12px";
    subnetDiv.style.border = "1px solid #e0e0e0";

    const title = document.createElement("h4");
    title.textContent = `Subred ${subnet.index}`;
    title.style.marginTop = "0";
    title.style.color = "#424242";
    subnetDiv.appendChild(title);

    const details = [
      { label: "Red", value: `${subnet.network}/${subnet.prefix}` },
      { label: "Máscara", value: subnet.mask },
      {
        label: "Rango de Hosts",
        value: `${subnet.firstHost} - ${subnet.lastHost}`,
      },
      { label: "Broadcast", value: subnet.broadcast },
      { label: "Hosts solicitados", value: subnet.hostsRequested },
      { label: "Hosts disponibles", value: subnet.hostsAvailable },
      {
        label: "Utilización",
        value: `${subnet.utilizationPercent}% (${subnet.hostsWasted} IPs sin usar)`,
      },
    ];

    details.forEach((detail) => {
      const p = document.createElement("p");
      p.style.margin = "4px 0";

      const label = document.createElement("strong");
      label.textContent = `${detail.label}: `;

      const value = document.createTextNode(detail.value);

      p.appendChild(label);
      p.appendChild(value);
      subnetDiv.appendChild(p);
    });

    container.appendChild(subnetDiv);
  });
}
