import { neon } from '@netlify/neon';

const sql = neon();

export default async () => {
  const rows = await sql`
    SELECT event, value, COUNT(*) as count
    FROM events
    GROUP BY event, value
    ORDER BY event, count DESC
  `;

  return new Response(JSON.stringify(rows, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = { path: '/.netlify/functions/stats' };
