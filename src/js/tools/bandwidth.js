export function initBandwidthTool() {
  const sizeInput = document.getElementById("bw-size");
  const sizeUnit = document.getElementById("bw-size-unit");
  const speedInput = document.getElementById("bw-speed");
  const speedUnit = document.getElementById("bw-speed-unit");
  const btnCalc = document.getElementById("btn-bw-calc");
  const resultContainer = document.getElementById("bw-results");

  if (!sizeInput || !resultContainer) return;

  function formatTime(seconds) {
    if (seconds < 1) return (seconds * 1000).toFixed(0) + " ms";
    if (seconds < 60) return seconds.toFixed(2) + " segundos";

    const minutes = Math.floor(seconds / 60);
    const remSeconds = (seconds % 60).toFixed(0);
    if (minutes < 60) return `${minutes} min, ${remSeconds} seg`;

    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    if (hours < 24) return `${hours} horas, ${remMinutes} min`;

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days} días, ${remHours} horas`;
  }

  function calculate() {
    const size = parseFloat(sizeInput.value);
    const speed = parseFloat(speedInput.value);

    if (isNaN(size) || isNaN(speed) || size <= 0 || speed <= 0) {
      resultContainer.innerHTML =
        '<div class="warning-message">Ingresa valores válidos mayor a 0.</div>';
      return;
    }

    // Convert everything to Bits
    // Size Units (Based on 1000 for simplicity in networking, or 1024?
    // Usually network speeds are decimal (1Gbps = 1e9 bits).
    // File sizes are usually binary (1GB = 2^30 bytes).
    // Let's use Binary for Size (Bytes) and Decimal for Speed (Bits) which is real world scenario.

    const sizeMultipliers = {
      KB: 1024 * 8, // Kilobytes to bits
      MB: 1024 * 1024 * 8,
      GB: 1024 * 1024 * 1024 * 8,
      TB: 1024 * 1024 * 1024 * 1024 * 8,
    };

    const speedMultipliers = {
      Kbps: 1000,
      Mbps: 1000 * 1000,
      Gbps: 1000 * 1000 * 1000,
    };

    const totalBits = size * sizeMultipliers[sizeUnit.value];
    const bitsPerSecond = speed * speedMultipliers[speedUnit.value];

    const seconds = totalBits / bitsPerSecond;

    resultContainer.innerHTML = `
      <div class="card" style="padding: 24px; text-align: center; border-left: 4px solid var(--color-primary); animation: highlight 0.5s;">
        <h3 style="margin:0; color:var(--color-text-secondary); font-size: 0.9rem; text-transform:uppercase;">Tiempo Estimado</h3>
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-primary); margin: 10px 0;">
            ${formatTime(seconds)}
        </div>
        <div style="font-size: 0.8rem; color: var(--color-text-secondary);">
            Transferencia de ${size} ${sizeUnit.value} a ${speed} ${speedUnit.value}
        </div>
        <div style="margin-top:15px; font-size:0.8rem; opacity:0.7;">
          (Asumiendo uso de canal al 100% sin overhead)
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);

  // Auto calc on enter key
  [sizeInput, speedInput].forEach(inp => {
    inp.addEventListener("keypress", e => {
      if (e.key === "Enter") calculate();
    });
  });
}
