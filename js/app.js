/* ============================================================
   Agua es Vida — Gemeinsame Logik (beide Seiten)
   Lädt data/translations.json + data/site.json und steuert
   Sprache, Ankündigungsbanner, Navigation und Kontaktformular.
   ============================================================ */
'use strict';

const AEV = {
  lang: localStorage.getItem('aev_lang') || 'es',
  t: {},        // translations.json
  site: {},     // site.json
  ready: null   // Promise — shop.js wartet darauf
};

AEV.ready = Promise.all([
  fetch('data/translations.json').then(r => r.json()),
  fetch('data/site.json').then(r => r.json())
]).then(([t, site]) => {
  AEV.t = t;
  AEV.site = site;
  applyLang(AEV.lang);
  renderAnnouncement();
  applySiteLinks();
}).catch(err => console.error('AEV: Daten konnten nicht geladen werden', err));

/* ---------- Sprache ---------- */
function applyLang(lang) {
  if (!AEV.t[lang]) lang = 'es';
  AEV.lang = lang;
  localStorage.setItem('aev_lang', lang);
  const t = AEV.t[lang];

  document.querySelectorAll('[data-i]').forEach(el => {
    const k = el.getAttribute('data-i');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });
  document.querySelectorAll('[data-placeholder]').forEach(el => {
    const k = el.getAttribute('data-placeholder');
    if (t[k] !== undefined) el.placeholder = t[k];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.documentElement.lang = lang;

  // Banner-Text neu setzen und Shop informieren
  renderAnnouncement();
  document.dispatchEvent(new CustomEvent('aev:lang', { detail: { lang } }));
}

function setLang(lang) { applyLang(lang); }

/* Übersetzungs-Helfer für JS-generierte Texte */
function T(key) {
  return (AEV.t[AEV.lang] && AEV.t[AEV.lang][key]) || key;
}

/* ---------- Ankündigungsbanner (Messe/Flyer, aus site.json) ---------- */
function renderAnnouncement() {
  const bar = document.getElementById('announce-bar');
  if (!bar) return;
  const a = AEV.site.announcement;
  if (!a || !a.enabled) { bar.classList.remove('show'); return; }

  const text = (a.text && a.text[AEV.lang]) || '';
  const cta  = (a.cta && a.cta[AEV.lang]) || '';
  let html = '<span>' + text + '</span>';
  if (a.image) {
    html += '<button type="button" onclick="openLightbox()">' + cta + '</button>';
  } else if (a.link) {
    html += '<a href="' + a.link + '" target="_blank" rel="noopener">' + cta + '</a>';
  }
  bar.innerHTML = html;
  bar.classList.add('show');

  const lbImg = document.getElementById('lightbox-img');
  if (lbImg && a.image) lbImg.src = a.image;
}

function openLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.add('open');
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

/* ---------- Kontaktdaten aus site.json in Links spiegeln ---------- */
function applySiteLinks() {
  const c = AEV.site.contact;
  if (!c) return;
  const map = {
    'wa-main':  { href: 'https://wa.me/' + c.whatsapp_main,  text: c.whatsapp_main_display },
    'wa-chaco': { href: 'https://wa.me/' + c.whatsapp_chaco, text: c.whatsapp_chaco_display },
    'email':    { href: 'mailto:' + c.email,                 text: c.email },
    'facebook': { href: c.facebook },
    'instagram':{ href: c.instagram }
  };
  document.querySelectorAll('[data-site]').forEach(el => {
    const m = map[el.getAttribute('data-site')];
    if (!m) return;
    if (el.tagName === 'A' && m.href) el.href = m.href;
    if (m.text && el.hasAttribute('data-site-text')) el.textContent = m.text;
  });

  // Hero-Produktbild (aus site.json steuerbar)
  const heroImg = document.getElementById('hero-product-img');
  if (heroImg && AEV.site.hero && AEV.site.hero.image) {
    heroImg.src = AEV.site.hero.image;
    if (AEV.site.hero.image_alt) heroImg.alt = AEV.site.hero.image_alt;
  }
}

/* ---------- Navigation ---------- */
function toggleMenu() {
  document.querySelector('nav').classList.toggle('nav-open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.querySelector('nav').classList.remove('nav-open'));
  });
  window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 10);
  });

  // Scroll-Einblendungen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Lightbox / Modals per Escape oder Klick auf Hintergrund schließen
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      const drawer = document.getElementById('cart-drawer');
      if (drawer) { drawer.classList.remove('open'); document.getElementById('cart-overlay').classList.remove('open'); }
    }
  });
  const lb = document.getElementById('lightbox');
  if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
});

/* ---------- Kontaktformular ---------- */
function validateForm() {
  const name = document.getElementById('form-name').value.trim();
  const msg  = document.getElementById('form-msg').value.trim();
  if (!name || !msg) { alert(T('form_err')); return false; }
  return true;
}

function formData() {
  return {
    name:    document.getElementById('form-name').value.trim(),
    email:   document.getElementById('form-email').value.trim(),
    subject: document.getElementById('form-subject').value.trim(),
    msg:     document.getElementById('form-msg').value.trim()
  };
}

function sendWhatsApp() {
  if (!validateForm()) return;
  const d = formData();

  let text = T('wa_greet') + ' ' + d.name;
  if (d.email)   text += '\n' + T('wa_email_label') + ': ' + d.email;
  if (d.subject) text += '\n' + T('wa_subject_label') + ': ' + d.subject;
  if (d.msg)     text += '\n\n' + d.msg;

  const num = (AEV.site.contact && AEV.site.contact.whatsapp_main) || '595982300202';
  window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(text), '_blank');
  document.querySelector('.contact-form').reset();
}

function sendEmail() {
  if (!validateForm()) return;
  const d = formData();
  let body = T('wa_greet') + ' ' + d.name;
  if (d.email) body += '\n' + T('wa_email_label') + ': ' + d.email;
  body += '\n\n' + d.msg;
  const sub = d.subject || T('wa_default_subject');
  const addr = (AEV.site.contact && AEV.site.contact.email) || 'info@aguaesvida.com.py';
  window.location.href = 'mailto:' + addr + '?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
}
