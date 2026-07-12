# Informar un problema

Un buen informe permite al mantenedor reproducir el problema en lugar de adivinar por un título. Abre informe de bug para un mal funcionamiento; reserva petición de función para capacidad nueva o decisión de producto. Un error de compatibilidad o regresión es un bug aunque también quieras una mejora amplia.

## Datos que incluir

- versión y fuente de PipePipe;
- versión Android y modelo;
- servicio y URL o consulta;
- endpoint YouTube seleccionado;
- sesión, país de contenido y VPN/proxy;
- pasos exactos, esperado, resultado real y hora aproximada;
- informe o crash log generado por PipePipe.

Para WebView, añade paquete/versión del proveedor y captura de **Implementación WebView** de Android. Para búsqueda, resultado esperado. Para reproducción, inicio, durante reproducción, cambio de calidad, volver a app o seek.

![Error de red PipePipe con acción REPORT](/screenshots/pipepipe-network-error-5.2.3-api36.png)

Cuando PipePipe ofrece **REPORT**, ábrelo antes de reintentar o borrar datos. La
página generada contiene servicio, URL/petición, endpoint, idioma/país, versión y
detalles que fueron esenciales en correcciones SABR recientes. Quita u oculta una
URL privada, cookie, token, cuenta u otro dato sensible antes de compartirlo.

![Informe de error PipePipe generado](/screenshots/pipepipe-error-report-5.2.3-api36.png)

*Capturas de referencia: PipePipe 5.2.3 · Android 16/API 36. El error mostrado
es solo un ejemplo; informa los campos de tu propio fallo.*

## Escribe pasos ejecutables

Da acciones numeradas, no conclusiones. «Abrir URL, elegir MWeb, reproducir, seek a 01:00 y volver desde Inicio» se puede comprobar; «la reproducción está rota tras actualizar» no. Di si ocurre siempre y qué cambio único, si lo hay, modifica el resultado.

No ocultes contexto que cambia extracción: sesión, endpoint, país, UI experimental y VPN/proxy. Pero no pegues copia privada, cookie, token, IP, correo ni volcado de logs sin relación.

## Plantilla copiable

```text
### Entorno
Versión PipePipe y fuente:
Android / dispositivo:
Servicio y URL o consulta exacta:
Endpoint / sesión / país / VPN-proxy:

### Reproducción
1.
2.
3.

### Resultado esperado

### Resultado real

### Evidencia
Error exacto, hora aproximada, informe generado y captura segura:
```

## Mantén alcance pequeño

Una issue debe describir un síntoma reproducible. Dos informes separados de búsqueda y reproducción son más útiles que uno combinado, incluso si ambos comenzaron tras la misma actualización.

Antes de crearla, busca en issues recientes abiertas y cerradas el error exacto y versión actual. Añade evidencia a una existente si el síntoma es igual; crea una nueva si servicio, desencadenante o ruta de error son materialmente distintos.
