/*
 * Pupganics — hace funcional el bloque "Ofertas en cantidad" de la descripción
 * del producto (tiendanube-descripcion.html). Se registra como Script de
 * Tiendanube (Partners Portal → Scripts) porque el editor de descripción
 * borra cualquier <script> puesto ahí directamente.
 *
 * Qué hace, en la página de producto:
 *  - Detecta las tarjetas ".pg-offer-card" (data-variation="1 frasco" / "2 frascos" / "4 frascos")
 *    inyectadas en la descripción.
 *  - Al hacer click en una tarjeta, cambia el <select id="variation_1"> nativo
 *    (el que Tiendanube usa para la variante "Cantidad") y dispara "change"
 *    para que el tema recalcule precio/cuotas.
 *  - Actualiza el estilo (borde, radio, barras de bonus) de la tarjeta activa.
 *  - El botón "#pg-offer-cta" hace click en el botón real ".js-addtocart"
 *    del tema, para no depender de reimplementar el alta al carrito.
 *
 * No hace nada si la página no tiene ni el select ni las tarjetas (por
 * ejemplo, otros productos de la tienda), así que es seguro cargarlo en
 * todas las páginas de la tienda.
 */
(function () {
  var BLUE = '#235FB4';
  var GRAY = '#c7cfdb';
  var GRAY_BORDER = '#e1e6ee';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var select = document.getElementById('variation_1');
    var cards = document.querySelectorAll('.pg-offer-card');
    var cta = document.getElementById('pg-offer-cta');
    if (!select || !cards.length) return;

    function setActive(card, active) {
      var radio = card.querySelector('.pg-offer-radio');
      var bonuses = card.querySelectorAll('.pg-offer-bonus');
      card.style.border = active ? '2px solid ' + BLUE : '1px solid ' + GRAY_BORDER;
      if (radio) {
        radio.style.background = active ? BLUE : 'transparent';
        radio.style.border = active ? 'none' : '2px solid ' + GRAY;
        radio.style.boxShadow = active ? 'inset 0 0 0 3px #fff, 0 0 0 2px ' + BLUE : 'none';
      }
      for (var i = 0; i < bonuses.length; i++) {
        bonuses[i].style.background = active ? BLUE : GRAY;
      }
    }

    function selectCard(card) {
      var value = card.getAttribute('data-variation');
      var hasOption = false;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === value) hasOption = true;
      }
      if (!hasOption) return;
      if (select.value !== value) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      for (var j = 0; j < cards.length; j++) {
        setActive(cards[j], cards[j] === card);
      }
    }

    for (var k = 0; k < cards.length; k++) {
      (function (card) {
        card.addEventListener('click', function () {
          selectCard(card);
        });
      })(cards[k]);
    }

    // Sincroniza el precio de arriba con la tarjeta marcada como "Más Popular"
    // apenas carga la página, igual que en la referencia de Shopify.
    var defaultCard = document.querySelector('.pg-offer-card[data-variation="2 frascos"]') || cards[0];
    selectCard(defaultCard);

    if (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        var addBtn = document.querySelector('.js-addtocart');
        if (addBtn) addBtn.click();
      });
    }

    // Oculta el bloque nativo redundante (precio/cuotas/descuento, el selector
    // "Cantidad" + paso a paso + botón "Agregar al carrito", el simulador de
    // envío y los sellos de confianza) ya que las tarjetas + el CTA propio los
    // reemplazan. El tema vuelve a mostrar el precio y el simulador de envío
    // cada vez que cambia la variante (recalcula cuotas/costo de envío), así
    // que un simple style.display='none' se pierde en el próximo click. Por
    // eso se ocultan con una regla CSS !important (gana siempre sobre el
    // display inline que el tema vuelva a poner) más un MutationObserver que
    // reaplica la clase si el tema reconstruye esos nodos. Nunca se sacan del
    // DOM: el <select> y el botón real siguen ahí, y un elemento oculto
    // responde igual a .value, "change" y .click().
    var HIDE_CLASS = 'pg-native-hide';
    var style = document.createElement('style');
    style.textContent =
      '.js-price-container, .js-product-payments-container, #product-shipping-container, .js-offer-label, .' +
      HIDE_CLASS +
      ' { display: none !important; }';
    document.head.appendChild(style);

    function hide(el) {
      if (el) el.classList.add(HIDE_CLASS);
    }

    function hideNativeExtras() {
      var qtyRow = select.closest('.js-product-variants') || select.closest('.form-row');
      hide(qtyRow);

      var addToCartBtnEl = document.querySelector('.js-addtocart');
      hide(addToCartBtnEl ? addToCartBtnEl.closest('.form-row') : null);

      var formRows = document.querySelectorAll('#product_form > div');
      for (var m = 0; m < formRows.length; m++) {
        var t = formRows[m].textContent;
        if (/compra protegida/i.test(t) || /cambios y devoluciones/i.test(t)) {
          hide(formRows[m]);
        }
      }
    }

    hideNativeExtras();

    var form = document.getElementById('product_form');
    if (form && window.MutationObserver) {
      var observer = new MutationObserver(function () {
        hideNativeExtras();
      });
      observer.observe(form, { childList: true, subtree: true });
    }

    // Convierte los botones nativos de "compartir este producto" en links
    // directos a WhatsApp/Facebook/Instagram de Pupganics. Twitter y
    // Pinterest quedan ocultos. El ícono de Instagram no existe de forma
    // nativa en esta fila: se clona el de Facebook (mismo estilo circular)
    // y se le cambia el símbolo SVG por "#instagram", que ya está definido
    // en el sprite del tema.
    var XLINK_NS = 'http://www.w3.org/1999/xlink';

    function setupSocialLinks() {
      var container = document.querySelector('.social-share');
      if (!container) return;

      var waLinks = container.querySelectorAll('a[data-network="whatsapp"]');
      for (var i = 0; i < waLinks.length; i++) {
        waLinks[i].href = 'https://wa.me/5493804851800';
        waLinks[i].title = 'Escribinos por WhatsApp';
        waLinks[i].setAttribute('aria-label', 'Escribinos por WhatsApp');
        waLinks[i].classList.remove('d-md-none');
      }

      var fb = container.querySelector('a[data-network="facebook"]');
      if (fb) {
        fb.href = 'https://www.facebook.com/profile.php?id=61594149814469';
        fb.title = 'Seguinos en Facebook';
        fb.setAttribute('aria-label', 'Seguinos en Facebook');
      }

      hide(container.querySelector('a[data-network="twitter"]'));
      hide(container.querySelector('a[data-network="pinterest"]'));

      var pinIt = container.querySelector('.pin-it-button');
      hide(pinIt ? pinIt.closest('.social-share-button') || pinIt : null);

      if (fb && !container.querySelector('a[data-network="instagram"]')) {
        var ig = fb.cloneNode(true);
        ig.setAttribute('data-network', 'instagram');
        ig.href = 'https://www.instagram.com/pupganics.arg/';
        ig.title = 'Seguinos en Instagram';
        ig.setAttribute('aria-label', 'Seguinos en Instagram');
        var use = ig.querySelector('use');
        if (use) use.setAttributeNS(XLINK_NS, 'xlink:href', '#instagram');
        fb.insertAdjacentElement('afterend', ig);
      }
    }

    setupSocialLinks();
  });
})();

