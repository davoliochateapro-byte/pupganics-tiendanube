"""Genera la descripción HTML de Pupganics para Tiendanube.

Todo el CSS va inline (el editor de Tiendanube elimina <style> y <script>),
mobile-first en una sola columna.

Uso:
    python build.py            # tiendanube-descripcion.html (imágenes desde CDN) + preview.html (assets locales)

Para cambiar dónde están alojadas las imágenes, editá IMG_CDN (URL de cada archivo
una vez subido a Tiendanube) y volvé a correr el script.
"""

from pathlib import Path

HERE = Path(__file__).parent
SHOPIFY = "https://cdn.shopify.com/s/files/1/1017/9448/0445/files/"

# archivo local -> URL pública actual (CDN de Shopify, con resize a 800px)
IMG_CDN = {
    "00-intestino-articulacion.mp4": "https://cdn.shopify.com/videos/c/o/v/ad8c49591e4f4dbea2fb7e122f8b8559.mp4",
    "02-ing-aceite-salmon.webp": SHOPIFY + "Salmon_oil_and_fresh_fillet_display.png?width=400",
    "03-ing-probioticos.webp": SHOPIFY + "Untitled_design_-_2026-04-13T195118.642.png?width=400",
    "04-ing-vita-coq10.webp": SHOPIFY + "Untitled_design_-_2026-04-13T195151.069.png?width=400",
    "05-ing-glucosamina-msm.webp": SHOPIFY + "Untitled_design_-_2026-04-13T195139.091.png?width=400",
    "06-ing-quercetina.webp": SHOPIFY + "Untitled_design_-_2026-04-18T224911.545.png?width=400",
    "07-beneficios-secundarios.webp": SHOPIFY + "Active_pup_with_health_icons.png?width=800",
    "08-semana-1.webp": SHOPIFY + "ChatGPT_Image_Apr_13_2026_07_08_42_PM.png?width=800",
    "09-semana-3.webp": SHOPIFY + "ChatGPT_Image_Apr_13_2026_07_08_51_PM.png?width=800",
    "10-semana-6.webp": SHOPIFY + "ChatGPT_Image_Apr_13_2026_07_08_54_PM.png?width=800",
    "11-semana-12.webp": SHOPIFY + "ChatGPT_Image_Apr_13_2026_07_22_49_PM.png?width=800",
    "12-resultado-1.webp": SHOPIFY + "8de2fcfe14f9f6811780fd16d397d2ad9fd8d378-1512x1512.webp?width=800",
    "13-resultado-2.webp": SHOPIFY + "first-time-beagle-owner-tips-for-dealing-with-puppies-please-v0-8iimt0d0dx7e1.webp?width=800",
    "14-resultado-3.webp": SHOPIFY + "9l8pd4d67a121.webp?width=800",
    "15-porcion-1.webp": SHOPIFY + "Untitled_design_-_2026-08-01T165736.482.png?width=200",
    "16-porcion-2.webp": SHOPIFY + "Untitled_design_-_2026-08-01T165755.212.png?width=200",
    "17-porcion-3.webp": SHOPIFY + "Untitled_design_-_2026-08-01T165806.903.png?width=200",
    "18-porcion-4.webp": SHOPIFY + "ChatGPT_Image_Sep_7_2026_04_38_00_AM.png?width=200",
    "19-garantia.webp": SHOPIFY + "Screenshot_2026-04-06_181131.png?width=600",
}

# Paleta y tipografía del tema original (Shrine Pro)
BLUE = "#235FB4"
NAVY = "#0B1128"
TEXT = "#5b6472"
MUTED = "#8892a0"
CARD = "#f6f9fd"
FONT = "font-family:Poppins,Arial,sans-serif;"

WRAP = f"{FONT}max-width:600px;margin:0 auto;padding:48px 20px;box-sizing:border-box;"
EYEBROW = f"text-align:center;color:{BLUE};font-weight:800;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;"
H2 = f"text-align:center;font-size:26px;line-height:1.25;font-weight:800;color:{NAVY};margin:0 0 12px;"
SUB = f"text-align:center;color:{TEXT};font-size:16px;line-height:1.5;margin:0 auto 32px;"
CARD_BOX = f"background:{CARD};border-radius:16px;"
H3 = f"font-size:16px;font-weight:800;color:{NAVY};margin:0 0 8px;"
P = f"font-size:14px;color:{TEXT};line-height:1.5;margin:0;"
CIRCLE = f"border-radius:50%;background:{BLUE};color:#fff;font-weight:800;text-align:center;"


