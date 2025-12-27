# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.6.0] - 2025-12-27 (The Professional Update)

### Nuevas Características 🌟

- 🗺️ **Visualización de Red**: Nuevo módulo de mapas de asignación.
  - Gráfico de barras interactivo que muestra la ocupación de la red.
  - Diferenciación visual de subredes y espacio libre.
  - Hover effects interactivos.
- ⚡ **Validación en Tiempo Real**: Feedback instantáneo (✅/❌) mientras escribes.
- ℹ️ **Tooltips Educativos**: Explicaciones contextuales al pasar el mouse por los campos.
- ⌨️ **Atajos de Teclado**:
  - `/`: Enfocar campo de red.
  - `Esc`: Limpiar formulario.
- 🎨 **UX Profesional**: Nuevos estilos de validación y feedback visual mejorado.

### Técnico 🔧

- 🆕 Nuevo módulo `visualization.js` para lógica de gráficos.
- 🆕 Nuevo archivo `visualization.css` para estilos de gráficos.
- 🔄 Refactorización de `index.html` con estructura semántica mejorada (`input-group`).
- 🔄 Optimización de eventos con `debounce` en `main.js`.
- 🔄 Actualización de `ui.js` para manejar estados de validación dinámicos.

## [1.5.0] - 2025-12-24

### Añadido

- 📊 Google Analytics 4 (GA4) integration
- 📊 Módulo `analytics.js` con tracking de eventos personalizado
- 📊 Event tracking para cálculos VLSM (`vlsm_calculation`)
- 📊 Event tracking para exportaciones (`export_data`)
- 📊 Event tracking para operaciones de portapapeles (`copy_to_clipboard`)
- 📊 Event tracking para errores de validación (`validation_error`)
- 📊 Configuración respetuosa con la privacidad (IP anonymization)
- 📊 Analytics deshabilitado en localhost automáticamente
- 📚 Guía exhaustiva de configuración (`GOOGLE_ANALYTICS_SETUP.md`)
- 📈 Dashboard de métricas clave recomendadas

### Cambiado

- 🔄 `index.html` incluye script de Google Analytics
- 🔄 `main.js` integra tracking en eventos clave
- 🔄 Versión actualizada a 1.5.0

## [1.1.0] - 2025-12-24

### Añadido

- ✅ README.md completo y profesional
- ✅ Licencia MIT
- ✅ Validación de prefijo CIDR (0-32)
- ✅ Detección de agotamiento de espacio de red
- ✅ Cálculo de desperdicio de IPs
- ✅ Estadísticas de utilización de red
- ✅ Mensajes de error mejorados con estilos
- ✅ Mensajes de advertencia para IPs no alineadas
- ✅ Meta tags SEO completos
- ✅ Open Graph tags para redes sociales
- ✅ Twitter Card tags
- ✅ Favicon con emoji de red
- ✅ Sistema de diseño con CSS Variables
- ✅ Gradiente de fondo moderno
- ✅ Animaciones suaves (fadeIn, fadeInUp, shake)
- ✅ Efectos hover en resultados
- ✅ Diseño responsive mejorado
- ✅ Configuración ESLint
- ✅ Configuración Prettier
- ✅ Configuración Netlify con headers de seguridad
- ✅ JSDoc en todas las funciones

### Cambiado

- 🔄 innerHTML reemplazado por createElement (seguridad XSS)
- 🔄 Try-catch global para manejo de errores
- 🔄 Validación de IP mejorada
- 🔄 Paleta de colores profesional
- 🔄 Tipografía moderna (System fonts)
- 🔄 Sombras y bordes mejorados
- 🔄 Max-width aumentado a 600px
- 🔄 Padding y espaciado mejorados

### Seguridad

- 🔒 Eliminación de innerHTML
- 🔒 Content Security Policy configurado
- 🔒 Security headers en Netlify
- 🔒 Validación estricta de inputs

## [1.0.0] - 2025-12-24

### Añadido

- ✅ Calculadora VLSM básica funcional
- ✅ Validación de direcciones IPv4
- ✅ Cálculo de subredes con algoritmo VLSM
- ✅ Ordenamiento descendente de hosts
- ✅ Conversión IP ↔ Decimal
- ✅ Interfaz de usuario básica
- ✅ Diseño responsive inicial
- ✅ Control de versiones con Git

[1.1.0]: https://github.com/Medalcode/myvlsm/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Medalcode/myvlsm/releases/tag/v1.0.0
