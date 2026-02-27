import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'dev.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ properties: [], bookings: [], guestSessions: [], audit: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeStore(next) {
  ensureStore();
  const backup = path.join(dataDir, `dev.backup.${Date.now()}.json`);
  if (fs.existsSync(dataFile)) fs.copyFileSync(dataFile, backup);
  fs.writeFileSync(dataFile, JSON.stringify(next, null, 2));
}

function pushAudit(db, event, targetId, metadata = {}) {
  db.audit.push({
    id: crypto.randomUUID(),
    event,
    targetId,
    metadata,
    at: new Date().toISOString(),
  });
}

export function listProperties() {
  return readStore().properties;
}

export function createProperty(input) {
  const db = readStore();
  const row = {
    id: crypto.randomUUID(),
    name: input.name,
    timezone: input.timezone || 'Europe/Berlin',
    defaultLanguage: input.defaultLanguage || 'de',
    emergencyContact: input.emergencyContact || null,
    createdAt: new Date().toISOString(),
  };
  db.properties.push(row);
  pushAudit(db, 'property.created', row.id);
  writeStore(db);
  return row;
}

export function listBookings(propertyId) {
  return readStore().bookings.filter((b) => b.propertyId === propertyId);
}

export function createBooking(input) {
  const db = readStore();
  const row = {
    id: crypto.randomUUID(),
    propertyId: input.propertyId,
    bookingRef: input.bookingRef,
    guestPin: input.guestPin || String(Math.floor(100000 + Math.random() * 900000)),
    guestName: input.guestName || null,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    createdAt: new Date().toISOString(),
  };
  db.bookings.push(row);
  pushAudit(db, 'booking.created', row.id, { propertyId: row.propertyId, bookingRef: row.bookingRef });
  writeStore(db);
  return row;
}

export function findBookingByRefAndPin({ propertyId, bookingRef, guestPin }) {
  const db = readStore();
  return db.bookings.find(
    (b) => b.propertyId === propertyId && b.bookingRef === bookingRef && String(b.guestPin) === String(guestPin)
  );
}

export function createGuestSession({ bookingId, propertyId, guestName }) {
  const db = readStore();
  const row = {
    id: crypto.randomUUID(),
    token: crypto.randomUUID(),
    bookingId,
    propertyId,
    guestName: guestName || null,
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  db.guestSessions.push(row);
  pushAudit(db, 'guest.session.created', row.id, { bookingId, propertyId });
  writeStore(db);
  return row;
}

export function getGuestSessionByToken(token) {
  const db = readStore();
  const row = db.guestSessions.find((s) => s.token === token);
  if (!row) return null;
  if (new Date(row.expiresAt) < new Date()) return null;
  return row;
}

export function listAudit(limit = 50) {
  const db = readStore();
  return db.audit.slice(-limit).reverse();
}
