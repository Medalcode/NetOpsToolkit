export function initPublicIpWidget() {
  const container = document.getElementById("public-ip-widget");
  if (!container) return; // This widget lives in the dashboard view primarily

  async function fetchIp() {
    container.innerHTML = "<div class=\"loading-spinner\"></div> Cargando IP...";

    try {
      // Try our Serverless Backend first (Best Practice)
      // This avoids CORS issues and demonstrates full-stack capability
      const response = await fetch("/.netlify/functions/geo-ip");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      render(data);
    } catch (error) {
      container.innerHTML =
        "<div style=\"color:var(--color-error); font-size:0.9rem;\">Error al obtener IP. <button id=\"btn-retry-ip\" style=\"background:none; border:none; color:var(--color-primary); cursor:pointer; text-decoration:underline;\">Reintentar</button></div>";

      const retry = document.getElementById("btn-retry-ip");
      if (retry) retry.addEventListener("click", fetchIp);
    }
  }

  function render(data) {
    container.innerHTML = `
        <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-primary); margin-bottom: 5px;">
            ${data.ip}
        </div>
        <div style="margin-bottom: 10px; font-size: 0.9rem;">
            <span style="font-weight:600;">${data.org || data.asn}</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem; color: var(--color-text-secondary);">
            <div>📍 ${data.city}, ${data.country_code}</div>
            <div>🛡️ ${data.ip.includes(":") ? "IPv6" : "IPv4"}</div>
        </div>
    `;
  }

  // Initial load
  fetchIp();
}
