# Signature Villas – Realistischer Umsetzungsplan (v0.1)

## Was Jens **eigentlich** will (kompakt)
Nicht nur ein WhatsApp-Bot, sondern eine **vollständige B2B SaaS-Plattform** für Ferienvillen:
- Mandantenfähig (pro Villa/Owner getrennt)
- AI Concierge (Web zuerst, WhatsApp danach)
- RAG auf Hauswissen (manual + owner inputs)
- Sichere Ausgabe sensibler Daten (Türcode etc.) mit Regeln
- Feedback/Reports
- Rebooking-Funnel für Signature Villas

## Was bereits da ist (aus unserem Stand)
- WhatsApp-Prototyp läuft lokal
- Web-Demo-Frontend vorhanden (Sales/Demo-Story)
- Grundidee "Concierge" klar und zeigbar

## Was noch fehlt für echtes Produkt
1. Tenant-Isolation + Rollenmodell + Auth
2. Booking-/Phasenlogik als zentrale Policy
3. RAG-Pipeline mit Source-Priorisierung
4. Secure Vault + Audit Logs
5. Dashboard (Owner/Admin)
6. Stabiler 24/7 Betrieb (Cloud Deploy, Monitoring)

---

## Empfehlung: 2-Spur-Ansatz

### Spur A – "Show" (Sales Demo)
- Klickbare Demo + WhatsApp-Flow für Pitch
- Fake/Seed-Daten für 2–3 Demo-Villen
- Ziel: Stakeholder überzeugen

### Spur B – "Build" (Produktkern)
- Saubere API + DB + Security + Governance
- Ziel: Signature Villas live

---

## Realistische Priorisierung (8–12 Wochen MVP)

### Sprint 0 (1 Woche)
- Final Scope + Architekturentscheidungen
- Security-/DSGVO-Baseline
- Staging Setup

### Sprint 1 (2 Wochen)
- Datenmodell: Property, User, Role, Booking, StayPhase
- Auth (Magic Link + PIN)
- Tenant-Isolation

### Sprint 2 (2 Wochen)
- Knowledge Upload + Chunking + Retrieval
- Antwortlogik mit "keine verlässliche Info"-Fallback

### Sprint 3 (2 Wochen)
- Secure Vault für sensitive Felder
- Controlled Reveal + Audit Logging

### Sprint 4 (2 Wochen)
- Guest Webchat + Owner Mini Dashboard
- Feedback + Monatsreport (basic)

### Sprint 5 (1–2 Wochen)
- WhatsApp produktionsnah integrieren
- Opt-in / Template-Flow

---

## Architekturvorschlag (pragmatisch)
- Backend: Node.js (Nest/Fastify) oder Python FastAPI
- DB: Postgres (mit row-level security für tenant isolation)
- Vector: pgvector (Start), später optional dediziert
- Queue/Jobs: Redis + worker
- Object Storage: S3-kompatibel (Manuals)
- Vault: KMS-gestützte Encryption (app-level + key rotation)
- Frontend: Next.js/React (Guest + Owner)
- WhatsApp: Meta Cloud API oder Twilio (je nach Verfügbarkeit)
- Deploy: Render/Fly/Railway (MVP), später AWS/GCP

---

## Was in Jens' Liste für MVP ggf. "zu groß" ist
- Direkt Payment/Payout in v1
- Voller Multi-Channel Omnichannel-Stack in v1
- Sehr tiefe BI/Analytics in v1

=> Besser: Erst funktionierender Core + 2 Pilot-Villen live.

---

## Definition of Done (MVP-Realität)
- 1) Gast kann authentifiziert chatten (Web)
- 2) System beantwortet Hausfragen aus KB mit Quellenpriorität
- 3) Sensitive Daten nur mit Phase+Auth+Zeitfenster
- 4) Audit-Log ist nachweisbar
- 5) Owner sieht Top Fragen + Feedback monatlich
- 6) 1 WhatsApp-Pilotflow stabil
