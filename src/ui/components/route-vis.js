import { showToast } from "../shared/ui-engine.js";

// Helper to convert IP string to 32-bit integer
function ipToNum(ip) {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Helper to convert 32-bit integer to IP string
function numToIp(num) {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join(".");
}

// Helper to get binary string padded to 32 bits
function numToBinString(num) {
  return num.toString(2).padStart(32, "0");
}

export function initRouteVisTool(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
      <!-- Input Area -->
      <div class="flex flex-col gap-2">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Networks to Aggregate</h4>
        <p class="text-xs text-slate-400 mb-2">Enter one prefix per line (e.g. 192.168.1.0/24)</p>
        <textarea id="route-input" class="w-full h-full bg-black/50 border border-border-dark rounded p-4 text-signal-green mono-data text-xs resize-none focus:border-primary focus:outline-none custom-scrollbar" placeholder="192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24"></textarea>
        <button id="btn-aggregate" class="bg-primary hover:bg-primary-hover text-black font-bold py-3 px-4 rounded transition-colors mt-2">
          Calculate Supernet
        </button>
      </div>

      <!-- Output Area -->
      <div class="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Aggregation Result</h4>
        
        <div id="supernet-result" class="bg-black/50 border border-border-dark rounded p-6 mb-4 text-center hidden">
          <p class="text-slate-400 text-xs uppercase tracking-widest mb-2">Summarized Route</p>
          <div class="text-2xl font-bold text-primary mono-data" id="supernet-value"></div>
        </div>

        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 mt-2">Binary Analysis</h4>
        <div id="binary-container" class="flex flex-col gap-1 bg-black border border-border-dark rounded p-4 overflow-x-auto text-xs mono-data hidden">
           <!-- Binary strings go here -->
        </div>
      </div>
    </div>
  `;

  const inputArea = container.querySelector("#route-input");
  const btnAggregate = container.querySelector("#btn-aggregate");
  const supernetResult = container.querySelector("#supernet-result");
  const supernetValue = container.querySelector("#supernet-value");
  const binaryContainer = container.querySelector("#binary-container");

  btnAggregate.addEventListener("click", () => {
    const text = inputArea.value.trim();
    if (!text) {
      showToast("Please enter at least one prefix", "error");
      return;
    }

    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const validNetworks = [];

    for (const line of lines) {
      const parts = line.split("/");
      if (parts.length !== 2) {
        showToast(`Invalid format: ${line}`, "error");
        return;
      }
      const ip = parts[0];
      const prefix = parseInt(parts[1], 10);
      if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        showToast(`Invalid prefix: ${line}`, "error");
        return;
      }

      try {
        const num = ipToNum(ip);
        // Apply mask to ensure it's a network address
        const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
        const netNum = (num & mask) >>> 0;

        validNetworks.push({
          original: line,
          ip: numToIp(netNum),
          num: netNum,
          prefix: prefix,
          binStr: numToBinString(netNum)
        });
      } catch (e) {
        showToast(`Invalid IP: ${line}`, "error");
        return;
      }
    }

    if (validNetworks.length === 0) return;

    if (validNetworks.length === 1) {
      supernetResult.classList.remove("hidden");
      supernetValue.textContent = `${validNetworks[0].ip}/${validNetworks[0].prefix}`;
      binaryContainer.classList.add("hidden");
      showToast("Only one network provided", "notice");
      return;
    }

    // Find common prefix
    let commonBits = 32;
    const firstBin = validNetworks[0].binStr;

    for (let i = 1; i < validNetworks.length; i++) {
      const currentBin = validNetworks[i].binStr;
      let j = 0;
      while (j < commonBits && firstBin[j] === currentBin[j]) {
        j++;
      }
      commonBits = j;
    }

    // Calculate supernet IP
    const mask = commonBits === 0 ? 0 : (~0 << (32 - commonBits)) >>> 0;
    const supernetNum = (validNetworks[0].num & mask) >>> 0;
    const supernetIp = numToIp(supernetNum);

    supernetResult.classList.remove("hidden");
    supernetValue.textContent = `${supernetIp}/${commonBits}`;

    // Render Binary Analysis
    binaryContainer.classList.remove("hidden");
    binaryContainer.innerHTML = "";

    // Header
    const hdr = document.createElement("div");
    hdr.className = "text-slate-500 mb-2 border-b border-border-dark pb-2 flex justify-between";
    hdr.innerHTML = `<span>Common bits: <span class="text-signal-green">${commonBits}</span></span><span>Variable bits: <span class="text-red-500">${32 - commonBits}</span></span>`;
    binaryContainer.appendChild(hdr);

    validNetworks.forEach(net => {
      const el = document.createElement("div");

      let formattedHtml = "";
      for(let i=0; i<32; i++){
        const bit = net.binStr[i];
        const color = i < commonBits ? "text-signal-green" : "text-slate-600";
        formattedHtml += `<span class="${color}">${bit}</span>`;
        if ((i + 1) % 8 === 0 && i < 31) formattedHtml += "<span class=\"text-slate-800\">.</span>";
      }

      el.innerHTML = `
        <div class="flex items-center gap-4 hover:bg-white/5 p-1 rounded">
          <span class="w-32 text-slate-300">${net.ip}/${net.prefix}</span>
          <span>${formattedHtml}</span>
        </div>
      `;
      binaryContainer.appendChild(el);
    });

    showToast("Supernet calculated", "success");
  });
}