def build(src):
    def img(name, alt, style):
        return f'<img src="{src(name)}" alt="{alt}" loading="lazy" style="{style}">'

    out = []
    add = out.append

    # ---------- Hero: bullets debajo del botón de compra ----------
    add(f'<div style="{FONT}max-width:600px;margin:0 auto;padding:4px 0 8px;">')
    add(f'<p style="font-size:14px;font-weight:700;color:#1c2430;margin:0 0 10px;">⭐⭐⭐⭐⭐ +1.240 dueños confían en Pupganics</p>')
    add(f'<p style="font-size:13px;font-weight:700;color:{BLUE};margin:0 0 10px;">Una fórmula que actúa en el eje intestino-articulación</p>')
    for b in [
        "Apoya el amortiguamiento del cartílago y el confort articular",
        "Cuida el intestino para que los nutrientes lleguen a la articulación",
        "Ayuda a disminuir la rigidez diaria",
        "Favorece un movimiento más fácil y menos días difíciles",
    ]:
        add(f'<p style="margin:0 0 10px;font-size:15px;line-height:1.45;color:#1c2430;padding-left:24px;text-indent:-24px;">'
            f'<span style="color:{BLUE};font-weight:800;display:inline-block;width:24px;text-indent:0;">✔</span>{b}</p>')

    # Ofertas en cantidad (réplica visual del selector de Shopify/Kaching).
    # Tiendanube borra <script> de la descripción, así que esto NO es clickeable:
    # la compra real se hace con el desplegable "Cantidad" nativo, arriba del todo.
    add(f'<p style="text-align:center;font-size:11px;color:{MUTED};margin:14px 0 12px;">👆 Elegí tu pack en el menú "Cantidad" de arriba</p>')

    def offer_card(active, badge, title, units, price, compare, sub, bonuses):
        border = f"border:2px solid {BLUE};" if active else "border:1px solid #e1e6ee;"
        if active:
            radio = (f'<div style="width:18px;height:18px;border-radius:50%;background:{BLUE};'
                     f'box-shadow:inset 0 0 0 3px #fff,0 0 0 2px {BLUE};"></div>')
        else:
            radio = '<div style="width:18px;height:18px;border-radius:50%;border:2px solid #c7cfdb;"></div>'
        badge_html = (f'<span style="position:absolute;top:-11px;right:14px;background:{NAVY};color:#fff;'
                      f'font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;">{badge}</span>' if badge else '')
        bonus_html = ''
        bg = BLUE if active else '#c7cfdb'
        for i, b in enumerate(bonuses):
            radius = 'border-radius:0 0 9px 9px;' if i == len(bonuses) - 1 else ''
            bonus_html += (f'<div style="background:{bg};color:#fff;font-size:12px;font-weight:700;'
                           f'padding:8px 16px;{radius}">+ {b}</div>')
        return (f'<div style="position:relative;{border}border-radius:10px;margin:0 0 14px;">'
                '<table role="presentation" style="width:100%;border-collapse:collapse;"><tr>'
                f'<td style="width:34px;padding:14px 0 14px 16px;vertical-align:middle;">{radio}</td>'
                '<td style="padding:14px 8px;vertical-align:middle;">'
                f'<span style="font-size:15px;font-weight:800;color:{NAVY};">{title}</span> '
                f'<span style="display:inline-block;background:{CARD};color:{BLUE};font-size:11px;font-weight:700;'
                f'padding:2px 8px;border-radius:10px;margin-left:2px;white-space:nowrap;">{units}</span>'
                f'<div style="font-size:11px;color:{MUTED};margin-top:3px;">{sub}</div></td>'
                '<td style="padding:14px 16px 14px 0;text-align:right;vertical-align:middle;white-space:nowrap;">'
                f'<div style="font-size:15px;font-weight:800;color:{NAVY};">{price}</div>'
                f'<div style="font-size:12px;color:{MUTED};text-decoration:line-through;">{compare}</div></td>'
                f'</tr></table>{badge_html}{bonus_html}</div>')

    add('<div style="border-top:1px solid #e7ecf3;padding-top:16px;">')
    add(f'<p style="text-align:center;font-weight:800;font-size:13px;color:{NAVY};letter-spacing:0.3px;margin:0 0 14px;">Ofertas en cantidad</p>')
    add(offer_card(False, None, "Lleva 1", "30 gomitas", "$39.900,00", "$59.900,00", "Apoyo para 30 Días", []))
    add(offer_card(True, "Más Popular", "Oferta x2", "60 gomitas", "$59.990,00", "$119.800,00", "Apoyo para 2 meses",
                    ["E-Book sobre deficiencias nutricionales", "Envío GRATIS"]))
    add(offer_card(False, "Mejor Oferta", "Pack 4 Meses", "120 gomitas", "$79.900,00", "$239.600,00", "Apoyo para 4 Meses",
                    ["E-Book sobre deficiencias nutricionales", "Envío GRATIS"]))
    add('</div>')

    # Guía de porción + por qué les encanta (2 columnas, también en celular)
    add('<table role="presentation" style="width:100%;border-collapse:collapse;margin:16px 0 0;border-top:1px solid #e7ecf3;"><tr>')
    add(f'<td style="width:50%;vertical-align:top;text-align:center;padding:14px 9px 0 0;">'
        f'{img("16-porcion-2.webp", "Guía de porción diaria", "width:44px;height:44px;object-fit:contain;display:block;margin:0 auto 8px;")}'
        f'<span style="display:block;font-size:12px;font-weight:700;color:{NAVY};">Guía de porción diaria</span>'
        f'<span style="display:block;font-size:11px;color:{MUTED};margin-top:4px;line-height:1.4;">De 1 a 4 masticables por día según el peso (ver tabla abajo)</span></td>')
    add(f'<td style="width:50%;vertical-align:top;text-align:center;padding:14px 0 0 9px;">'
        f'<span style="display:block;font-size:12px;font-weight:700;color:{NAVY};">Por qué les encanta a los perros</span>'
        f'<span style="display:block;font-size:11px;color:{MUTED};margin-top:4px;line-height:1.4;">Caldo sabroso de res y pollo que los perros naturalmente adoran, en un masticable suave que van a querer todos los días.</span></td>')
    add('</tr></table>')

    # Franja de confianza (nueva)
    add(f'<div style="background:{CARD};border-radius:12px;padding:12px 14px;margin:16px 0 0;font-size:13px;line-height:1.7;color:#1c2430;">'
        '🚚 <b>Envío GRATIS</b> en packs de 2 y 4 frascos<br>'
        '📦 Despachamos en 24 a 72 hs hábiles<br>'
        '🛡️ <b>Garantía de 90 días</b> o te devolvemos el dinero</div>')
    add('</div>')

    # ---------- 1. Conexión intestino-articulación ----------
    add(f'<div style="{WRAP}">')
    add(f'<video src="{src("00-intestino-articulacion.mp4")}" autoplay muted loop playsinline '
        f'style="width:100%;display:block;margin:0 auto 32px;border-radius:16px;"></video>')
    add(f'<p style="{EYEBROW}">Por qué sigue pasando</p>')
    add(f'<h2 style="{H2}">La conexión intestino-articulación</h2>')
    add(f'<p style="{SUB}max-width:560px;">La incomodidad articular muchas veces empieza más profundo que la propia articulación.</p>')
    for icon, n, title, text in [
        ("🦠", 1, "Inflamación intestinal", "Un intestino desequilibrado puede favorecer la inflamación en todo el cuerpo."),
        ("🔄", 2, "El ciclo de la molestia", "Esa inflamación sostenida puede sumarse a la rigidez y la incomodidad articular."),
        ("🌱", 3, "Cuidá el intestino", "Los probióticos y los omega-3 ayudan a mantener un intestino equilibrado."),
        ("🦴", 4, "Articulaciones mejor acompañadas", "Con el intestino en equilibrio, la glucosamina y el MSM se aprovechan mejor."),
    ]:
        add(f'<div style="{CARD_BOX}padding:26px 20px;text-align:center;margin:0 0 20px;">'
            f'<div style="font-size:30px;line-height:1;margin-bottom:10px;">{icon}</div>'
            f'<div style="{CIRCLE}width:36px;height:36px;line-height:36px;font-size:15px;margin:0 auto 14px;">{n}</div>'
            f'<h3 style="{H3}">{title}</h3><p style="{P}">{text}</p></div>')
    add('</div>')

    # ---------- 2. Ingredientes (carrusel deslizable) ----------
    add(f'<div style="{WRAP}">')
    add(f'<h2 style="{H2}margin-bottom:32px;">Qué hay en cada porción</h2>')
    add('<div style="display:flex;gap:20px;overflow-x:auto;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;padding:6px 2px 16px;">')
    for f, alt, dose, title, text in [
        ("02-ing-aceite-salmon.webp", "Aceite de salmón", "95mg", "Aceite de salmón", "Omega-3 que ayuda a mantener una respuesta inflamatoria equilibrada."),
        ("03-ing-probioticos.webp", "Probióticos", "500M CFU patentados", "Probióticos (3 cepas)", "Contribuyen a un intestino sano para aprovechar mejor los nutrientes."),
        ("04-ing-vita-coq10.webp", "Vitamina A y CoQ10", "1000IU + 10mg", "Vit A + CoQ10", "Apoyan la energía celular y el mantenimiento de los tejidos."),
        ("05-ing-glucosamina-msm.webp", "Glucosamina y MSM", "200mg + 100mg", "Glucosamina + MSM", "Acompañan el cuidado del cartílago y el amortiguamiento de la articulación."),
        ("06-ing-quercetina.webp", "Quercetina dihidrato", "50mg", "Quercetina dihidrato", "Antioxidante natural que ayuda a mantener el confort articular."),
    ]:
        add(f'<div style="flex:0 0 240px;scroll-snap-align:start;{CARD_BOX}padding:22px;text-align:center;box-sizing:border-box;">'
            f'{img(f, alt, "width:90px;height:90px;object-fit:contain;display:block;margin:0 auto 14px;")}'
            f'<div style="color:{BLUE};font-weight:800;font-size:13px;letter-spacing:0.5px;margin-bottom:6px;">{dose}</div>'
            f'<h3 style="{H3}">{title}</h3><p style="{P}font-size:13px;">{text}</p></div>')
    add('</div>')
    add(f'<p style="text-align:center;font-size:12px;color:{MUTED};margin:4px 0 0;">Deslizá para ver todos los ingredientes →</p>')
    add('</div>')

    # ---------- 3. Beneficios secundarios ----------
    add(f'<div style="{WRAP}">')
    add(img("07-beneficios-secundarios.webp", "Perro activo con íconos de salud", "width:100%;display:block;border-radius:20px;margin:0 0 32px;"))
    add(f'<p style="{EYEBROW}text-align:left;">Beneficios secundarios</p>')
    add(f'<h2 style="{H2}text-align:left;font-size:24px;margin-bottom:14px;">Más que apoyo articular</h2>')
    add(f'<p style="{P}font-size:15px;margin:0 0 28px;">Pensado para acompañar el cuidado articular, mientras apoya los sistemas que influyen en cómo se mueve tu perro día a día.</p>')
    for title, text in [
        ("Absorción intestinal", "Un intestino más sano ayuda a que la glucosamina y el MSM se aprovechen mejor."),
        ("Respuesta inflamatoria equilibrada", "Ayuda a mantener el equilibrio que tu perro necesita para moverse cómodo todos los días."),
        ("Cuidado del cartílago", "La glucosamina y el MSM acompañan el amortiguamiento y ayudan a reducir la rigidez diaria."),
        ("Movilidad + movimiento", "Apoya paseos más completos, escaleras más fáciles y las ganas de volver a saltar."),
    ]:
        add('<table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 22px;"><tr>'
            f'<td style="width:48px;vertical-align:top;padding:0;"><div style="width:34px;height:34px;line-height:34px;border-radius:50%;background:#eaf1fb;color:{BLUE};text-align:center;font-weight:800;">✓</div></td>'
            f'<td style="vertical-align:top;padding:0;"><h3 style="{H3}margin-bottom:4px;">{title}</h3><p style="{P}">{text}</p></td></tr></table>')
    add('</div>')

    # ---------- 4. Rutina de 90 días ----------
    add(f'<div style="{WRAP}">')
    add(f'<h2 style="{H2}margin-bottom:10px;">La rutina de 90 días</h2>')
    add(f'<p style="{SUB}margin-bottom:36px;">Cambios graduales, no de la noche a la mañana.</p>')
    for f, alt, tag, text in [
        ("08-semana-1.webp", "Perro descansando cómodamente", "Semana 1", "La digestión se asienta y las heces tienden a normalizarse: la primera señal de que el intestino está respondiendo."),
        ("09-semana-3.webp", "Perro moviéndose con más libertad", "Semana 3", "La rigidez al levantarse empieza a ceder. Tu perro se mueve con un poco más de disposición después del descanso."),
        ("10-semana-6.webp", "Perro caminando afuera con más facilidad", "Semana 6", "El primer cambio visible de verdad. Los paseos se alargan, las escaleras se vuelven más fáciles y los quejidos se hacen menos frecuentes."),
        ("11-semana-12.webp", "Perro feliz y activo en casa", "Semana 12", "Las articulaciones se mantienen más cómodas, con menos días difíciles. Los resultados se sienten más estables y fáciles de sostener."),
    ]:
        add(f'<div style="{CARD_BOX}overflow:hidden;margin:0 0 20px;">'
            f'{img(f, alt, "width:100%;aspect-ratio:1/1;object-fit:cover;display:block;")}'
            f'<div style="padding:18px;"><span style="display:inline-block;background:{BLUE};color:#fff;font-size:11px;font-weight:800;letter-spacing:0.5px;padding:3px 10px;border-radius:20px;margin-bottom:10px;">{tag}</span>'
            f'<p style="{P}font-size:13px;">{text}</p></div></div>')
    add(f'<p style="text-align:center;font-weight:700;color:{NAVY};font-size:15px;margin:36px auto 0;">¿Sin mejora notoria al día 90? Te devolvemos el dinero.</p>')
    add(f'<p style="text-align:center;font-size:14px;color:{TEXT};margin:10px auto 0;">💡 El pack de 4 frascos es la forma más conveniente de sostener la rutina.</p>')
    add('</div>')

    # ---------- 5. Resultados reales ----------
    add(f'<div style="{WRAP}">')
    add(f'<h2 style="{H2}font-size:24px;margin-bottom:30px;">Resultados Reales De Verdaderos Papás Perrunos</h2>')
    for f in ["12-resultado-1.webp", "13-resultado-2.webp", "14-resultado-3.webp"]:
        add(img(f, "Perro de un cliente de Pupganics", f"width:100%;aspect-ratio:1/1;object-fit:cover;display:block;border-radius:16px;margin:0 0 20px;"))
    add(f'<p style="text-align:center;font-size:12px;color:{MUTED};margin:4px auto 0;">Algunos testimonios provienen de clientes que recibieron producto gratis o compensación a cambio de su reseña.</p>')
    add('</div>')

    # ---------- 6. Muro de testimonios ----------
    add(f'<div style="{WRAP}">')
    add(f'<h2 style="{H2}margin-bottom:8px;">Lo Que Dicen Los Papás Perrunos</h2>')
    add(f'<p style="text-align:center;color:{BLUE};font-weight:700;font-size:14px;margin:0 0 34px;">+1.240 dueños ya eligieron Pupganics</p>')
    for ini, name, title, text in [
        ("ME", "Melissa", "Realmente la ayudaron", "¡Los suplementos realmente han ayudado con la rigidez de mi perra! Y le encanta el sabor. No puede esperar a que llegue la \"hora de la vitamina\". 🙂"),
        ("NI", "Niko", "De verdad funciona", "Shady parece tener más energía y mejor movilidad desde que empezó hace unos dos meses... ahora que tiene 13 años, parece que el multivitamínico de verdad la está ayudando."),
        ("MD", "Marie D", "Llega siempre a tiempo", "El producto siempre llega a tiempo, ¡y a mi perra le encanta! Se mueve mucho mejor y ya no se queda a mitad de camino en los paseos."),
        ("LA", "Laura", "Hasta ahora todo muy bien", "Empecé con las vitaminas para mis tres perritos: menos rigidez para el Havanés después de dos semanas y mejor movimiento para el Doberman de 15 años. ¡Volveré a comprar!"),
        ("DL", "Dave L.", "Empresa fantástica", "No solo los productos son de una calidad fantástica, sino que el equipo detrás de ellos tiene un servicio al cliente increíble. No podría recomendarlos más."),
        ("ME", "Mel", "Diferencia visible en la movilidad", "A mis perros les encantan los multivitamínicos y mi perra mayor, que tiene 13 años, notablemente tiene más energía y sube las escaleras con menos rigidez."),
    ]:
        add(f'<div style="{CARD_BOX}border-radius:14px;padding:20px;margin:0 0 18px;">'
            '<table role="presentation" style="border-collapse:collapse;margin:0 0 10px;"><tr>'
            f'<td style="padding:0 10px 0 0;"><div style="{CIRCLE}width:34px;height:34px;line-height:34px;font-size:12px;">{ini}</div></td>'
            f'<td style="padding:0;"><div style="font-size:13px;font-weight:800;color:{NAVY};">{name}</div><div style="font-size:11px;color:#ffb800;letter-spacing:1px;">★★★★★</div></td></tr></table>'
            f'<h3 style="{H3}font-size:14px;margin-bottom:6px;">{title}</h3><p style="{P}font-size:13px;">{text}</p></div>')
    add('</div>')

    # ---------- 7. Por qué esta fórmula ----------
    add(f'<div style="{WRAP}">')
    add(f'<p style="{EYEBROW}">Por qué esta fórmula en específico</p>')
    add(f'<h2 style="{H2}margin-bottom:36px;">Diseñada diferente, con propósito</h2>')
    for title, text in [
        ("De adentro hacia afuera", "Construida alrededor de la conexión intestino-articulación, no solo para aliviar la molestia del momento."),
        ("Más de una función", "Apoya la salud intestinal, la respuesta inflamatoria, el cuidado del cartílago y la movilidad en un solo masticable diario."),
        ("Hecha para la constancia", "Diseñada para usarse todos los días, porque el verdadero cambio articular viene de mantener la rutina."),
    ]:
        add(f'<div style="text-align:center;padding:10px;margin:0 0 24px;">'
            f'<div style="{CIRCLE}width:44px;height:44px;line-height:44px;font-size:20px;margin:0 auto 16px;">✓</div>'
            f'<h3 style="{H3}">{title}</h3><p style="{P}">{text}</p></div>')
    add('</div>')

    # ---------- 8. Porción diaria (en kg) ----------
    add(f'<div style="{WRAP}">')
    add(f'<h2 style="{H2}margin-bottom:10px;">Porción diaria sencilla</h2>')
    add(f'<p style="{SUB}font-size:15px;margin-bottom:34px;">Dale los masticables cada mañana con comida o simplemente como un premio.</p>')
    for f, alt, title, weight, dose in [
        ("15-porcion-1.webp", "Un masticable", "Perros pequeños", "Hasta 11 kg", "1 masticable al día"),
        ("16-porcion-2.webp", "Dos masticables", "Perros medianos", "De 11 a 23 kg", "2 masticables al día"),
        ("17-porcion-3.webp", "Tres masticables", "Perros grandes", "De 23 a 34 kg", "3 masticables al día"),
        ("18-porcion-4.webp", "Cuatro masticables", "Perros extra grandes", "Más de 34 kg", "4 masticables al día"),
    ]:
        add(f'<div style="{CARD_BOX}padding:22px;text-align:center;margin:0 0 20px;">'
            f'{img(f, alt, "width:64px;height:64px;object-fit:contain;display:block;margin:0 auto 14px;")}'
            f'<h3 style="{H3}font-size:15px;margin-bottom:4px;">{title}</h3>'
            f'<p style="font-size:12px;color:{MUTED};margin:0 0 8px;">{weight}</p>'
            f'<p style="font-size:13px;font-weight:700;color:{BLUE};margin:0;">{dose}</p></div>')
    add(f'<p style="text-align:center;font-size:13px;color:{MUTED};margin:26px auto 0;line-height:1.5;">Cada frasco trae 30 masticables: rinde 30 días en perros pequeños.<br>Para perros medianos y grandes te conviene el pack de 4 frascos.</p>')
    add('</div>')

    # ---------- 9. Garantía ----------
    add(f'<div style="{WRAP}text-align:center;">')
    add(img("19-garantia.webp", "Frasco de Pupganics junto a un Bulldog Francés", "max-width:280px;width:100%;height:auto;display:block;margin:0 auto 24px;border-radius:16px;"))
    add(f'<h2 style="{H2}font-size:24px;">Dale 90 días, o te devolvemos el dinero</h2>')
    add(f'<p style="{P}font-size:15px;">Si al día 90 no notás mejoras en la movilidad de tu perro, te devolvemos el dinero. Consultá las condiciones en nuestra política de devoluciones.</p>')
    add('</div>')

    # ---------- 10. Opiniones de dueños reales ----------
    add(f'<div style="{WRAP}">')
    add(f'<p style="{EYEBROW}">Opiniones de dueños reales</p>')
    add(f'<h2 style="{H2}margin-bottom:36px;">Lo que los dueños empiezan a notar</h2>')
    for quote, author in [
        ("\"Probé otro tratamiento durante 4 meses. Ayudó como 3 semanas y luego volvió a quejarse. A la semana 5 con esto, saltó solo a la cama por primera vez en meses.\"", "Karen D., dueña de Cooper (Golden Retriever, 9 años)"),
        ("\"Antes se quedaba a la mitad de las escaleras y solo me miraba. Pensé que así iba a ser su vida. A las 6 semanas subió el tramo completo. Lloré de verdad.\"", "Melissa T., dueña de Daisy (Labrador, 8 años)"),
    ]:
        add(f'<div style="{CARD_BOX}padding:26px;margin:0 0 22px;">'
            '<div style="color:#ffb800;font-size:15px;margin-bottom:12px;letter-spacing:2px;">★★★★★</div>'
            f'<p style="font-size:14px;color:#1c2430;line-height:1.6;margin:0 0 16px;font-style:italic;">{quote}</p>'
            f'<div style="font-size:11px;font-weight:800;color:{BLUE};letter-spacing:0.3px;text-transform:uppercase;">{author}</div></div>')
    add('</div>')

    # ---------- 11. Preguntas frecuentes (nueva) ----------
    add(f'<div style="{WRAP}">')
    add(f'<h2 style="{H2}margin-bottom:28px;">Preguntas frecuentes</h2>')
    for q, a in [
        ("¿Cuánto tarda en llegar?", "Despachamos tu pedido dentro de las 24 a 72 hs hábiles de realizada la compra."),
        ("¿Cuántos masticables le doy?", "Depende del peso: 1 por día hasta 11 kg, 2 de 11 a 23 kg, 3 de 23 a 34 kg y 4 si pesa más de 34 kg. Podés dárselos con la comida o como premio."),
        ("¿Cuánto dura un frasco?", "Cada frasco trae 30 masticables: rinde 30 días en perros pequeños, 15 días en medianos y unos 10 días en grandes. Por eso el pack de 4 frascos es el más elegido."),
        ("¿En cuánto tiempo voy a ver cambios?", "Los primeros cambios digestivos suelen notarse en la primera semana, y los de movilidad entre la semana 3 y la 6. Recomendamos sostener la rutina 90 días."),
        ("¿Se lo puedo dar si toma medicación?", "Pupganics es un suplemento y no reemplaza ningún tratamiento. Si tu perro toma medicación o tiene una condición de salud, consultá con tu veterinario antes de empezar."),
        ("¿Sirve para cachorros?", "Está pensado para perros adultos y senior. Para cachorros, consultá con tu veterinario."),
        ("¿Y si no le gusta o no veo resultados?", "Tiene sabor a caldo de res y pollo, que a la mayoría les encanta. Y si al día 90 no notás mejoras, te devolvemos el dinero."),
    ]:
        add(f'<details style="border-bottom:1px solid #e7ecf3;padding:16px 0;">'
            f'<summary style="font-size:15px;font-weight:700;color:{NAVY};cursor:pointer;">{q}</summary>'
            f'<p style="{P}margin-top:10px;">{a}</p></details>')
    add('</div>')

    return "\n".join(out) + "\n"


if __name__ == "__main__":
    (HERE / "tiendanube-descripcion.html").write_text(build(lambda n: IMG_CDN[n]), encoding="utf-8")
    body = build(lambda n: f"assets/{n}")
    (HERE / "preview.html").write_text(
        '<!doctype html>\n<html lang="es"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Pupganics — preview</title></head>'
        '<body style="margin:0;background:#fff;padding:0 16px;">\n' + body + "</body></html>\n",
        encoding="utf-8",
    )
    print("ok")
