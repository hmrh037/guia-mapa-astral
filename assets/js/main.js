/* Guia Visual do Mapa Astral — landing page
   Comportamentos: reveal discreto, CTA fixo no mobile, FAQ, analytics (interface neutra). */
(function () {
  'use strict';
  var CFG = window.MVA_CONFIG || {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ analytics
     Interface única: MVA.track(evento, dados). Envia para dataLayer (GTM),
     gtag (GA4) e fbq (Meta Pixel) quando estiverem presentes. Para conectar uma
     plataforma, preencha os IDs em config.js ou registre um adaptador:
       window.MVA.onTrack(function (name, params) { ... });                     */
  var listeners = [];
  var FB_STANDARD = { view_content: 'ViewContent', begin_checkout: 'InitiateCheckout' };
  function track(name, params) {
    params = params || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, params));
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      if (typeof window.fbq === 'function') {
        if (FB_STANDARD[name]) window.fbq('track', FB_STANDARD[name], params);
        else window.fbq('trackCustom', name, params);
      }
      listeners.forEach(function (fn) { try { fn(name, params); } catch (e) { /* noop */ } });
      if (CFG.debug) console.info('[MVA track]', name, params);
    } catch (e) { /* nunca quebrar a página por causa de analytics */ }
  }
  window.MVA = { track: track, onTrack: function (fn) { listeners.push(fn); } };

  function loadScript(src, cb) { var s = document.createElement('script'); s.async = true; s.src = src; if (cb) s.onload = cb; document.head.appendChild(s); }
  function initVendors() {
    if (CFG.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CFG.ga4, { send_page_view: true });
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.ga4));
    }
    if (CFG.metaPixel) {
      /* carregador padrão do Meta Pixel */
      !(function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CFG.metaPixel);
      window.fbq('track', 'PageView');
    }
  }

  /* ------------------------------------------------------------------ helpers */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var priceParams = { currency: CFG.currency || 'BRL', value: CFG.price, item_name: CFG.product };

  document.addEventListener('DOMContentLoaded', function () {
    initVendors();
    track('view_content', Object.assign({ content_type: 'product' }, priceParams));

    /* ---- reveal discreto ---- */
    var revealEls = $$('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach(function (el) { ro.observe(el); });
    }

    /* ---- CTAs ---- */
    $$('[data-cta]').forEach(function (a) {
      a.addEventListener('click', function () {
        var loc = a.getAttribute('data-cta');
        track('click_cta', Object.assign({ location: loc }, priceParams));
        if (CFG.checkoutUrl && a.getAttribute('href') === CFG.checkoutUrl) {
          track('begin_checkout', Object.assign({ location: loc }, priceParams));
        }
      });
    });

    /* ---- oferta vista ---- */
    var offer = $('#oferta');
    if (offer && 'IntersectionObserver' in window) {
      var seen = false;
      var oo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting && !seen) { seen = true; track('view_offer', priceParams); oo.disconnect(); } });
      }, { threshold: 0.3 });
      oo.observe(offer);
    }

    /* ---- FAQ: um aberto por vez + evento ---- */
    var faqItems = $$('.faq-item');
    faqItems.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          faqItems.forEach(function (o) { if (o !== d && o.open) o.open = false; });
          var q = $('summary', d); track('faq_open', { question: q ? q.textContent.trim() : '' });
        }
      });
    });

    /* ---- CTA fixo no mobile: aparece depois que o CTA do hero sai da tela e
            nunca divide a tela com outro botão de compra (qualquer parte dele visível).
            Some de vez depois do CTA final, para não cobrir o rodapé. ---- */
    var sticky = $('#sticky-cta');
    var heroCta = $('#hero-cta');
    var finalCta = $('#final-cta');
    var inlineCtas = $$('[data-cta]').filter(function (a) { return a.getAttribute('data-cta') !== 'sticky'; });
    if (sticky && heroCta) {
      var ticking = false, lastShow = null;
      var onScreen = function (el) { var r = el.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < window.innerHeight; };
      var update = function () {
        ticking = false;
        var heroGone = heroCta.getBoundingClientRect().bottom < 0;
        var pastFinal = finalCta ? finalCta.getBoundingClientRect().bottom < 0 : false;
        var show = heroGone && !pastFinal && !inlineCtas.some(onScreen);
        if (show === lastShow) return;
        lastShow = show;
        if (show) { sticky.hidden = false; requestAnimationFrame(function () { sticky.classList.add('show'); }); }
        else { sticky.classList.remove('show'); sticky.hidden = true; }
      };
      var onScrollSticky = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', onScrollSticky, { passive: true });
      window.addEventListener('resize', onScrollSticky, { passive: true });
      update();
    }

    /* ---- ano no rodapé (fallback) ---- */
    var y = $('[data-year]'); if (y && !y.textContent) y.textContent = String(new Date().getFullYear());
  });
})();
