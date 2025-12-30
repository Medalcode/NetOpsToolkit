/**
 * NetOps Toolkit - Main Entry Point
 * Rewritten for stability, performance, and modularity.
 * Replaces the previous broken implementation.
 */

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.css';

// Bootstrap JS (Component logic)
import 'bootstrap';

// Core Imports
import { initTheme, createThemeToggle, getEffectiveTheme } from './theme.js';
import { initI18n, setLanguage } from './i18n.js';

// VLSM Imports (Critical)
import { calculateVLSM, calculateTotalRequired, calculateTotalAvailable } from './calculator.js';
import { displayResults, showError, clearResults, showToast } from './ui.js';
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
function initVLSM() {
    const form = document.getElementById('vlsm-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Get Inputs
        const networkInput = document.getElementById('network').value.trim();
        const hostsInput = document.getElementById('hosts').value.trim();
        const resultsContainer = document.getElementById('results');

        // 2. Validate Basic Input
        if (!networkInput || !hostsInput) {
            showToast('Por favor completa todos los campos', 'warning');
            return;
        }

        // 3. Process Hosts
        const hosts = hostsInput.split(',')
            .map(h => parseInt(h.trim()))
            .filter(h => !isNaN(h) && h > 0)
            .sort((a, b) => b - a); // VLSM requires descending order

        if (hosts.length === 0) {
            showToast('Ingresa cantidades de hosts válidas', 'error');
            return;
        }

        // 4. Calculate
        try {
            clearResults(resultsContainer);
            
            // Parse Network
            const [baseIP, prefixStr] = networkInput.split('/');
            const prefix = parseInt(prefixStr);

            if (!baseIP || isNaN(prefix)) {
                throw new Error("Formato de red inválido. Usa: x.x.x.x/xx");
            }

            // Perform Calculation
            const subnets = calculateVLSM(baseIP, prefix, hosts);
            const totalRequired = calculateTotalRequired(hosts);
            const totalAvailable = calculateTotalAvailable(prefix);

            // Display
            displayResults(subnets, { totalRequired, totalAvailable }, resultsContainer);
            trackCalculation(subnets.length, networkInput, totalRequired);
            
            showToast('Cálculo completado con éxito', 'success');

        } catch (err) {
            showError(resultsContainer, err.message);
            console.error(err);
        }
    });
}

/**
 * Global Actions (Buttons)
 */
function setupGlobalActions() {
    const container = document.querySelector('.global-actions');
    if (!container) return;
    
    container.innerHTML = '';

    // Theme Button
    const themeBtn = createThemeToggle();
    themeBtn.className = "btn btn-outline-secondary btn-sm me-2";
    // themeBtn.innerHTML = '<i class="fas fa-adjust"></i> Tema'; 
    // ^ createThemeToggle handles innerHTML, we just style it
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
