# Changelog — NetOpsToolkit

Todos los cambios notables en este proyecto son documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [4.2.5] - 2026-08-21

### Añadido ✨
- ⌨️ **Command Palette Global (`Cmd+K` / `Ctrl+K`)**: Creado `src/ui/components/command-palette.js` para acceso instantáneo por teclado a cualquiera de las 17 herramientas de red.
- 🔍 **Motor de Búsqueda Difusa (`fuzzy-search.js`)**: Algoritmo de filtrado difuso tolerante a erratas de tipeo para catálogos de puertos y registros OUI.
- ⚙️ **Typechecking Estático JSDoc (`jsconfig.json`)**: Verificación de tipos sin agregar compilador TypeScript.
- 📜 **Registros de Decisiones de Arquitectura (ADR)**: Documentados `ADR-001` (Vanilla ES Modules) y `ADR-002` (Puertos y Adaptadores Hexagonales) en `docs/adr/`.
- 🧪 **Suite de Pruebas de UX**: Creado `tests/ux-features.test.js` aumentando la suite total a 10 archivos y 67 pruebas pasando (100% verde).

---

## [4.2.0] - 2026-08-21

### Seguridad & Performance Core 🛡️
- 🔒 **Sanitización DOM XSS**: Creado el helper `escapeHtml` en `src/ui/shared/utils.js` y aplicado en `config-analyzer.js` y `ai-chat.js`.
- 🧠 **Corrección de Memory Leaks**: Limpieza reactiva de timers `authCheckInterval` (`clearInterval`) en `ai-chat.js`.
- 🌐 **Cifrado HTTPS Serverless**: Endpoint migrado a `https://ip-api.com` en `netlify/functions/geo-ip.js`.
- 🧱 **Storage Hexagonal**: Eliminado acceso directo a `localStorage` en `settings.js` y `ai-chat.js`, sustituido por el adaptador `storage.js`.

---

## [4.1.0] - 2026-08-21

### Añadido ✨
- 🐳 **Containerización Docker**: Creados `Dockerfile` (construcción multi-etapa con Node.js 20 Alpine y NGINX Alpine) y `docker-compose.yml` para despliegues reproducibles.
- 🧪 **Suite de Testing Completa (QA Automation)**: Creadas las suites `tests/platform.test.js`, `tests/shared-services.test.js` y `tests/smoke-regression.test.js` aumentando la suite a 8 archivos y 59 pruebas automatizadas (100% en el Core).
- ⚙️ **CI/CD Mejorado**: Actualizado `.github/workflows/ci.yml` para compilar con Node 20, auditar `npm run build` y verificar cobertura con exit code 0.

### Refactorización & Calidad 💎
- 🗑️ **Eliminación de Código Muerto**: Removida la dependencia obsoleta de Bootstrap (`bootstrap` y `@popperjs/core`) de `package.json` y el alias `~bootstrap` en `vite.config.js`.
- 🔒 **Higienización de Eventos & CSP**: Reemplazados todos los handlers `onclick="..."` inline en `index.html` por *Event Delegation* declarativo mediante atributos `data-tool-id` y `data-action` en `src/ui/main.js`.
- 🧠 **Prevención de Fugas de Memoria**: Corregido el manejo de timers en `showToast` y desvinculación de nodos DOM en `src/ui/shared/ui-engine.js` y `src/ui/shared/error-handler.js`.

### Corregido 🐛
- 🐛 **Caso Borde en Prefijo /0**: Corregido `getNetworkAddress` en `src/core/convert.js` para controlar el desbordamiento de desplazamiento de bits a nivel de JS cuando `prefix = 0`.

---

## [4.0.1] - 2026-05-21

- ✅ Suite de tests de conversión.
- 🐛 Corrección de vista VLSM en navegación.
