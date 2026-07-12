# Descargas

## Antes de informar un fallo

Anota servicio y URL, formato/resolución, carpeta o proveedor de documentos, espacio disponible, sesión y momento del fallo: antes, durante o al unir audio/vídeo. Di también si es descarga solo audio, solo vídeo o vídeo+audio unidos: no fallan en el mismo punto.

## Distinguir los casos

- Un vídeo que reproduce pero no descarga puede ser problema de descargador o formato.
- Un archivo incompleto necesita tamaño final, formato y punto de parada.
- Un fallo de almacenamiento necesita Android y destino: interno, SD o proveedor de documentos.
- Pedir miniatura para un audio es una función, no un bug de reproducción.

![Ajustes de descarga PipePipe, 5.2.3 en Android 16](/screenshots/pipepipe-download-5.2.3-api36.png)

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. Las carpetas de vídeo/audio son destinos finales; no representan espacio temporal interno.*

La carpeta configurada es la ubicación **final**. Los archivos temporales de trabajo pueden usar todavía el almacenamiento interno de PipePipe y se eliminan al completar. Por tanto, «está seleccionada mi SD» no demuestra que hubiese almacenamiento interno temporal suficiente. Informa espacio libre interno *y* de destino, y si el fallo ocurre antes de aparecer el archivo final.

::: warning
No actives una opción experimental de YouTube/SABR solo para forzar descargas. Un vídeo abierto con ella puede conservar metadatos de stream en caché un tiempo tras desactivarla. Para diagnosticarlo, desactívala, fuerza el cierre completo de PipePipe, abre el vídeo de nuevo (o espera que caduque la caché) y prueba una vez. Indica compilación y ajuste exactos.
:::

Las descargas HLS/en directo pueden tener límites distintos de los streams progresivos. No llames «MP4 corrupto» a algo sin formato elegido y error exacto de la fase de descarga.

No borres el único archivo parcial útil antes de anotar su error.

## Plantilla de informe

```text
Servicio y URL:
Versión PipePipe / Android:
Formato de audio/vídeo y resolución:
Destino final (interno / SD / proveedor de documentos):
Espacio libre interno / destino:
Fase del fallo (inicio / transferencia / unión / mover al destino):
Mensaje exacto y ¿reproduce el mismo elemento?:
Sesión y ajustes experimentales relevantes:
```
