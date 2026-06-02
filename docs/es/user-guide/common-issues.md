# Problemas Comunes

## Restricciones de Red y de YouTube

### AntiBotException: "Inicia sesión para confirmar que no eres un bot"
Se trata de un bloqueo del lado del servidor de YouTube. Ocurre cuando tu dirección IP queda marcada por "comportamiento anómalo" (demasiadas peticiones en poco tiempo, a menudo por culpa de NAT o de importar muchas suscripciones).

**Soluciones:**
1.  **Cambia tu IP:** Pasa de Wi-Fi a datos móviles, o reinicia tu router para obtener una nueva IP dinámica.
2.  **Usa una VPN:** Recomendamos usar un servicio de alta calidad como [Proton VPN](https://protonvpn.com/).
    *   *Nota: No estamos afiliados a este servicio; esta recomendación se basa en pruebas de la comunidad que muestran su fiabilidad.*
3.  **Cambia de región:** Si usas una VPN y sigues recibiendo el error, simplemente cambia el servidor a otro país. Esto proporciona una nueva IP que probablemente no esté marcada por YouTube.
4.  **Orbot (Tor):** Usar [Orbot](https://orbot.app/) te permite rotar por distintos nodos de salida de todo el mundo hasta que se supera el bloqueo.
5.  **Inicio de sesión:** Iniciar sesión en tu cuenta de YouTube dentro de PipePipe sigue siendo una forma estable de evitar esta excepción si no quieres usar una VPN.

## Reproducción de Vídeo: "La página necesita recargarse"

Este es actualmente el problema más reportado. Los usuarios ven un popup o un registro de error que dice: `org.schabi.newpipe.extractor.exceptions.ContentNotAvailableException: The page needs to be reloaded.`

### ¿Por qué ocurre esto?
YouTube realiza con frecuencia "pruebas A/B" sobre la lógica de su reproductor. Esto significa que cambian la forma en que se envían los datos de vídeo al cliente. Como PipePipe es un "envoltorio" que extrae esos datos, cualquier cambio del lado de YouTube puede romper el proceso de extracción.

### La solución (Versión 4.7.8+)
El desarrollador ya ha publicado una corrección en la **versión 4.7.8**. Sin embargo, muchos usuarios siguen experimentando el fallo por la forma en que actualizan la app.

### Resolución paso a paso

1. **Verifica tu versión actual**
   Ve a `Ajustes > Acerca de` en PipePipe. Si ves la versión **4.7.7** o inferior, te afecta este fallo.

2. **El retraso de F-Droid**
   Si instalaste PipePipe a través de F-Droid, quizá notes que la 4.7.8 aún no está disponible. F-Droid tarda unos **7 días** en revisar y publicar las nuevas versiones.

   ::: tip Solución
   Consulta nuestra [Guía de Instalación](/es/user-guide/installation) para aprender a instalar actualizaciones de inmediato con Obtainium o GitHub.
   :::

3. **Actualizar de inmediato**
   Para corregir el error ahora mismo, no esperes a F-Droid. Descarga el APK directamente desde las [Releases oficiales de GitHub](https://github.com/InfinityLoop1308/PipePipe/releases).

### Cómo evitar esto en el futuro
Para no quedar bloqueado durante una semana cada vez que YouTube hace un cambio, la comunidad recomienda usar **Obtainium**. Esta herramienta sigue el repositorio de GitHub directamente y proporciona actualizaciones en el minuto en que el desarrollador pulsa "Publicar", evitando por completo el retraso de F-Droid.

### La aplicación no se instala
Asegúrate de que tu dispositivo cumple los [Requisitos del Sistema](/es/user-guide/installation#requisitos-del-sistema).

## Android Auto

### PipePipe no aparece en Android Auto
Como PipePipe no está disponible en la Google Play Store, Android Auto lo oculta por defecto por razones de seguridad.

**Solución:**
1.  Abre los ajustes de **Android Auto** en tu teléfono.
2.  Desplázate hasta el final y toca la sección **Versión** 10 veces hasta que un popup diga "Modo de desarrollador activado".
3.  Toca los tres puntos (menú) en la esquina superior derecha y selecciona **Ajustes de desarrollador**.
4.  Desplázate hacia abajo y marca la casilla de **Fuentes desconocidas**.
5.  Reinicia Android Auto (o desconecta y vuelve a conectar tu teléfono al coche).

## Interfaz y Reproductor

### Falta la barra del reproductor minimizado o la opción "Encolar"
A veces, al iniciar un vídeo directamente en modo segundo plano o popup, la barra del reproductor de la parte inferior no aparece, lo que hace imposible gestionar tu cola.

**Solución:**
*   Esto fue un fallo importante corregido en la **versión 4.7.2**.
*   Si sigues viéndolo, confirma que estás en una versión desactualizada. Por favor, actualiza al menos a la **4.7.8** usando los métodos descritos en la [Guía de Instalación](/es/user-guide/installation).

### El vídeo se queda en búfer y luego se cierra
Si tu vídeo empieza de repente a almacenar en búfer y la app acaba cerrándose (común en dispositivos Xiaomi/MIUI), es probable que sea un problema de sincronización de hardware.

**Solución:**
1.  Ve a **Ajustes > Avanzado > Ajustes de ExoPlayer**.
2.  Activa la opción **Usar siempre el workaround del ajuste de superficie de salida de vídeo de ExoPlayer**.
3.  Reinicia la aplicación.
4.  Si sigue ocurriendo, se recomienda reiniciar el dispositivo por completo.

### Cierre al reproducir vídeos descargados
Si PipePipe se cierra cuando intentas abrir un archivo descargado, suele ser un conflicto de permisos con tu reproductor de vídeo externo.

**Solución:**
*   **Permisos:** Asegúrate de que tu app de reproductor de vídeo tiene concedidos los permisos de "Archivos y multimedia" en los Ajustes de Android.
*   **Reproductor recomendado:** Usa un reproductor robusto como **VLC** o **Just (Video) Player**. Gestionan el Scoped Storage de Android mejor que muchas apps de galería de fábrica.
*   **Alternativa:** En lugar de reproducir desde PipePipe, prueba a abrir el vídeo directamente desde el Gestor de Archivos de tu teléfono.
