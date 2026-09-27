# Landing Pupganics → Tiendanube

Réplica de las secciones de la landing de Shopify (`pupganics.online/products/pupganics-apoyo-articular`) para pegar en la descripción del producto en Tiendanube. Incluye las correcciones de la auditoría.

## Archivos

| Archivo | Qué es |
|---|---|
| `tiendanube-descripcion.html` | **El código para copiar y pegar.** Las imágenes cargan desde el CDN de Shopify. |
| `preview.html` | Vista previa con las imágenes locales (abrir en el navegador). |
| `assets/` | Todas las imágenes (WebP optimizado) y el video, para re-subirlas a Tiendanube. |
| `build.py` | Genera los dos HTML. Si cambiás las URLs de las imágenes en `IMG_CDN`, corré `python build.py`. |

## Cómo pegarlo

1. Tiendanube → **Productos** → tu producto → **Descripción**.
2. En el editor, tocá el botón **`<>`** (código HTML).
3. Borrá lo que haya, pegá todo `tiendanube-descripcion.html` y guardá.
4. En **Mi tienda → Diseño → Tipografía**, elegí **Poppins** (es la del tema original).

Todo el estilo va inline (sin `<style>` ni `<script>`), porque el editor de Tiendanube los elimina.

## Imágenes: importante

Hoy las imágenes se sirven desde `cdn.shopify.com`. **Si cerrás la tienda de Shopify, dejan de verse.** Antes de cerrarla:
subí cada archivo de `assets/` desde el editor de Tiendanube (botón de imagen), copiá la URL que te da y reemplazala en `IMG_CDN` dentro de `build.py`, o directo en el HTML.

**Video:** si el editor elimina la etiqueta `<video>`, subilo a YouTube (no listado) y reemplazalo por el `<iframe>` de YouTube.

## Lo que va en la configuración de Tiendanube (no en el HTML)

- **Nombre del producto:** `Pupganics™ Masticables para Articulaciones y Movilidad`.
- **Packs** (reemplazan a Kaching): variante "Cantidad" con estas opciones:
  - 1 frasco → $39.900, precio tachado $59.900
  - 2 frascos → $59.990, precio tachado $119.800
  - 4 frascos → $79.900, precio tachado $239.600
- **Envío gratis** en 2 y 4 frascos: Marketing → Promociones / envío gratis por producto o variante.
- **Páginas obligatorias:** política de devoluciones con la garantía de 90 días, y el **Botón de arrepentimiento** (Tiendanube lo trae, activalo).
- **Barra de anuncios:** sin "Primer Aniversario". Por ejemplo: `🚚 Envío GRATIS en packs x2 y x4 | Hasta 67% OFF`.

## Correcciones aplicadas

- Pesos en **kg**: hasta 11 · 11–23 · 23–34 · más de 34 kg.
- Frasco = **30 masticables**, igual que en los packs. ⚠️ **Confirmar con el frasco real.** Si trae 28, cambialo en `build.py` (porción diaria y FAQ).
- Afirmaciones de salud suavizadas: "ayuda a", "acompaña", "apoya", en lugar de "sana", "reconstruye", "detiene" o "bloquea".
- Sacados los testimonios que sugerían dejar la medicación o reemplazar al veterinario (Christaline, Tom R.), y el de "resultados al día 3", que contradecía la rutina de 90 días (Miguel).
- Sin fechas en los testimonios. Una sola cifra de prueba social: "+1.240 dueños".
- Sacado el bloque "4.9 / 233 reviews", que no tenía reseñas. Cuando tengas reseñas reales, usá la app de reseñas de Tiendanube.
- Sacada la infografía de porciones, que tenía lbs y "28 masticables" dentro de la imagen.
- **Nuevo:** franja de confianza (envío, despacho y garantía) y **Preguntas frecuentes**.
- **Pendiente:** reemplazar las 3 fotos de "Resultados reales" (son de internet) y los testimonios por fotos y reseñas reales de clientes argentinos.
