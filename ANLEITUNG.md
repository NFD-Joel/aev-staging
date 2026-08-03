# Inhalte ändern — ohne Code anzufassen

Alle regelmäßig wechselnden Inhalte liegen in **`data/`** als JSON-Dateien.
Du kannst sie direkt auf GitHub im Browser bearbeiten — die Seite aktualisiert
sich automatisch ca. 1 Minute nach dem Speichern.

**So geht's:** github.com/NFD-Joel/aev-staging → Datei anklicken → ✏️ (Edit) →
ändern → "Commit changes". Fertig.

---

## 1. Messebanner / Flyer wechseln → `data/site.json`

```json
"announcement": {
  "enabled": true,                              ← false = Banner weg
  "image": "images/fair-expo-pioneros.jpg",     ← der Flyer (Klick öffnet ihn groß)
  "text": {
    "es": "📅 ¡Visitanos en la Expo Pioneros del Chaco!",
    "de": "📅 Besuch uns auf der Expo Pioneros im Chaco!"
  },
  "cta": { "es": "Ver flyer", "de": "Flyer ansehen" }
}
```

**Neuen Flyer hochladen:** im Ordner `images/` → "Add file" → "Upload files",
dann oben den Dateinamen bei `"image"` anpassen.

## 2. Produkt ändern / hinzufügen → `data/products.json`

Jedes Produkt ist ein Block. Für ein neues Produkt: bestehenden Block kopieren,
`id` eindeutig machen, Bild nach `images/` hochladen. Wichtige Felder:

| Feld | Bedeutung |
|---|---|
| `price` | `null` = "Consultar precio" · Zahl (z.B. `4500000`) = Preis in Gs. |
| `available` | `false` = wird als "nicht verfügbar" angezeigt |
| `featured` | `true` = erscheint auf der Startseite unter "Destacados" |
| `desc`, `tags`, `capacity` | Texte immer in `es` und `de` |

## 3. Shop scharf schalten (später) → `data/site.json`

Solange `"showPrices": false` ist, arbeitet die Tienda als **Cotización-Anfrage**
(Warenkorb → WhatsApp-Anfrage, ohne Preise). Wenn Preise verkauft werden sollen:

1. In `products.json` bei den Produkten `price` eintragen (Guaraní, ohne Punkte)
2. In `site.json`: `"showPrices": true`

Dann zeigt die Seite Preise + Gesamtsumme und der Warenkorb wird zur Bestellung
per WhatsApp. (Online-Zahlung wäre ein späterer Ausbauschritt.)

## 4. Kontaktdaten / Nummern → `data/site.json`

WhatsApp-Nummern, E-Mail und Social-Links unter `"contact"`. Werden überall
auf der Seite automatisch übernommen (Kontaktsektion, Buttons, Float-Button).

## 5. Texte der Website → `data/translations.json`

Alle festen Texte (Hero, Über uns, Warum AEV, Formular …) in **vier Sprachen**:
`es` (Spanisch), `de` (Deutsch), `en` (Englisch), `nl` (Niederländisch).

> ⚠️ **Wichtig:** Textänderungen immer in **allen 4 Sprachen** machen — auch bei
> Produkttexten in `products.json` und beim Banner in `site.json`.

## 6. Hero-Produktbild → `data/site.json` → `"hero"`

Das große Produktbild auf der Startseite. Pfad auf ein anderes Bild in
`images/` zeigen lassen.

---

## Staging → offizielle Seite

Änderungen hier sind nur auf **aev.xaytag.com** sichtbar. Wenn alles passt,
auf dem Rechner ausführen:

```bash
cd ~/Claude/projects/aev && ./promote.sh
```

Das überträgt den Stand auf die offizielle Seite (aguaesvida.com.py).
