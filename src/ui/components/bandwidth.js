export function initBandwidthTool(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6">
        <div class="bg-surface-dark cyber-border rounded p-6">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Bandwidth Calculator</h4>
            <div class="space-y-4">
                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">File Size</label>
                        <input id="bw-size" type="number" step="any" placeholder="100" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white focus:border-primary transition-colors">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit</label>
                        <select id="bw-size-unit" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer focus:border-primary transition-colors">
                            <option value="KB">KB</option>
                            <option value="MB" selected>MB</option>
                            <option value="GB">GB</option>
                            <option value="TB">TB</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Network Speed</label>
                        <input id="bw-speed" type="number" step="any" placeholder="10" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white focus:border-primary transition-colors">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit</label>
                        <select id="bw-speed-unit" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer focus:border-primary transition-colors">
                            <option value="Kbps">Kbps</option>
                            <option value="Mbps" selected>Mbps</option>
                            <option value="Gbps">Gbps</option>
                        </select>
                    </div>
                </div>
                <button id="btn-bw-calc" class="w-full bg-primary hover:bg-primary/80 text-white text-xs font-bold uppercase tracking-widest py-3 rounded transition-colors shadow-lg shadow-primary/20 mt-2">
                    Calculate Time
                </button>
            </div>
        </div>
        
        <div id="bw-results"></div>
    </div>
  `;

  const sizeInput = container.querySelector("#bw-size");
  const sizeUnit = container.querySelector("#bw-size-unit");
  const speedInput = container.querySelector("#bw-speed");
  const speedUnit = container.querySelector("#bw-speed-unit");
  const btnCalc = container.querySelector("#btn-bw-calc");
  const resultContainer = container.querySelector("#bw-results");

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
