import { showToast } from "../shared/ui-engine.js";
import { escapeHtml } from "../shared/utils.js";

// Regex patterns
const interfaceRegex = /interface\s+([\w/.-]+)\s*([\s\S]*?)(?=\ninterface|\n!|$)/g;
const ipRegex = /ip address\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})/;
const descriptionRegex = /description\s+(.*)/;
const shutdownRegex = /^\s*shutdown\s*$/m;
const telnetRegex = /line\s+vty[\s\S]*?transport\s+input\s+.*telnet/i;
const passwordRegex = /enable\s+password\s+/;

export function initConfigAnalyzerTool(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
      <!-- Input Area -->
      <div class="flex flex-col gap-2">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Configuration Input (Cisco IOS)</h4>
        <textarea id="analyzer-input" class="w-full h-full bg-black/50 border border-border-dark rounded p-4 text-signal-green mono-data text-xs resize-none focus:border-primary focus:outline-none custom-scrollbar" placeholder="Paste your Cisco IOS config here..."></textarea>
        <button id="btn-analyze" class="bg-primary hover:bg-primary-hover text-black font-bold py-3 px-4 rounded transition-colors mt-2">
          Analyze & Audit
        </button>
      </div>

      <!-- Output Area -->
      <div class="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Audit Results</h4>
        
        <!-- Global Security Alerts -->
        <div id="global-alerts-container" class="flex flex-col gap-2 mb-4"></div>

        <!-- Interfaces -->
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 mt-2">Interfaces Detected</h4>
        <div id="interfaces-container" class="flex flex-col gap-3"></div>
      </div>
    </div>
  `;

  const inputArea = container.querySelector("#analyzer-input");
  const btnAnalyze = container.querySelector("#btn-analyze");
  const globalAlertsContainer = container.querySelector("#global-alerts-container");
  const interfacesContainer = container.querySelector("#interfaces-container");

  btnAnalyze.addEventListener("click", () => {
    const config = inputArea.value;
    if (!config.trim()) {
      showToast("Please paste a configuration first", "error");
      return;
    }

    // 1. Analyze Global Security
    globalAlertsContainer.innerHTML = "";
    let globalIssues = 0;

    if (telnetRegex.test(config)) {
      addGlobalAlert(
        "CRITICAL: Telnet is enabled on VTY lines. Use SSH instead.",
        "bg-red-500/20 text-red-500 border-red-500/50"
      );
      globalIssues++;
    }

    if (passwordRegex.test(config)) {
      addGlobalAlert(
        "WARNING: Plain-text 'enable password' found. Use 'enable secret' instead.",
        "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      );
      globalIssues++;
    }

    if (!config.includes("service password-encryption")) {
      addGlobalAlert(
        "NOTICE: 'service password-encryption' is missing.",
        "bg-blue-500/20 text-blue-400 border-blue-500/50"
      );
      globalIssues++;
    }

    if (globalIssues === 0) {
      addGlobalAlert(
        "✅ No global security issues detected.",
        "bg-emerald-500/20 text-emerald-500 border-emerald-500/50"
      );
    }

    // 2. Parse Interfaces
    interfacesContainer.innerHTML = "";
    let match;
    let interfacesFound = 0;

    // Reset regex index
    interfaceRegex.lastIndex = 0;

    while ((match = interfaceRegex.exec(config)) !== null) {
      const intfName = match[1];
      const intfBlock = match[2];
      interfacesFound++;

      const ipMatch = ipRegex.exec(intfBlock);
      const descMatch = descriptionRegex.exec(intfBlock);
      const isShutdown = shutdownRegex.test(intfBlock);

      const ip = ipMatch ? ipMatch[1] : "Unassigned";
      const mask = ipMatch ? ipMatch[2] : "";
      const desc = descMatch ? descMatch[1] : "";

      const alerts = [];
      if (!isShutdown && !ipMatch && !intfBlock.includes("switchport")) {
        alerts.push({
          msg: "Interface is UP but has no IP or switchport config.",
          type: "warning",
        });
      }
      if (!isShutdown && !descMatch) {
        alerts.push({ msg: "Missing description on active interface.", type: "notice" });
      }

      renderInterfaceCard(intfName, ip, mask, desc, isShutdown, alerts);
    }

    if (interfacesFound === 0) {
      interfacesContainer.innerHTML =
        '<div class="text-slate-500 text-sm">No interface blocks found in configuration.</div>';
    }

    showToast("Analysis complete", "success");
  });

  function addGlobalAlert(message, classes) {
    const el = document.createElement("div");
    el.className = `p-3 rounded border text-xs font-mono ${classes}`;
    el.textContent = message;
    globalAlertsContainer.appendChild(el);
  }

  function renderInterfaceCard(name, ip, mask, desc, isShutdown, alerts) {
    const card = document.createElement("div");
    card.className = "bg-black/50 border border-border-dark rounded p-4";

    const statusColor = isShutdown ? "bg-red-500" : "bg-signal-green";
    const statusText = isShutdown ? "ADMIN DOWN" : "UP";

    let alertsHtml = "";
    if (alerts.length > 0) {
      alertsHtml = '<div class="mt-3 flex flex-col gap-1">';
      alerts.forEach(a => {
        const color = a.type === "warning" ? "text-yellow-500" : "text-blue-400";
        alertsHtml += `<div class="text-[10px] ${color}">• ${a.msg}</div>`;
      });
      alertsHtml += "</div>";
    }

    const safeName = escapeHtml(name);
    const safeDesc = escapeHtml(desc);
    const safeIp = escapeHtml(ip);
    const safeMask = escapeHtml(mask);

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full ${statusColor}"></div>
          <h5 class="text-white font-bold text-sm">${safeName}</h5>
        </div>
        <span class="text-[10px] text-slate-500 border border-border-dark px-2 py-0.5 rounded">${statusText}</span>
      </div>
      ${safeDesc ? `<div class="text-slate-400 text-xs italic mb-2">"${safeDesc}"</div>` : ""}
      <div class="mono-data text-xs text-primary">IP: <span class="text-white">${safeIp}</span> ${safeMask ? `<span class="text-slate-500">${safeMask}</span>` : ""}</div>
      ${alertsHtml}
    `;

    interfacesContainer.appendChild(card);
  }
}
