import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import twilio from "twilio";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "public")));

const PORT = Number(process.env.PORT || 3000);
const VERIFY_SIGNATURE = String(process.env.TWILIO_VERIFY_SIGNATURE || "false") === "true";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const DEMO_MESSAGE = process.env.DEMO_MESSAGE || "Willkommen im digitalen Concierge von Oceanview Villa 👋 Frag mich alles zu Haus, Umgebung und Check-in.";

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const baseDir = path.resolve(process.cwd());
const houses = JSON.parse(fs.readFileSync(path.join(baseDir, "data", "houses.json"), "utf8"));
const bookings = JSON.parse(fs.readFileSync(path.join(baseDir, "data", "bookings.json"), "utf8"));

/**
 * In-memory session store for MVP.
 * key: whatsapp from number (e.g. whatsapp:+4917...)
 */
const activeSessions = new Map();

const SENSITIVE_KEYWORDS = [
  "code",
  "zugang",
  "passwort",
  "alarm",
  "wifi passwort",
  "wlan passwort",
  "schlüssel",
  "schluessel"
];

function normalize(text = "") {
  return text.toLowerCase().trim();
}

function nowMs() {
  return Date.now();
}

function toMs(iso) {
  return new Date(iso).getTime();
}

function getBooking(bookingId) {
  return bookings.find((b) => b.bookingId.toUpperCase() === String(bookingId || "").toUpperCase());
}

function withinAccessWindow(booking) {
  const start = toMs(booking.checkIn);
  const end = toMs(booking.checkOut) + (booking.graceHours || 0) * 3600 * 1000;
  const now = nowMs();
  return now >= start && now <= end;
}

function isSensitiveQuestion(body) {
  const t = normalize(body);
  return SENSITIVE_KEYWORDS.some((k) => t.includes(k));
}

function buildTwiml(message) {
  const response = new twilio.twiml.MessagingResponse();
  response.message(message);
  return response.toString();
}

function verifyTwilioSignature(req) {
  if (!VERIFY_SIGNATURE) return true;
  if (!TWILIO_AUTH_TOKEN) return false;

  const signature = req.get("X-Twilio-Signature");
  if (!signature) return false;

  // IMPORTANT: Set PUBLIC_BASE_URL in production and use exact webhook URL.
  const publicBaseUrl = process.env.PUBLIC_BASE_URL;
  if (!publicBaseUrl) return false;

  const url = `${publicBaseUrl}/webhook/whatsapp`;
  return twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, req.body);
}

function fallbackAnswer(input, house) {
  const q = normalize(input);
  if (q.includes("pool")) return house.generalInfo.pool;
  if (q.includes("sicherung") || q.includes("fuse")) return house.generalInfo.fuseBox;
  if (q.includes("müll") || q.includes("muell")) return house.generalInfo.waste;
  if (q.includes("pizza") || q.includes("restaurant")) return `Empfehlung: ${house.localTips.pizza}`;
  if (q.includes("strand") || q.includes("beach")) return `Empfehlung: ${house.localTips.beach}`;

  return "Dazu habe ich gerade keine sichere Info. Bitte schreib 'HUMAN', dann leite ich dich an den Support weiter.";
}

async function aiAnswer(input, house) {
  if (!openai) return fallbackAnswer(input, house);

  const system = `
Du bist ein digitaler Ferienhaus-Concierge für ${house.name}.
Regeln:
1) Antworte kurz, freundlich, konkret.
2) Erfinde keine Fakten.
3) Wenn Information nicht im Kontext enthalten ist: verweise auf Human Support.
4) Gib sensible Daten nur aus, wenn sie im USER-KONTEXT explizit enthalten sind.
`;

  const context = {
    houseName: house.name,
    houseRules: house.houseRules,
    generalInfo: house.generalInfo,
    localTips: house.localTips,
    ownerEscalation: house.ownerEscalation
  };

  const prompt = `USER-KONTEXT (nur diese Daten nutzen):\n${JSON.stringify(context, null, 2)}\n\nGAST-FRAGE: ${input}`;

  const result = await openai.responses.create({
    model: OPENAI_MODEL,
    input: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  });

  return result.output_text?.trim() || fallbackAnswer(input, house);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "whatsapp-concierge-mvp" });
});

