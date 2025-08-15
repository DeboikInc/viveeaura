// lib/payments.ts
import crypto from 'crypto';

const SECRET = process.env.INTERNAL_SIGNING_SECRET;

// Sign a payload (e.g., bookingId + amount) to prevent client tampering
export function signPayload(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySignedPayload(token) {
  const [payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (sig !== expected) throw new Error('Invalid signature');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}
