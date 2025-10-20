// /api/submit.js — Proxy til Google Apps Script (leysir CORS og passar body)
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // robust body-lesning (virkar bæði á Edge/Node runtimes)
    let body = req.body;
    if (!body) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      try { body = JSON.parse(raw || '{}'); } catch { body = {}; }
    }

    const EP = 'https://script.google.com/macros/s/AKfycbzTuGwMuQewaVKG64a_9zbppNv4um7Dg0lK17IUN1yFUCDfxOOMHzjpRB__da-OhEIjGA/exec';

    const fwd = await fetch(EP, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    });

    const text = await fwd.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(fwd.status || 200).send(text || '');
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ ok:false, error:'forward_failed' });
  }
}
