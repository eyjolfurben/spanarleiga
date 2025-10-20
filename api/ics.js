// /api/ics.js - proxy fyrir Google Calendar ICS (leystir CORS)
export default async function handler(req, res) {
  const CAL_ID = '0139025d6a6c070428e029d913db214eb14bb67c527d9588416b67afd4efb0aa@group.calendar.google.com';
  const url = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CAL_ID)}/public/basic.ics`;

  try {
    const r = await fetch(url);
    const txt = await r.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    // Smá edge cache á Vercel (CDN)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).send(txt);
  } catch (e) {
    res.status(502).send('Failed to fetch ICS');
  }
}
