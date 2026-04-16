/* ─── landing.js ────────────────────────────────────────────
   Reads quiz history from localStorage, powers all analytics
   on the landing page: hero stats, summary cards, chart,
   difficulty breakdown, and the full attempts table.
──────────────────────────────────────────────────────────── */

const HISTORY_KEY = 'quizHistory';

// ── Helpers ───────────────────────────────────────────────

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function pct(score, total) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

function diffBadge(diff) {
  const d = diff === 'all' ? 'all' : diff;
  return `<span class="badge badge-${d}">${diff === 'all' ? 'Mixed' : diff}</span>`;
}

function resultBadge(percentage) {
  return percentage >= 60
    ? `<span class="result-pass">✓ Pass</span>`
    : `<span class="result-fail">✗ Fail</span>`;
}

// ── NAV scroll effect ─────────────────────────────────────

window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  nav.style.background = window.scrollY > 60
    ? 'rgba(13,13,26,0.95)'
    : 'rgba(13,13,26,0.75)';
});

// ── Hamburger ─────────────────────────────────────────────

document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const open = links.style.display === 'flex';
  if (open) {
    links.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:rgba(13,13,26,0.98);padding:20px 24px;gap:18px;border-bottom:1px solid rgba(102,126,234,0.2);z-index:200;';
  }
});

// ── Main render ───────────────────────────────────────────

function renderAll() {
  const history = getHistory();
  renderHeroStats(history);
  renderSummaryCards(history);

  if (history.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
    document.getElementById('analytics-grid').classList.add('hidden');
  } else {
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('analytics-grid').classList.remove('hidden');
    renderChart(history);
    renderBreakdown(history);
    renderTable(history, 'all');
  }
}

// ── Hero stats ────────────────────────────────────────────

function renderHeroStats(history) {
  const el = (id) => document.getElementById(id);
  if (history.length === 0) {
    el('hs-attempts').textContent = '0';
    el('hs-best').textContent = '—';
    el('hs-avg').textContent = '—';
    return;
  }

  const percentages = history.map(e => pct(e.score, e.total));
  const best = Math.max(...percentages);
  const avg  = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);

  el('hs-attempts').textContent = history.length;
  el('hs-best').textContent     = best + '%';
  el('hs-avg').textContent      = avg + '%';
}

// ── Summary stat cards ────────────────────────────────────

function renderSummaryCards(history) {
  const el = (id) => document.getElementById(id);
  el('sc-total').textContent = history.length;

  if (history.length === 0) {
    el('sc-best').textContent   = '—';
    el('sc-avg').textContent    = '—';
    el('sc-streak').textContent = '0';
    return;
  }

  const percentages = history.map(e => pct(e.score, e.total));
  const best = Math.max(...percentages);
  const avg  = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);

  el('sc-best').textContent = best + '%';
  el('sc-avg').textContent  = avg + '%';

  // Win streak: consecutive passes (>=60%) from most recent
  let streak = 0;
  for (const e of history) {
    if (pct(e.score, e.total) >= 60) streak++;
    else break;
  }
  el('sc-streak').textContent = streak;
}

// ── Score chart (canvas) ──────────────────────────────────

