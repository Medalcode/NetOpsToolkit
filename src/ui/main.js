/**
 * NetOps Toolkit - Main Entry Point
 * Rewritten for stability, performance, and modularity.
 * Replaces the previous broken implementation.
 */

// Styles
import "../css/main.css"; // Tailwind CSS

// Error Handling
import { initGlobalErrorHandlers } from "./shared/error-handler.js";

// Core Imports
import { initTheme, createThemeToggle, getEffectiveTheme } from "./shared/theme.js";
import { initI18n, setLanguage } from "./shared/i18n.js";

// VLSM Imports (Critical)
// VLSM Imports (Critical)
import { calculateVLSM, calculateTotalRequired, calculateTotalAvailable } from "../core/network.js";
import {
  displayResults,
  showError,
  showToast,
  createHistoryPanel,
  updateHistoryPanel,
} from "./shared/ui-engine.js";
import {
  addToHistory,
  getHistory,
  getHistoryStats,
  removeFromHistory,
  clearHistory,
} from "./shared/history.js";
import { trackCalculation } from "./shared/analytics.js";

// Global State (reserved for future uses)
// const AppState = { currentTool: "tool-dashboard", initializedTools: new Set() };

/**
 * Tool Configuration Map
 * Maps DOM IDs to their module paths and init functions.
 */
/**
 * Tool Configuration Map
 * Maps DOM IDs to their module loaders and init functions.
 * Using explicit import() ensures Vite bundles these chunks correctly.
 */
const TOOL_REGISTRY = {
  "tool-subnet": { load: () => import("./components/ipv4-analyzer.js"), fn: "initStandardCalc" },
  "tool-dns": { load: () => import("./components/dns.js"), fn: "initDnsTool" },
  "tool-ports": { load: () => import("./components/ports.js"), fn: "initPortTool" },
  "tool-oui": { load: () => import("./components/oui.js"), fn: "initOuiTool" },
  "tool-ipv6": { load: () => import("./components/ipv6.js"), fn: "initIPv6Tool" },
  "tool-config": { load: () => import("./components/config_gen.js"), fn: "initConfigGenTool" },
  "tool-hex": { load: () => import("./components/base-converter.js"), fn: "initConverter" },
  "tool-bw": { load: () => import("./components/bandwidth.js"), fn: "initBandwidthTool" },
  "tool-keygen": { load: () => import("./components/keygen.js"), fn: "initKeyGenTool" },
  "tool-ip-ref": { load: () => import("./components/ip_reference.js"), fn: "initIpRefTool" },
  "tool-public-ip": { load: () => import("./components/public_ip.js"), fn: "initPublicIpWidget" },
};

/**
 * Initialization Sequence
 */
async function init() {
  console.group("🚀 NetOps Toolkit Initialization");

  try {
    // 0. Initialize Global Error Handlers
    initGlobalErrorHandlers();
    console.log("✅ Error Handlers");

    // 1. Theme (Immediate visual stability)
    initTheme();
    console.log("✅ Theme System");

    // 2. Internationalization
    initI18n();
    console.log("✅ i18n System");

    // 3. Navigation System
    setupNavigation();
    console.log("✅ Navigation System");

    // 4. Global UI Actions
    setupGlobalActions();
    console.log("✅ UI Actions");

    // 5. Initialize Core VLSM Tool (The flagship feature)
    initVLSM();
    console.log("✅ VLSM Core Logic");

    // 6. Initialize Public IP Widget (Always on dashboard)
    loadToolLogic("tool-public-ip");

    console.log("🏁 Initialization Complete");
  } catch (e) {
    console.error("❌ CRITICAL ERROR:", e);
    // Fallback: try to show error on screen if possible
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `<div class="bg-red-500/10 border border-red-500/30 rounded p-6 m-4 text-red-400">
                <h4 class="text-lg font-bold mb-2">System Error</h4>
                <p class="text-sm mb-3">Failed to initialize application: ${e.message}</p>
                <button class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors" onclick="location.reload()">Reload</button>
            </div>`;
    }
  }
  console.groupEnd();
}

/**
 * Sets up the Sidebar and Internal Link Navigation
 */
/**
 * Sets up the Sidebar and Internal Link Navigation
 */
function setupNavigation() {
  // 1. Handle Sidebar Links (VLSM vs Tools)
  document.querySelectorAll(".nav-item").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      // Active Class Toggle
      document
        .querySelectorAll(".nav-item")
        .forEach(n => n.classList.remove("active", "bg-primary/10", "text-primary"));
      document.querySelectorAll(".nav-item").forEach(n => n.classList.add("text-slate-500"));

      el.classList.add("active", "bg-primary/10", "text-primary");
      el.classList.remove("text-slate-500");

      const target = el.getAttribute("data-target");
      if (target === "vlsm") showView("view-vlsm", "VLSM CALCULATOR");
      if (target === "tools") showView("view-tools", "UTILITIES GRID");
    });
  });

  // Expose helpers for HTML onclick events
  window.switchToolView = toolId => {
    loadToolLogic(toolId);
  };

  window.showToolsGrid = () => {
    showView("view-tools", "UTILITIES GRID");
  };

  window.showView = showView;
}

