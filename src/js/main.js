/**
 * NetOps Toolkit - Main Entry Point
 * Rewritten for stability, performance, and modularity.
 * Replaces the previous broken implementation.
 */

// Styles
import '../css/main.css'; // Tailwind CSS

// Error Handling
import { initGlobalErrorHandlers, handleError, showSuccessNotification } from './error-handler.js';

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
        // 0. Initialize Global Error Handlers
        initGlobalErrorHandlers();
        console.log("✅ Error Handlers");

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
/**
 * Sets up the Sidebar and Internal Link Navigation
 */
function setupNavigation() {
    // 1. Handle Sidebar Links (VLSM vs Tools)
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            // Active Class Toggle
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active', 'bg-primary/10', 'text-primary'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.add('text-slate-500'));
            
            el.classList.add('active', 'bg-primary/10', 'text-primary');
            el.classList.remove('text-slate-500');

            const target = el.getAttribute('data-target');
            if (target === 'vlsm') showView('view-vlsm', 'VLSM CALCULATOR');
            if (target === 'tools') showView('view-tools', 'UTILITIES GRID');
        });
    });

    // Expose helpers for HTML onclick events
    window.switchToolView = (toolId) => {
        loadToolLogic(toolId);
    };

    window.showToolsGrid = () => {
        showView('view-tools', 'UTILITIES GRID');
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
    ['view-vlsm', 'view-tools', 'view-dynamic-tool'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('hidden')) {
            // Add exit animation
            el.classList.add('view-transition-exit');
            
            // Wait for animation, then hide
            setTimeout(() => {
                el.classList.add('hidden');
                el.classList.remove('view-transition-exit');
                if (id === 'view-tools') el.classList.remove('grid');
            }, 300);
        } else if (el) {
            el.classList.add('hidden');
            if (id === 'view-tools') el.classList.remove('grid');
        }
    });

    // 4. Show Target with enter animation
    setTimeout(() => {
        const targetEl = document.getElementById(viewId);
        if (targetEl) {
            targetEl.classList.remove('hidden');
            targetEl.classList.add('view-transition-enter');
            if (viewId === 'view-tools') targetEl.classList.add('grid');
            
            // Remove animation class after it completes
            setTimeout(() => {
                targetEl.classList.remove('view-transition-enter');
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
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    if (!breadcrumbContainer) return;

    const parts = typeof path === 'string' ? path.split(' / ') : [path];
    
    breadcrumbContainer.innerHTML = `
        <span class="text-slate-500 font-bold tracking-widest">NETOPS</span>
        ${parts.map((part, i) => `
            <span class="text-slate-700">/</span>
            <span class="${i === parts.length - 1 ? 'text-white' : 'text-slate-400'}">${part}</span>
        `).join('')}
    `;
}

/**
 * Update sidebar active state
 */
function updateSidebarActiveState(viewId) {
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'bg-primary/10', 'text-primary');
        item.classList.add('text-slate-500');
    });

    // Add active to current
    let targetAttr = '';
    if (viewId === 'view-vlsm') targetAttr = 'vlsm';
    else if (viewId === 'view-tools' || viewId === 'view-dynamic-tool') targetAttr = 'tools';

    if (targetAttr) {
        const activeItem = document.querySelector(`[data-target="${targetAttr}"]`);
        if (activeItem) {
            activeItem.classList.add('active', 'bg-primary/10', 'text-primary');
            activeItem.classList.remove('text-slate-500');
        }
    }
}

/**
 * Dynamically imports and initializes tool logic
 */
async function loadToolLogic(toolId) {
    // 1. Show Loading State with Skeleton
    showView('view-dynamic-tool', 'LOADING...', 'TOOLS / LOADING');
    const contentContainer = document.getElementById('dynamic-tool-content');
    const titleContainer = document.getElementById('dynamic-tool-title');
    
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
            const toolName = toolId.replace('tool-', '').replace(/-/g, ' ').toUpperCase();
            if(titleContainer) titleContainer.textContent = toolName;

            const module = await config.load();
            
            if (module[config.fn] && typeof module[config.fn] === 'function') {
                // Clear skeleton and render tool
                contentContainer.innerHTML = '';
                module[config.fn](contentContainer); 
                console.log(`✨ Initialized ${toolId}`);
                
                // Update breadcrumb with tool name
                showView('view-dynamic-tool', toolName, `TOOLS / ${toolName}`);
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
    const calcBtn = document.getElementById('btn-calc-vlsm');
    const ipInput = document.getElementById('vlsm-ip');
    const hostsInput = document.getElementById('vlsm-hosts');
    
    if (!calcBtn) return;

    // Add real-time validation (will be imported)
    import('./input-validation.js').then(module => {
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

    calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runVLSMCalculation();
    });

    // Add Enter key support
    [ipInput, hostsInput].forEach(input => {
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    runVLSMCalculation();
                }
            });
        }
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
            const ipEl = document.getElementById('vlsm-ip');
            const hostsEl = document.getElementById('vlsm-hosts');
            if (ipEl) ipEl.value = item.network;
            if (hostsEl) hostsEl.value = item.hosts;
            
            // Go to dashboard/VLSM view
            showView('view-vlsm', 'VLSM CALCULATOR');
            
            // Re-run calculation (or just display stored results)
            const btn = document.getElementById('btn-calc-vlsm');
            if (btn) btn.click();
            
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
