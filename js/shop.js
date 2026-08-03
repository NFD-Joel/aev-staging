/* ============================================================
   Agua es Vida — Shop-Logik
   Rendert den Katalog aus data/products.json, verwaltet den
   Warenkorb (localStorage) und baut die WhatsApp-Bestellung.

   Auf der Startseite rendert es nur die "Destacados"-Zeile
   (#featured-grid); auf tienda.html den vollen Katalog.
   ============================================================ */
'use strict';

const SHOP = {
  data: null,          // products.json
  activeCat: 'filtros',
  cart: JSON.parse(localStorage.getItem('aev_cart') || '[]')  // [{id, qty}]
};

document.addEventListener('DOMContentLoaded', async () => {
  await AEV.ready;
  SHOP.data = await fetch('data/products.json').then(r => r.json());
  renderAll();
  updateCartBadge();
});

document.addEventListener('aev:lang', () => { if (SHOP.data) renderAll(); });

function renderAll() {
  renderTabs();
  renderCatalog();
  renderFeatured();
  renderCart();
}

/* ---------- Helfer ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function productById(id) {
  return SHOP.data.products.find(p => p.id === id);
}

function productName(p, plain) {
  const base = (p.name_i18n && p.name_i18n[AEV.lang]) || p.name;
  if (plain) return base + (p.suffix ? ' ' + p.suffix : '');
  return esc(base) + (p.suffix ? ' <em>' + esc(p.suffix) + '</em>' : '');
}

function showPrices() { return !!(AEV.site.shop && AEV.site.shop.showPrices); }

function fmtPrice(n) {
  const cur = (AEV.site.shop && AEV.site.shop.currency) || 'Gs.';
  return cur + ' ' + Number(n).toLocaleString('es-PY');
}

function priceHtml(p) {
  if (showPrices() && typeof p.price === 'number') {
    return '<div class="product-price">' + fmtPrice(p.price) + '</div>';
  }
  return '<div class="product-price consult">' + esc(T('shop_consult')) + '</div>';
}

/* ---------- Kategorie-Tabs (nur tienda.html) ---------- */
function renderTabs() {
  const wrap = document.getElementById('shop-tabs');
  if (!wrap) return;
  wrap.innerHTML = SHOP.data.categories.map(c =>
    '<button type="button" class="tab-btn' + (c.id === SHOP.activeCat ? ' active' : '') + '"' +
    ' onclick="setCat(\'' + c.id + '\')">' + esc(c.label[AEV.lang] || c.label.es) + '</button>'
  ).join('');
}

function setCat(id) {
  SHOP.activeCat = id;
  renderTabs();
  renderCatalog();
}

/* ---------- Produktkarte ---------- */
function cardHtml(p) {
  const inCart = SHOP.cart.some(i => i.id === p.id);
  const isService = p.type === 'service';
  const unavailable = p.available === false;

  const visual = isService
    ? '<div class="service-icon">' + (p.icon || '🔧') + '</div>'
    : '<div class="product-img" onclick="openProduct(\'' + p.id + '\')">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(productName(p, true)) + '" loading="lazy"/></div>';

  const capacity = p.capacity
    ? '<div class="product-capacity">' + esc(p.capacity[AEV.lang] || p.capacity.es) + '</div>' : '';

  const tags = (p.tags || []).map(t =>
    '<span>' + esc(t[AEV.lang] || t.es) + '</span>').join('');

  let actions;
  if (isService) {
    const num = (AEV.site.shop && AEV.site.shop.orderNumber) || '595982300202';
    const msg = encodeURIComponent(T('wa_interest') + productName(p, true));
    actions = '<div class="product-actions">' +
      '<a class="btn btn-add" href="https://wa.me/' + num + '?text=' + msg + '" target="_blank" rel="noopener">' +
      esc(T('shop_service_cta')) + '</a></div>';
  } else if (unavailable) {
    actions = '<div class="product-actions"><button type="button" class="btn btn-add" disabled>' +
      esc(T('shop_unavailable')) + '</button></div>';
  } else {
    actions = '<div class="product-actions">' +
      '<button type="button" class="btn btn-add' + (inCart ? ' added' : '') + '" data-add="' + p.id + '"' +
      ' onclick="addToCart(\'' + p.id + '\')">' + esc(inCart ? T('shop_added') : T('shop_add')) + '</button>' +
      '<button type="button" class="btn btn-detail" onclick="openProduct(\'' + p.id + '\')">' +
      esc(T('shop_details')) + '</button></div>';
  }

  return '<div class="product-card fade-up in-view' + (unavailable ? ' unavailable' : '') + '">' +
    visual +
    '<div class="product-body">' +
      '<div class="product-name">' + productName(p) + '</div>' +
      capacity +
      '<p class="product-desc">' + esc(p.desc[AEV.lang] || p.desc.es) + '</p>' +
      '<div class="product-tags">' + tags + '</div>' +
      (isService ? '' : priceHtml(p)) +
      actions +
    '</div></div>';
}

