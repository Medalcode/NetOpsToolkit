# 🛡️ NetOps Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/Medalcode/NetOpsToolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/Medalcode/NetOpsToolkit/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7)](https://netops-toolkit.netlify.app)

Suite de herramientas de red **100% client-side** para tareas operativas y de análisis: VLSM, subnetting, utilidades IPv6, DNS Lookup, generación de configuraciones y más.

## ✨ Descripción breve

NetOps Toolkit reúne utilidades para ingeniería de redes en una sola interfaz web. La lógica principal está modularizada por capas (`core`, `platform`, `ui`) y puede ejecutarse localmente con Vite.

## ✅ Prerrequisitos

- Node.js 18+
- npm 9+

## 🚀 Instalación / setup

```bash
git clone https://github.com/Medalcode/NetOpsToolkit.git
cd NetOpsToolkit
npm ci
```

## 🧪 Uso (comandos principales)

```bash
# Desarrollo local
npm run dev

# Lint
npm run lint

# Tests
npm test

# Build de producción
npm run build

# Previsualizar build
npm run preview
```

Demo pública: **https://netops-toolkit.netlify.app**

## 🧰 Herramientas incluidas

- VLSM Calculator
- Subnet Analyzer
- IPv6 Tools
- DNS Lookup
- Public IP Widget
- Port Reference
- OUI Lookup
- Config Generator
- Key Generator

## 🗂️ Estructura del repositorio (resumen)

```text
src/
  core/       # Lógica de dominio y validaciones
  platform/   # Adaptadores de plataforma (fetch, storage, clipboard)
  ui/         # Componentes e interacción de interfaz
  css/        # Estilos

tests/        # Suite Jest
docs/         # Guías de contribución y documentación técnica
```

## 🤝 Contribución

Las pautas de contribución están en [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

Flujo recomendado:

1. Crear rama (`feature/...` o `fix/...`).
2. Ejecutar calidad local (`npm run lint` y `npm test`).
3. Abrir PR con descripción clara.

## 📄 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).
