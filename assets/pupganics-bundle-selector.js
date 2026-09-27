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
  });
})();
