# Machens Bauelemente · Hörmann Hannover

Statische Website für Gerhard Machens · Bauelemente Montagen, Hörmann-Montagepartner in Hannover.

---

## 🚀 Deployment

### Option A — Netlify (empfohlen, Drag & Drop)

1. Gehe zu **<https://app.netlify.com/drop>**
2. Ziehe den **gesamten Ordner** (alle HTML-Dateien + `assets/`) in das Browser-Fenster
3. Netlify deployt sofort und gibt dir eine URL wie `https://random-name.netlify.app`
4. ⚠️ **Wichtig: Mach jetzt Schritt 3 unten** — sonst kommen keine Form-Mails an!

### Option B — Netlify via GitHub

1. Push den gesamten Ordner in ein GitHub-Repo
2. In Netlify: **"Add new site" → "Import an existing project" → GitHub**
3. Wähle das Repo. Build-Settings können leer bleiben (ist statisches HTML).
4. Publish-Directory: `/` (Root)

---

## 📧 Schritt 3 — E-Mail-Benachrichtigung einrichten (PFLICHT!)

Damit jede Anfrage automatisch an **leonpeschke09@gmail.com** geschickt wird:

1. Im Netlify-Dashboard: dein Site auswählen
2. Links im Menü: **Forms** anklicken
3. Du siehst dort das Formular **"anfrage"** (taucht auf, sobald die erste Anfrage eingeht — oder du kannst das Formular sofort sehen, sobald die Seite live ist)
4. Klick auf das Formular → oben Reiter **"Settings & usage"** (oder Zahnrad-Icon)
5. Scroll zu **"Form notifications"** → **"Add notification"** → **"Email notification"**
6. Felder:
   - **Event to listen for:** `New form submission`
   - **Email to notify:** `leonpeschke09@gmail.com`
   - **Form:** `anfrage`
7. **Save**

Ab jetzt landet jede ausgefüllte Anfrage in deinem Posteingang.

> 💡 **Tipp:** Du kannst weitere Empfänger hinzufügen (z. B. Gerhards Adresse `info@1agaragentore.de` oder `gerhard.machens@gmail.com`) — einfach nochmal "Add notification".

---

## 🔍 Was unter der Haube passiert

- Das Formular hat den `name="anfrage"` und das Attribut `data-netlify="true"` — Netlify erkennt es automatisch beim ersten Deploy.
- Versteckte Felder (`form-name`, `bot-field`) werden für die Netlify-API und Spam-Schutz benötigt.
- JavaScript sendet die Daten per `fetch` ohne Page-Reload und zeigt eine Inline-Bestätigung.
- **Fallback:** Falls JS deaktiviert ist, leitet das Formular nach Submit auf `/danke.html` weiter — funktioniert also immer.
- **Spam-Schutz:** Das Honeypot-Feld (`bot-field`) blockt unsichtbar die meisten Bots; bei viel Spam kann zusätzlich reCAPTCHA in Netlify aktiviert werden.

---

## 📁 Dateistruktur

```
.
├── index.html                       Startseite
├── garagen-sektionaltore.html       Sektionaltore
├── garagen-schwingtore.html         Schwingtore
├── garagen-rolltore.html            Rolltore RollMatic
├── seiten-sektionaltore.html        Seiten-Sektionaltore
├── garagen-nebentuer.html           Garagen-Nebentür
├── garagentor-antrieb.html          Garagentor-Antrieb
├── einfahrtstor-antrieb.html        Einfahrtstor-Antrieb
├── anfrage.html                     Kontaktformular-Seite
├── danke.html                       Bestätigung nach Submission
└── assets/
    ├── styles.css                   Gemeinsames Stylesheet
    ├── main.js                      Gemeinsames JavaScript
    └── img/
        └── logo.png                 GM-Logo
```

---

## 💸 Kosten

- **Netlify Free-Tier** reicht für diese Seite locker:
  - 100 GB Bandwidth/Monat
  - **100 Form-Submissions/Monat kostenlos**
  - Unbegrenzte E-Mail-Notifications
- Bei mehr als 100 Anfragen/Monat: Forms Level 1 für 19 USD/Monat (1.000 Submissions). Realistisch wirst du das nicht brauchen.

---

## ✏️ Die wichtigsten Stellen zum Anpassen

| Was               | Wo                                                        |
|-------------------|-----------------------------------------------------------|
| Telefon-Nummer    | Suche `05131463233` und `05131 / 463233` (alle Seiten)   |
| E-Mail-Adresse    | Suche `info@1agaragentore.de` (alle Seiten)              |
| Adresse           | Suche `Glockenblumenweg 20` im Footer (alle Seiten)      |
| Logo              | `assets/img/logo.png` ersetzen (Format gleichlassen)     |
| Farben            | `assets/styles.css` → ganz oben unter `:root { ... }`    |
