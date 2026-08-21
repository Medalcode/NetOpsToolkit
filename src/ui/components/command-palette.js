/**
 * Componente Command Palette Global (Cmd+K / Ctrl+K)
 * Permite buscar e inicializar cualquier herramienta de red al instante
 * @module command-palette
 */

import { fuzzySearch } from "../shared/fuzzy-search.js";

const COMMAND_LIST = [
  {
    id: "tool-topology",
    name: "Network Topology Mapper",
    desc: "Interactive SVG diagram designer for Routers, Switches, and Subnets",
    icon: "hub",
    category: "Networking",
  },
  {
    id: "vlsm",
    name: "VLSM Subnet Calculator",
    desc: "Calculate IPv4 subnets using VLSM",
    icon: "calculate",
    category: "Networking",
  },
  {
    id: "subnet-analyzer",
    name: "Subnet Analyzer",
    desc: "Detailed breakdown of IP parameters",
    icon: "analytics",
    category: "Networking",
  },
  {
    id: "dns",
    name: "DNS Lookup (DoH)",
    desc: "Perform DNS queries over HTTPS",
    icon: "dns",
    category: "Networking",
  },
  {
    id: "ipv6",
    name: "IPv6 Tools",
    desc: "Expand, compress and analyze IPv6 addresses",
    icon: "tag",
    category: "Networking",
  },
  {
    id: "public-ip",
    name: "Public IP Detector",
    desc: "Detect client public IP & Geo metadata",
    icon: "public",
    category: "Networking",
  },
  {
    id: "route-vis",
    name: "Route Visualizer",
    desc: "Aggregate BGP routes and visual supernetting",
    icon: "alt_route",
    category: "Networking",
  },
  {
    id: "acl-builder",
    name: "ACL Builder",
    desc: "Visual Cisco Standard/Extended ACL generator",
    icon: "security",
    category: "Networking",
  },
  {
    id: "config-analyzer",
    name: "Config Security Audit",
    desc: "Audit Cisco IOS configuration files via RegEx",
    icon: "fact_check",
    category: "Networking",
  },
  {
    id: "ai-chat",
    name: "AI Network Assistant",
    desc: "CCIE AI Assistant using Gemini BYOK",
    icon: "smart_toy",
    category: "AI & Automation",
  },
  {
    id: "oui",
    name: "OUI MAC Lookup",
    desc: "Identify hardware vendor by MAC address",
    icon: "fingerprint",
    category: "Utilities",
  },
  {
    id: "config_gen",
    name: "Cisco Config Generator",
    desc: "Generate basic router & switch configs",
    icon: "terminal",
    category: "Utilities",
  },
  {
    id: "keygen",
    name: "SSH Key Generator",
    desc: "Generate RSA & Ed25519 keypairs",
    icon: "key",
    category: "Utilities",
  },
  {
    id: "ports",
    name: "Port Reference",
    desc: "Common TCP/UDP service port database",
    icon: "router",
    category: "Utilities",
  },
  {
    id: "base-converter",
    name: "Base Converter",
    desc: "Convert numbers between Dec, Hex, Bin, Oct",
    icon: "pin",
    category: "Utilities",
  },
  {
    id: "bandwidth",
    name: "Bandwidth Converter",
    desc: "Convert data rates & calculate transfers",
    icon: "speed",
    category: "Utilities",
  },
  {
    id: "ip_reference",
    name: "IP Reference Cheat Sheet",
    desc: "Quick reference for special IP ranges",
    icon: "menu_book",
    category: "Utilities",
  },
  {
    id: "syntax-converter",
    name: "Syntax Converter",
    desc: "Convert syntax between network vendors",
    icon: "swap_horiz",
    category: "Utilities",
  },
  {
    id: "templates",
    name: "Config Templates",
    desc: "Production-ready network templates",
    icon: "description",
    category: "Utilities",
  },
];

