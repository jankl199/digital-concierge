import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'dev.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ properties: [], bookings: [], audit: [] }, null, 2));
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
  db.audit.push({ id: crypto.randomUUID(), event: 'property.created', targetId: row.id, at: new Date().toISOString() });
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
    guestName: input.guestName || null,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    createdAt: new Date().toISOString(),
  };
  db.bookings.push(row);
  db.audit.push({ id: crypto.randomUUID(), event: 'booking.created', targetId: row.id, at: new Date().toISOString() });
  writeStore(db);
  return row;
}

export function listAudit(limit = 50) {
  const db = readStore();
  return db.audit.slice(-limit).reverse();
}
