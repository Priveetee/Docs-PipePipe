# Reproducción YouTube, red e inicio de sesión

## `AntiBotException`

`Sign in to confirm you're not a bot` significa que YouTube restringe una petición anónima. No es una petición genérica de borrar caché o actualizar WebView. Prueba una vez más y luego otra red o salida VPN. Anota el endpoint de extracción de YouTube antes de informarlo.

Usa el mismo vídeo público en cada prueba. Anota país/salida de red y si el fallo es inmediato o aparece después de algunos streams. Un resultado que cambia solo con la red es evidencia útil; no publiques IP ni datos de cuenta.

## `Source error` o búfer

Estos mensajes no identifican una sola causa. Actualiza PipePipe, adjunta el informe generado e incluye URL, endpoint, sesión, país y estado de VPN/proxy. Di si falla al inicio, tras un tiempo fijo, al cambiar calidad, al volver a la app o tras seek.

Web y MWeb usan SABR en reproducción anónima. Probar otro endpoint puede ser un diagnóstico temporal; no prueba que endpoint inicial o WebView sean culpables.

### Prueba de reproducción controlada

1. Empieza con un vídeo público y anota endpoint.
2. Prueba una vez en red normal sin cambiar varios ajustes.
3. Si falla, repite una vez con el mismo vídeo y anota tiempo/posición.
4. Si procede, cambia solo una variable —red/salida VPN, endpoint o sesión— y vuelve a probar.
5. Adjunta informe generado y ambos resultados.

Así se separa un fallo de extracción repetible de un incidente aislado de red/sesión y se evita afirmar que cinco cambios fueron la solución.

## Reproducción con sesión

La sesión se reserva para bloqueos IP, contenido de edad/miembros o traducción automática de YouTube. Sus limitaciones actuales incluyen formatos AVC, sin descarga solo audio, sin retroceso en un directo ya iniciado y extracción menos predecible. Si falla después de iniciar sesión, prueba una vez sin sesión e informa ambos resultados.

No publiques cookies, tokens, correo de cuenta ni grabación del flujo de inicio. «Con sesión/sin sesión» y error visible bastan para el primer informe.

## El endpoint es evidencia, no un botón mágico

Un endpoint elige ruta de petición/extracción. Puede hacer aparecer o desaparecer un síntoma y debe anotarse, pero un endpoint que funciona una vez no prueba que los demás estén rotos. Indica endpoint por defecto, los probados y resultado para la misma URL. No mezcles pruebas de endpoint con una issue WebView salvo que aparezca el mensaje WebView exacto.

<div class="screenshot-callout" role="img" aria-label="Selector de endpoint YouTube con MWEB y Android VR resaltados">
  <img src="/screenshots/pipepipe-endpoint-picker-5.2.3-api36.png" alt="Selector de endpoint de extracción YouTube">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="70" y="995" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1025" r="42" /><text x="965" y="1025">1</text>
    <rect class="callout-box" x="70" y="1260" width="940" height="125" rx="24" />
    <circle class="callout-number" cx="965" cy="1290" r="42" /><text x="965" y="1290">2</text>
  </svg>
</div>

La issue cerrada [#2686](https://github.com/InfinityLoop1308/PipePipe/issues/2686)
es un ejemplo concreto: para un bloqueo IP informado, el mantenedor preguntó si
estaba seleccionado **Android VR (DASH)** y aconsejó probar PipePipe 5.2.3 con
**MWEB (SABR)**. En la captura, **1** es MWEB y **2** Android VR. Es una comparación controlada, no la promesa de que MWEB arregle
cualquier fallo de red o cuenta.

## Informe mínimo de reproducción

```text
URL de vídeo y servicio:
Versión PipePipe / Android:
Endpoint antes y durante el fallo:
Con sesión o sin sesión:
País de red / VPN o proxy:
Punto del fallo (inicio / tiempo / seek / calidad / volver a app):
Mensaje visible e informe generado:
Prueba de una variable y resultado:
```

## No confundir con WebView

El mensaje exacto **WebView unavailable** tiene su [guía propia](./webview). Un WebView reciente no excluye red o SABR, y `Source error` no prueba que WebView necesite actualizarse.
