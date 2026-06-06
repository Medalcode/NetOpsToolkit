# 🤖 AI Assistant (Guía BYOK)

NetOpsToolkit ahora cuenta con un asistente de inteligencia artificial a nivel **CCIE** potenciado por Google Gemini.

Dado que la aplicación es 100% sin servidor (Serverless), no existe un backend centralizado para ocultar claves de API. Por lo tanto, utilizamos el modelo **Bring Your Own Key (BYOK)** para asegurar tu privacidad.

## Pasos para configurar tu IA

1. **Obtén tu API Key**:
   Ve a [Google AI Studio](https://aistudio.google.com/) y genera una API Key gratuita. (Asegúrate de no compartir esta clave con nadie).
   
2. **Ingrésala en la App**:
   - En NetOpsToolkit, ve al ícono de engranaje (Settings) en la barra de navegación superior.
   - Pega tu API Key y guarda los cambios.
   
3. **Privacidad Total**:
   - La API Key se guarda **exclusivamente** en el `localStorage` de tu navegador.
   - Jamás se envía a servidores de terceros, excepto directamente a los servidores de Google (`generativelanguage.googleapis.com`) desde tu propia PC.
   - Tu código/configuraciones de red enviadas al chat solo se mandan al endpoint de Gemini.

## Casos de Uso del AI Assistant
- **Troubleshooting**: Pégale el output de un `show ip bgp summary` o `show ip ospf neighbor` y pídele que encuentre por qué las adyacencias no suben.
- **Auditoría de Diseño**: Pídele sugerencias arquitectónicas (Ej. *"¿Debería usar iBGP o OSPF en esta topología leaf-spine?"*).
- **Scripts**: Pídele scripts de Python (`netmiko` o `napalm`) para automatizar el backup de tus equipos.
