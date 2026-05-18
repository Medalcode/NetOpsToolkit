export function initBandwidthTool(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">File Size</label>
          <div class="flex gap-2">
            <input id="bw-size" type="number" placeholder="100" class="flex-1 bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white placeholder-slate-700 focus:border-primary transition-colors">
            <select id="bw-size-unit" class="bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer">
              <option value="1">Bytes</option>
              <option value="1024" selected>KB</option>
              <option value="1048576">MB</option>
              <option value="1073741824">GB</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Transfer Speed</label>
          <div class="flex gap-2">
            <input id="bw-speed" type="number" placeholder="50" class="flex-1 bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white placeholder-slate-700 focus:border-primary transition-colors">
            <select id="bw-speed-unit" class="bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer">
              <option value="1">bps</option>
              <option value="1000">Kbps</option>
              <option value="1000000" selected>Mbps</option>
              <option value="1000000000">Gbps</option>
            </select>
          </div>
        </div>
        <button id="btn-bw-calc" class="bg-primary hover:bg-primary/80 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors">Calculate</button>
      </div>
      <div id="bw-results" class="bg-surface-dark cyber-border rounded p-4 text-slate-400 text-sm">
        Enter a file size and speed to calculate transfer time.
      </div>
    </div>
  `;

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
        "<div class=\"warning-message\">Ingresa valores válidos mayor a 0.</div>";
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
