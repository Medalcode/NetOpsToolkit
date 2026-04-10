# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [4.0.1] - 2026-05-21

### Añadido ✨

- ✅ **Suite de Tests de Conversión**: Creado `tests/converters.test.js` para probar la lógica de `src/core/convert.js`.
- ✅ **Soporte de Refresh de IP**: Vinculado el botón de actualización `#refresh-ip` en el widget de IP pública para re-consultar la dirección IP.

### Corregido 🐛

- 🐛 **Navegación y Estructura HTML (`index.html`)**: Se restableció el contenedor `<div id="view-vlsm">` que rodea la calculadora VLSM y el widget de IP, corrigiendo el error donde la calculadora se mostraba de manera persistente al navegar hacia otras herramientas.
- 🐛 **Widget de IP en Arranque (`main.js`)**: Se modificó la inicialización para importar e iniciar el widget de IP pública en segundo plano sin alterar la vista activa inicial.
- 🐛 **Widgets de Herramientas (`bandwidth.js`, `base-converter.js`, `ip_reference.js`)**: Corregidos para renderizar e inicializar su HTML de manera dinámica dentro del contenedor que les provee el gestor de vistas, resolviendo fallos donde las herramientas se cargaban vacías por buscar elementos estáticos ausentes.
- 🐛 **Manifest de Agentes (`docs/agent.md`)**: Corregidas las referencias obsoletas a rutas antiguas de archivos (`src/js/`) remanentes de la refactorización v4.0.0.

## [4.0.0] - 2026-02-25

### Refactorización: "Lean Architecture" 💎

Reestructuración completa del proyecto para eliminar redundancias y mejorar la mantenibilidad siguiendo principios de alta densidad.

- **Eliminación de Basura**: Borrado de `index_legacy.html`, `js/` (raíz), `old_monolithic/` y archivos temporales.
- **Nueva Estructura de Capas**:
    - `src/core/`: Lógica académica pura (Subnetting, Conversiones, Validaciones).
    - `src/platform/`: Wrappers de entorno (Fetch, Storage, Clipboard).
    - `src/ui/`: Capa de presentación modular.
        - `ui/components/`: Herramientas individuales (DNS, VLSM, IPv6, etc.).
        - `ui/shared/`: Servicios UI comunes (i18n, history, theme).
- **Fusión de Lógica**:
    - Consolidación de `converters.js` y `converter.js` en un módulo core unificado de conversión.
    - Integración de validaciones de UI y negocio en una capa centralizada.
- **Optimización de Imports**: Actualización de todo el árbol de dependencias para asegurar un bundle limpio mediante Vite.

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

## [Unreleased] - 2026-01-27

### Completado ✅

- Añadidos adaptadores de plataforma para desacoplar side-effects:
	- `src/platform/fetch.js` (wrapper mínimo para `fetch`)
	- `src/platform/storage.js` (wrapper seguro para `localStorage` con JSON)
	- `src/platform/clipboard.js` (wrapper para `navigator.clipboard.writeText` con fallback)
- Extraída lógica pura de DNS a `src/ui/components/dns-core.js` (construcción de URL y mapeo de tipos).
- Refactorizado `src/ui/components/dns.js` para usar `platformFetch`, `dns-core` y `platform/clipboard` (se reemplazó el `onclick` inline por listeners y el wrapper de clipboard).
- Refactorizado `src/ui/shared/history.js` para usar `src/platform/storage.js` en vez de `localStorage` directo.
- Añadido test unitario: `tests/dns.core.test.js` (URL building y type mapping).
- Ejecutados tests: todas las suites pasan (3 suites, 32 tests en el momento de la ejecución).

### Pendiente ⚙️

- Pruebas manuales smoke en navegador (`npm run dev`) para validar copia al portapapeles y comportamiento UI.
- Extraer lógica pura y tests para otros tools (por ejemplo `config_gen`, `public_ip`, `bandwidth`).
- Normalizar API de inicialización de herramientas (`init(container, services)`) y adaptar `src/ui/main.js` para inyectar servicios.
- Añadir tests de integración jsdom que arranquen `src/ui/main.js` y verifiquen el flujo de carga de herramientas.

### Notas Técnicas

- Cambios realizados con enfoque incremental y baja intrusión: se introdujeron wrappers y módulos puros sin cambiar la API pública de herramientas en esta fase.
- Objetivo: mejorar testabilidad y reducir acoplamientos entre UI, I/O y lógica de negocio, manteniendo el comportamiento actual.
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
