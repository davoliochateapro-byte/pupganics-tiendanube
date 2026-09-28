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
