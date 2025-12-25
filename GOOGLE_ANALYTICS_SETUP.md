# 📊 Guía de Configuración de Google Analytics 4

Esta guía te ayudará a configurar Google Analytics 4 (GA4) para la Calculadora VLSM y comenzar a recopilar datos de uso.

---

## 🎯 ¿Qué se rastrea?

La aplicación está configurada para rastrear las siguientes interacciones de manera **respetuosa con la privacidad**:

### Eventos Automáticos

- **Page Views**: Vistas de página (automático)
- **Session Start**: Inicio de sesiones (automático)

### Eventos Personalizados

1. **`vlsm_calculation`** - Cada vez que se calcula VLSM

   - `subnet_count`: Número de subredes calculadas
   - `base_network`: Red base utilizada
   - `total_hosts`: Total de hosts solicitados

2. **`export_data`** - Cuando se exportan resultados

   - `export_format`: Formato de exportación (csv, json, txt)
   - `subnet_count`: Número de subredes exportadas

3. **`copy_to_clipboard`** - Cuando se copia al portapapeles

   - `copy_type`: Tipo de copia ('subnet' o 'all')
   - `subnet_index`: Índice de subred (si aplica)

4. **`validation_error`** - Errores de validación
   - `error_type`: Tipo de error (invalid_ip, invalid_cidr, etc.)
   - `field_name`: Campo que falló la validación

---

## 🚀 Configuración Paso a Paso

### Paso 1: Crear una cuenta de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Haz clic en **"Start measuring"** (Iniciar medición)
3. Completa la información de la cuenta:
   - **Account name**: `VLSM Calculator` (o el nombre que prefieras)
   - Configura las opciones de compartir datos según tus preferencias

### Paso 2: Crear una propiedad GA4

1. En "Property setup":
   - **Property name**: `Calculadora VLSM`
   - **Reporting time zone**: Selecciona tu zona horaria
   - **Currency**: Selecciona tu moneda
2. Haz clic en **"Next"**
3. Completa la información del negocio (opcional)
4. Haz clic en **"Create"**
5. Acepta los términos de servicio

### Paso 3: Configurar el stream de datos web

1. Selecciona **"Web"** como plataforma
2. Configura el stream:
   - **Website URL**: `https://luxury-dango-9d7cff.netlify.app`
   - **Stream name**: `VLSM Web App`
3. Haz clic en **"Create stream"**

### Paso 4: Obtener tu Measurement ID

1. Después de crear el stream, verás tu **Measurement ID**
   - Tiene el formato: `G-XXXXXXXXXX`
2. **¡CÓPIALO!** Lo necesitarás en el siguiente paso

### Paso 5: Actualizar el código

#### En `index.html`:

Encuentra esta línea:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

Reemplaza `G-XXXXXXXXXX` con tu **Measurement ID real**.

#### En `js/analytics.js`:

Encuentra esta línea:

```javascript
measurementId: 'G-XXXXXXXXXX', // TODO: Replace with actual ID
```

Reemplaza `G-XXXXXXXXXX` con tu **Measurement ID real**.

Ejemplo:

```javascript
measurementId: 'G-ABC123DEF4', // Tu ID real
```

#### Actualizar dominios habilitados (Opcional)

En `js/analytics.js`, actualiza la lista de dominios si configuras un dominio personalizado:

```javascript
enabledDomains: [
  "luxury-dango-9d7cff.netlify.app",
  "tudominio.com", // Agrega tu dominio personalizado aquí
];
```

### Paso 6: Desplegar los cambios

1. Commit y push de los cambios:

```bash
git add index.html js/analytics.js
git commit -m "feat: Configure Google Analytics 4 tracking"
git push origin main
```

2. Netlify desplegará automáticamente los cambios

### Paso 7: Verificar que funciona

1. Ve a tu sitio web desplegado
2. En Google Analytics, ve a **Reports > Realtime**
3. Realiza un cálculo VLSM en tu sitio
4. Deberías ver tu actividad en tiempo real en GA4

---

## 🔍 Explorar tus datos

### Panel de Tiempo Real

- **Reports > Realtime**: Ver usuarios activos en este momento
- Verás eventos personalizados como `vlsm_calculation` en tiempo real

### Eventos

- **Reports > Engagement > Events**: Ver todos los eventos rastreados
- Aquí verás:
  - `vlsm_calculation`
  - `export_data`
  - `copy_to_clipboard`
  - `validation_error`

### Crear informes personalizados

1. Ve a **Explore** en el sidebar
2. Haz clic en **"Create a new exploration"**
3. Selecciona una plantilla o crea desde cero

