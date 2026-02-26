import { neon } from '@netlify/neon';

const sql = neon();

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const VALID = ['scenario_click','drivetrain_click','unit_switch','tab_view','temp_set'];
  if (!VALID.includes(body.event)) {
    return new Response('Invalid event', { status: 400 });
  }

  const event = body.event;
  const value = String(body.value || '').slice(0, 64);

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id    BIGSERIAL PRIMARY KEY,
      event TEXT NOT NULL,
      value TEXT,
      ts    TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`INSERT INTO events (event, value) VALUES (${event}, ${value})`;

  return new Response('ok', { status: 200 });
};

export const config = { path: '/.netlify/functions/track' };
