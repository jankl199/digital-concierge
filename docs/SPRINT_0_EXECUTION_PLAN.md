# Sprint 0 – Execution Plan (Signature Villas)

## Ziel
In 5-7 Tagen die Basis festziehen, damit Sprint 1 direkt umsetzbar ist.

## Scope
1. Architektur-Entscheidungen (MVP)
2. Datenmodell v1 (tenant-ready)
3. Security/GDPR-Baseline
4. API-Skeleton + Guardrails (RBAC + Stay Phase)
5. Backlog für Sprint 1

## Architektur (MVP)
- Backend: Node.js + Express
- DB: PostgreSQL (+ pgvector in Sprint 2)
- Cache/Jobs: Redis
- Storage: S3-kompatibel (Dokumente)
- Messaging: WhatsApp (später), Webchat zuerst

## Entscheidungen
- Multi-Tenancy: `property_id` auf allen domain-relevanten Tabellen
- Stay-Phase: wird serverseitig aus check-in/check-out + timezone bestimmt
- Sensitive Daten: niemals in Chat-Logs; nur über Vault-Endpoint mit Policy-Check

## Deliverables dieses Sprints
- `architecture/data-model-v1.sql`
- `architecture/security-baseline.md`
- `apps/api/src/*` (API Skeleton)
- `docs/SPRINT_1_BACKLOG.md`
