# Changelog — NetOpsToolkit

Todos los cambios notables en este proyecto son documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
