# ADR-002: Arquitectura Hexagonal (Ports and Adapters) para la Capa de Plataforma

- **Estado:** Aprobado
- **Fecha:** 2026-08-21
- **Autor:** Staff Software Architect

## Contexto
El código de la interfaz de usuario interactuaba directamente con APIs globales del navegador (`localStorage`, `fetch`, `navigator.clipboard`), lo que acoplaba fuertemente la UI a la plataforma y complicaba la creación de mocks en las suites de prueba unitarias.

## Decisión
Se aisló todo acceso a I/O y persistencia dentro del directorio `src/platform/` creando adaptadores dedicados:
- `src/platform/storage.js`: Abstracción segura de persistencia con manejo de excepciones `QuotaExceededError`.
- `src/platform/fetch.js`: Wrapper seguro para solicitudes HTTP/HTTPS.
- `src/platform/clipboard.js`: Wrapper con fallback para copia al portapapeles.

## Razón
1. Permite testear el 100% de la lógica de negocio sin depender de las APIs del navegador.
2. Evita errores de ejecución en entornos donde `localStorage` o `navigator.clipboard` estén deshabilitados por políticas del navegador.

## Consecuencias
- La UI debe consumir siempre los adaptadores exportados en `src/platform/` en lugar de llamar a `localStorage` directamente.
