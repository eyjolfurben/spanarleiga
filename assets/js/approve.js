// assets/js/approve.js
document.addEventListener('DOMContentLoaded', () => {
  const qs   = new URLSearchParams(location.search);
  const data = Object.fromEntries(qs.entries());

  const info = document.getElementById('info');
  if (info) info.innerHTML = Object.entries(data)
    .map(([k,v]) => `<div><b>${k}:</b> ${v}</div>`).join('');

  const show = (html, cls='') => {
    const el = document.getElementById('result');
    if (el) el.innerHTML = cls ? `<span class="${cls}">${html}</span>` : html;
  };

  const approveBtn = document.getElementById('approve');
  if (approveBtn) {
    approveBtn.addEventListener('click', async () => {
      if (!data.from || !data.to) { show('Vantar from/to.', 'bad'); return; }
      approveBtn.disabled = true; approveBtn.textContent = 'Senda…';
      try {
        const r = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action:'approve', ...data })
        });
        const txt = await r.text();
        if (r.ok) show('Skráð í dagatal ✔ ' + txt, 'good');
        else show('Villa: ' + (txt || r.status), 'bad');
      } catch (e) {
        console.error(e); show('Tenging mistókst', 'bad');
      } finally {
        approveBtn.disabled = false; approveBtn.textContent = '✅ Samþykkja og skrá í dagatal';
      }
    });
  }

  const rejectBtn = document.getElementById('reject');
  if (rejectBtn) rejectBtn.addEventListener('click', () => show('Hafnað', 'bad'));
});
