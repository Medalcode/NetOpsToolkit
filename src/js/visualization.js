/**
 * Módulo de Visualización
 * Renderiza gráficos y diagramas de la red
 * @module visualization
 */

/**
 * Renderiza el gráfico de asignación de espacio de red
 * @param {Array} subnets - Lista de subredes calculadas
 * @param {string} baseNetworkCIDR - Red base (e.g. "192.168.1.0/24")
 * @param {HTMLElement} container - Contenedor donde renderizar
 */
export function renderAllocationChart(subnets, baseNetworkCIDR, container) {
  // Limpiar contenedor
  container.innerHTML = "";

  const chartWrapper = document.createElement("div");
  chartWrapper.className = "allocation-chart-wrapper";

  const title = document.createElement("h3");
  title.textContent = "🗺️ Mapa de Asignación de IPs";
  chartWrapper.appendChild(title);

  // Calcular tamaño total de la red base
  const [, prefixStr] = baseNetworkCIDR.split("/");
  const basePrefix = parseInt(prefixStr, 10);
  const totalIPs = Math.pow(2, 32 - basePrefix);

  // Crear la barra de visualización
  const barContainer = document.createElement("div");
  barContainer.className = "allocation-bar";

  subnets.forEach((subnet, index) => {
    // Calcular IPs de esta subred
    const subnetSize = Math.pow(2, 32 - subnet.prefix);
    const percentage = (subnetSize / totalIPs) * 100;

    // Crear segmento de subred
    const segment = document.createElement("div");
    segment.className = "allocation-segment";
    segment.style.width = `${percentage}%`;
    segment.setAttribute(
      "title",
      `Subred ${subnet.index}: ${subnet.network}/${subnet.prefix} (${subnetSize} IPs)`
    );

    // Color diferente para cada subred (cíclico)
    const hue = (index * 137.5) % 360; // Golden angle approx for distinct colors
    segment.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;

    // Contenido del segmento (si cabe)
    if (percentage > 5) {
      segment.textContent = `S${subnet.index}`;
    }

    // Eventos para interactividad
    segment.addEventListener("mouseenter", () => {
      // Podríamos resaltar la tarjeta de la subred correspondiente aquí
      const card = document.querySelector(`.subnet-result:nth-child(${index + 2})`); // +2 por header stats
      if (card) {
        card.classList.add("highlight-card");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    segment.addEventListener("mouseleave", () => {
      const card = document.querySelector(`.subnet-result:nth-child(${index + 2})`);
      if (card) card.classList.remove("highlight-card");
    });

    barContainer.appendChild(segment);
  });

  // Calcular espacio libre al final
  const usedIPs = subnets.reduce((acc, sub) => acc + Math.pow(2, 32 - sub.prefix), 0);
  const freeIPs = totalIPs - usedIPs;

  if (freeIPs > 0) {
    const freePercentage = (freeIPs / totalIPs) * 100;
    const freeSegment = document.createElement("div");
    freeSegment.className = "allocation-segment free-space";
    freeSegment.style.width = `${freePercentage}%`;
    freeSegment.setAttribute("title", `Espacio Libre: ${freeIPs} IPs disponibles`);
    freeSegment.textContent = freePercentage > 10 ? "Libre" : "";
    barContainer.appendChild(freeSegment);
  }

  chartWrapper.appendChild(barContainer);

  // Agregar leyenda/info
  const legend = document.createElement("div");
  legend.className = "chart-legend";
  legend.innerHTML = `
    <span><strong>Total IPs:</strong> ${totalIPs}</span>
    <span><strong>Usadas:</strong> ${usedIPs} (${((usedIPs / totalIPs) * 100).toFixed(1)}%)</span>
    <span><strong>Libres:</strong> ${freeIPs} (${((freeIPs / totalIPs) * 100).toFixed(1)}%)</span>
  `;
  chartWrapper.appendChild(legend);

  container.appendChild(chartWrapper);
}
