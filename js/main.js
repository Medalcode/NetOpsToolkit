/**
 * Módulo Principal - Calculadora VLSM
 * Orchestration de todos los módulos y manejo de eventos
 * @module main
 * @author MedalCode
 * @version 1.6.0
 */

// Importar validadores
import {
  validateIPAddress,
  validateCIDRPrefix,
  validateNetworkAddress,
  validateHosts,
  validateNetworkCapacity
} from './validators.js';

// Importar conversores
import { ipToDecimal, getNetworkAddress } from './converters.js';

// Importar calculador
import {
  calculateVLSM,
  calculateTotalRequired,
  calculateTotalAvailable
} from './calculator.js';

// Importar estadísticas
import { calculateStatistics } from './statistics.js';

// Importar UI
import {
  clearResults,
  showError,
  showWarning,
  displayStatistics,
  createActionsBar,
  addCopyButtonToSubnet,
  showToast,
  createHistoryPanel,
  updateHistoryPanel,
  showInputError, // New
  showInputSuccess, // New
  resetInputValidation // New
} from './ui.js';

// Importar exportación
import { exportToCSV, exportToJSON } from './exporters.js';

// Importar portapapeles
import { copyAllResults, copySubnet } from './clipboard.js';

// Importar analytics
import {
  trackCalculation,
  trackExport,
  trackCopy,
  trackValidationError
} from './analytics.js';

// Importar tema
import { initTheme, createThemeToggle } from './theme.js';

// Importar visualización
import { renderAllocationChart } from './visualization.js';

// Importar tools
import { initConverter } from './converter.js';
import { initStandardCalc } from './standard_calc.js';
import { initPortTool } from './tools/ports.js';
import { initOuiTool } from './tools/oui.js';
import { initIpRefTool } from './tools/ip_reference.js';

// Importar historial
import {
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getHistoryStats
} from './history.js';

// Variables globales para cache de los últimos resultados
let lastSubnets = null;
let lastStats = null;
let historyPanelElements = null;

// ... (Existing handleFormSubmit and other functions remain, just skipping them in this replacement for brevity if using replace, but for safety I will include specific changes or full file rewrite if needed. Since I need to replace imports and init, I'll do a block replacement for the top and bottom)

/* =========================================
   NAVIGATION (New Sidebar System)
   ========================================= */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const views = document.querySelectorAll('.tool-view');
  const breadcrumb = document.getElementById('current-view-name');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      
      // Update Sidebar State
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update View State
      views.forEach(view => {
        view.classList.remove('active');
        if (view.id === targetId) {
          view.classList.add('active');
        }
      });
      
      // Update Breadcrumb
      if (breadcrumb) {
        // Strip emoji for clean text
        const text = item.innerText.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'').trim(); 
        breadcrumb.textContent = text;
      }
    });
  });
}

/**
 * Inicializa la aplicación
 */
function init() {
  // Inicializar tema PRIMERO (para evitar flash)
  initTheme();

  // Agregar botón de tema (Floating or in Header? We put a placeholder in header, let's keep floating for now as backup)
  const themeToggle = createThemeToggle();
  document.body.appendChild(themeToggle);

  // Inicializar historial
  initHistory();
  
  // Inicializar UX Pro
  setupRealTimeValidation();
  setupKeyboardShortcuts();
  
  // Inicializar Navegación Dashboard
  setupNavigation();
  
  // Inicializar Herramientas
  initConverter();
  initStandardCalc();
  initPortTool();
  initOuiTool();
  initIpRefTool();

  // Agregar event listener al formulario
  const form = document.getElementById("vlsm-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
    console.log("✅ NetOps Toolkit v2.0.0 inicializado correctamente");
  } 
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Exportar para testing
export { handleFormSubmit, init };