function renderChart(history) {
  const canvas = document.getElementById('score-chart');
  const ctx    = canvas.getContext('2d');
  const data   = [...history].reverse().slice(-10); // oldest → newest, max 10
  const W      = canvas.offsetWidth  || 600;
  const H      = canvas.offsetHeight || 220;

  canvas.width  = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  if (data.length === 0) return;

  const PAD   = { top: 20, right: 20, bottom: 40, left: 40 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top  - PAD.bottom;
  const vals  = data.map(e => pct(e.score, e.total));
  const n     = vals.length;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth   = 1;
  [0, 25, 50, 75, 100].forEach(v => {
    const y = PAD.top + plotH - (v / 100) * plotH;
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(W - PAD.right, y);
    ctx.stroke();

    ctx.fillStyle = 'rgba(152,153,200,0.55)';
    ctx.font      = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(v + '%', PAD.left - 6, y + 4);
  });

  // 60% pass-line
  const passY = PAD.top + plotH - (60 / 100) * plotH;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(102,126,234,0.3)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(PAD.left, passY);
  ctx.lineTo(W - PAD.right, passY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Area fill
  const xOf = i => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yOf = v => PAD.top  + plotH - (v / 100) * plotH;

  const grad = ctx.createLinearGradient(0, PAD.top, 0, H);
  grad.addColorStop(0,   'rgba(102,126,234,0.35)');
  grad.addColorStop(1,   'rgba(102,126,234,0)');
  ctx.beginPath();
  ctx.moveTo(xOf(0), H - PAD.bottom);
  vals.forEach((v, i) => ctx.lineTo(xOf(i), yOf(v)));
  ctx.lineTo(xOf(n - 1), H - PAD.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  vals.forEach((v, i) => {
    if (i === 0) ctx.moveTo(xOf(i), yOf(v));
    else         ctx.lineTo(xOf(i), yOf(v));
  });
  ctx.strokeStyle = '#667eea';
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  ctx.stroke();

  // Dots
  vals.forEach((v, i) => {
    const x = xOf(i);
    const y = yOf(v);
    const pass = v >= 60;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle   = pass ? '#667eea' : 'rgba(252,129,129,0.85)';
    ctx.fill();
    ctx.strokeStyle = '#0d0d1a';
    ctx.lineWidth   = 2;
    ctx.stroke();

    // label
    ctx.fillStyle = 'rgba(240,240,255,0.85)';
    ctx.font      = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(v + '%', x, y - 10);

    // x-axis label
    const label = data[i].date || '';
    ctx.fillStyle = 'rgba(152,153,200,0.7)';
    ctx.font      = '10px Inter, sans-serif';
    ctx.fillText(label, x, H - PAD.bottom + 14);
  });
}

// ── Difficulty breakdown ──────────────────────────────────

function renderBreakdown(history) {
  const container = document.getElementById('diff-breakdown');
  container.innerHTML = '';

  const diffs = ['easy', 'medium', 'hard', 'all'];
  const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard', all: 'Mixed' };
  let any = false;

  diffs.forEach(d => {
    const entries = history.filter(e => e.difficulty === d);
    if (entries.length === 0) return;
    any = true;

    const percentages = entries.map(e => pct(e.score, e.total));
    const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);

    const row = document.createElement('div');
    row.className = 'diff-row';
    row.innerHTML = `
      <div class="diff-row-label">
        <strong>${labels[d]}</strong>
        <span>${entries.length} attempt${entries.length !== 1 ? 's' : ''} · avg ${avg}%</span>
      </div>
      <div class="diff-bar-track">
        <div class="diff-bar-fill" style="width:${avg}%"></div>
      </div>
    `;
    container.appendChild(row);
  });

  if (!any) {
    container.innerHTML = '<p class="diff-empty">No data yet.</p>';
  }
}

// ── Attempts table ─────────────────────────────────────────

function renderTable(history, filterDiff) {
  const tbody = document.getElementById('attempts-tbody');
  tbody.innerHTML = '';

  const filtered = filterDiff === 'all'
    ? history
    : history.filter(e => e.difficulty === filterDiff);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px">No attempts for this filter.</td></tr>`;
    return;
  }

  filtered.forEach((e, i) => {
    const p = pct(e.score, e.total);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--text-muted)">${i + 1}</td>
      <td>${e.date || '—'}</td>
      <td>${diffBadge(e.difficulty)}</td>
      <td>${e.score} / ${e.total}</td>
      <td>
        <div class="score-bar-wrap">
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width:${p}%"></div>
          </div>
          <span class="score-label">${p}%</span>
        </div>
      </td>
      <td>${resultBadge(p)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Filter dropdown ────────────────────────────────────────

document.getElementById('filter-diff').addEventListener('change', function () {
  renderTable(getHistory(), this.value);
});

// ── Clear all ─────────────────────────────────────────────

document.getElementById('clear-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all quiz history? This cannot be undone.')) {
    localStorage.removeItem(HISTORY_KEY);
    renderAll();
  }
});

// ── Resize → re-draw chart ─────────────────────────────────

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const history = getHistory();
    if (history.length > 0) renderChart(history);
  }, 200);
});

// ── Scroll reveal ──────────────────────────────────────────

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feat-card, .step, .stat-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── Boot ───────────────────────────────────────────────────

renderAll();
