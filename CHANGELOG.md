# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
