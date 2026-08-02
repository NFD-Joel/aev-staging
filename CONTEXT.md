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

---

## Languages

The website is **bilingual: Spanish (ES) and German (DE).**
A language switcher (ES / DE buttons) is in the navigation bar.
All text content is stored in a `translations` JavaScript object with keys for each language.
English may be added later as a third language.

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
- The green accent color (`#5bbf3c`) is used for highlights and italic product name suffixes

---

## File Location

```
/projects/aev/website/
└── index.html        ← main website file (single HTML file, no build system)
```

The entire website is a **single self-contained `index.html` file** — HTML, CSS, and JavaScript are all in one file. There is no framework, no bundler, no npm. Just plain HTML/CSS/JS.

The team photo (`team.jpg` or similar) should be placed in the same directory and referenced as a relative path.

---

## Website Structure

The site is a **one-page website** with the following sections (in order):

1. **Navigation Bar** — Logo, 3 links (Nosotros / Productos / Contacto), language switcher
2. **Hero** — Tagline, subtext, CTA buttons ("Solicitar Cotización" / "Ver Productos →")
3. **About Us (Nosotros)** — Mission, values, team photo placeholder
4. **Products & Services (Productos)** — Tabbed layout (3 tabs: Filtros Domésticos / Pre-Filtros / Servicios)
5. **Why AEV (¿Por qué elegirnos?)** — 4 benefit cards
6. **Contact (Contacto)** — Contact info + contact form

> **Note:** The Portfolio section was intentionally removed because the company is young and doesn't yet have enough completed projects to showcase.

---

## Products

### Tab 1: Filtros Domésticos (Home Filters — all Reverse Osmosis)

| Product | Key Features | Capacity |
|---|---|---|
| **Blue Infinity** | Self-priming, no tank, connects to faucet, can supply a Blue Pure from its output, 2 filters (PCB: yearly, RO: every 3 years), Aqua-Stop | 1.5 L/min direct flow |
| **Blue Pure** | Countertop, hot/cold/ambient water, ice maker, presets, touch control, parental controls, needs water pressure | 4.2 L immediate |
| **Blue Sparkling** | Same as Blue Pure + integrated soda bubbler (for sparkling water/drinks), UV sterilization | 2.4 L immediate |
| **Blue Café** | Same as Blue Pure + integrated coffee machine (espresso, lungo, americano, tea), UV sterilization | 2.4 L immediate |
| **Blue Ambient** | Simplified countertop, ambient temperature water only, touch control, presets, no hot/cold | 5 L immediate |

### Tab 2: Pre-Filtros

| Product | Key Features |
|---|---|
| **PreFilter** | Installed at home entrance, filters coarse particles, protects faucets/showers/washing machines/home filters, backwashable, disassemblable for manual cleaning |
| **Decal Sor** | Large lime/scale removal filter, all household water passes through it, protects appliances and pipes |
| **Canillas AEV (Faucets)** | Dual-handle faucets: one for tap water, one for filtered water (from Blue Infinity), 2–3 models available |

### Tab 3: Servicios

| Service | Description |
|---|---|
| **Mantenimiento & Servicio** | Post-installation service: filter changes, periodic inspections, technical support |
| **Asesoría & Análisis** | Water quality testing and personalized system recommendation |

---

## JavaScript Architecture

- All translations live in a `translations` object: `translations.es` and `translations.de`
- `setLang(lang)` function updates all `[data-i]` elements and `[data-placeholder]` attributes
- `filterProducts(cat)` function controls the product tab display (categories: `homefilters`, `prefilters`, `services`)
- Product cards use `data-cat` attribute to match tab filters
- Cards are shown/hidden via `.visible` CSS class

---

## Things Still To Do / Known Placeholders

- [x] **Team photo:** Embedded as base64 data URL directly in `index.html` (no external file dependency).
- [x] **Mobile responsiveness:** Hamburger menu at ≤800px, grids collapse at ≤900px/600px, hero fixes at ≤600px/400px. Language switcher included inside hamburger dropdown.
- [x] **Design polish:** Scroll fade-up animations (Intersection Observer), hero decorative circles, trust indicators, product card hover border, why-card hover, nav scroll shadow, footer border, typography improvements.
- [x] **Contact form:** On submit, opens WhatsApp (`wa.me/595982300202`) with name, email, subject and message pre-filled. Language-aware labels (ES/DE). Name and message are required fields.
- [x] **Logo:** SVG logo (`images/logo.svg`) in navbar, replaces plain text. SVG chosen over PNG (38KB vs 631KB).
- [x] **Hero watermark:** Water droplet pattern (`images/background-wasserzeichen.jpg`) as hero background at `opacity:0.35`.
- [x] **Scroll indicator:** Animated chevron arrow at bottom-center of hero, links to `#about`, hidden on mobile ≤600px.
- [ ] **Hero section visual — OPEN:** Hero still feels empty/generic. Two approaches tried and reverted: (1) text messaging changes broke the slogan, (2) product thumbnail strip + gap reduction didn't feel right either. **Next direction to explore:** Replace the fair card (right side) with a prominent product image as the visual centerpiece; move fair info to a small overlay badge. Reference site for inspiration: waterdropfilter.com. **Key open question:** Do we have lifestyle photos (product in use, kitchen setting)? If yes, a full-bleed background image approach (like waterdrop) becomes possible.
- [ ] **Portfolio section:** Not yet added — to be considered once the company has more completed installations to showcase.
- [ ] **English language:** The `translations` object only has `es` and `de` keys. English (`en`) can be added later.
- [x] **Prices:** Intentionally omitted — site purpose is to inform and generate contact, not sell online. Pricing is discussed directly with the customer.
- [x] **Product images:** All product cards have real photos with transparent backgrounds (base64 embedded): Blue Infinity, Blue Pure, Blue Sparkling, Blue Café, Blue Ambient, Blue PreFiltro, Blue DecalSor, Canillas (ES + DE). Service cards intentionally use emoji icons. File versions also exist in `images/` folder.
- [x] **Product naming:** Blue PreFiltro (was PreFilter), Blue DecalSor (was Decal Sor), Canillas (was Canillas AEV). Reflected in translations (ES+DE), HTML, alt text, and image filenames.
- [x] **Spec tag translations:** All product spec tags have `data-i` keys and translate correctly in ES/DE.
- [x] **Browser tab & favicon:** Title is "Agua es Vida" (AEV removed). Blue water-drop SVG favicon added inline.
