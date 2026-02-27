# WhatsApp Concierge MVP (Twilio Sandbox + AI)

Schneller MVP für deinen digitalen Concierge über WhatsApp.

## Was ist drin?

- ✅ Twilio WhatsApp Sandbox Webhook
- ✅ Node/Express Backend
- ✅ OpenAI Responses API (optional, mit Fallback)
- ✅ Testdaten (Haus + Buchung)
- ✅ 3 Sicherheitsregeln:
  1. Zugriff nur nach `START <BOOKING-ID> <PIN>`
  2. Zugriff nur im Zeitfenster Check-in bis Check-out + Grace
  3. Sensible Daten nur bei aktiver Session

---

## 1) Setup lokal

```bash
cd /Users/jan/.openclaw/workspace/whatsapp-concierge-mvp
npm install
cp .env.example .env
```

In `.env` setzen:

- `OPENAI_API_KEY=...`
- `TWILIO_AUTH_TOKEN=...`
- `TWILIO_VERIFY_SIGNATURE=false` (für ersten Test)

Dann starten:

```bash
npm run dev
```

Healthcheck:

```bash
curl http://localhost:3000/health
```

---

## 2) Öffentliche URL für Twilio

Twilio braucht eine öffentliche Webhook-URL.

Beispiel mit ngrok:

```bash
ngrok http 3000
```

Nimm die HTTPS-URL, z. B. `https://abc-123.ngrok-free.app`.

Webhook in Twilio Sandbox eintragen:

`https://abc-123.ngrok-free.app/webhook/whatsapp`

---

## 3) Twilio WhatsApp Sandbox

1. Twilio Console öffnen
2. Messaging → Try it out → WhatsApp Sandbox
3. Dort steht ein Join-Code wie `join <word>`
4. Von deinem WhatsApp an die Sandbox-Nummer diesen Join-Text senden
5. Danach kannst du mit dem Bot chatten

---

## 4) Test-Flow

In WhatsApp:

1. Verifizieren:

```text
START TEST-1001 123456
```

2. Dann Fragen stellen, z. B.:
- `Wo ist der Sicherungskasten?`
- `Gibt es eine Pizza Empfehlung?`
- `Wie ist der Türcode?`

3. Bei Bedarf:
- `HUMAN`

---

## 5) Wichtige Hinweise für Produktion

MVP ist absichtlich simpel. Für live Betrieb brauchst du:

- persistente DB (nicht in-memory)
- echte Buchungsanbindung (PMS/iCal)
- rotierende Türcodes / Smart Lock Integration
- Twilio Signature Validation aktivieren (`TWILIO_VERIFY_SIGNATURE=true`)
- DSGVO-konforme Speicherung & Löschfristen

---

## Dateistruktur

- `src/server.js` – Webhook + Logik
- `data/houses.json` – Hauswissen
- `data/bookings.json` – Test-Buchungen
- `.env.example` – Umgebungsvariablen

