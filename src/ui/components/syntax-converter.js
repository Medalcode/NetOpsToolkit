import { writeText } from "../../platform/clipboard.js";
import { showToast } from "../shared/ui-engine.js";

// Basic regex based converter
const ciscoToMikrotik = [
  // VLAN Creation
  { rx: /vlan\s+(\d+)/gi, rep: "/interface vlan add name=vlan$1 vlan-id=$1 interface=ether1" },
  // IP Address
  {
    rx: /ip\s+address\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})/gi,
    rep: (match, ip, mask) => {
      const maskParts = mask.split(".").map(Number);
      let prefix = 0;
      for (const p of maskParts) {
        const bin = p.toString(2);
        for (const bit of bin) if (bit === "1") prefix++;
      }
      return `/ip address add address=${ip}/${prefix}`;
    },
  },
  // Static Route
  {
    rx: /ip\s+route\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+([\w.]+)/gi,
    rep: (match, net, mask, gw) => {
      const maskParts = mask.split(".").map(Number);
      let prefix = 0;
      for (const p of maskParts) {
        const bin = p.toString(2);
        for (const bit of bin) if (bit === "1") prefix++;
      }
      return `/ip route add dst-address=${net}/${prefix} gateway=${gw}`;
    },
  },
  // Description
  { rx: /description\s+(.*)/gi, rep: 'comment="$1"' },
  // No shutdown
  { rx: /no\s+shutdown/gi, rep: "disabled=no" },
];

export function initSyntaxConverterTool(container) {
  container.innerHTML = `
    <div class="flex flex-col h-[600px] gap-4">
      <div class="flex justify-between items-center bg-surface-dark border border-border-dark p-4 rounded">
         <div>
            <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Syntax Converter</h4>
            <p class="text-slate-400 text-xs">Translate basic Cisco IOS commands to Mikrotik RouterOS (Best Effort).</p>
         </div>
         <button id="btn-convert" class="bg-primary hover:bg-primary-hover text-black font-bold py-2 px-6 rounded transition-colors text-xs uppercase tracking-widest">
            Convert ➔
         </button>
      </div>

      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
         <!-- Source -->
         <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
               <h5 class="text-xs font-bold uppercase tracking-widest text-slate-500">Cisco IOS (Source)</h5>
               <button id="btn-clear-src" class="text-xs text-slate-500 hover:text-red-500 transition-colors uppercase">Clear</button>
            </div>
            <textarea id="conv-src" class="flex-1 w-full bg-black/50 border border-border-dark rounded p-4 text-signal-green mono-data text-xs resize-none focus:border-primary focus:outline-none custom-scrollbar" placeholder="interface Vlan10\n ip address 192.168.1.1 255.255.255.0\n no shutdown"></textarea>
         </div>

         <!-- Destination -->
         <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
               <h5 class="text-xs font-bold uppercase tracking-widest text-slate-500">Mikrotik RouterOS (Result)</h5>
               <button id="btn-copy-dst" class="text-xs text-primary hover:text-white transition-colors uppercase">Copy</button>
            </div>
            <textarea id="conv-dst" readonly class="flex-1 w-full bg-black border border-border-dark rounded p-4 text-sky-400 mono-data text-xs resize-none focus:outline-none custom-scrollbar"></textarea>
         </div>
      </div>
    </div>
  `;

  const src = container.querySelector("#conv-src");
  const dst = container.querySelector("#conv-dst");
  const btnConvert = container.querySelector("#btn-convert");
  const btnClear = container.querySelector("#btn-clear-src");
  const btnCopy = container.querySelector("#btn-copy-dst");

  btnConvert.addEventListener("click", () => {
    let text = src.value;
    if (!text) return;

    // Apply regex replacements
    for (const rule of ciscoToMikrotik) {
      text = text.replace(rule.rx, rule.rep);
    }

    dst.value = text;
    showToast("Conversion complete", "success");
  });

  btnClear.addEventListener("click", () => {
    src.value = "";
    dst.value = "";
  });

  btnCopy.addEventListener("click", async () => {
    if (dst.value) {
      await writeText(dst.value);
      showToast("Copied to clipboard!", "success");
    }
  });
}
