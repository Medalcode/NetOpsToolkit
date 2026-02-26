---
id: skills-catalog-v1
version: 1.0.0
language: es
generated_by: agent-automation
description: >-
  Catálogo machine-readable de "skills" (capacidades) disponibles en el
  proyecto NetOpsToolkit. Cada entrada contiene metadata que permite a
  agentes y pipelines descubrir, validar e invocar funcionalidades.
---

# Catálogo de Skills

## Formato

Cada skill tiene YAML frontmatter con los campos mínimos:

- `id` (string): identificador único (kebab-case)
- `name` (string): nombre legible
- `description` (string): breve explicación
- `capabilities` (array): lista de capacidades / tags
- `inputs` (array): esquema simplificado de entradas (name, type, required)
- `outputs` (array): esquema simplificado de salidas (name, type)
- `runtime_requirements` (object): requisitos para ejecución (node, env vars)
- `owner` (string): responsable / equipo
- `version` (string): semver

Ejemplo de skill (registro):

---
id: ip-lookup
name: Búsqueda IP pública
description: Devuelve información geolocalizada y metadata de la IP pública.
capabilities:
  - geo
  - public-ip
inputs:
  - name: clientIp
    type: string
    required: false
outputs:
  - name: ip
    type: string
  - name: country
    type: string
  - name: asn
    type: string
runtime_requirements:
  node: ">=16"
  env:
    - NETLIFY_API_KEY (optional)
owner: netops-team
version: 1.0.0
---

## Skills registrados (Consolidados)

- **`identity-service`** — Gestiona la identidad de red del cliente.
  - *Parámetros*: `mode` (public|geo|local).
  - *Implementación*: Combina `netlify/functions/geo-ip.js` y `src/ui/components/public_ip.js`.
- **`net-analysis-engine`** — Motor de análisis de red unificado.
  - *Parámetros*: `type` (dns|vlsm|ipv4|ipv6).
  - *Implementación*: Centraliza la lógica de `src/ui/components/dns.js`, `src/core/network.js` y `src/ui/components/ipv6.js`.
- **`infra-toolbox`** — Utilidades de infraestructura y seguridad.
  - *Parámetros*: `tool` (keygen|cfg-gen|oui|ports).
  - *Implementación*: Agrupa herramientas en `src/ui/components/` (keygen, config_gen, oui, ports).
- **`data-conversion`** — Suite de conversión de formatos.
  - *Parámetros*: `input_type` (ip|decimal|hex|binary).
  - *Implementación*: Fusiona `src/core/convert.js` y `src/ui/components/base-converter.js`.


## Buenas prácticas para añadir nuevas skills

- Crear una entrada YAML en `docs/skills.md` con `id` único.
- Implementar la lógica en `src/ui/components/<skill>.js` y exponer `init<Skill>` y una API pura exportable para tests.
- Añadir tests en `tests/` que cubran la lógica del core.
- Documentar variables de entorno necesarias y permisos para serverless en `agent.md`.

## Consumo por agentes

Un agente puede parsear el frontmatter YAML para obtener el catálogo de
`skills` y mapear `skill.id` a los módulos/lambdas correspondientes. Las
políticas de validación se indican en `runtime_requirements`.
