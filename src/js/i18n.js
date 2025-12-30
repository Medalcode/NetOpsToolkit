/**
 * Internationalization (i18n) Module
 * Handles translations for English and Spanish
 */

const translations = {
    es: {
        // Sidebar
        "nav.general": "General",
        "nav.dashboard": "Panel de Control",
        "nav.l3": "Capa 3: Red",
        "nav.vlsm": "Calc. VLSM",
        "nav.subnet": "Analizador Subred",
        "nav.ipref": "Referencia IP",
        "nav.ipv6": "Herramientas IPv6",
        "nav.dns": "Consulta DNS",
        "nav.l2": "Capa 2: Enlace",
        "nav.oui": "Buscador OUI",
        "nav.auto": "Automatización",
        "nav.config": "Gen. Config",
        "nav.l4": "Capa 4: Transporte",
        "nav.ports": "Catálogo Puertos",
        "nav.l1": "Capa 1: Física",
        "nav.wiring": "Cableado (T568)",
        "nav.utils": "Utilidades",
        "nav.hex": "Convertidor",
        "nav.bw": "Calc. Transferencia",
        "nav.keygen": "Generador Claves",
        
        // Dashboard
        "dash.title": "🚀 Centro de Comando",
        "dash.subtitle": "Bienvenido a la suite definitiva para ingenieros de red.",
        "dash.vlsm.title": "VLSM Pro",
        "dash.vlsm.desc": "Diseña esquemas de direccionamiento complejos.",
        "dash.vlsm.btn": "Abrir Calculadora",
        "dash.ports.title": "Puertos",
        "dash.ports.desc": "Catálogo de puertos y servicios.",
        "dash.ports.btn": "Buscar Puerto",
        "dash.ip.title": "Tu IP Pública",
        "dash.ip.detecting": "Detectando...",
        
        // VLSM Tool
        "vlsm.title": "Calculadora VLSM",
        "vlsm.net.label": "Red Principal (CIDR)",
        "vlsm.net.help": "La red base que deseas dividir.",
        "vlsm.hosts.label": "Hosts por Subred",
        "vlsm.hosts.help": "Ingresa los tamaños separados por comas.",
        "vlsm.btn": "Calcular Distribución",
        "vlsm.wait": "Esperando datos",
        
        // DNS Tool
        "dns.title": "Consulta DNS (DoH)",
        "dns.desc": "Consulta registros DNS en tiempo real.",
        "dns.domain": "Dominio",
        "dns.type": "Tipo",
        "dns.resolver": "Resolver",
        "dns.btn": "Consultar"
    },
    en: {
        // Sidebar
        "nav.general": "General",
        "nav.dashboard": "Dashboard",
        "nav.l3": "Layer 3: Network",
        "nav.vlsm": "VLSM Calc",
        "nav.subnet": "Subnet Analyzer",
        "nav.ipref": "IP Reference",
        "nav.ipv6": "IPv6 Tools",
        "nav.dns": "DNS Lookup",
        "nav.l2": "Layer 2: Data Link",
        "nav.oui": "OUI Lookup",
        "nav.auto": "Automation",
        "nav.config": "Config Gen",
        "nav.l4": "Layer 4: Transport",
        "nav.ports": "Port Catalog",
        "nav.l1": "Layer 1: Physical",
        "nav.wiring": "Wiring (T568)",
        "nav.utils": "Utilities",
        "nav.hex": "Converter",
        "nav.bw": "Transfer Calc",
        "nav.keygen": "Key Generator",

        // Dashboard
        "dash.title": "🚀 Command Center",
        "dash.subtitle": "Welcome to the ultimate network engineering suite.",
        "dash.vlsm.title": "VLSM Pro",
        "dash.vlsm.desc": "Design complex addressing schemes efficiently.",
        "dash.vlsm.btn": "Open Calculator",
        "dash.ports.title": "Ports",
        "dash.ports.desc": "Quick catalog of ports and services.",
        "dash.ports.btn": "Search Port",
        "dash.ip.title": "Your Public IP",
        "dash.ip.detecting": "Detecting...",

        // VLSM Tool
        "vlsm.title": "VLSM Calculator",
        "vlsm.net.label": "Major Network (CIDR)",
        "vlsm.net.help": "The base network you want to subnet.",
        "vlsm.hosts.label": "Hosts per Subnet",
        "vlsm.hosts.help": "Enter sizes separated by commas.",
        "vlsm.btn": "Calculate Distribution",
        "vlsm.wait": "Waiting for data",

        // DNS Tool
        "dns.title": "DNS Lookup (DoH)",
        "dns.desc": "Query DNS records in real-time.",
        "dns.domain": "Domain",
        "dns.type": "Type",
        "dns.resolver": "Resolver",
        "dns.btn": "Lookup"
    }
};

let currentLang = 'es';

/**
 * Switch language and update UI
 * @param {string} lang - 'es' or 'en'
 */
export function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Save preference
    localStorage.setItem('netops_lang', lang);
    
    applyTranslations();
    updateLanguageToggleUI();
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
export function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = translations[currentLang][key];
        if (text) {
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });
}

/**
 * Get a specific translation programmatically
 * @param {string} key 
 */
export function t(key) {
    return translations[currentLang][key] || key;
}

/**
 * Initialize i18n
 */
export function initI18n() {
    const saved = localStorage.getItem('netops_lang');
    if (saved) {
        setLanguage(saved);
    } else {
        // Auto-detect? For now default to ES as per user history
        setLanguage('es'); 
    }
}

function updateLanguageToggleUI() {
    const btn = document.getElementById('lang-toggle');
    if(btn) {
        btn.innerHTML = currentLang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES';
    }
}

// Global expose for ease of use in inline handlers if absolutely necessary
window.switchLang = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    setLanguage(newLang);
};
