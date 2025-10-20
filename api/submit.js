// /api/submit.js - proxy til Google Apps Script (leystir CORS)
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = await req.json();
    const EP = 'https://script.google.com/macros/s/AKfycbzTuGwMuQewaVKG64a_9zbppNv4um7Dg0lK17IUN1yFUCDfxOOMHzjpRB__da-OhEIjGA/exec';

    const r = await fetch(EP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ ok:false, error: 'forward_failed' });
  }
}
