# 🛠️ Guía de Herramientas (Features)

Aquí se documentan las herramientas avanzadas introducidas en el **V3 Major Update**.

## 1. Route Aggregator (Supernetting BGP)
Los ingenieros de red a menudo necesitan resumir docenas de rutas específicas en una única gran ruta para inyectar en OSPF o BGP y así mantener limpia la tabla de enrutamiento.

**Cómo usarlo:**
1. Abre el **Route Aggregator**.
2. Pega una lista de prefijos (ej. `192.168.1.0/24`, `192.168.2.0/24`).
3. Haz clic en "Aggregate".
4. Verás la **Supernet** resultante y un análisis binario visual donde los bits verdes son idénticos y los grises/rojos son los variables.

## 2. Config Analyzer & Auditor
Pegar un `show running-config` entero e intentar leer puerto por puerto es extenuante.

**Cómo usarlo:**
1. Abre el **Config Analyzer**.
2. Pega toda la configuración de Cisco IOS.
3. La herramienta detectará vulnerabilidades como **Telnet** activo o el uso de contraseñas de "enable" planas sin cifrar.
4. Generará tarjetas por cada interfaz indicando su estado, IP, máscara, e inconsistencias (ej: puerto UP pero sin IP configurada).

## 3. ACL Builder
Evita cometer errores de bloqueo catastróficos en producción.

**Cómo usarlo:**
1. Abre el **ACL Builder**.
2. Selecciona "Standard" o "Extended".
3. Añade orígenes, destinos y puertos (`eq 443`, `eq 80`).
4. Genera la configuración, revísala y cópiala directamente a la terminal de tu switch/router.

## 4. Full Config Generator
Evolución de nuestro script base. 

**Flujo:**
Le dices que tienes la red `10.0.0.0/16` y necesitas 5 VLANs. Él invocará el **motor VLSM interno** para calcular los tamaños exactos y te generará en 3 pestañas simultáneas toda la configuración de Interfaces, OSPF Area 0, y DHCP Servers para **Cisco, Mikrotik y JunOS**.
