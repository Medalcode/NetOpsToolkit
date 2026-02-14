---
id: agent-manifest-v1
version: 1.0.0
language: es
generated_by: agent-automation
description: >-
  Documento maestro que describe el agente/entorno de ejecución para
  NetOpsToolkit: arquitectura, catálogo de `skills`, contratos de invocación,
  políticas de seguridad y checklist de despliegue.
---

# Agent Manifest — NetOpsToolkit

## Propósito

Este documento describe cómo un "agent" (humano o automatizado) debe
descubrir, validar e invocar las capacidades (`skills`) del proyecto.

## Arquitectura (resumen)

- Frontend SPA construido con Vite, Tailwind y módulos ES (entry: `src/js/main.js`).
- Herramientas organizadas en `src/js/tools/` y wrappers de plataforma en `src/js/platform/`.
- Serverless: Netlify Functions en `netlify/functions/` (ej. `geo-ip.js`).
- Tests: Jest (`tests/`).

## Catálogo de skills

El catálogo machine-readable se encuentra en `docs/skills.md`.
Los agentes deben leer el frontmatter YAML para mapear `skill.id` a la
implementación adecuada (módulo lazy-loaded o función serverless).

## Contrato de invocación (ejemplos)

1) Invocar skill en cliente (módulo JS):

```js
import('./src/js/tools/ip-lookup.js').then(({run})=>{
  return run({clientIp: '1.2.3.4'})
})
```

2) Invocar skill como API (Netlify Function):

Request POST /.netlify/functions/skill-proxy
Payload:
```json
{ "skill": "ip-lookup", "input": { "clientIp": "1.2.3.4" } }
```

Response esperado (estándar):
```json
{ "status": "ok", "skill": "ip-lookup", "result": { ... } }
```

## Requisitos de runtime y secrets

- Node >=16 para funciones serverless y scripts de build.
- Secretos (añadir en Netlify / GitHub Secrets): `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `SENTRY_DSN` (si aplica).

## CI/CD

- CI: `npm run lint`, `npm test -- --coverage` en PRs.
- Deploy: build y despliegue automático a Netlify en `main` (workflow incluido).

## Observabilidad y errores

- Integrar Sentry/Roweball para errores client-side si se decide.
- Enviar métricas vitales y eventos de uso desde `src/js/analytics.js`.

## Seguridad

- Mantener `netlify.toml` y `public/_headers` con CSP y headers.
- Revisar dependencias periódicamente (`npm audit`) y actualizar.

## Checklist de despliegue (antes de merge a `main`)

- [ ] Lint limpio (`npm run lint`).
- [ ] Tests pasando con coverage aceptable (`npm test`).
- [ ] Actualizar `docs/skills.md` si se añade/actualiza un skill.
- [ ] Revisar `netlify.toml` y variables de entorno.

## Onboarding para contributors

- Añadir nueva herramienta: crear module en `src/js/tools/`, tests en `tests/`, y entry en `docs/skills.md`.
- Seguir Conv. Commits y abrir PR con descripción y screenshots si aplica.
