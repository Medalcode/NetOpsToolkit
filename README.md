# 🌐 Calculadora VLSM (Variable Length Subnet Mask)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy Status](https://img.shields.io/badge/deploy-ready-brightgreen)](https://github.com/Medalcode/myvlsm)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red)](https://github.com/Medalcode/myvlsm)

> Herramienta web profesional para calcular subredes utilizando la metodología VLSM (Variable Length Subnet Mask), optimizando el uso de direcciones IP en diseños de red empresariales.

![VLSM Calculator Screenshot](https://via.placeholder.com/800x400/007BFF/FFFFFF?text=VLSM+Calculator)

## 🎯 Características Principales

- ✅ **Cálculo VLSM Automático** - Algoritmo optimizado para distribución eficiente de subredes
- 📊 **Información Detallada** - Dirección de red, máscara, broadcast, rango de hosts
- 🎨 **Interfaz Intuitiva** - Diseño limpio y fácil de usar
- ⚡ **Sin Dependencias** - 100% Vanilla JavaScript, carga instantánea
- 📱 **Responsive** - Funciona en desktop, tablet y móvil
- 🔒 **Privacidad Total** - Todos los cálculos en el navegador, sin envío de datos

## 🚀 Demo en Vivo

**[👉 Probar la Calculadora](https://myvlsm.netlify.app)** _(Próximamente)_

## 📖 ¿Qué es VLSM?

**VLSM (Variable Length Subnet Mask)** es una técnica de subnetting que permite dividir una red IP en subredes de diferentes tamaños, optimizando el uso de direcciones IP según las necesidades específicas de cada segmento de red.

### Ventajas de VLSM:

- 🎯 **Eficiencia** - Minimiza el desperdicio de direcciones IP
- 📈 **Escalabilidad** - Permite crecimiento flexible de la red
- 💰 **Ahorro** - Optimiza el uso de espacios de direccionamiento
- 🏢 **Profesional** - Estándar en diseños de redes empresariales

## 💻 Uso

### Opción 1: Uso Online

Visita [myvlsm.netlify.app](https://myvlsm.netlify.app) y comienza a calcular.

### Opción 2: Uso Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Medalcode/myvlsm.git
   cd myvlsm
   ```

2. **Abrir en el navegador:**

   ```bash
   # Opción A: Abrir directamente
   open index.html

   # Opción B: Con servidor local (Python)
   python3 -m http.server 8000
   # Visitar: http://localhost:8000

   # Opción C: Con Node.js
   npx serve
   # Visitar: http://localhost:3000
   ```

## 📝 Ejemplo de Uso

### Escenario:

Tienes la red `192.168.1.0/24` y necesitas crear subredes para:

- 🏢 Oficina principal: 50 hosts
- 🏪 Sucursal: 30 hosts
- 📡 WiFi invitados: 10 hosts

### Pasos:

1. **Ingresar la red principal:**

   ```
   Red Principal: 192.168.1.0/24
   ```

2. **Ingresar hosts requeridos (separados por comas):**

   ```
   Hosts por Subred: 50,30,10
   ```

3. **Hacer clic en "Calcular"**

### Resultado:

```
Subred 1:
Red: 192.168.1.0/26
Máscara: 255.255.255.192
Rango: 192.168.1.1 - 192.168.1.62
Broadcast: 192.168.1.63
Hosts disponibles: 62

Subred 2:
Red: 192.168.1.64/27
Máscara: 255.255.255.224
Rango: 192.168.1.65 - 192.168.1.94
Broadcast: 192.168.1.95
Hosts disponibles: 30

Subred 3:
Red: 192.168.1.96/28
Máscara: 255.255.255.240
Rango: 192.168.1.97 - 192.168.1.110
Broadcast: 192.168.1.111
Hosts disponibles: 14
```

## 🛠️ Tecnologías

| Componente           | Tecnología                |
| -------------------- | ------------------------- |
| Frontend             | HTML5                     |
| Estilos              | CSS3 (Vanilla)            |
| Lógica               | JavaScript ES6+ (Vanilla) |
| Hosting              | Netlify / Vercel          |
| Control de Versiones | Git                       |

## 🏗️ Arquitectura

```
myvlsm/
├── index.html          # Estructura HTML
├── style.css           # Estilos CSS
├── script.js           # Lógica JavaScript
├── README.md           # Este archivo
├── LICENSE             # Licencia MIT
└── .gitattributes      # Config Git
```

## 🧮 Algoritmo VLSM

El algoritmo implementado sigue estos pasos:

1. **Ordenar requisitos** - Los hosts se ordenan de mayor a menor
2. **Calcular bits necesarios** - `bits = ceil(log2(hosts + 2))`
3. **Determinar prefijo** - `nuevo_prefijo = 32 - bits`
4. **Calcular tamaño de bloque** - `tamaño = 2^bits`
5. **Asignar direcciones** - Consecutivamente según el ordenamiento

### Complejidad:

- Ordenamiento: O(n log n)
- Cálculo: O(n)
- Total: O(n log n)

## 🎓 Recursos de Aprendizaje

### Tutoriales Recomendados:

- 📘 [RFC 1878 - VLSM](https://tools.ietf.org/html/rfc1878)
- 📗 [Cisco - IP Addressing](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- 📕 [Subnetting Practice](https://subnettingpractice.com/)

### Conceptos Clave:

- **CIDR Notation** - Notación de prefijo (e.g., /24)
- **Subnet Mask** - Máscara de subred
- **Network Address** - Dirección de red
- **Broadcast Address** - Dirección de broadcast
- **Usable Hosts** - Hosts utilizables

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas colaborar:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas de Mejora:

- 🎨 UI/UX mejorado (modo oscuro, animaciones)
- 📊 Visualización gráfica de subredes
- 📱 Progressive Web App (PWA)
- 🌍 Internacionalización (i18n)
- 🧪 Tests automatizados
- 📈 Exportación de resultados (CSV, PDF)

Ver [MEJORAS_COMPLETAS.md](MEJORAS_COMPLETAS.md) para lista completa de mejoras planificadas.

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/Medalcode/myvlsm/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Navegador y versión

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**MedalCode Team**

- GitHub: [@Medalcode](https://github.com/Medalcode)
- Proyecto: [myvlsm](https://github.com/Medalcode/myvlsm)

## ⭐ Apoya el Proyecto

Si este proyecto te ha sido útil, considera:

- ⭐ Darle una estrella en GitHub
- 🐛 Reportar bugs o sugerir mejoras
- 🤝 Contribuir con código
- 📢 Compartir con otros profesionales de networking

## 📊 Estadísticas del Proyecto

![GitHub stars](https://img.shields.io/github/stars/Medalcode/myvlsm?style=social)
![GitHub forks](https://img.shields.io/github/forks/Medalcode/myvlsm?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Medalcode/myvlsm?style=social)

## 🗺️ Roadmap

### v1.0 - MVP ✅

- [x] Cálculo básico VLSM
- [x] Validación de inputs
- [x] Interfaz responsive

### v1.1 - Mejoras Core (En desarrollo)

- [ ] Validación avanzada
- [ ] Exportar a CSV
- [ ] Modo oscuro
- [ ] Deployment producción

### v2.0 - Features Avanzadas (Planificado)

- [ ] Visualización gráfica
- [ ] PWA con offline mode
- [ ] Multiidioma (es, en, pt)
- [ ] API REST

Ver [MEJORAS_COMPLETAS.md](MEJORAS_COMPLETAS.md) para roadmap completo.

---

<div align="center">

**Hecho con ❤️ para la comunidad de networking**

[Reportar Bug](https://github.com/Medalcode/myvlsm/issues) · [Solicitar Feature](https://github.com/Medalcode/myvlsm/issues) · [Documentación](https://github.com/Medalcode/myvlsm/wiki)

</div>
