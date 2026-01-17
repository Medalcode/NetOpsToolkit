/**
 * NetOps Toolkit - Main Entry Point
 * Rewritten for stability, performance, and modularity.
 * Replaces the previous broken implementation.
 */

// Styles
import '../css/main.css'; // Tailwind CSS

// Core Imports
import { initTheme, createThemeToggle, getEffectiveTheme } from './theme.js';
import { initI18n, setLanguage } from './i18n.js';

// VLSM Imports (Critical)
// VLSM Imports (Critical)
import { calculateVLSM, calculateTotalRequired, calculateTotalAvailable } from './calculator.js';
import { displayResults, showError, clearResults, showToast, createHistoryPanel, updateHistoryPanel } from './ui.js';
import { addToHistory, getHistory, getHistoryStats, removeFromHistory, clearHistory } from './history.js';
import { trackCalculation } from './analytics.js';

// Global State
const AppState = {
    currentTool: 'tool-dashboard',
    initializedTools: new Set()
};

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
    'tool-subnet': { load: () => import('./standard_calc.js'), fn: 'initStandardCalc' },
    'tool-dns': { load: () => import('./tools/dns.js'), fn: 'initDnsTool' },
    'tool-ports': { load: () => import('./tools/ports.js'), fn: 'initPortTool' },
    'tool-oui': { load: () => import('./tools/oui.js'), fn: 'initOuiTool' },
    'tool-ipv6': { load: () => import('./tools/ipv6.js'), fn: 'initIPv6Tool' },
    'tool-config': { load: () => import('./tools/config_gen.js'), fn: 'initConfigGenTool' },
    'tool-hex': { load: () => import('./converter.js'), fn: 'initConverter' },
    'tool-bw': { load: () => import('./tools/bandwidth.js'), fn: 'initBandwidthTool' },
    'tool-keygen': { load: () => import('./tools/keygen.js'), fn: 'initKeyGenTool' },
    'tool-ip-ref': { load: () => import('./tools/ip_reference.js'), fn: 'initIpRefTool' },
    'tool-public-ip': { load: () => import('./tools/public_ip.js'), fn: 'initPublicIpWidget' }
};

/**
 * Initialization Sequence
 */
async function init() {
    console.group("🚀 NetOps Toolkit Initialization");

    try {
        // 1. Theme (Immediate visual stability)
        initTheme();
        updateBootstrapTheme(getEffectiveTheme()); // Sync Bootstrap
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
        loadToolLogic('tool-public-ip');

        console.log("🏁 Initialization Complete");
    } catch (e) {
        console.error("❌ CRITICAL ERROR:", e);
        // Fallback: try to show error on screen if possible
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `<div class="alert alert-danger m-4">
                <h4>System Error</h4>
                <p>Failed to initialize application: ${e.message}</p>
                <button class="btn btn-outline-danger" onclick="location.reload()">Reload</button>
            </div>`;
        }
    }
    console.groupEnd();
}

/**
 * Sets up the Sidebar and Internal Link Navigation
 */
function setupNavigation() {
    // 1. Handle Sidebar and Dashboard Links
    document.querySelectorAll('[data-target]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            // Handle active class
            if (el.classList.contains('nav-link')) {
                document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                el.classList.add('active');
            }
            // Navigate
            navigate(el.getAttribute('data-target'));
        });
    });

    // 2. Determine Start View (Default to Dashboard)
    navigate('tool-dashboard');
}

/**
 * Navigates to a specific tool view
 */
function navigate(targetId) {
    console.log(`Navigate -> ${targetId}`);
    
    // Validate target
    const view = document.getElementById(targetId);
    if (!view) {
        console.warn(`View ID ${targetId} not found.`);
        return;
    }

    // Hide all views
    document.querySelectorAll('.tool-view').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
        v.classList.remove('active');
    });

    // Show target
    view.style.display = 'block';
    // Small delay to allow display:block to apply before adding class (for transitions if added later)
    requestAnimationFrame(() => view.classList.add('active'));

    // Update Breadcrumb
    const breadcrumb = document.getElementById('current-view-name');
    const link = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if (breadcrumb) {
        breadcrumb.textContent = link ? link.innerText.trim() : "Herramienta";
    }

    // Lazy Load Tool Logic
    loadToolLogic(targetId);
}

/**
 * Dynamically imports and initializes tool logic
 */