app.post("/webhook/whatsapp", async (req, res) => {
  try {
    if (!verifyTwilioSignature(req)) {
      res.status(403).send("Forbidden");
      return;
    }

    const from = req.body.From; // whatsapp:+4917...
    const body = String(req.body.Body || "").trim();
    const msg = normalize(body);

    if (!from) {
      res.type("text/xml").send(buildTwiml("Ungültige Anfrage."));
      return;
    }

    if (msg === "demo") {
      res.type("text/xml").send(buildTwiml(DEMO_MESSAGE));
      return;
    }

    if (msg === "human") {
      const session = activeSessions.get(from);
      const house = session ? houses[session.houseId] : null;
      const human = house?.ownerEscalation?.whatsapp || "Support";
      res.type("text/xml").send(buildTwiml(`Ich leite dich an den menschlichen Support weiter: ${human}`));
      return;
    }

    if (msg.startsWith("start ")) {
      const [, bookingId, pin] = body.split(/\s+/);
      const booking = getBooking(bookingId);
      if (!booking || booking.pin !== pin) {
        res.type("text/xml").send(buildTwiml("Verifizierung fehlgeschlagen. Format: START <BOOKING-ID> <PIN>"));
        return;
      }

      if (!withinAccessWindow(booking)) {
        res.type("text/xml").send(buildTwiml("Deine Buchung ist aktuell außerhalb des Zugriffszeitraums."));
        return;
      }

      activeSessions.set(from, {
        bookingId: booking.bookingId,
        houseId: booking.houseId,
        expiresAt: toMs(booking.checkOut) + (booking.graceHours || 0) * 3600 * 1000
      });

      res.type("text/xml").send(buildTwiml(`Verifiziert ✅ Willkommen bei ${houses[booking.houseId].name}. Du kannst jetzt Fragen stellen.`));
      return;
    }

    const session = activeSessions.get(from);
    if (!session) {
      res.type("text/xml").send(buildTwiml("Bitte zuerst verifizieren: START <BOOKING-ID> <PIN>"));
      return;
    }

    if (nowMs() > session.expiresAt) {
      activeSessions.delete(from);
      res.type("text/xml").send(buildTwiml("Session abgelaufen. Bitte Support kontaktieren."));
      return;
    }

    const house = houses[session.houseId];
    if (!house) {
      res.type("text/xml").send(buildTwiml("Hausdaten nicht gefunden. Bitte Support kontaktieren."));
      return;
    }

    // Sensitive guardrail
    if (isSensitiveQuestion(body)) {
      const answer = [];
      const q = normalize(body);
      if (q.includes("alarm")) answer.push(`Alarmcode: ${house.sensitive.alarmCode}`);
      if (q.includes("wifi") || q.includes("wlan")) answer.push(`WLAN Passwort: ${house.sensitive.wifiPassword}`);
      if (q.includes("zugang") || q.includes("code") || q.includes("schlüssel") || q.includes("schluessel")) {
        answer.push(`Türcode: ${house.sensitive.doorCode}`);
      }

      const out = answer.length
        ? `${answer.join("\n")}\n\nWichtig: Diese Daten sind nur während deines Aufenthalts gültig.`
        : "Bei sensiblen Anfragen konnte ich nichts eindeutig zuordnen. Schreib bitte genauer oder 'HUMAN'.";

      res.type("text/xml").send(buildTwiml(out));
      return;
    }

    const answer = await aiAnswer(body, house);
    res.type("text/xml").send(buildTwiml(answer));
  } catch (err) {
    console.error(err);
    res.type("text/xml").send(buildTwiml("Upps, interner Fehler. Bitte versuche es erneut oder schreibe HUMAN."));
  }
});

app.listen(PORT, () => {
  console.log(`whatsapp-concierge-mvp läuft auf http://localhost:${PORT}`);
});
