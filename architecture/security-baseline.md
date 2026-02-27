# Security Baseline (MVP)

## Must-have rules
1. Sensitive values (door/alarm/safe codes) are never stored in chat logs.
2. Sensitive values are never indexed in RAG.
3. Controlled reveal requires all:
   - authenticated guest session
   - booking linked to property
   - phase == active_stay
   - value in valid time window
4. Every reveal action writes audit event.

## Data retention (proposal)
- chat logs: 90 days
- guest sessions: 30 days
- booking metadata: 180 days (unless legal needs differ)
- audit logs: 365 days

## GDPR notes
- Minimize PII collection
- Export/delete endpoints for data subject rights
- Explicit opt-in for marketing/rebooking outreach

## Operational basics
- Rate limits on auth + chat + reveal endpoints
- Structured error logging (without sensitive payload)
- Secrets via env/KMS; never hardcoded