/* ---------- Voller Katalog (tienda.html) ---------- */
function renderCatalog() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  const items = SHOP.data.products.filter(p => p.category === SHOP.activeCat);
  grid.innerHTML = items.map(cardHtml).join('');
}

/* ---------- Destacados (index.html) ---------- */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const items = SHOP.data.products.filter(p => p.featured);
  grid.innerHTML = items.map(cardHtml).join('');
}

/* ---------- Produkt-Modal ---------- */
function openProduct(id) {
  const p = productById(id);
  if (!p) return;
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const tags = (p.tags || []).map(t => '<span>' + esc(t[AEV.lang] || t.es) + '</span>').join('');
  const capacity = p.capacity
    ? '<div class="modal-capacity">' + esc(p.capacity[AEV.lang] || p.capacity.es) + '</div>' : '';
  const inCart = SHOP.cart.some(i => i.id === p.id);

  modal.querySelector('.modal').innerHTML =
    '<button type="button" class="modal-close" onclick="closeProduct()">×</button>' +
    '<div class="modal-img"><img src="' + esc(p.image) + '" alt="' + esc(productName(p, true)) + '"/></div>' +
    '<div class="modal-body">' +
      '<h3>' + productName(p) + '</h3>' +
      capacity +
      '<p class="modal-desc">' + esc(p.desc[AEV.lang] || p.desc.es) + '</p>' +
      '<div class="product-tags">' + tags + '</div>' +
      priceHtml(p) +
      '<div class="product-actions">' +
        '<button type="button" class="btn btn-add' + (inCart ? ' added' : '') + '" data-add="' + p.id + '"' +
        ' onclick="addToCart(\'' + p.id + '\')">' + esc(inCart ? T('shop_added') : T('shop_add')) + '</button>' +
      '</div>' +
    '</div>';
  modal.classList.add('open');
  modal.onclick = e => { if (e.target === modal) closeProduct(); };
}

function closeProduct() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
}

/* ---------- Warenkorb ---------- */
function saveCart() {
  localStorage.setItem('aev_cart', JSON.stringify(SHOP.cart));
  updateCartBadge();
  renderCart();
}

function addToCart(id) {
  const item = SHOP.cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else SHOP.cart.push({ id, qty: 1 });
  saveCart();
  document.querySelectorAll('[data-add="' + id + '"]').forEach(b => {
    b.classList.add('added');
    b.textContent = T('shop_added');
  });
  openCart();
}

function changeQty(id, delta) {
  const item = SHOP.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) SHOP.cart = SHOP.cart.filter(i => i.id !== id);
  saveCart();
  renderCatalog();
  renderFeatured();
}

function clearCart() {
  SHOP.cart = [];
  saveCart();
  renderCatalog();
  renderFeatured();
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;
  const n = SHOP.cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = n > 0 ? n : '';
}

