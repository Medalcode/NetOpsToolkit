# 🌐 Network Tools Suite (v2.0.0)

## 🚨 Transformación Mayor: De Calculadora a Suite

Siguiendo tu sugerencia de igualar a "subnettingpractice.com", hemos re-arquitecturado la aplicación por completo. Ya no es solo una calculadora, es una **Suite de Herramientas de Networking**.

### 🏗️ Cambios Arquitectónicos

- **Navegación por Pestañas**: Nuevo sistema de tabs que permite cambiar entre herramientas instantáneamente sin recargar la página.
- **Modularidad**: Cada herramienta vive en su propio módulo JS/CSS, manteniendo el código limpio.

---

## 🛠️ Nuevas Herramientas Implementadas

### 1. 🧮 Standard IPv4 Subnet Calculator (Nuevo)

Calculadora de subred clásica para análisis rápido de una IP.

- **Input**: IP (ej: `192.168.1.50`) y Máscara (ej: `/26`).
- **Output Detallado**:
  - Dirección de Red y Broadcast.
  - Máscara y Wildcard Mask.
  - Rango de Hosts utilizables.
  - Clase de IP (A, B, C...) y Tipo (Privada/Pública).
  - **Visualización Binaria**: Desglose bit a bit para educación.

### 2. 🔢 Hex/Binary Converter (Nuevo)

Convertidor de base en tiempo real.

- **Magic Input**: Detecta automáticamente qué estás escribiendo.
  - `0b1010` -> Detecta Binario.
  - `0xFF` -> Detecta Hexadecimal.
  - `255` -> Detecta Decimal.
- **Resultado**: Muestra las 3 bases simultáneamente.

### 3. 🌐 VLSM Calculator (Mejorada)

La herramienta original sigue siendo la estrella, ahora con todas las mejoras "Pro" de la v1.6.0 (Validación real-time, Mapas visuales).

### 4. 🔮 IPv6 Calculator (Próximamente)

Ya tenemos el espacio reservado en la interfaz para implementar la calculadora IPv6 en el siguiente sprint.

---

## 📸 Resumen de Versión v2.0.0

| Herramiento       | Estado | Características                     |
| :---------------- | :----: | :---------------------------------- |
| **VLSM Calc**     |   ✅   | Validation, Visual Maps, UX Pro     |
| **Subnet Calc**   |   ✅   | Class detection, Binary Viz, Ranges |
| **Hex Converter** |   ✅   | Auto-detection, Real-time           |
| **IPv6 Calc**     |   ⏳   | Placeholder listo                   |

---

## 🚀 ¿Qué sigue?

1.  **Implementar IPv6**: El último eslabón para completar la suite.
2.  **Deploy**: Esta versión v2.0.0 es un cambio mayor y está lista para publicación.

¡La aplicación ahora es una navaja suiza para ingenieros de red! 🛠️
