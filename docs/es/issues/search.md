# Búsqueda y descubrimiento

La búsqueda es una operación de extractor, no de reproducción. No se debe asumir que una corrección de reproductor o WebView arreglará una búsqueda vacía.

Hay síntomas distintos: error de petición; resultados vacíos para una consulta pública normal; falta un resultado esperado; resultados en idioma/país inesperado; filtro, pestaña o continuación incorrectos. Los dos últimos pueden ser datos del servicio o localización, no un fallo al enviar la consulta.

## Antes de informar

Prueba una consulta pública simple y anota:

- servicio (YouTube, BiliBili, NicoNico u otro);
- consulta exacta y un resultado esperado;
- país de contenido por defecto;
- endpoint YouTube si buscas en YouTube;
- sesión, UI experimental y VPN/proxy.

Adjunta informe generado si PipePipe lo ofrece. Si falla solo a veces, da hora y si es vacío, irrelevante o parcialmente ausente. Para un elemento ausente, añade URL pública y si abrir canal/página directamente funciona. Para idioma inesperado, añade idiomas de app y Android. Para filtro/pestaña, anota filtro y si cambió antes o después de la consulta.

## Una consulta, una comparación

No uses una consulta privada larga ni una página de tendencias cambiante. Usa una frase pública corta, cópiala exactamente e identifica un resultado público esperado. Si comparas endpoint o red, cambia solo una variable conservando servicio/consulta/país.

## Mantén el informe separado

No añadas una queja de búsqueda a una issue de reproducción o WebView: el mantenedor debe examinar otra petición y ruta de respuesta.

## Plantilla de búsqueda

```text
Servicio y consulta exacta:
Resultado público esperado (URL si es posible):
Resultado observado (vacío / ausente / incorrecto / error):
Versión PipePipe / Android:
País de contenido / idioma app / idioma Android:
Endpoint YouTube, sesión, UI experimental, VPN/proxy:
Hora de prueba e informe generado:
```