export function initCommandPalette(onSelectTool) {
  const modalHTML = `
    <div id="cmd-palette-modal" class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm hidden opacity-0 transition-opacity">
      <div class="bg-surface-dark border border-primary/50 shadow-[0_0_30px_rgba(0,255,170,0.2)] rounded-lg max-w-xl w-full p-4 transform scale-95 transition-transform duration-200">
        <div class="relative mb-3">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input type="text" id="cmd-palette-input" placeholder="Type a command or search tool... (Esc to cancel)" class="w-full bg-black border border-border-dark rounded-md pl-10 pr-4 py-3 text-sm text-white focus:border-primary focus:outline-none">
        </div>
        <div id="cmd-palette-results" class="max-h-80 overflow-y-auto custom-scrollbar flex flex-col gap-1">
          <!-- Results rendered dynamically -->
        </div>
        <div class="flex justify-between items-center border-t border-border-dark pt-3 mt-3 text-[10px] text-slate-500 uppercase tracking-wider">
          <span>Use <kbd class="px-1 py-0.5 bg-black border border-border-dark rounded text-slate-300">↑</kbd> <kbd class="px-1 py-0.5 bg-black border border-border-dark rounded text-slate-300">↓</kbd> to navigate</span>
          <span>Press <kbd class="px-1 py-0.5 bg-black border border-border-dark rounded text-slate-300">Enter</kbd> to select</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("cmd-palette-modal");
  const modalContent = modal.querySelector("div");
  const input = document.getElementById("cmd-palette-input");
  const resultsContainer = document.getElementById("cmd-palette-results");

  let selectedIndex = 0;
  let currentResults = [...COMMAND_LIST];

  function openPalette() {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.remove("opacity-0");
    modalContent.classList.remove("scale-95");
    input.value = "";
    renderResults(COMMAND_LIST);
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    modal.classList.add("opacity-0");
    modalContent.classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);
  }

  function renderResults(items) {
    currentResults = items;
    selectedIndex = 0;
    if (items.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-slate-500 text-xs text-center py-6">No matching tools found</div>
      `;
      return;
    }

    resultsContainer.innerHTML = items
      .map(
        (item, idx) => `
        <button data-cmd-id="${item.id}" class="cmd-item flex items-center justify-between p-2.5 rounded-md text-left transition-colors ${idx === 0 ? "bg-primary/20 text-primary" : "hover:bg-white/5 text-slate-300"}">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-sm text-primary">${item.icon}</span>
            <div>
              <div class="text-xs font-bold text-white">${item.name}</div>
              <div class="text-[10px] text-slate-400">${item.desc}</div>
            </div>
          </div>
          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded border border-border-dark text-slate-500">${item.category}</span>
        </button>
      `
      )
      .join("");

    attachItemListeners();
  }

  function attachItemListeners() {
    const items = resultsContainer.querySelectorAll(".cmd-item");
    items.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-cmd-id");
        if (id && onSelectTool) {
          onSelectTool(id);
          closePalette();
        }
      });
      btn.addEventListener("mouseenter", () => {
        updateSelection(idx);
      });
    });
  }

  function updateSelection(newIdx) {
    const items = resultsContainer.querySelectorAll(".cmd-item");
    if (items.length === 0) return;
    items[selectedIndex]?.classList.remove("bg-primary/20", "text-primary");
    items[selectedIndex]?.classList.add("text-slate-300");

    selectedIndex = (newIdx + items.length) % items.length;
    items[selectedIndex]?.classList.add("bg-primary/20", "text-primary");
    items[selectedIndex]?.classList.remove("text-slate-300");
    items[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", e => {
    const filtered = fuzzySearch(COMMAND_LIST, e.target.value, "name");
    renderResults(filtered);
  });

  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      updateSelection(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      updateSelection(selectedIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentResults[selectedIndex] && onSelectTool) {
        onSelectTool(currentResults[selectedIndex].id);
        closePalette();
      }
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) closePalette();
  });

  return { openPalette, closePalette };
}
