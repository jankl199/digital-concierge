# Sprint 1 Backlog (Core)

## Epic A: Tenant & Access
- [ ] Property CRUD (Admin)
- [ ] Role assignment (Owner/Manager)
- [ ] Booking + guest binding
- [ ] Stay-phase resolver middleware

## Epic B: Guest Access
- [ ] Magic link or booking PIN auth
- [ ] Guest session token bound to booking_id
- [ ] Guest chat endpoint (web)

## Epic C: Policies
- [ ] RBAC guard middleware
- [ ] Phase guard middleware
- [ ] Combined policy checks per endpoint

## Epic D: Audit & Security Foundations
- [ ] Audit table + write helper
- [ ] Sensitive access event logging
- [ ] Basic rate limiting

## Success Criteria
- 1 test property, 1 booking, 1 guest can authenticate
- guest can chat in allowed phase
- sensitive endpoint blocked when phase/auth invalid
