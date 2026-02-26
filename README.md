# 🛡️ NetOps Toolkit v4.0.0 — Lean Architecture Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Stable-green)](https://github.com/Medalcode/NetOpsToolkit)
[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7)](https://netops-toolkit.netlify.app)
[![Tests](https://img.shields.io/badge/Tests-20%20passing-success)](https://github.com/Medalcode/NetOpsToolkit)
[![CI](https://github.com/Medalcode/NetOpsToolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/Medalcode/NetOpsToolkit/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/PUT-YOUR-BADGE-HERE/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)

> **"La Navaja Suiza para Ingenieros de Red"**
>
> Suite integral de herramientas de red 100% client-side. Cálculo VLSM, análisis de subredes, DNS lookup, generación de configuraciones y más. Todo ejecutándose en tu navegador con máxima privacidad.

## ✨ Características Principales

- ✅ **100% Client-Side** - Sin backend, máxima privacidad
- ✅ **Interfaz Moderna** - Diseño Cyberpunk con Tailwind CSS
- ✅ **Validación en Tiempo Real** - Feedback instantáneo mientras escribes
- ✅ **Animaciones Fluidas** - Transiciones suaves entre vistas
- ✅ **Responsive** - Funciona en desktop y móvil
- ✅ **PWA Ready** - Instalable como aplicación
- ✅ **Internationalization** - Soporte nativo Español 🇪🇸 / Inglés 🇺🇸
- ✅ **Secure** - CSP headers, XSS prevention
- ✅ **Tested** - 29 tests unitarios pasando (Validators + VLSM Logic)
- ✅ **Open Source** - MIT License

## 🎯 Herramientas Disponibles

### 🌐 Networking

- **VLSM Calculator** - Calculadora avanzada de subredes con visualización
- **Subnet Analyzer** - Análisis detallado de direcciones IP
- **IPv6 Tools** - Expansión, compresión e identificación
- **DNS Lookup** - Consultas DNS en tiempo real vía DoH
- **Public IP Widget** - Detección automática de IP pública

### 🔧 Utilities

- **Port Reference** - Catálogo de puertos TCP/UDP
- **OUI Lookup** - Identificación de fabricantes por MAC
- **Config Generator** - Plantillas Cisco, Mikrotik, Juniper
- **Key Generator** - Generación segura de claves WPA2/3

## 🚀 Demo en Vivo

**[👉 Abrir NetOps Toolkit](https://netops-toolkit.netlify.app)**

## 💻 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/Medalcode/NetOpsToolkit.git
cd NetOpsToolkit

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm test

# Build para producción
npm run build
```

## 🏗️ Arquitectura del Proyecto (Lean Design)
El proyecto ha sido reestructurado para maximizar la densidad de valor y eliminar la fragmentación:

- **`src/core/`**: Lógica académica pura desposeída de side-effects. (Subnetting, Conversiones, Validaciones).
- **`src/platform/`**: Capa de abstracción para I/O (Fetch, LocalStorage, Clipboard).
- **`src/ui/`**: Capa de presentación modular y reactiva.
    - `ui/components/`: Widgets de herramientas individuales.
    - `ui/shared/`: Servicios UI comunes (i18n, history, theme).

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, JavaScript ES6+ (Modular)
- **Styling**: Tailwind CSS v3
- **Build**: Vite
- **Testing**: Jest + jsdom (32 tests pasando)
- **Deploy**: Netlify (Serverless Functions para Geo-IP)

## 📖 Documentación

- [CHANGELOG.md](CHANGELOG.md) - Historial de cambios
- [TODO.md](TODO.md) - Tareas pendientes y roadmap
- [LICENSE](LICENSE) - Licencia MIT
 - [Docs (agent & skills)](docs) - Guía para agentes, catálogo de skills y prácticas de CI/CD

## Docs & PR

- Documentación añadida en [docs/](docs) — `agent.md`, `skills.md`, `CONTRIBUTING.md`.
- Pull request con estos cambios: https://github.com/Medalcode/NetOpsToolkit/pull/1

Nota: el badge de Netlify es un placeholder; añade `NETLIFY_BADGE_ID` o actualiza la URL del badge con el ID de tu sitio en Netlify.


## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

**Estado actual**: 3 test suites, 32 tests pasando (añadidos tests para `dns-core` el 2026-01-27)

### Cambios Recientes (v4.0.0 - 2026-02-25)
- **Refactorización Lean**: Eliminación de archivos legados (`index_legacy.html`, `js/` raíz) y consolidación de lógica dispersa.
- **Estructura de Capas**: Separación clara entre `core/`, `platform/` y `ui/`.
- **Skills Consilidadas**: Implementación de Super-Skills paramétricas (`identity-service`, `net-analysis-engine`).
- **Testing**: Actualización de la suite para cubrir las nuevas rutas del core (32 tests pasando).

Para reproducir los cambios localmente:

```bash
npm install
npm test
npm run dev
```

## 🔒 Seguridad

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- XSS Prevention (no innerHTML)
- Input sanitization
- HTTPS enforcement

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Seguir [Conventional Commits](https://www.conventionalcommits.org/)
- Ejecutar `npm run lint` antes de commit
- Escribir tests para nuevas funcionalidades
- Mantener coverage > 70%

## 📊 Roadmap

### v3.1.0 (Próximo)

- [ ] Google Analytics 4 integration
- [ ] Export to PDF
- [ ] Dark mode toggle
- [ ] Tooltips informativos
- [ ] Keyboard shortcuts

### v3.2.0

- [ ] PWA completo con Service Worker
- [ ] Offline mode
- [ ] LocalStorage history para todas las herramientas
- [ ] Visual subnet diagrams

### v4.0.0

- [ ] Supernetting calculator
- [ ] Route aggregation
- [ ] IPv6 full support
- [ ] Internationalization (i18n)

Ver [TODO.md](TODO.md) para más detalles.

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE)

---

<div align="center">
  <b>Desarrollado por MedalCode</b><br>
  <i>Empoderando a ingenieros de red</i><br><br>
  <a href="https://netops-toolkit.netlify.app">🌐 Demo</a> •
  <a href="https://github.com/Medalcode/NetOpsToolkit/issues">🐛 Issues</a> •
  <a href="CHANGELOG.md">📝 Changelog</a>
</div>
