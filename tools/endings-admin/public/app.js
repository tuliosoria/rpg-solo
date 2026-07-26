const $ = (sel) => document.querySelector(sel);

document.querySelectorAll('nav button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    $('#' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'editor' && !$('#editor select')) renderEditor();
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

async function renderEditor() {
  const content = await (await fetch('/api/content')).json();
  const root = document.querySelector('#editor');
  root.innerHTML = '<p>Edit English + translations, then Save. Review the git diff before committing.</p>';
  const select = document.createElement('select');
  Object.keys(content).forEach((id) => {
    const opt = document.createElement('option'); opt.value = id; opt.textContent = id; select.appendChild(opt);
  });
  const form = document.createElement('div');
  const saveBtn = document.createElement('button'); saveBtn.textContent = 'Save';
  const status = document.createElement('pre');

  function drawFields(id) {
    form.innerHTML = '';
    const f = content[id].fields;
    const addField = (label, getVal, setVal) => {
      const wrap = document.createElement('div'); wrap.className = 'cat';
      const h = document.createElement('h4'); h.textContent = label; wrap.appendChild(h);
      const ta = document.createElement('textarea'); ta.value = getVal(); ta.style.width = '100%'; ta.rows = 2;
      ta.addEventListener('input', () => setVal(ta.value));
      wrap.appendChild(ta); form.appendChild(wrap);
    };
    addField('title', () => f.title, (v) => (f.title = v));
    addField('subtitle', () => f.subtitle, (v) => (f.subtitle = v));
    addField('ufo74_final', () => f.ufo74_final, (v) => (f.ufo74_final = v));
    f.narrative.forEach((line, i) => addField(`narrative[${i}]`, () => f.narrative[i], (v) => (f.narrative[i] = v)));
    addField('aol.headline', () => f.aol.headline, (v) => (f.aol.headline = v));
    addField('aol.subheadline', () => f.aol.subheadline, (v) => (f.aol.subheadline = v));
    f.aol.body.forEach((line, i) => addField(`aol.body[${i}]`, () => f.aol.body[i], (v) => (f.aol.body[i] = v)));
  }

  select.addEventListener('change', () => drawFields(select.value));
  saveBtn.addEventListener('click', async () => {
    status.textContent = 'Saving…';
    const res = await fetch('/api/save', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const r = await res.json();
    status.textContent = r.ok ? 'Saved. git diff:\n' + (r.diff || '(no diff)') : 'Error: ' + r.error;
  });

  root.appendChild(select); root.appendChild(form); root.appendChild(saveBtn); root.appendChild(status);
  drawFields(select.value);
}
