import express from 'express';
import { resolveStayPhase, canRevealSensitive, roleAllowed } from './policy.js';
import {
  createProperty,
  listProperties,
  createBooking,
  listBookings,
  listAudit,
  findBookingByRefAndPin,
  createGuestSession,
  getGuestSessionByToken,
} from './store.js';

const app = express();
app.use(express.json());

function requireGuest(req, res, next) {
  const auth = req.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing bearer token' });
  const session = getGuestSessionByToken(token);
  if (!session) return res.status(401).json({ error: 'invalid/expired session' });
  req.guestSession = session;
  next();
}

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

// Sprint-1 foundation endpoints (dev store)
app.get('/admin/properties', (_req, res) => {
  res.json({ items: listProperties() });
});

app.post('/admin/properties', (req, res) => {
  const { name, timezone, defaultLanguage, emergencyContact } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const item = createProperty({ name, timezone, defaultLanguage, emergencyContact });
  res.status(201).json(item);
});

app.get('/admin/properties/:propertyId/bookings', (req, res) => {
  res.json({ items: listBookings(req.params.propertyId) });
});

app.post('/admin/bookings', (req, res) => {
  const { propertyId, bookingRef, checkIn, checkOut, guestName, guestPin } = req.body;
  if (!propertyId || !bookingRef || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'propertyId, bookingRef, checkIn, checkOut are required' });
  }
  const item = createBooking({ propertyId, bookingRef, checkIn, checkOut, guestName, guestPin });
  res.status(201).json(item);
});

app.get('/admin/audit', (req, res) => {
  const limit = Number(req.query.limit || 50);
  res.json({ items: listAudit(limit) });
});

// Guest auth stub (PIN)
app.post('/guest/auth/pin', (req, res) => {
  const { propertyId, bookingRef, pin } = req.body;
  if (!propertyId || !bookingRef || !pin) {
    return res.status(400).json({ error: 'propertyId, bookingRef, pin are required' });
  }

  const booking = findBookingByRefAndPin({ propertyId, bookingRef, guestPin: pin });
  if (!booking) return res.status(401).json({ error: 'invalid bookingRef/pin' });

  const session = createGuestSession({ bookingId: booking.id, propertyId, guestName: booking.guestName });
  res.json({
    accessToken: session.token,
    expiresAt: session.expiresAt,
    booking: {
      id: booking.id,
      bookingRef: booking.bookingRef,
      guestName: booking.guestName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
  });
});

app.get('/guest/me', requireGuest, (req, res) => {
  res.json({ session: req.guestSession });
});

const PORT = Number(process.env.API_PORT || 4100);
app.listen(PORT, () => console.log(`API skeleton listening on :${PORT}`));