/**
 * Generic View Switcher with Enhanced UX
 */
function showView(viewId, title, breadcrumb = null) {
  // 1. Update Breadcrumb
  updateBreadcrumb(breadcrumb || title);

  // 2. Update Sidebar Active State
  updateSidebarActiveState(viewId);

  // 3. Hide All Views with exit animation
  ["view-vlsm", "view-tools", "view-dynamic-tool"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("hidden")) {
      // Add exit animation
      el.classList.add("view-transition-exit");

      // Wait for animation, then hide
      setTimeout(() => {
        el.classList.add("hidden");
        el.classList.remove("view-transition-exit");
        if (id === "view-tools") el.classList.remove("grid");
      }, 300);
    } else if (el) {
      el.classList.add("hidden");
      if (id === "view-tools") el.classList.remove("grid");
    }
  });

  // 4. Show Target with enter animation
  setTimeout(() => {
    const targetEl = document.getElementById(viewId);
    if (targetEl) {
      targetEl.classList.remove("hidden");
      targetEl.classList.add("view-transition-enter");
      if (viewId === "view-tools") targetEl.classList.add("grid");

      // Remove animation class after it completes
      setTimeout(() => {
        targetEl.classList.remove("view-transition-enter");
      }, 400);
    }
  }, 300);

  // 5. Update document title
  document.title = `${title} - NetOps Toolkit`;
}

/**
 * Update breadcrumb navigation
 */
function updateBreadcrumb(path) {
  const breadcrumbContainer = document.getElementById("breadcrumb-container");
  if (!breadcrumbContainer) return;

  const parts = typeof path === "string" ? path.split(" / ") : [path];

  breadcrumbContainer.innerHTML = `
        <span class="text-slate-500 font-bold tracking-widest">NETOPS</span>
        ${parts
    .map(
      (part, i) => `
            <span class="text-slate-700">/</span>
            <span class="${i === parts.length - 1 ? "text-white" : "text-slate-400"}">${part}</span>
        `
    )
    .join("")}
    `;
}

/**
 * Update sidebar active state
 */
function updateSidebarActiveState(viewId) {
  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active", "bg-primary/10", "text-primary");
    item.classList.add("text-slate-500");
  });

  // Add active to current
  let targetAttr = "";
  if (viewId === "view-vlsm") targetAttr = "vlsm";
  else if (viewId === "view-tools" || viewId === "view-dynamic-tool") targetAttr = "tools";

  if (targetAttr) {
    const activeItem = document.querySelector(`[data-target="${targetAttr}"]`);
    if (activeItem) {
      activeItem.classList.add("active", "bg-primary/10", "text-primary");
      activeItem.classList.remove("text-slate-500");
    }
  }
}

/**
 * Dynamically imports and initializes tool logic
 */