#### Ejemplo: Informe de Uso de VLSM

**Template**: Free form

**Configuración**:

- **Dimensions**:
  - Event name
  - base_network
  - subnet_count
- **Metrics**:
  - Event count
  - Total users
- **Filters**: Event name = `vlsm_calculation`

Esto te mostrará qué redes están calculando los usuarios y con cuántas subredes.

---

## 🛡️ Privacidad y GDPR

La implementación incluye configuraciones de privacidad:

### Configuradas automáticamente:

- ✅ **IP Anonymization**: Las IPs de usuarios se anonimizan
- ✅ **SameSite Cookies**: Cookies configuradas con `SameSite=None; Secure`
- ✅ **No tracking en localhost**: Analytics deshabilitado en desarrollo

### Si necesitas cumplir con GDPR:

1. **Banner de consentimiento**: Considera agregar un banner de cookies

   - Opciones: [cookie-consent](https://github.com/orestbida/cookieconsent)

2. **Política de privacidad**: Actualiza tu política de privacidad para mencionar GA4

3. **Configuración adicional en GA4**:
   - Ve a **Admin > Data Settings > Data Collection**
   - Habilita **Google signals** data collection (opcional)
   - Configura **Data retention** según tus necesidades

---

## 📊 Métricas clave a monitorear

### Uso general

- **Page views**: ¿Cuántas visitas recibe tu app?
- **Users**: ¿Cuántos usuarios únicos?
- **Sessions**: ¿Cuántas sesiones de uso?

### Funcionalidad

- **`vlsm_calculation` count**: ¿Cuántos cálculos se realizan?
- **`subnet_count` average**: ¿Cuántas subredes se calculan en promedio?
- **`export_data` by format**: ¿Qué formato prefieren (CSV vs JSON)?

### Errores y UX

- **`validation_error` by type**: ¿Qué errores son más comunes?
- **`copy_to_clipboard` count**: ¿Los usuarios usan la función de copiar?

### Engagement

- **Average engagement time**: ¿Cuánto tiempo pasan en la app?
- **Engaged sessions**: ¿Cuántas sesiones son "engaged" (10s+)?

---

## 🔧 Troubleshooting

### No veo datos en GA4

1. **Verifica el Measurement ID**:

   - Debe ser el mismo en `index.html` y `js/analytics.js`
   - Formato correcto: `G-XXXXXXXXXX`

2. **Revisa la consola del navegador**:

   - Abre DevTools (F12) > Console
   - Deberías ver: `[Analytics] Initialized successfully`
   - Y al hacer un cálculo: `[Analytics] Event tracked: vlsm_calculation`

3. **Verifica que estás en el dominio correcto**:

   - Analytics NO funciona en `localhost`
   - Debe estar en `luxury-dango-9d7cff.netlify.app` o tu dominio personalizado

4. **Revisa ad-blockers**:

   - Algunos bloqueadores de anuncios bloquean Google Analytics
   - Prueba en modo incógnito o desactiva bloqueadores

5. **Espera 24-48 horas**:
   - Algunos informes en GA4 toman tiempo en procesarse
   - Los datos en tiempo real deberían aparecer inmediatamente

### Los eventos personalizados no aparecen

1. **Verifica que gtag esté cargado**:

   ```javascript
   // En la consola del navegador:
   typeof gtag;
   // Debería retornar: "function"
   ```

2. **Revisa la configuración de eventos en GA4**:

   - Ve a **Configure > Events** en GA4
   - Los eventos personalizados deberían aparecer automáticamente después de ser enviados

3. **Verifica el código fuente**:
   - Asegúrate de que los imports de `analytics.js` estén correctos en `main.js`

---

## 📈 Próximos pasos

Una vez configurado y funcionando:

1. **Configura conversiones**: Define qué eventos son "conversiones" importantes

   - Por ejemplo: `vlsm_calculation` podría ser una conversión

2. **Crea un dashboard personalizado**:

   - Combina métricas clave en un solo panel

3. **Configura alertas**:

   - Recibe notificaciones de cambios significativos en el tráfico

4. **Integra con Google Search Console**:
   - Ve qué términos de búsqueda llevan tráfico a tu app

---

## 🆘 Recursos adicionales

- [Documentación oficial de GA4](https://support.google.com/analytics/answer/10089681)
- [GA4 Event reference](https://support.google.com/analytics/answer/9267735)
- [Curso gratuito de Google Analytics](https://analytics.google.com/analytics/academy/)

---

**¿Preguntas?** Revisa la [documentación del proyecto](../README.md) o abre un issue en GitHub.

---

**Última actualización**: Checkpoint 3 - Google Analytics Integration
