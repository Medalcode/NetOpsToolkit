const translations = {
  es: {
    // App General
    "app.title": "NetOps Toolkit - Suite Herramientas Red",
    "header.bc.netops": "NETOPS",
    "header.bc.vlsm": "CALCULADORA VLSM",
    "header.btn.vlsm": "VLSM",
    "header.btn.tools": "HERRAMIENTAS",
    "header.ver": "v4.0.1",
    "footer.ready": "Sistema Listo — v4.0.1-cyber",
    "footer.medalcode": "MEDALCODE",
    "footer.secure": "SEGURO",
    "tools.back": "Volver al Grid",
    "term.root": "Terminal — root@netops",
    "term.init": "$ iniciando conexión...",

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
    "vlsm.config.title": "Configuración VLSM",
    "vlsm.net.label": "Red Principal (CIDR)",
    "vlsm.net.help": "La red base que deseas dividir.",
    "vlsm.hosts.label": "Hosts por Subred",
    "vlsm.hosts.help": "Ingresa los tamaños separados por comas.",
    "vlsm.btn": "Calcular Distribución",
    "vlsm.calc.btn": "Calcular",
    "vlsm.wait": "Esperando datos",
    "input.hosts.hint": "Lista separada por comas (orden descendente recomendado)",

    // Help Banner
    "help.how": "Cómo usar:",
    "help.step1": "Ingresa una dirección de red (ej. 192.168.1.0)",
    "help.step2": "Selecciona la máscara de subred (ej. /24)",
    "help.step3": "Ingresa hosts requeridos separados por comas (ej. 50, 30, 20)",
    "help.step4": "Click en 'Calcular' o presiona Enter",

    // DNS Tool
    "dns.title": "Consulta DNS (DoH)",
    "dns.desc": "Consulta registros DNS en tiempo real.",
    "dns.domain": "Dominio",
    "dns.type": "Tipo",
    "dns.resolver": "Resolver",
    "dns.btn": "Consultar",

    // Tool Help Texts & Titles
    "subnet.title": "Analizador de Subredes",
    "subnet.desc": "Disecciona una dirección IPv4 para obtener su red, broadcast y rango de hosts.",
    "ipref.title": "Referencia IP",
    "ipref.desc": "Guía rápida de clases de IP, rangos privados (RFC 1918) y máscaras comunes.",
    "ipv6.title": "Herramientas IPv6",
    "ipv6.desc": "Comprime, expande y analiza direcciones IPv6 según el RFC 5952.",
    "oui.title": "Buscador OUI",
    "oui.desc":
      "Busca el fabricante de un dispositivo mediante los primeros 6 caracteres de su MAC.",
    "config.title": "Generador de Config",
    "config.desc": "Crea plantillas de configuración básicas para switches y routers.",
    "ports.title": "Catálogo de Puertos",
    "ports.desc": "Diccionario de puertos TCP/UDP comunes y sus servicios asociados.",
    "wiring.title": "Cableado Ethernet",
    "wiring.desc": "Referencia visual para el crimpado de cables T568A y T568B.",
    "hex.title": "Convertidor de Bases",
    "hex.desc":
      "Convierte números entre formatos Decimal, Binario y Hexadecimal automáticamente. Escribe en cualquier campo o usa prefijos (0x, 0b).",
    "bw.title": "Calculadora de Transferencia",
    "bw.desc": "Estima cuánto tardará en enviarse un archivo dado un ancho de banda específico.",
    "keygen.title": "Generador de Claves",
    "keygen.desc": "Crea contraseñas robustas y claves WPA/PSK seguras aleatorias.",
  },
  en: {
    // App General
    "app.title": "NetOps Toolkit - Network Tools Suite",
    "header.bc.netops": "NETOPS",
    "header.bc.vlsm": "VLSM CALCULATOR",
    "header.btn.vlsm": "VLSM",
    "header.btn.tools": "TOOLS",
    "header.ver": "v4.0.1",
    "footer.ready": "System Ready — v4.0.1-cyber",
    "footer.medalcode": "MEDALCODE",
    "footer.secure": "SECURE",
    "tools.back": "Back to Grid",
    "term.root": "Terminal — root@netops",
    "term.init": "$ initializing connection...",

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
    "vlsm.config.title": "VLSM Configuration",
    "vlsm.net.label": "Major Network (CIDR)",
    "vlsm.net.help": "The base network you want to subnet.",
    "vlsm.hosts.label": "Hosts per Subnet",
    "vlsm.hosts.help": "Enter sizes separated by commas.",
    "vlsm.btn": "Calculate Distribution",
    "vlsm.calc.btn": "Calculate",
    "vlsm.wait": "Waiting for data",
    "input.hosts.hint": "Comma separated list (descending order recommended)",

    // Help Banner
    "help.how": "How to use:",
    "help.step1": "Enter a network address (e.g., 192.168.1.0)",
    "help.step2": "Select subnet mask (e.g., /24)",
    "help.step3": "Enter required hosts per subnet separated by commas (e.g., 50, 30, 20)",
    "help.step4": "Click 'Calculate' or press Enter",

    // DNS Tool
    "dns.title": "DNS Lookup (DoH)",
    "dns.desc": "Query DNS records in real-time.",
    "dns.domain": "Domain",
    "dns.type": "Type",
    "dns.resolver": "Resolver",
    "dns.btn": "Lookup",

    // Tool Help Texts & Titles
    "subnet.title": "Subnet Analyzer",
    "subnet.desc": "Dissect an IPv4 address to get its network, broadcast, and host range.",
    "ipref.title": "IP Reference",
    "ipref.desc": "Quick guide to IP classes, private ranges (RFC 1918), and common masks.",
    "ipv6.title": "IPv6 Tools",
    "ipv6.desc": "Compress, expand, and analyze IPv6 addresses according to RFC 5952.",
    "oui.title": "OUI Lookup",
    "oui.desc": "Find a device manufacturer using the first 6 characters of its MAC.",
    "config.title": "Config Generator",
    "config.desc": "Create basic configuration templates for switches and routers.",
    "ports.title": "Port Catalog",
    "ports.desc": "Dictionary of common TCP/UDP ports and their services.",
    "wiring.title": "Ethernet Wiring",
    "wiring.desc": "Visual reference for T568A and T568B cable crimping.",
    "hex.title": "Base Converter",
    "hex.desc":
      "Convert numbers between Decimal, Binary, and Hexadecimal automatically. Type in any field or use prefixes (0x, 0b).",
    "bw.title": "Transfer Calculator",
    "bw.desc": "Estimate how long it will take to send a file given a specific bandwidth.",
    "keygen.title": "Key Generator",
    "keygen.desc": "Create robust passwords and secure random WPA/PSK keys.",
  },
};

let currentLang = "es";

/**
 * Switch language and update UI
 * @param {string} lang - 'es' or 'en'
 */
export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;

  // Save preference
  localStorage.setItem("netops_lang", lang);

  applyTranslations();
  updateLanguageToggleUI();
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
export function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = translations[currentLang][key];
    if (text) {
      if (el.tagName === "INPUT" && el.getAttribute("placeholder")) {
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
  const saved = localStorage.getItem("netops_lang");
  if (saved) {
    setLanguage(saved);
  } else {
    // Auto-detect? For now default to ES as per user history
    setLanguage("es");
  }
}

function updateLanguageToggleUI() {
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.innerHTML = currentLang === "es" ? "🇺🇸 EN" : "🇪🇸 ES";
  }
}

// Global expose for ease of use in inline handlers if absolutely necessary
window.switchLang = () => {
  const newLang = currentLang === "es" ? "en" : "es";
  setLanguage(newLang);
};
