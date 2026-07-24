# Reproducción YouTube, red e inicio de sesión

## Fallan todos los vídeos de YouTube: comprueba el filtrado DNS

Si todos los vídeos públicos de YouTube fallan casi de inmediato, consulta el
informe generado por PipePipe antes de cambiar el endpoint de extracción,
reinstalar la aplicación o actualizar WebView.

### Paso 1: confirma la firma DNS

Si PipePipe muestra **Network error**, pulsa **REPORT**:

<div class="screenshot-callout" role="img" aria-label="Botón Report resaltado en la pantalla Network error de PipePipe">
  <img src="/screenshots/pipepipe-network-error-5.2.4-api36.png" alt="Pantalla Network error de PipePipe con los botones Report y Retry">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="395" y="990" width="320" height="205" rx="28" />
    <path class="callout-arrow" d="M 810 920 C 780 955, 740 1005, 690 1050" />
    <circle class="callout-number" cx="830" cy="900" r="42" /><text x="830" y="900">1</text>
  </svg>
</div>

En la página **Error report**, pulsa el icono de compartir para copiar el texto
generado en una nota local y busca dentro de ese texto:

<div class="screenshot-callout" role="img" aria-label="Botón de compartir resaltado en la pantalla Error report de PipePipe">
  <img src="/screenshots/pipepipe-error-report-5.2.4-api36.png" alt="Pantalla Error report de PipePipe con el botón de compartir">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="935" y="55" width="135" height="165" rx="24" />
    <path class="callout-arrow" d="M 880 285 C 915 250, 950 210, 985 170" />
    <circle class="callout-number" cx="850" cy="310" r="42" /><text x="850" y="310">2</text>
  </svg>
</div>

*Estas pantallas muestran PipePipe 5.2.4 en Android 16. El fallo de red
controlado solo sirve para localizar los botones; usa el texto de tu propio
informe para el diagnóstico.*

Busca `googleapis.com` y `google.com` en el informe. Estas formas identifican un
bloqueo DNS o de red local:

```text
jnn-pa.googleapis.com/0.0.0.0:443
jnn-pa.googleapis.com/127.0.0.1:443
localhost/127.0.0.1:...
```

::: warning La petición nunca llegó a Google
`0.0.0.0`, `127.0.0.1` y `localhost` apuntan al propio dispositivo en vez de al
servicio real. PipePipe no puede evitar esa redirección cambiando de endpoint.
:::

![Cómo el filtrado DNS detiene la reproducción de YouTube](/diagrams/dns-filtering.png)

### Paso 2: encuentra el filtro responsable

Comprueba estas capas una por una:

1. **DNS privado de Android:** abre **Ajustes → Redes e Internet → DNS
   privado**. En Samsung, la ruta habitual es **Ajustes → Conexiones → Más
   ajustes de conexión → DNS privado**. Anota el proveedor seleccionado y
   consulta su panel o registro de consultas.
2. **VPN o filtro local:** revisa el registro de peticiones bloqueadas de la
   VPN, bloqueador de anuncios, cortafuegos o aplicación DNS mientras vuelves a
   probar el vídeo.
3. **Router o DNS autoalojado:** revisa el registro y la lista de permitidos del
   router, Pi-hole, AdGuard Home, NextDNS o servicio equivalente.
4. **Dispositivo rooteado o ROM personalizada:** comprueba si el archivo hosts
   redirige un dominio necesario a `0.0.0.0` o `127.0.0.1`.

<div class="screenshot-callout" role="img" aria-label="Fila DNS privado resaltada en los ajustes de Redes e Internet de Android">
  <img src="/screenshots/android-network-private-dns-api36.png" alt="Ajustes de Redes e Internet de Android con la fila DNS privado">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="35" y="1700" width="1010" height="225" rx="28" />
    <path class="callout-arrow" d="M 970 1640 C 925 1670, 900 1710, 865 1760" />
    <circle class="callout-number" cx="985" cy="1620" r="42" /><text x="985" y="1620">3</text>
  </svg>
