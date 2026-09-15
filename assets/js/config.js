/* =====================================================================
   CONFIGURAÇÃO DA OFERTA E DO TRACKING — Guia Visual do Mapa Astral
   Único lugar para editar no GitHub Pages. Carregado antes de assets/js/main.js.
   Use somente valores reais: campos vazios simplesmente não são ativados.
   ===================================================================== */
window.MVA_CONFIG = {
  product: "Guia Visual do Mapa Astral",
  price: 27.9,            // preço usado nos eventos de analytics (o preço exibido está no index.html)
  currency: "BRL",

  // TODO: inserir URL real do checkout (ex.: página de pagamento da Hotmart/Kiwify/Eduzz).
  // Vazio = todos os botões de compra levam à seção #oferta.
  checkoutUrl: "",

  // TODO: inserir ID do Google Analytics 4 (formato G-XXXXXXXXXX). Vazio = GA4 não é carregado.
  ga4: "",

  // TODO: inserir ID do Meta Pixel (somente números). Vazio = Pixel não é carregado.
  metaPixel: "",

  debug: false             // true = mostra os eventos de tracking no console
};

/* Aplica o checkout configurado acima a todos os botões de compra (data-cta) que hoje apontam para #oferta. */
(function () {
  var url = String(window.MVA_CONFIG.checkoutUrl || '').trim();
  window.MVA_CONFIG.checkoutUrl = url;
  if (!url) return;
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a[data-cta]');
    for (var i = 0; i < links.length; i++) if (links[i].getAttribute('href') === '#oferta') links[i].setAttribute('href', url);
  });
})();
