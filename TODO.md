# TODO - NetOps Toolkit

## 🎯 Próximas Tareas Prioritarias

### Fase 0 - Completar Quick Wins

- [ ] **Auditoría Funcional**: Verificar que todas las herramientas funcionen correctamente
  - [ ] VLSM Calculator
  - [ ] DNS Lookup
  - [ ] IPv6 Tools
  - [ ] Config Generator
  - [ ] OUI Lookup
  - [ ] Key Generator
  - [ ] Port Reference

- [ ] **Verificar Funcionalidades Existentes**:
  - [ ] Copy to clipboard (ya implementado en `clipboard.js`)
  - [ ] Export to CSV/JSON (ya implementado en `exporters.js`)
  - [ ] Historial VLSM con nuevos IDs

- [ ] **UI/UX**:
  - [ ] Mejorar focus states para accesibilidad
  - [ ] Añadir animaciones suaves
  - [ ] Revisar modo móvil y consistencia de tarjetas

- [ ] **Analytics**:
  - [ ] Integrar Google Analytics 4
  - [ ] Configurar tracking de eventos

---

## 🚀 Fase 1 - Alta Prioridad

### Funcionalidad

- [ ] Export to PDF
- [ ] LocalStorage history para todas las herramientas
- [ ] Share via URL parameters
- [ ] Real-time input validation con visual feedback

### UI/UX

- [ ] Dark mode toggle (ya hay soporte básico)
- [ ] Tooltips informativos
- [ ] Toast notifications mejoradas
- [ ] Keyboard shortcuts (Ctrl+K, Esc)

### Testing

- [ ] Tests para VLSM calculations
- [ ] Tests para conversion functions
- [ ] Aumentar coverage a 80%+
- [ ] Pre-commit hooks con Husky

---

## 🔮 Fase 2 - Futuras Mejoras

### Features Avanzadas

- [ ] Supernetting calculator
- [ ] Route aggregation
- [ ] Overlapping detection
- [ ] Visual subnet diagram
- [ ] Utilization charts (Chart.js)

### PWA

- [ ] Service Worker para offline mode
- [ ] Install prompt
- [ ] Push notifications

### Internacionalización

- [ ] i18next setup
- [ ] Spanish translation
- [ ] English translation
- [ ] Language selector UI

---

## 🐛 Issues Conocidos

1. Algunos `getElementById` podrían apuntar a IDs antiguos después de la refactorización
2. Validación de inputs podría mejorarse en algunas herramientas
3. Modo móvil necesita optimización

---

## 📝 Notas

- El proyecto ya tiene excelente funcionalidad de export (CSV, JSON, Text)
- Clipboard functionality está bien implementada
- ESLint y Prettier ya configurados
- 20 tests unitarios pasando (100%)

**Última actualización**: 2026-01-19  
**Versión actual**: 3.0.1
