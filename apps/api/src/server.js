import express from 'express';
import { resolveStayPhase, canRevealSensitive, roleAllowed } from './policy.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'signature-villas-api-skeleton' }));

app.post('/policy/stay-phase', (req, res) => {
  const { checkIn, checkOut, now } = req.body;
  const phase = resolveStayPhase({ now: now ? new Date(now) : new Date(), checkIn, checkOut });
  res.json({ phase });
});

app.post('/policy/reveal-sensitive', (req, res) => {
  const { isAuthenticated, checkIn, checkOut, validFrom, validUntil, now } = req.body;
  const ts = now ? new Date(now) : new Date();
  const phase = resolveStayPhase({ now: ts, checkIn, checkOut });
  const withinValidity = ts >= new Date(validFrom) && ts <= new Date(validUntil);
  const allowed = canRevealSensitive({ isAuthenticated, phase, withinValidity });
  res.json({ allowed, phase, withinValidity });
});

app.post('/policy/rbac', (req, res) => {
  const { role, allowedRoles } = req.body;
  res.json({ allowed: roleAllowed(role, allowedRoles || []) });
});

const PORT = Number(process.env.API_PORT || 4100);
app.listen(PORT, () => console.log(`API skeleton listening on :${PORT}`));
