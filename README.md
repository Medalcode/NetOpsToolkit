# 🛡️ NetOps Toolkit (v2.0.0-alpha)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/State-Alpha-orange)](https://github.com/Medalcode/myvlsm)

> **"La Navaja Suiza para Ingenieros de Red"**
>
> Suite integral de herramientas Open Source que incluye Calculadora VLSM, Diagnóstico DNS, Referencia de Puertos, Generador de Configuración y más. Todo ejecutándose 100% en el navegador (Client-Side) con máxima privacidad.

![NetOps Toolkit Dashboard](https://via.placeholder.com/800x400/0f172a/38bdf8?text=NetOps+Toolkit+Dashboard)

## 🎯 Herramientas Incluidas

### 🌐 Layer 3: Network

- **Calculadora VLSM Pro**: Algoritmo optimizado para distribución eficiente de subredes.
- **Subnet Analyzer**: Análisis detallado de bloques CIDR.
- **IPv6 Tools**: Compresión, expansión y análisis de tipos de dirección.
- **DNS Lookup**: Consultas en tiempo real vía DNS-over-HTTPS (Google/Cloudflare).
- **Public IP**: Detección automática de IP pública, ASN y ubicación.

### 🔌 Layer 4: Transport

- **Port Catalog**: Búsqueda rápida de puertos TCP/UDP y servicios comunes.

### 🏷️ Layer 2: Data Link

- **OUI Lookup**: Identificación de fabricantes por MAC Address (Base de datos offline).

### 🧶 Layer 1: Physical

- **Wiring Guide**: Referencia visual interactiva para estándares T568A/B.

### 🤖 Automation & Utils

- **Config Generator**: Plantillas para Cisco, Mikrotik y Juniper.
- **Key Generator**: Generación segura de WPA2/3, PSK y Secret Keys.
- **Bandwidth Calc**: Estimación de tiempos de transferencia de archivos.
- **Hex Converter**: Conversión entre bases (Decimal, Binario, Hex).

## 🚀 Demo

**[👉 Abrir NetOps Toolkit](index.html)** _(Ejecutar localmente)_

## 💻 Instalación Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Medalcode/myvlsm.git NetOpsToolkit
   cd NetOpsToolkit
   ```

2. **Ejecutar:**

   Simplemente abre el archivo `index.html` en tu navegador favorito (Chrome, Firefox, Edge).

   _Opcional: Si deseas usarlo como servidor local:_

   ```bash
   # Python
   python3 -m http.server 8000

   # Node.js
   npx serve
   ```

## 🛠️ Tecnologías

| Componente  | Stack                                   |
| ----------- | --------------------------------------- |
| **Core**    | HTML5 Semántico                         |
| **Styling** | CSS3 Moderno (Variables, Grid, Flexbox) |
| **Logic**   | JavaScript ES6+ (Módulos Nativos)       |
| **APIs**    | DoH (Google/Cloudflare), IPAPI          |
| **Deploy**  | Static (Netlify/Vercel compatible)      |

## 🏗️ Estructura del Proyecto

```
NetOpsToolkit/
├── index.html           # Dashboard Principal
├── css/
│   ├── dashboard.css    # Layout del Dashboard
│   ├── tools.css        # Estilos de Herramientas
│   └── main.css         # Estilos Globales
├── js/
│   ├── main.js          # Orquestador
│   ├── tools/           # Módulos de Herramientas
│   │   ├── dns.js
│   │   ├── ipv6.js
│   │   ├── oui.js
│   │   └── ...
└── README.md            # Documentación
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingTool`)
3. Commit tus cambios (`git commit -m 'Add: New Tool'`)
4. Push a la branch (`git push origin feature/AmazingTool`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

<div align="center">
  <b>Desarrollado por MedalCode Team</b><br>
  <i>Empoderando a la próxima generación de ingenieros de red.</i>
</div>