async function loadToolLogic(toolId) {
    if (AppState.initializedTools.has(toolId)) return;

    const config = TOOL_REGISTRY[toolId];
    if (config) {
        try {
            console.log(`📦 Loading module for ${toolId}`);
            const module = await config.load();
            
            if (module[config.fn] && typeof module[config.fn] === 'function') {
                module[config.fn]();
                console.log(`✨ Initialized ${toolId}`);
                AppState.initializedTools.add(toolId);
            } else {
                console.warn(`Function ${config.fn} not found in module`);
            }
        } catch (e) {
            console.error(`Failed to load ${toolId}:`, e);
        }
    } else {
        // Dashboard or VLSM (handled manually) don't need dynamic load
    }
}

/**
 * Core VLSM Tool Initialization (Inline to ensure reliability)
 */
/**
 * Core VLSM Tool Initialization (Tailwind Adaptation)
 */
function initVLSM() {
    const calcBtn = document.getElementById('btn-calc-vlsm');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runVLSMCalculation();
    });
}

function runVLSMCalculation() {
    // 1. Get Inputs (New Split IDs)
    const ipInput = document.getElementById('vlsm-ip').value.trim();
    const maskInput = document.getElementById('vlsm-mask').value;
    const hostsInput = document.getElementById('vlsm-hosts').value.trim();
    
    // Containers
    const visualizerContainer = document.getElementById('vlsm-visualizer-container');
    const resultsContainer = document.getElementById('vlsm-results-container');

    // 2. Validate Basic Input
    if (!ipInput || !hostsInput) {
        showToast('Please fill all fields', 'warning');
        return;
    }

    // 3. Process Hosts
    const hosts = hostsInput.split(',')
        .map(h => parseInt(h.trim()))
        .filter(h => !isNaN(h) && h > 0)
        .sort((a, b) => b - a);

    if (hosts.length === 0) {
        showToast('Invalid hosts list', 'error');
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
        displayResults(subnets, { totalRequired, totalAvailable, networkPrefix: parseInt(maskInput) }, resultsContainer, visualizerContainer);
        
        trackCalculation(subnets.length, fullNetworkStr, totalRequired);
        
        // Save to Local History
        addToHistory(fullNetworkStr, hostsInput, subnets, {totalRequired, totalAvailable});
        
        showToast('Calculation Complete', 'success');

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
    const container = document.querySelector('.global-actions');
    if (!container) return;
    
    container.innerHTML = '';

    // --- History System Integration ---
    // Create the panel and overlay (hidden by default)
    const { panel, overlay, toggleBtn: historyBtnIcon, content } = createHistoryPanel(
        // On Load Item
        (item) => {
            // Restore inputs
            document.getElementById('network').value = item.network;
            document.getElementById('hosts').value = item.hosts;
            // Go to dashboard/VLSM view
            navigate('tool-vlsm');
            // Re-run calculation (or just display stored results)
            document.getElementById('calculate-btn').click();
            // Close panel
            panel.classList.remove("open");
            overlay.classList.remove("active");
        },
        // On Delete Item
        (id) => {
            removeFromHistory(id);
            refreshHistory();
        },
        // On Clear All
        () => {
            clearHistory();
            refreshHistory();
        }
    );

    // Refresh function helper
    function refreshHistory() {
        updateHistoryPanel(
            content, 
            getHistory(), 
            getHistoryStats(), 
            (item) => { /* Load handled in createHistoryPanel closure above */ },
            (id) => { removeFromHistory(id); refreshHistory(); },
            () => { clearHistory(); refreshHistory(); }
        );
    }

    // Append Panel & Overlay to Body (outside header)
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // Add History Button to Header
    const historyBtn = document.createElement('button');
    historyBtn.className = "btn btn-outline-info btn-sm me-2";
    historyBtn.innerHTML = '<i class="fas fa-history"></i> Historial';
    historyBtn.onclick = () => {
        refreshHistory(); // Update data before showing
        panel.classList.add("open");
        overlay.classList.add("active");
    };
    container.appendChild(historyBtn);
    // ----------------------------------

    // Theme Button
    const themeBtn = createThemeToggle();
    themeBtn.className = "btn btn-outline-secondary btn-sm me-2";
    themeBtn.addEventListener('click', () => {
         setTimeout(() => updateBootstrapTheme(getEffectiveTheme()), 50);
    });
    container.appendChild(themeBtn);

    // Lang Button
    const langBtn = document.createElement('button');
    langBtn.className = "btn btn-outline-secondary btn-sm";
    langBtn.innerHTML = document.documentElement.lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES';
    langBtn.onclick = () => switchAppLanguage(langBtn);
    container.appendChild(langBtn);
}

function switchAppLanguage(btn) {
    const newLang = document.documentElement.lang === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    btn.innerHTML = newLang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES';
}

function updateBootstrapTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light');
}

// Boot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