async function loadToolLogic(toolId) {
  // 1. Show Loading State with Skeleton
  showView("view-dynamic-tool", "LOADING...", "TOOLS / LOADING");
  const contentContainer = document.getElementById("dynamic-tool-content");
  const titleContainer = document.getElementById("dynamic-tool-title");

  // Show skeleton loader
  contentContainer.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <div class="skeleton-title"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
            <div class="space-y-2">
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text w-3/4"></div>
            </div>
        </div>
    `;

  // 2. Load Module
  const config = TOOL_REGISTRY[toolId];
  if (config) {
    try {
      console.log(`📦 Loading module for ${toolId}`);

      // Update title
      const toolName = toolId.replace("tool-", "").replace(/-/g, " ").toUpperCase();
      if (titleContainer) titleContainer.textContent = toolName;

      const module = await config.load();

      if (module[config.fn] && typeof module[config.fn] === "function") {
        // Clear skeleton and render tool
        contentContainer.innerHTML = "";
        module[config.fn](contentContainer);
        console.log(`✨ Initialized ${toolId}`);

        // Update breadcrumb with tool name
        showView("view-dynamic-tool", toolName, `TOOLS / ${toolName}`);
      } else {
        contentContainer.innerHTML = `
                    <div class="bg-red-500/10 border border-red-500/30 rounded p-6 text-red-400">
                        <span class="material-symbols-outlined mr-2">error</span>
                        Error: Entry point ${config.fn} not found.
                    </div>
                `;
      }
    } catch (e) {
      console.error(`Failed to load ${toolId}:`, e);
      contentContainer.innerHTML = `
                <div class="bg-red-500/10 border border-red-500/30 rounded p-6 text-red-400">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined">error</span>
                        <strong>Failed to load tool</strong>
                    </div>
                    <p class="text-sm text-red-300">${e.message}</p>
                </div>
            `;
    }
  } else {
    contentContainer.innerHTML = `<div class="text-yellow-500">Tool registry configuration not found for ${toolId}</div>`;
  }
}

/**
 * Core VLSM Tool Initialization with Enhanced UX
 */
function initVLSM() {
  const calcBtn = document.getElementById("btn-calc-vlsm");
  const ipInput = document.getElementById("vlsm-ip");
  const hostsInput = document.getElementById("vlsm-hosts");

  if (!calcBtn) return;

  // Add real-time validation (will be imported)
  import("./shared/form-handlers.js").then(module => {
    if (ipInput) {
      module.addIPValidation(ipInput);
      // Temporarily disabled until fully functional
      // module.addExampleButton(ipInput, '192.168.1.0');
    }
    if (hostsInput) {
      module.addHostsValidation(hostsInput);
      // Temporarily disabled until fully functional
      // module.addExampleButton(hostsInput, '50, 30, 20, 10');
    }
  });

  calcBtn.addEventListener("click", e => {
    e.preventDefault();
    runVLSMCalculation();
  });

  // Add Enter key support
  [ipInput, hostsInput].forEach(input => {
    if (input) {
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          runVLSMCalculation();
        }
      });
    }
  });
}

function runVLSMCalculation() {
  // 1. Get Inputs (New Split IDs)
  const ipInput = document.getElementById("vlsm-ip").value.trim();
  const maskInput = document.getElementById("vlsm-mask").value;
  const hostsInput = document.getElementById("vlsm-hosts").value.trim();

  // Containers
  const visualizerContainer = document.getElementById("vlsm-visualizer-container");
  const resultsContainer = document.getElementById("vlsm-results-container");

  // 2. Validate Basic Input
  if (!ipInput || !hostsInput) {
    showToast("Please fill all fields", "warning");
    return;
  }

  // 3. Process Hosts
  const hosts = hostsInput
    .split(",")
    .map(h => parseInt(h.trim()))
    .filter(h => !isNaN(h) && h > 0)
    .sort((a, b) => b - a);

  if (hosts.length === 0) {
    showToast("Invalid hosts list", "error");
    return;
  }

  // 4. Calculate
  try {
    // Clear previous
    // clearResults handled inside displayResults

    // Validate IP Format
    // Simple regex or let the calculator handle it, but we need to combine IP + /Mask
    // e.g. "192.168.1.0" + "/" + "24" -> "192.168.1.0/24"
    const fullNetworkStr = `${ipInput}/${maskInput}`;

    // Perform Calculation
    const subnets = calculateVLSM(ipInput, parseInt(maskInput), hosts);
    const totalRequired = calculateTotalRequired(hosts);
    const totalAvailable = calculateTotalAvailable(parseInt(maskInput));

    // Display (Pass containers explicitly if logic changed, but displayResults expects one container)
    // We will adapt displayResults to target specific containers or split logic

    // For compatibility with existing ui.js, update displayResults to handle Tailwind injection
    displayResults(
      subnets,
      { totalRequired, totalAvailable, networkPrefix: parseInt(maskInput) },
      resultsContainer,
      visualizerContainer
    );

    trackCalculation(subnets.length, fullNetworkStr, totalRequired);

    // Save to Local History
    addToHistory(fullNetworkStr, hostsInput, subnets, { totalRequired, totalAvailable });

    showToast("Calculation Complete", "success");
  } catch (err) {
    showError(resultsContainer, err.message);
    console.error(err);
  }
}

/**
 * Global Actions (Buttons)
 */
/**
 * Global Actions (Buttons)
 */
function setupGlobalActions() {
  // --- History System Integration ---
  const { panel, overlay, content } = createHistoryPanel(
    item => {
      const ipEl = document.getElementById("vlsm-ip");
      const hostsEl = document.getElementById("vlsm-hosts");
      if (ipEl) ipEl.value = item.network;
      if (hostsEl) hostsEl.value = item.hosts;
      showView("view-vlsm", "VLSM CALCULATOR");
      panel.classList.remove("open");
      overlay.classList.remove("active");
    },
    id => { removeFromHistory(id); refreshHistory(); },
    () => { clearHistory(); refreshHistory(); }
  );

  function refreshHistory() {
    updateHistoryPanel(content, getHistory(), getHistoryStats(),
      () => {},
      id => { removeFromHistory(id); refreshHistory(); },
      () => { clearHistory(); refreshHistory(); }
    );
  }

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  // Add History button to the header next to the tools buttons
  const headerRight = document.querySelector("header .flex.items-center.gap-4:last-child");
  if (headerRight) {
    const historyBtn = document.createElement("button");
    historyBtn.className = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded bg-surface-dark text-slate-400 border border-border-dark hover:text-white hover:border-primary transition-all";
    historyBtn.innerHTML = '<span class="material-symbols-outlined !text-sm" style="vertical-align: middle;">history</span>';
    historyBtn.title = "History";
    historyBtn.onclick = () => {
      refreshHistory();
      panel.classList.add("open");
      overlay.classList.add("active");
    };
    headerRight.insertBefore(historyBtn, headerRight.firstChild);
  }
}

// Boot
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
