# AEV Website — Project Context

## About the Business

**Company Name:** Agua es Vida (short: AEV)
**Website:** www.aguaesvida.com.py
**Email:** info@aguaesvida.com.py
**Location:** Asunción, Paraguay (also active in the Chaco region)

**What we do:** We sell and service water filtration systems based on reverse osmosis (Osmosis Inversa) technology for homes and businesses.

**Stage:** Young company, currently in its 4th year of operation. We do NOT use inflated statistics or fake numbers — honesty and authenticity are important to us.

**Tagline (ES):** "Filtrá, tomá y disfrutá — directamente de la red de agua de tu casa"
**Tagline (EN):** "Filter, drink and enjoy — directly from your home's water supply"

---

## Team

**CEOs:** Jakob Gossen, Andreas Wiebe, Heinrich Neufeld
**Partner (Socio):** Marvin Joel Neufeld

---

## Contact Details

| Channel | Details |
|---|---|
| WhatsApp (main) | +595 982 300 202 |
| WhatsApp (Chaco) | +595 982 619 202 |
| Email | info@aguaesvida.com.py |
| Website | www.aguaesvida.com.py |
| Facebook | Agua Es Vida PY |
| Instagram | @aguaesvida_py |

> Contact data is **data-driven**: edit `data/site.json`, not the HTML.

---

## Deployment

- **Staging:** repo `NFD-Joel/aev-staging` → https://aev.xaytag.com (GitHub Pages, noindex via robots.txt)
- **Official:** repo `NFD-Joel/aev-website` → https://aguaesvida.com.py (GitHub Pages)
- Promote staging → official with `../promote.sh` (excludes CNAME + robots.txt)

---

## Architecture (rebuilt 2026-08, shop-ready)

No framework, no build step — plain HTML/CSS/JS, **data-driven** via JSON files.
All frequently changing content lives in `data/` and is editable via the GitHub
web UI without touching code (see `ANLEITUNG.md`).

```
index.html          Startseite: Hero, Nosotros, Destacados, Why, Contacto
tienda.html         Shop: Kategorie-Tabs, Katalog, Produkt-Modal, Warenkorb
privacy.html        Datenschutzerklärung (standalone)
404.html            Fehlerseite (standalone)
css/style.css       gesamtes Styling (Markenfarben als CSS-Variablen)
js/app.js           i18n, Nav, Ankündigungsbanner, Kontaktformular, site.json-Links
js/shop.js          Katalog-Rendering, Modal, Warenkorb (localStorage), WhatsApp-Checkout
data/site.json      Kontaktdaten, Messebanner/Flyer, Hero-Bild, Shop-Modus
data/products.json  Produktkatalog (Kategorien, Produkte, Services; price/available/featured)
data/translations.json  Alle UI-Texte in ES und DE
images/             Produktfotos, Logo, Teamfoto, Flyer (echte Dateien, kein Base64 mehr)
ANLEITUNG.md        Redaktions-Anleitung (deutsch): Inhalte ändern ohne Code
```

### Shop concept

- Default mode (`site.json → shop.showPrices: false`): the Tienda works as a
  **quote-request shop** — cart collects products, checkout sends a WhatsApp
  message asking for a cotización. No prices shown (matches company policy).
- Future mode (`showPrices: true` + `price` values in `products.json`): prices
  in Gs. are displayed, cart shows a total, checkout sends a WhatsApp order.
  Online payment would be a later step.
- Services were removed from the Tienda (2026-08-02, user decision) — maintenance
  and consulting are handled via the contact section / WhatsApp instead. The
  `type: "service"` rendering path in `js/shop.js` still exists if ever needed.

### i18n — FOUR languages (since 2026-08-02)

- The site is available in **es, de, en, nl**. `data/translations.json` holds all
  four dicts; static HTML uses `data-i` / `data-placeholder` attributes;
  JS-rendered content re-renders on the `aev:lang` custom event. Language
  persists in `localStorage (aev_lang)`. Fallback is always `es`.
- Product texts carry all four languages inside `products.json`
  (`desc.es/de/en/nl`, same for `tags`, `capacity`, category `label`).
- **RULE (user request): every future text change must be made in all 4
  languages** — translations.json, products.json and site.json announcement.

### Cart

- `localStorage (aev_cart)` as `[{id, qty}]`, rendered against `products.json`.
- Cart drawer + product modal markup exists on **both** pages.

---

## Products

Categories: **Filtros Domésticos** (Blue Infinity, Pure, Sparkling, Café, Ambient),
**Pre-Filtros** (Blue PreFiltro, Blue DecalSor), **Canillas** (own category —
2–3 faucet models exist; more can be added as separate products with photos).
Full specs live in `data/products.json` — that file is the single source of truth now.

---

## Design & Brand Style

- **Style:** Clean & minimal
- **Color palette (from official catalog):**
  - Primary blue: `#1a5fa8`
  - Aqua / Sky blue: `#4dc8e8`
  - Light background: `#eaf7fd`
  - Dark text: `#1a3a5c`
  - Gray text: `#4a7a9b`
  - Green accent: `#5bbf3c`
- **Font:** Segoe UI (system font)
- **Background gradient (hero):** `#e0f6fd → #c8eef9 → #a8e4f5`
- Green accent is used for highlights and italic product name suffixes

---

## Notes / History

- Old site was a single self-contained `index.html` with base64-embedded images
  (~4.3 MB). Rebuilt 2026-08 into the data-driven structure above; images are
  now real files (page weight massively reduced).
- The hero "fair card" was replaced by a product image centerpiece; fair/Messe
  info moved to the announcement banner driven by `data/site.json`.
- Prices intentionally omitted by default — site generates contacts, not sales.
- Portfolio section still postponed until more installations exist.
- English (`en`) not yet added.
