# API Skeleton (Sprint 1 Foundation)

## Run
```bash
cd apps/api
npm install
npm start
```

Runs on `http://localhost:4100`.

## Endpoints
- `GET /health`
- `POST /policy/stay-phase`
- `POST /policy/reveal-sensitive`
- `POST /policy/rbac`
- `GET /admin/properties`
- `POST /admin/properties`
- `GET /admin/properties/:propertyId/bookings`
- `POST /admin/bookings`
- `GET /admin/audit`

## Notes
- Current store is file-based (`apps/api/.data/dev.json`) for safe incremental progress.
- Every write creates a backup snapshot in `.data/`.
- Next step: swap to PostgreSQL repository layer.
