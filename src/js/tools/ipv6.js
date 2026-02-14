/**
 * Módulo de Herramientas IPv6 (Tailwind Version)
 * Provee funciones para manipulación y análisis de direcciones IPv6
 */

export function initIPv6Tool(container) {
  // 1. Render UI
  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
        <!-- Input Section -->
        <div class="bg-surface-dark cyber-border rounded p-6">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">IPv6 Address Manipulation</h4>
            <div class="space-y-4">
                <input id="ipv6-input" type="text" placeholder="e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334" class="w-full bg-black border border-border-dark rounded px-4 py-3 text-white mono-data focus:border-primary transition-colors">
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button id="btn-ipv6-compress" class="bg-black border border-border-dark hover:border-primary text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined !text-sm">compress</span> Compress
                    </button>
                    <button id="btn-ipv6-expand" class="bg-black border border-border-dark hover:border-primary text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined !text-sm">expand</span> Expand
                    </button>
                    <button id="btn-ipv6-info" class="bg-primary hover:bg-primary/80 text-white font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                         <span class="material-symbols-outlined !text-sm">info</span> Analyze
                    </button>
                </div>
            </div>
        </div>

        <!-- Results Section -->
        <div id="ipv6-results" class="hidden bg-surface-dark cyber-border rounded p-6">
            <!-- Dynamic Content -->
        </div>
    </div>
  `;

  const input = container.querySelector("#ipv6-input");
  const btnCompress = container.querySelector("#btn-ipv6-compress");
  const btnExpand = container.querySelector("#btn-ipv6-expand");
  const btnInfo = container.querySelector("#btn-ipv6-info");
  const resultContainer = container.querySelector("#ipv6-results");

  // --- Logic ---

  function validate(addr) {
    const regex =
      /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){1,7}:)|(([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2})|(([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3})|(([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4})|(([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5})|([0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6}))|:((:[0-9A-Fa-f]{1,4}){1,7}|:)|fe80:(:[0-9A-Fa-f]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9A-Fa-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\s*$/;
    return regex.test(addr);
  }

  function expand(addr) {
    const full = addr.toLowerCase();
    const parts = full.split("::");
    if (parts.length > 2) return null;

    let left = parts[0] ? parts[0].split(":") : [];
    let right = parts[1] ? parts[1].split(":") : [];

    if (parts[0] === "") left = [];
    if (parts[1] === "") right = [];

    const missing = 8 - (left.length + right.length);
    const zeros = Array(missing).fill("0000");

    let allParts = [...left, ...zeros, ...right];
    allParts = allParts.map(p => p.padStart(4, "0"));

    return allParts.join(":");
  }

  function compress(addr) {
    const expended = expand(addr);
    if (!expended) return null;

    const parts = expended.split(":").map(p => p.replace(/^0+(.+)/, "$1").replace(/^0+$/, "0"));

    let bestStart = -1;
    let bestLen = 0;

    let currentStart = -1;
    let currentLen = 0;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "0") {
        if (currentStart === -1) currentStart = i;
        currentLen++;
      } else {
        if (currentLen > bestLen) {
          bestLen = currentLen;
          bestStart = currentStart;
        }
        currentStart = -1;
        currentLen = 0;
      }
    }
    if (currentLen > bestLen) {
      bestLen = currentLen;
      bestStart = currentStart;
    }

    if (bestLen > 1) {
      parts.splice(bestStart, bestLen, "");
      if (bestStart === 0 && bestStart + bestLen === 8) return "::";

      let res = parts.join(":");
      if (parts[0] === "") res = ":" + res;
      if (parts[parts.length - 1] === "") res = res + ":";
      return res;
    }

    return parts.join(":");
  }

  function getType(addr) {
    const full = expand(addr);
    if (!full) return "Invalid";

    const p = full.toLowerCase();

    if (p === "0000:0000:0000:0000:0000:0000:0000:0000") return "Unspecified (::)";
    if (p === "0000:0000:0000:0000:0000:0000:0000:0001") return "Loopback (::1)";
    if (p.startsWith("fe80")) return "Link-Local Unicast";
    if (p.startsWith("fec0")) return "Site-Local Unicast (Deprecated)";
    if (p.startsWith("fc") || p.startsWith("fd")) return "Unique Local (ULA)";
    if (p.startsWith("ff")) return "Multicast";
    if (p.startsWith("2001:0db8")) return "Documentation";
    if (p.startsWith("2001:0000")) return "Teredo Tunneling";
    if (p.startsWith("2002")) return "6to4 Tunneling";
    if (p.startsWith("2") || p.startsWith("3")) return "Global Unicast";

    return "Unknown / Reserved";
  }

  function handleAction(action) {
    const val = input.value.trim();

    resultContainer.classList.remove("hidden");
    resultContainer.innerHTML = "";

    if (!validate(val)) {
      resultContainer.innerHTML =
        '<span class="text-red-500 font-mono">Error: Invalid IPv6 address format.</span>';
      return;
    }

    if (action === "compress") {
      renderField("Compressed Address", compress(val));
      renderField("Canonical Form", expand(val));
    } else if (action === "expand") {
      renderField("Expanded Address (Canonical)", expand(val));
    } else if (action === "info") {
      const type = getType(val);
      const exp = expand(val);
      const comp = compress(val);

      const wrapper = document.createElement("div");
      wrapper.className = "space-y-4";

      wrapper.appendChild(createDetailRow("Address Type", type, true));
      wrapper.appendChild(createDetailRow("Canonical Form", exp));
      wrapper.appendChild(createDetailRow("Compressed Form", comp));

      resultContainer.appendChild(wrapper);
    }
  }

  function renderField(title, value) {
    resultContainer.appendChild(createDetailRow(title, value));
  }

  function createDetailRow(label, value, isType = false) {
    const div = document.createElement("div");
    div.className = "border-b border-white/5 pb-2 last:border-0";

    const lbl = document.createElement("div");
    lbl.className = "text-[10px] uppercase font-bold text-slate-500 mb-1";
    lbl.textContent = label;

    const val = document.createElement("div");
    val.className = isType
      ? "text-primary font-bold"
      : "font-mono text-white break-all flex justify-between items-center group";

    if (!isType) {
      val.innerHTML = `
            <span>${value}</span>
            <button class="opacity-0 group-hover:opacity-100 text-[10px] text-slate-500 hover:text-white transition-opacity ml-2" onclick="navigator.clipboard.writeText('${value}')">COPY</button>
          `;
    } else {
      val.textContent = value;
    }

    div.appendChild(lbl);
    div.appendChild(val);
    return div;
  }

  btnCompress.addEventListener("click", () => handleAction("compress"));
  btnExpand.addEventListener("click", () => handleAction("expand"));
  btnInfo.addEventListener("click", () => handleAction("info"));
}
