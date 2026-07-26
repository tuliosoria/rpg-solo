const $ = (sel) => document.querySelector(sel);

document.querySelectorAll('nav button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    $('#' + btn.dataset.tab).classList.add('active');
  });
});

let model = null;

async function load() {
  model = await (await fetch('/api/model')).json();
  renderExplorer();
  renderSimulator();
}

function renderExplorer() {
  const root = $('#explorer');
  root.innerHTML = '';
  for (const [id, e] of Object.entries(model.endings)) {
    const card = document.createElement('div');
    card.className = 'ending-card';
    card.innerHTML =
      `<h3>${e.title} <small>(${id})</small></h3>` +
      `<div class="rule">Trigger: ${e.rule}</div>` +
      `<div class="files">Example leak set: ${(model.examples[id] || []).join(', ') || '(none)'}</div>` +
      `<p>${e.subtitle}</p>`;
    root.appendChild(card);
  }
}

let selected = new Set();

function renderSimulator() {
  const root = $('#sim-categories');
  root.innerHTML = '';
  for (const [cat, files] of Object.entries(model.categories)) {
    const box = document.createElement('div');
    box.className = 'cat';
    const h = document.createElement('h4');
    h.textContent = cat;
    box.appendChild(h);
    for (const f of files) {
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = f;
      cb.addEventListener('change', () => {
        if (cb.checked) selected.add(f); else selected.delete(f);
        simulate();
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + f));
      box.appendChild(label);
    }
    root.appendChild(box);
  }
}

async function simulate() {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ files: [...selected] }),
  });
  const r = await res.json();
  const title = model.endings[r.endingId]?.title ?? r.endingId;
  $('#sim-result').innerHTML =
    `<div class="big">${title}</div>` +
    `<div class="rule">${r.matchedRule}</div>` +
    `<div class="files">${selected.size} files selected</div>`;
}

load();