function openCart() {
  const d = document.getElementById('cart-drawer');
  const o = document.getElementById('cart-overlay');
  if (!d) return;
  renderCart();
  d.classList.add('open');
  o.classList.add('open');
}

function closeCart() {
  const d = document.getElementById('cart-drawer');
  const o = document.getElementById('cart-overlay');
  if (!d) return;
  d.classList.remove('open');
  o.classList.remove('open');
}

function renderCart() {
  const list = document.getElementById('cart-items');
  if (!list || !SHOP.data) return;

  if (SHOP.cart.length === 0) {
    list.innerHTML = '<p class="cart-empty-msg">' + esc(T('cart_empty')) + '</p>';
  } else {
    list.innerHTML = SHOP.cart.map(i => {
      const p = productById(i.id);
      if (!p) return '';
      const price = (showPrices() && typeof p.price === 'number')
        ? '<div class="cart-item-price">' + fmtPrice(p.price) + '</div>' : '';
      return '<div class="cart-item">' +
        '<div class="cart-item-img"><img src="' + esc(p.image) + '" alt=""/></div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + productName(p) + '</div>' + price +
        '</div>' +
        '<div class="cart-qty">' +
          '<button type="button" onclick="changeQty(\'' + p.id + '\',-1)">−</button>' +
          '<span class="qty-n">' + i.qty + '</span>' +
          '<button type="button" onclick="changeQty(\'' + p.id + '\',1)">+</button>' +
        '</div></div>';
    }).join('');
  }

  // Gesamtsumme nur wenn Preise aktiv sind und alle Artikel einen Preis haben
  const totalRow = document.getElementById('cart-total-row');
  if (totalRow) {
    const priced = SHOP.cart.map(i => ({ i, p: productById(i.id) }))
      .filter(x => x.p && typeof x.p.price === 'number');
    if (showPrices() && SHOP.cart.length > 0 && priced.length === SHOP.cart.length) {
      const total = priced.reduce((s, x) => s + x.p.price * x.i.qty, 0);
      totalRow.style.display = 'flex';
      totalRow.innerHTML = '<span>' + esc(T('cart_total')) + '</span><span>' + fmtPrice(total) + '</span>';
    } else {
      totalRow.style.display = 'none';
    }
  }

  const sendBtn = document.getElementById('cart-send-btn');
  if (sendBtn) {
    sendBtn.textContent = showPrices() ? T('cart_order') : T('cart_send');
    sendBtn.disabled = SHOP.cart.length === 0;
    sendBtn.style.opacity = SHOP.cart.length === 0 ? '0.55' : '1';
  }
}

/* ---------- Bestellung / Cotización per WhatsApp ---------- */
function sendCartWhatsApp() {
  if (SHOP.cart.length === 0) return;
  const intro = showPrices() ? T('cart_wa_intro_order') : T('cart_wa_intro');

  let text = intro + '\n';
  SHOP.cart.forEach(i => {
    const p = productById(i.id);
    if (!p) return;
    text += '\n• ' + i.qty + '× ' + productName(p, true);
    if (showPrices() && typeof p.price === 'number') {
      text += ' — ' + fmtPrice(p.price * i.qty);
    }
  });

  if (showPrices()) {
    const priced = SHOP.cart.map(i => ({ i, p: productById(i.id) }))
      .filter(x => x.p && typeof x.p.price === 'number');
    if (priced.length === SHOP.cart.length) {
      const total = priced.reduce((s, x) => s + x.p.price * x.i.qty, 0);
      text += '\n\n' + T('cart_total') + ': ' + fmtPrice(total);
    }
  }

  const note = document.getElementById('cart-note');
  if (note && note.value.trim()) {
    text += '\n\n' + T('cart_wa_note') + ': ' + note.value.trim();
  }

  const num = (AEV.site.shop && AEV.site.shop.orderNumber) || '595982300202';
  window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(text), '_blank');
}
