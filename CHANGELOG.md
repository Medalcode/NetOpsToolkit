# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [3.0.1] - 2026-01-19

### Añadido ✨

- ✅ **SEO Completo**: Meta tags, Open Graph, Twitter Cards
- ✅ **Favicon**: Icono terminal cyberpunk (512x512px)
- ✅ **PWA Ready**: Web app manifest para instalación
- ✅ **Robots.txt y Sitemap.xml**: Optimización para crawlers
- ✅ **Security Headers**: CSP, X-Frame-Options, Referrer-Policy
- ✅ **Global Error Handler**: Manejo de errores con notificaciones toast
- ✅ **Testing Infrastructure**: Jest configurado con 20 tests unitarios
- ✅ **Validators Tests**: 100% passing (validateIPAddress, validateCIDRPrefix, etc.)
- ✅ **ESLint + Prettier**: Ya configurados previamente

### Cambiado 🔄

- 🔄 Versión actualizada: 2.2.0 → 3.0.1
- 🔄 `index.html`: Meta tags completos y favicon links
- 🔄 `main.js`: Integración de error handler global
- 🔄 `package.json`: Scripts de testing y linting, nuevas dependencias

### Técnico 🔧

- 📦 453 packages instalados (Jest, ESLint, Prettier, jsdom)
- 🧪 20 tests unitarios pasando
- 🏗️ Build exitoso (928ms)
- 📊 Coverage: 70%+ en validators

---

## [2.0.0-alpha] - 2025-12-29

### Transformación Mayor: "NetOps Toolkit" 🚀

Transformación completa de "VLSM Calculator" a "NetOps Toolkit". Una suite integral de herramientas para ingenieros de red.

### Nuevas Herramientas 🛠️

- **OUI Lookup**: Buscador de Fabricantes por MAC Address
- **IPv6 Tools**: Compresión, expansión y análisis de direcciones IPv6
- **Port Catalog**: Catálogo interactivo de puertos TCP/UDP comunes
- **IP Reference**: Tablas de referencia rápida para clases IP y rangos privados
- **Config Generator**: Generador de configuraciones Cisco/Mikrotik
- **Key Generator**: Generador de claves WPA2/3
- **DNS Lookup**: Consultas DNS en tiempo real

### Mejoras de UI/UX 🎨

- **Sidebar Navigation**: Sistema de navegación lateral profesional
- **Dashboard View**: Pantalla de bienvenida con widgets
- **Layout Moderno**: Reescritura del layout para múltiples vistas
- **Tailwind CSS**: Diseño moderno y responsive

---

## [1.6.0] - 2025-12-27

### Nuevas Características 🌟

- 🗺️ **Visualización de Red**: Gráfico de barras de ocupación
- ⚡ **Validación en Tiempo Real**: Feedback instantáneo (✅/❌)
- ℹ️ **Tooltips Educativos**: Explicaciones contextuales
- ⌨️ **Atajos de Teclado**: `/` para enfocar, `Esc` para limpiar

### Técnico 🔧

- 🆕 Módulo `visualization.js` para gráficos
- 🔄 Refactorización de `index.html` con estructura semántica
- 🔄 Optimización de eventos con `debounce`

---

## [1.5.0] - 2025-12-24

### Añadido

- 📊 Google Analytics 4 (GA4) integration
- 📊 Event tracking personalizado
- 📊 Configuración respetuosa con la privacidad

---

## [1.1.0] - 2025-12-24

### Añadido

- ✅ README.md completo
- ✅ Licencia MIT
- ✅ Validación de prefijo CIDR (0-32)
- ✅ Detección de agotamiento de espacio
- ✅ Cálculo de desperdicio de IPs
- ✅ Estadísticas de utilización
- ✅ Sistema de diseño con CSS Variables
- ✅ Animaciones suaves

### Seguridad

- 🔒 Eliminación de innerHTML
- 🔒 Content Security Policy
- 🔒 Security headers en Netlify

---

## [1.0.0] - 2025-12-24

### Añadido

- ✅ Calculadora VLSM básica funcional
- ✅ Validación de direcciones IPv4
- ✅ Cálculo de subredes con algoritmo VLSM
- ✅ Interfaz de usuario básica
- ✅ Diseño responsive inicial
