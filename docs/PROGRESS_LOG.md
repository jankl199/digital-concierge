# Progress Log

## 2026-02-27

### Step 1 — Sprint-0 Foundation
- Added architecture draft, security baseline, and v1 SQL model
- Added policy API skeleton (`stay-phase`, `rbac`, `reveal-sensitive`)
- Branch: `feature/sv-sprint0-core`
- Commit: `83b38d5`

### Step 2 — Delivery Safety Rules
- We keep incremental commits and avoid destructive rewrites.
- Every meaningful milestone gets:
  1) commit
  2) push
  3) optional snapshot tag

Next target: Sprint-1 foundation endpoints (Property + Booking + Audit stub).
