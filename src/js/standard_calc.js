/**
 * Módulo Calculadora Estándar IPv4 (Tailwind Version)
 */
import { ipToDecimal, decimalToIP } from "./converters.js";
import { validateIPAddress, validateCIDRPrefix } from "./validators.js";

export function initStandardCalc(container) {
  // 1. Render UI
  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
        <!-- Input Section -->
        <div class="bg-surface-dark cyber-border rounded p-6">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Analyze Address</h4>
            <div class="flex gap-4">
                <input id="std-ip" type="text" placeholder="e.g. 192.168.1.5/24" class="flex-1 bg-black border border-border-dark rounded px-4 py-3 text-white mono-data focus:border-primary transition-colors">
                <button id="std-btn" class="bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-widest px-6 rounded transition-colors shadow-lg shadow-primary/20">
                    ANALYZE
                </button>
            </div>
        </div>

        <!-- Results Section (Hidden initially) -->
        <div id="std-results" class="hidden grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Network Details -->
            <div class="bg-surface-dark cyber-border rounded p-6">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-border-dark pb-2">Network Details</h4>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between border-b border-slate-800 pb-1">
                        <span class="text-slate-500">IP Address</span>
                        <span id="out-ip" class="mono-data text-white"></span>
                    </div>
                    <div class="flex justify-between border-b border-slate-800 pb-1">
                        <span class="text-slate-500">Subnet Mask</span>
                        <span id="out-mask" class="mono-data text-signal-green"></span>
                    </div>
                    <div class="flex justify-between border-b border-slate-800 pb-1">
                        <span class="text-slate-500">Network ID</span>
                        <span id="out-network" class="mono-data text-primary"></span>
                    </div>
                    <div class="flex justify-between border-b border-slate-800 pb-1">
                        <span class="text-slate-500">Broadcast</span>
                        <span id="out-broadcast" class="mono-data text-purple-400"></span>
                    </div>
                    <div class="flex justify-between border-b border-slate-800 pb-1">
                        <span class="text-slate-500">Wildcard Mask</span>
                        <span id="out-wildcard" class="mono-data text-slate-400"></span>
                    </div>
                    <div class="flex justify-between pt-1">
                        <span class="text-slate-500">Usable Range</span>
                        <span id="out-range" class="mono-data text-white text-right"></span>
                    </div>
                </div>
            </div>

            <!-- Meta Info -->
            <div class="space-y-6">
                <div class="bg-surface-dark cyber-border rounded p-6 flex flex-col justify-center items-center text-center">
                    <span class="text-[10px] uppercase font-bold text-slate-500 mb-2">Total Usable Hosts</span>
                    <span id="out-hosts" class="text-3xl font-mono font-bold text-signal-green">0</span>
                    <span class="text-[10px] text-slate-600 mt-1">Addresses</span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-surface-dark cyber-border rounded p-4 text-center">
                        <span class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Class</span>
                        <span id="out-class" class="text-xl font-bold text-white"></span>
                    </div>
                    <div class="bg-surface-dark cyber-border rounded p-4 text-center">
                        <span class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Type</span>
                        <span id="out-type" class="text-sm font-bold text-white"></span>
                    </div>
                </div>
            </div>

            <!-- Binary Matrix -->
            <div class="col-span-1 md:col-span-2 bg-black border border-border-dark rounded p-6 font-mono text-sm leading-relaxed relative overflow-hidden group">
                 <div class="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <span class="material-symbols-outlined text-signal-green">terminal</span>
                 </div>
                 <h4 class="text-xs font-bold text-signal-green mb-4 opacity-70">// BINARY REPRESENTATION</h4>
                 <div id="out-binary" class="space-y-2"></div>
            </div>

        </div>
    </div>
  `;

  const btn = container.querySelector("#std-btn");
  const input = container.querySelector("#std-ip");

  // Logic
  function calculateStandard(inputValue) {
    const resultsDiv = container.querySelector("#std-results");

    if (!inputValue) {
      // Simple alert or toast
      input.classList.add("border-red-500");
      setTimeout(() => input.classList.remove("border-red-500"), 2000);
      return;
    }

    // Parse Input
    const parts = inputValue.split("/");
    const ip = parts[0].trim();
    let prefix = parts.length > 1 ? parseInt(parts[1]) : null;

    if (!validateIPAddress(ip)) {
      input.classList.add("border-red-500");
      return;
    }

    const octets = ip.split(".").map(Number);
    const firstOctet = octets[0];
    const ipClass = getClass(firstOctet);

    if (prefix === null) {
      if (ipClass.startsWith("A")) prefix = 8;
      else if (ipClass.startsWith("B")) prefix = 16;
      else if (ipClass.startsWith("C")) prefix = 24;
      else prefix = 24;
    }

    if (!validateCIDRPrefix(prefix)) {
      return;
    }

    // Calculations
    const ipDec = ipToDecimal(ip);
    const maskDec = (0xffffffff << (32 - prefix)) >>> 0;
    const networkDec = (ipDec & maskDec) >>> 0;
    const broadcastDec = (networkDec | ~maskDec) >>> 0;
    const wildcardDec = ~maskDec >>> 0;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

    // Update UI
    container.querySelector("#out-ip").textContent = ip;
    container.querySelector("#out-mask").textContent = `${decimalToIP(maskDec)} (/${prefix})`;
    container.querySelector("#out-wildcard").textContent = decimalToIP(wildcardDec);
    container.querySelector("#out-network").textContent = `${decimalToIP(networkDec)}/${prefix}`;
    container.querySelector("#out-broadcast").textContent = decimalToIP(broadcastDec);
    container.querySelector("#out-class").textContent = ipClass;
    container.querySelector("#out-range").textContent =
      usableHosts > 0 ? `${decimalToIP(networkDec + 1)} - ${decimalToIP(broadcastDec - 1)}` : "N/A";
    container.querySelector("#out-hosts").textContent = usableHosts.toLocaleString();
    container.querySelector("#out-type").textContent = getIPType(octets);

    // Binary
    const binContainer = container.querySelector("#out-binary");
    binContainer.innerHTML = "";
    binContainer.appendChild(createBinaryRow("IP ADDR", ipDec));
    binContainer.appendChild(createBinaryRow("SUBNET ", maskDec));
    binContainer.appendChild(createBinaryRow("NETWORK", networkDec));

    resultsDiv.classList.remove("hidden");
    resultsDiv.classList.add("grid");
  }

  btn.addEventListener("click", e => {
    e.preventDefault();
    calculateStandard(input.value);
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculateStandard(input.value);
    }
  });
}

function createBinaryRow(label, decValue) {
  const row = document.createElement("div");
  row.className = "flex items-center gap-4 border-b border-white/5 pb-1";

  const binStr = decimalToIP(decValue)
    .split(".")
    .map(octet => {
      return parseInt(octet).toString(2).padStart(8, "0");
    })
    .join("<span class=\"text-slate-600\">.</span>");

  row.innerHTML = `<span class="text-slate-500 w-20 text-xs">${label}</span> <span class="text-signal-green tracking-widest">${binStr}</span>`;
  return row;
}

// Helpers
function getClass(firstOctet) {
  if (firstOctet >= 0 && firstOctet <= 127) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D";
  if (firstOctet >= 240 && firstOctet <= 255) return "E";
  return "Unknown";
}

function getIPType(octets) {
  const first = octets[0];
  const second = octets[1];
  if (first === 10) return "Private";
  if (first === 127) return "Loopback";
  if (first === 169 && second === 254) return "Link-local";
  if (first === 192 && second === 168) return "Private";
  if (first === 172 && second >= 16 && second <= 31) return "Private";
  if (first >= 224 && first <= 239) return "Multicast";
  if (first === 255) return "Broadcast";
  return "Public";
}