</div>

**3.** Abre **DNS privado**. Esta página también muestra si hay una VPN activa.

<div class="screenshot-callout" role="img" aria-label="Diálogo del modo DNS privado de Android resaltado">
  <img src="/screenshots/android-private-dns-api36.png" alt="Diálogo del modo DNS privado de Android">
  <svg viewBox="0 0 1080 2400" aria-hidden="true">
    <rect class="callout-box" x="105" y="805" width="860" height="410" rx="28" />
    <path class="callout-arrow" d="M 965 705 C 920 730, 900 775, 865 835" />
    <circle class="callout-number" cx="980" cy="690" r="42" /><text x="980" y="690">4</text>
  </svg>
</div>

**4.** Anota el modo o proveedor activo. Si está seleccionado un nombre de host
de proveedor, abre el panel y el registro de consultas de ese servicio. El modo
**Automatic** no descarta un filtro en el router o en otra parte de la red.

*Las capturas muestran Android 16 en inglés. Los nombres y las rutas pueden
variar según el fabricante.*

### Paso 3: permite las familias de dominios necesarias

PipePipe necesita actualmente:

- `googleapis.com` y todos sus subdominios, incluidos
  `jnn-pa.googleapis.com` y `youtubei.googleapis.com`;
- `google.com` y todos sus subdominios.

Añade ambas familias a la lista de permitidos del componente encontrado en el
paso 2. La sintaxis depende de la herramienta: puede usar el dominio base, un
comodín como `*.googleapis.com` o su propia regla. Configura esta lista en lugar
de desactivar permanentemente todo el filtrado. Permitir solo el host visible
hoy puede no cubrir otro host que YouTube use más adelante.

::: info Por qué PipePipe necesita estas direcciones
El cliente actual contacta con `jnn-pa.googleapis.com` para preparar la prueba
necesaria para la reproducción protegida, mientras que el extractor usa
`youtubei.googleapis.com` para solicitar información de YouTube. Si el DNS
devuelve cualquiera de estas direcciones al teléfono, el intercambio se detiene
antes de la reproducción. Esto **no** requiere los servicios de Google Play.
:::

### Paso 4: vuelve a conectarte y verifica la solución

1. Vuelve a conectar el Wi-Fi o activa brevemente el modo avión para descartar
   resultados DNS antiguos.
2. Fuerza la detención de PipePipe y vuelve a abrirlo.
3. Reintenta el mismo vídeo público.
4. Genera un informe nuevo y confirma que el host necesario ya no resuelve a
   `0.0.0.0`, `127.0.0.1` o `localhost`.

Una prueba temporal con datos móviles u otra red sin filtros puede confirmar el
diagnóstico. No es una recomendación para dejar desactivada la protección.

El aviso fijado [#2757](https://github.com/InfinityLoop1308/PipePipe/issues/2757)
documenta las familias de dominios necesarias. En
[#2712](https://github.com/InfinityLoop1308/PipePipe/issues/2712), permitir
`jnn-pa.googleapis.com` restauró la reproducción.
[#2750](https://github.com/InfinityLoop1308/PipePipe/issues/2750) contiene la
misma firma `0.0.0.0`/localhost.

### Si el informe muestra una dirección pública real

Un error `ENETUNREACH`, un tiempo de espera agotado o un fallo de conexión a una
IP pública real es distinto: el DNS no redirigió el host localmente. Continúa
con la prueba de red controlada de abajo y anota VPN, ISP, país, endpoint y error
exacto en vez de añadir excepciones DNS no relacionadas.

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
DNS privado / bloqueador / cortafuegos y host bloqueado, si lo hay:
Punto del fallo (inicio / tiempo / seek / calidad / volver a app):
Mensaje visible e informe generado:
Prueba de una variable y resultado:
```

## No confundir con WebView

El mensaje exacto **WebView unavailable** tiene su [guía propia](./webview). Un WebView reciente no excluye red o SABR, y `Source error` no prueba que WebView necesite actualizarse.
