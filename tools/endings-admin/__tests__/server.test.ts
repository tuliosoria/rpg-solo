import { describe, it, expect, afterAll } from 'vitest';
import type { Server } from 'node:http';
import { createServer } from '../server';

const server: Server = createServer();
await new Promise<void>(r => server.listen(0, () => r()));
const port = (server.address() as import('node:net').AddressInfo).port;
const base = `http://127.0.0.1:${port}`;

afterAll(() => new Promise<void>(r => server.close(() => r())));

describe('endings-admin server', () => {
  it('GET /api/model returns endings, categories and examples', async () => {
    const res = await fetch(`${base}/api/model`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body.endings)).toHaveLength(12);
    expect(body.categories.military_coverup).toContain('jardim_andere_incident.txt');
    expect(body.examples.government_scandal.length).toBeGreaterThanOrEqual(4);
  });

  it('POST /api/simulate delegates to the real determineEnding', async () => {
    const res = await fetch(`${base}/api/simulate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ files: [
        'incident_report_1996_01_VG.txt','initial_response_orders.txt',
        'regional_summary_jan96.txt','transport_log_96.txt',
      ] }),
    });
    const body = await res.json();
    expect(body.endingId).toBe('government_scandal');
    expect(body.counts.militaryCoverup).toBe(4);
    expect(body.matchedRule).toMatch(/military/i);
  });

  it('POST /api/simulate with 2 honeypot files returns hackerkid_caught', async () => {
    const res = await fetch(`${base}/api/simulate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ files: ['URGENT_classified_alpha.txt','LEAKED_classified_records.dat'] }),
    });
    const body = await res.json();
    expect(body.endingId).toBe('hackerkid_caught');
  });
});
