# ADR-001: Adopción de Vanilla ES Modules y Vite sobre Frameworks SPA

- **Estado:** Aprobado
- **Fecha:** 2026-08-21
- **Autor:** Principal Product Engineer / CTO

## Contexto
NetOpsToolkit es una suite de herramientas de red 100% cliente. Se requería decidir la arquitectura de frontend adecuada entre adoptar un framework SPA (React, Vue, Angular) o mantener Vanilla JavaScript ES Modules empaquetado con Vite.

## Decisión
Se decidió mantener y optimizar la arquitectura basada en **Vanilla ES Modules (ES2022)** acelerada por **Vite**.

## Razón
1. **Rendimiento Máximo:** Bundle de producción ultraligero (< 50KB gzippeado) con tiempo de carga inicial instantáneo (< 200ms).
2. **Privacidad Total & Client-Side:** Cero sobrecarga de servidores o re-renderizados complejos de VDOM.
3. **Mantenibilidad a Largo Plazo:** El estándar nativo de ES Modules no sufre de la obsolescencia o rupturas de versión frecuentes en ecosistemas de frameworks.

## Consecuencias
- Mapeo dinámico `TOOL_REGISTRY` con `import()` dinámico para Code-Splitting de herramientas en demanda.
- Cobertura de tests puras en Jest utilizando JSDOM.
