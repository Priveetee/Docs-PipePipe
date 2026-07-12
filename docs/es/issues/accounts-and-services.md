# Cuentas y servicios

## Cuentas y cookies

Inicia sesión solo para una función que lo requiera. Para inicio/cierre de sesión, reCAPTCHA o cambio de cuenta, incluye servicio, Android, endpoint, pantalla/resultado y efecto de borrar cookies WebView. Nunca publiques credenciales, cookies, tokens o exportación de cuenta.

Los controles no borran los mismos datos. Un informe sobre **Borrar cookie reCAPTCHA** debe nombrar esa acción y decir si aparece confirmación; **borrar cookies WebView** es una acción distinta de cuenta/WebView, con su propia confirmación posible. «Borré las cookies» no basta para reproducir.

Antes de borrar nada, anota el síntoma y el servicio. Borrar cookies cierra sesión o elimina estado de desafío: es un reinicio de diagnóstico, no una solución universal. Después prueba exactamente la misma URL.

![Ajustes de cuenta PipePipe, 5.2.3 en Android 16](/screenshots/pipepipe-account-5.2.3-api36.png)

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. Distingue entradas de servicios y la acción **Borrar cookies WebView**.*

## Informes específicos por servicio

Identifica siempre el servicio: un endpoint YouTube no explica un fallo de BiliBili o NicoNico. Incluye URL y estado de sesión del servicio.

## Contenido restringido

Para contenido YouTube de edad o miembros, indica si la sesión está activa y si la cuenta debería poder acceder, sin revelar datos personales.

Iniciar sesión no garantiza que desaparezca un problema de extractor/upstream. Si un vídeo restringido y la traducción automática fallan tras iniciar sesión correctamente, informa sus comportamientos respectivos con URL y error visible: no demuestra que la cuenta sea inválida.
