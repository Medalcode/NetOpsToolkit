/**
 * NetOps Toolkit - Main Entry Point
 * Rewritten for stability and Bootstrap 5.3 compatibility
 */

import { initTheme, createThemeToggle, THEMES, getEffectiveTheme } from './theme.js';
import { initI18n, setLanguage } from './i18n.js';

// Global state
const AppState = {
    currentTool: 'tool-dashboard',
    initializedTools: new Set()
};

/**
 * Initialize the application
 */
async function init() {
    console.log("🚀 Initializing NetOps Toolkit...");

    try {
        // 1. Initialize Theme (Critical for avoiding FOUC)
        initTheme();
        // Override theme.js behavior to support Bootstrap 5.3
        updateBootstrapTheme(getEffectiveTheme());

        // 2. Initialize i18n
        initI18n();
        console.log("✅ i18n initialized");

        // 3. Setup Navigation
        setupNavigation();
        console.log("✅ Navigation setup complete");

        // 4. Setup Global Actions (Theme/Lang Toggles)
        setupGlobalActions();
        console.log("✅ Global actions created");

    } catch (e) {
        console.error("❌ CRITICAL INIT ERROR:", e);
        alert("Error initializing application. Check console for details.");
    }
}

/**
 * Setup Sidebar and Dashboard Navigation
 */
function setupNavigation() {
    // Select all elements that should trigger navigation
    // This includes sidebar links AND dashboard buttons
    const navTriggers = document.querySelectorAll('[data-target]');
    
    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            if (targetId) {
                navigateTo(targetId);
            }
        });
    });

    // Handle initial state (if URL has hash or default)
    // For now default to dashboard
    navigateTo('tool-dashboard');
}

/**
 * Perform navigation to a specific tool
 * @param {string} targetId - ID of the view to show (e.g. 'tool-vlsm')
 */
function navigateTo(targetId) {
    console.log(`Navigating to: ${targetId}`);
    
    // 1. Validate target exists
    const targetView = document.getElementById(targetId);
    if (!targetView) {
        console.error(`View not found: ${targetId}`);
        return;
    }

    // 2. Hide all views
    document.querySelectorAll('.tool-view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none'; // Force hide
    });

    // 3. Show target view
    targetView.classList.add('active');
    targetView.style.display = 'block'; // Force show normally handled by CSS but safety first

    // 4. Update Sidebar Active State
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        }
    });

    // 5. Update Breadcrumb
    const breadcrumb = document.getElementById('current-view-name');
    if (breadcrumb) {
        // Try to find a sidebar link text for this target
        const sidebarLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        if (sidebarLink) {
            breadcrumb.textContent = sidebarLink.innerText.trim();
        } else {
            breadcrumb.textContent = "Herramienta";
        }
    }

    // 6. Lazy Load Tool Logic
    loadToolLogic(targetId);

    AppState.currentTool = targetId;
}

/**
 * Lazy load specific logic for tools to prevent global crashes
 * @param {string} toolId 
 */
async function loadToolLogic(toolId) {
    if (AppState.initializedTools.has(toolId)) return;

    console.log(`Lazy loading logic for ${toolId}...`);

    try {
        switch (toolId) {
            case 'tool-vlsm':
                // Import logic safely
                // const module = await import('./tools/vlsm.js');
                // module.init();
                console.log("VLSM logic loaded (placeholder)");
                break;
            case 'tool-dns':
                 // const dnsParams = await import('./tools/dns.js');
                 console.log("DNS logic loaded (placeholder)");
                 break;
            // Add other tools here
        }
        AppState.initializedTools.add(toolId);
    } catch (e) {
        console.error(`Failed to load logic for ${toolId}`, e);
    }
}

/**
 * Setup the top-right action buttons
 */
function setupGlobalActions() {
    const container = document.querySelector('.global-actions');
    if (!container) {
        console.warn("Global actions container not found");
        return;
    }

    // Clear existing
    container.innerHTML = '';

    // 1. Theme Toggle
    const themeBtn = createThemeToggle();
    // Wrap click to also update Bootstrap attribute
    const originalClick = themeBtn.onclick || (() => {}); // capture existing listener if any
    themeBtn.addEventListener('click', () => {
         // Tiny delay to let theme.js update state
         setTimeout(() => updateBootstrapTheme(getEffectiveTheme()), 50);
    });
    
    // Style for Bootstrap
    themeBtn.className = "btn btn-outline-secondary btn-sm me-2";
    container.appendChild(themeBtn);

    // 2. Language Toggle
    const langBtn = document.createElement('button');
    langBtn.className = "btn btn-outline-secondary btn-sm";
    langBtn.id = "lang-toggle";
    langBtn.innerHTML = '<i class="fas fa-language"></i> Toggle';
    
    langBtn.onclick = () => {
        // Toggle logic
        const newLang = document.documentElement.lang === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        updateLangButtonState(langBtn, newLang);
    };

    // Initial state
    updateLangButtonState(langBtn, document.documentElement.lang || 'es');
    container.appendChild(langBtn);
}

function updateLangButtonState(btn, lang) {
    if (lang === 'es') {
        btn.innerHTML = '🇺🇸 EN'; // Button shows what you WILL switch to
    } else {
        btn.innerHTML = '🇪🇸 ES';
    }
}

/**
 * Syncs the internal theme state with Bootstrap 5.3 data attribute
 */
function updateBootstrapTheme(theme) {
    const bsTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', bsTheme);
}

// Start execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
