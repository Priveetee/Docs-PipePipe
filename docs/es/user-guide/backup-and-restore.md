# Copia de seguridad y restauración

PipePipe guarda su base de datos en el dispositivo. Una copia puede incluir
suscripciones, historial, listas, posiciones de reproducción y ajustes. Conserva
una exportación antes de restablecer, migrar o probar una versión preliminar.

## Crear una copia de seguridad

1. Abre **Ajustes → Copia de seguridad**.
2. Selecciona **Exportar base de datos**.
3. Elige una ubicación que puedas encontrar de nuevo y completa el selector de archivos Android.
4. Copia el archivo fuera del dispositivo si la copia es importante.

<div class="screenshot-callout" role="img" aria-label="Pantalla Copia de seguridad PipePipe con Import database y Export database resaltados">
  <img src="/screenshots/pipepipe-backup-5.2.3-api36.png" alt="Ajustes de copia de seguridad PipePipe, 5.2.3 en Android 16">
  <svg viewBox="0 0 1080 2340" aria-hidden="true">
    <rect class="callout-box" x="25" y="300" width="1030" height="225" rx="28" />
    <circle class="callout-number" cx="990" cy="330" r="42" /><text x="990" y="330">1</text>
    <rect class="callout-box" x="25" y="545" width="1030" height="180" rx="28" />
    <circle class="callout-number" cx="990" cy="575" r="42" /><text x="990" y="575">2</text>
  </svg>
</div>

*Captura de referencia: PipePipe 5.2.3 · Android 16/API 36. **1** importa y puede reemplazar datos locales; **2** crea primero la exportación de recuperación.*

::: warning Una copia puede contener datos personales de reproducción
Trata la exportación como un archivo privado. No la adjuntes a una issue pública
ni la envíes a alguien en quien no confíes.
:::

## Restaurar una copia de seguridad

1. Crea primero una exportación actual: la importación puede reemplazar historial,
   suscripciones, listas y, según la elección, ajustes.
2. Abre **Ajustes → Copia de seguridad → Importar base de datos**.
3. Selecciona el archivo y lee las opciones de importación antes de confirmar.
4. Reinicia PipePipe si Android o la aplicación te lo pide.

## Migrar a otra aplicación

PipePipe también puede exportar una copia en formato compatible con NewPipe. Usa
esa opción solo si la aplicación de destino documenta su compatibilidad; conserva
la exportación normal de PipePipe como copia de recuperación.
