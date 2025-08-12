(() => {
  const $ = s => document.querySelector(s);
  const setHidden = (el,flag) => flag ? el.setAttribute('hidden','') : el.removeAttribute('hidden');
  const BUILD_TIME = "2025-08-12 04:05 UTC";

  // Elements
  const selectEl = $('#productSelect');
  const warningEl = $('#chlorinatedWarning');
  const tableEl = $('#resultTable');
  const instrEl = $('#instructions');
  const chlorineStep = $('#chlorineStep');
  const footer = $('#footerInfo');
  const errorBanner = $('#errorBanner');

  // About modal
  const aboutBtn = $('#aboutBtn');
  const aboutModal = $('#aboutModal');
  const closeAbout = $('#closeAbout');
  const aboutContent = $('#aboutContent');

  function showError(msg) {
    console.error('[App Error]', msg);
    if (!errorBanner) return;
    errorBanner.textContent = String(msg);
    errorBanner.hidden = false;
  }

  // Load manifest for version
  let APP_VERSION = '1.0.0';
  fetch('manifest.json?_=' + Date.now())
    .then(r=>r.json())
    .then(m => { APP_VERSION = m.version || APP_VERSION; })
    .catch(()=>{});

  function renderAbout() {
    const changelog = [
      "Initial public release.",
      "About modal & diagnostics.",
      "Hidden JSON editor (E twice) with preview & download.",
      "Cache-busted products.json; PWA offline support."
    ];
    aboutContent.innerHTML = [
      '<p><strong>Version:</strong> ' + APP_VERSION + '</p>',
      '<p><strong>Build time:</strong> ' + BUILD_TIME + '</p>',
      '<p><strong>PWA:</strong> Offline caching via Service Worker (network-first for HTML & products.json).</p>',
      '<p><strong>Changelog:</strong></p>',
      '<ul>' + changelog.map(x => '<li>' + x + '</li>').join('') + '</ul>'
    ].join('');
  }

  if (aboutBtn) aboutBtn.addEventListener('click', () => { renderAbout(); aboutModal.style.display='flex'; });
  if (closeAbout) closeAbout.addEventListener('click', () => aboutModal.style.display='none');
  if (aboutModal) aboutModal.addEventListener('click', (e)=>{ if(e.target===aboutModal) aboutModal.style.display='none'; });

  // Hidden editor (E twice)
  const editBtn = $('#editBtn');
  const editorModal = $('#editorModal');
  const closeEditor = $('#closeEditor');
  const productsEditor = $('#productsEditor');
  const applyPreview = $('#applyPreview');
  const downloadJson = $('#downloadJson');

  (function(){ // double-press 'E' to toggle edit button
    let last=0;
    document.addEventListener('keydown', (e)=>{
      if (e.key.toLowerCase() !== 'e') return;
      const now=Date.now();
      if (now - last < 400) {
        if (editBtn) editBtn.style.display = (editBtn.style.display === 'none' ? 'inline-block' : 'none');
      }
      last = now;
    });
  })();

  async function openEditor() {
    try {
      const res = await fetch('products.json?_=' + Date.now(), { cache: 'no-store' });
      const txt = await res.text();
      productsEditor.value = txt;
      editorModal.style.display = 'flex';
    } catch (err) {
      showError('Could not load products.json into editor: ' + (err && err.message));
    }
  }
  if (editBtn) editBtn.addEventListener('click', openEditor);
  if (closeEditor) closeEditor.addEventListener('click', ()=> editorModal.style.display='none');
  if (editorModal) editorModal.addEventListener('click', (e)=>{ if(e.target===editorModal) editorModal.style.display='none'; });

  if (applyPreview) applyPreview.addEventListener('click', ()=>{
    try {
      const next = JSON.parse(productsEditor.value);
      if (!Array.isArray(next)) throw new Error('products.json must be an array');
      loadProducts(next); // re-render with preview data
      alert('Preview applied. Download and upload products.json to publish.');
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
    }
  });

  if (downloadJson) downloadJson.addEventListener('click', ()=>{
    try {
      const blob = new Blob([productsEditor.value], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download: ' + err.message);
    }
  });

  // Load & render products
  function loadProducts(data) {
    selectEl.innerHTML = '';
    data.forEach(({name,chlorinated,drops})=>{
      const opt = new Option(name, name);
      opt.dataset.chlorinated = chlorinated;
      opt.dataset.drops = JSON.stringify(drops);
      selectEl.add(opt);
    });
    // Reset UI
    warningEl.hidden = true;
    instrEl.hidden = true;
    tableEl.hidden = true;
  }

  fetch('products.json?_=' + Date.now(), { cache: 'no-store' })
    .then(r => (r.ok ? r : Promise.reject(new Error('HTTP ' + r.status))))
    .then(r => r.json())
    .then(loadProducts)
    .catch(err => showError('Failed to load products.json — ' + (err && err.message)));

  selectEl.addEventListener('change', (e)=>{
    const opt = e.target.selectedOptions[0];
    if (!opt) return;
    const drops = JSON.parse(opt.dataset.drops);
    drops.forEach((val,i)=>{
      const cell = document.getElementById('c'+i);
      if (!cell) return;
      cell.textContent = val ? val : '–';
    });
    tableEl.hidden = false;
    instrEl.hidden = false;
    const chlor = opt.dataset.chlorinated === 'true';
    warningEl.hidden = !chlor;
    chlorineStep.hidden = !chlor;
  });

  // Footer
  (function(){
    if (footer) footer.textContent = 'Offline ready • Updated: ' + new Date().toLocaleString();
  })();

  // SW register (no install prompt)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js').catch(()=>{}));
  }
})();