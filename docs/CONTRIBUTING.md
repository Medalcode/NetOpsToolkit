# Contribuir a NetOps Toolkit

Gracias por querer contribuir. Este documento resume el flujo sugerido,
normas de calidad y pasos mínimos antes de enviar un PR.

1. Fork y crea una rama descriptiva: `feature/<descripcion>` o `fix/<descripcion>`.
2. Sigue Conventional Commits para los mensajes de commit.
3. Ejecuta linters y tests localmente:

```bash
npm ci
npm run lint
npm test
```

4. Mantén la cobertura y añade tests para la lógica nueva.
5. Si añades una nueva "skill", actualiza `docs/skills.md` con el frontmatter correspondiente.
6. Añade documentación y notas de migración si cambias APIs o contratos.

Hooks y calidad de código

- El proyecto usa `husky` + `lint-staged`. Instala los hooks con:

```bash
npm run prepare
```

- El pre-commit ejecutará los linters y formateadores configurados.

Revisión y merge

- Abre un PR con descripción clara y checklist completada.
- Los PRs deben pasar CI (`.github/workflows/ci.yml`) antes de merge.

Gracias — tu contribución mejora la herramienta para toda la comunidad.