/*
 * Homepage de Pupganics (réplica corregida de la de Shopify, pupganics.online).
 * Solo corre en "/" (la raíz de la tienda). El home nativo de Tiendanube está
 * vacío (.js-home-sections-container sin banners configurados), así que se
 * inyecta el HTML completo ahí arriba de todo.
 *
 * Respecto de la versión de Shopify, se corrigen los mismos problemas que ya
 * se habían corregido en tiendanube-descripcion.html (ver README):
 *  - Sin el banner "Primer Aniversario" (la barra de anuncios se configura
 *    nativa en Tiendanube, no acá).
 *  - Sin "4.9/5 (233 reseñas)" / "233 familias ya lo probaron": no hay
 *    reseñas reales cargadas. Se usa la única cifra de prueba social ya
 *    aprobada ("+1.240 dueños").
 *  - Sin el testimonio de "Christaline" sobre dejar la medicación: se
 *    reemplaza por testimonios ya curados (Melissa, Niko) del muro de
 *    tiendanube-descripcion.html.
 *  - Afirmaciones de ingredientes suavizadas ("ayuda a/acompaña/apoya" en
 *    vez de "reconstruyen/detienen/sanan/bloquean"), con el mismo texto ya
 *    usado en la descripción del producto.
 */
(function () {
  if (window.location.pathname !== '/') return;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var BLUE = '#235FB4';
  var NAVY = '#0B1128';
  var TEXT = '#5b6472';
  var MUTED = '#8892a0';
  var CARD = '#f6f9fd';
  var FONT = 'font-family:Poppins,Arial,sans-serif;';
  var PRODUCT_URL = '/productos/pupganics-1vpp9/';

  var IMG = {
    beach: 'https://cdn.shopify.com/s/files/1/1017/9448/0445/files/lifestyle-beach.webp?width=800',
    couch: 'https://cdn.shopify.com/s/files/1/1017/9448/0445/t/3/assets/lifestyle-couch.webp?width=800',
    ingredients: 'https://cdn.shopify.com/s/files/1/1017/9448/0445/files/3.png?width=800',
  };

  function buildHomeHtml() {
    var out = [];

    // ---------- Hero ----------
    out.push(
      '<div style="' + FONT + '">' +
        '<img src="' + IMG.beach + '" alt="Pupganics en la playa" loading="eager" ' +
        'style="width:100%;display:block;object-fit:cover;aspect-ratio:16/10;">' +
        '<div style="max-width:600px;margin:0 auto;padding:32px 20px;text-align:center;">' +
          '<h1 style="font-size:28px;line-height:1.25;font-weight:800;color:' + NAVY + ';margin:0 0 14px;">' +
            'Suplementos diarios para un perro más sano y feliz</h1>' +
          '<p style="font-size:15px;color:' + TEXT + ';line-height:1.5;margin:0 0 24px;max-width:480px;margin-left:auto;margin-right:auto;">' +
            'Nutrición limpia, con respaldo científico, pensada para el bienestar articular de tu mejor amigo.</p>' +
          '<a href="' + PRODUCT_URL + '" style="display:inline-block;background:' + BLUE + ';color:#fff;' +
            'font-weight:800;font-size:15px;text-decoration:none;padding:15px 40px;border-radius:30px;">Comprar ahora</a>' +
        '</div>' +
        '<div style="background:' + NAVY + ';color:#fff;padding:20px;text-align:center;font-size:13px;line-height:2.1;">' +
          '🐾 <b>90 días</b> de garantía &nbsp;·&nbsp; ⭐ <b>+1.240 dueños</b> confían en Pupganics<br>' +
          '🚚 Envío en 24-72hs &nbsp;·&nbsp; 🔬 Fórmula con <b>respaldo científico</b>' +
        '</div>' +
      '</div>'
    );

    // ---------- Familias reales ----------
    out.push(
      '<div style="' + FONT + 'max-width:600px;margin:0 auto;padding:48px 20px;text-align:center;">' +
        '<h2 style="font-size:26px;font-weight:800;color:' + NAVY + ';margin:0 0 10px;">Familias reales, momentos reales</h2>' +
        '<p style="font-size:15px;color:' + TEXT + ';line-height:1.5;margin:0 0 28px;">' +
          '+1.240 dueños ya hicieron de Pupganics parte de la rutina diaria de sus perros.</p>' +
        '<img src="' + IMG.couch + '" alt="Pupganics en casa" loading="lazy" ' +
        'style="width:100%;border-radius:16px;display:block;object-fit:cover;aspect-ratio:1/1;">' +
      '</div>'
    );

    // ---------- Beneficios (4 íconos) ----------
    var benefits = [
      ['🦴', 'Soporte articular'],
      ['🏃', 'Movilidad diaria'],
      ['🌱', 'Salud intestinal'],
      ['🛡️', 'Bienestar general'],
    ];
    var benefitsHtml = '';
    for (var bi = 0; bi < benefits.length; bi++) {
      benefitsHtml +=
        '<div style="width:50%;box-sizing:border-box;text-align:center;padding:16px 8px;">' +
          '<div style="font-size:32px;margin-bottom:10px;">' + benefits[bi][0] + '</div>' +
          '<div style="font-size:13px;font-weight:700;color:' + NAVY + ';">' + benefits[bi][1] + '</div>' +
        '</div>';
    }
    out.push(
      '<div style="' + FONT + 'max-width:600px;margin:0 auto;padding:0 20px 48px;text-align:center;">' +
        '<h2 style="font-size:26px;font-weight:800;color:' + NAVY + ';margin:0 0 10px;">Todo lo que tu perro necesita para moverse libre</h2>' +
        '<p style="font-size:15px;color:' + TEXT + ';line-height:1.5;margin:0 0 8px;">' +
          'Una fórmula diaria pensada para el bienestar articular integral, desde la raíz.</p>' +
        '<div style="display:flex;flex-wrap:wrap;justify-content:center;">' + benefitsHtml + '</div>' +
      '</div>'
    );

    // ---------- Ingredientes ----------
    var ingredients = [
      ['SOPORTE ARTICULAR', 'Glucosamina + MSM', 'Acompañan el cuidado del cartílago y el amortiguamiento de la articulación.'],
      ['ANTI-INFLAMATORIO', 'Aceite de salmón', 'Omega-3 que ayuda a mantener una respuesta inflamatoria equilibrada.'],
      ['SALUD INTESTINAL', 'Probióticos (3 cepas)', 'Contribuyen a un intestino sano para aprovechar mejor los nutrientes.'],
      ['ANTIOXIDANTE', 'Quercetina', 'Antioxidante natural que ayuda a mantener el confort articular.'],
      ['ENERGÍA Y REPARACIÓN', 'Vitamina A + CoQ10', 'Apoyan la energía celular y el mantenimiento de los tejidos.'],
    ];
    var ingredientsHtml = '';
    for (var ii = 0; ii < ingredients.length; ii++) {
      var ing = ingredients[ii];
      ingredientsHtml +=
        '<div style="background:#fff;border-radius:14px;padding:20px;margin:0 0 14px;text-align:left;">' +
          '<div style="color:' + BLUE + ';font-weight:800;font-size:11px;letter-spacing:0.5px;margin-bottom:6px;">' + ing[0] + '</div>' +
          '<h3 style="font-size:16px;font-weight:800;color:' + NAVY + ';margin:0 0 6px;">' + ing[1] + '</h3>' +
          '<p style="font-size:13px;color:' + TEXT + ';line-height:1.5;margin:0;">' + ing[2] + '</p>' +
        '</div>';
    }
    out.push(
      '<div style="' + FONT + 'background:' + CARD + ';padding:48px 20px;">' +
        '<div style="max-width:600px;margin:0 auto;text-align:center;">' +
          '<h2 style="font-size:26px;font-weight:800;color:' + NAVY + ';margin:0 0 10px;">Ingredientes reales, con un propósito real</h2>' +
          '<p style="font-size:15px;color:' + TEXT + ';line-height:1.5;margin:0 0 28px;">' +
            'Una mirada a los ingredientes elegidos cuidadosamente detrás de Pupganics.</p>' +
          ingredientsHtml +
          '<img src="' + IMG.ingredients + '" alt="Ingredientes Pupganics" loading="lazy" ' +
          'style="width:100%;border-radius:16px;display:block;margin-top:6px;">' +
        '</div>' +
      '</div>'
    );

    // ---------- Testimonios (curados, sin reseñas falsas ni menciones de dejar medicación) ----------
    var testimonials = [
      ['Melissa', '¡Los suplementos realmente han ayudado con la rigidez de mi perra! Y le encanta el sabor.'],
      ['Niko', 'Shady parece tener más energía y mejor movilidad desde que empezó, hace unos dos meses. Tiene 13 años.'],
    ];
    var testimonialsHtml = '';
    for (var ti = 0; ti < testimonials.length; ti++) {
      testimonialsHtml +=
        '<div style="background:#fff;border-radius:14px;padding:22px;margin:0 0 16px;text-align:left;">' +
          '<div style="color:#ffb800;font-size:14px;margin-bottom:8px;letter-spacing:2px;">★★★★★</div>' +
          '<p style="font-size:14px;color:#1c2430;line-height:1.5;margin:0 0 10px;font-style:italic;">"' + testimonials[ti][1] + '"</p>' +
          '<div style="font-size:12px;font-weight:800;color:' + NAVY + ';">' + testimonials[ti][0] + '</div>' +
        '</div>';
    }
    out.push(
      '<div style="' + FONT + 'max-width:600px;margin:0 auto;padding:48px 20px;text-align:center;">' +
        '<h2 style="font-size:26px;font-weight:800;color:' + NAVY + ';margin:0 0 6px;">+1.240 dueños ya eligieron Pupganics</h2>' +
        '<p style="font-size:14px;color:' + BLUE + ';font-weight:700;margin:0 0 26px;">Lo que dicen los papás perrunos</p>' +
        testimonialsHtml +
      '</div>'
    );

    // ---------- Garantía / CTA final ----------
    out.push(
      '<div style="' + FONT + 'background:' + NAVY + ';color:#fff;padding:48px 20px;text-align:center;">' +
        '<h2 style="font-size:24px;font-weight:800;margin:0 0 12px;">Probalo sin riesgo por 90 días</h2>' +
        '<p style="font-size:14px;color:#c9d0dd;line-height:1.5;margin:0 0 22px;">Si no ves cambios, te devolvemos tu dinero.</p>' +
        '<a href="' + PRODUCT_URL + '" style="display:inline-block;background:' + BLUE + ';color:#fff;' +
          'font-weight:800;font-size:15px;text-decoration:none;padding:15px 40px;border-radius:30px;">Comprar ahora</a>' +
      '</div>'
    );

    return out.join('\n');
  }

  ready(function () {
    var container = document.querySelector('.js-home-sections-container');
    if (!container || container.querySelector('.pg-home')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'pg-home';
    wrapper.innerHTML = buildHomeHtml();
    container.insertBefore(wrapper, container.firstChild);
  });
})();
