(() => {
  const $ = s => document.querySelector(s);
  const setHidden = (el,flag) => flag ? el.setAttribute('hidden','') : el.removeAttribute('hidden');

  const selectEl = $('#productSelect');
  const warningEl = $('#chlorinatedWarning');
  const tableWrap = $('#tableWrap');
  const tableEl = $('#resultTable');
  const instrEl = $('#instructions');
  const chlorineStep = $('#chlorineStep');
  const footer = $('#footerInfo');
  const errorBanner = $('#errorBanner');
  const aboutBtn = $('#aboutBtn');
  const aboutModal = $('#aboutModal');
  const closeAbout = $('#closeAbout');
  const aboutContent = $('#aboutContent');
  const editBtn = $('#editBtn');

  // Double-press 'e' shortcut: open admin.html
  (function(){
    let last=0, count=0, timer=null;
    document.addEventListener('keydown', (e)=>{
      if (e.key.toLowerCase() !== 'e') return;
      const now=Date.now();
      if (now - last < 400) {
        count++;
        if (count >= 2) { // two quick presses
          window.open('./admin.html', '_blank');
          count = 0;
        }
      } else {
        count = 1;
      }
      last = now;
      clearTimeout(timer);
      timer = setTimeout(()=>{ count=0; }, 600);
    });
  })();

  // About modal content
  function loadManifestVersion(){
    return fetch('./manifest.json?_=' + Date.now())
      .then(r=>r.json())
      .then(m => m.version || '1.0.0')
      .catch(()=> '1.0.0');
  }
  async function renderAbout(){
    const ver = await loadManifestVersion();
    const log = [
      "Initial public release.",
      "About modal & diagnostics.",
      "Admin page (password) and double-E shortcut.",
      "Cache-busted products.json; PWA offline support."
    ];
    aboutContent.innerHTML = [
      '<p><strong>Version:</strong> ' + ver + '</p>',
      '<p><strong>Build time:</strong> ' + new Date().toLocaleString() + '</p>',
      '<p><strong>PWA:</strong> Offline caching via Service Worker; network-first for HTML & products.json.</p>',
      '<p><strong>Changelog:</strong></p>',
      '<ul>' + log.map(x=>'<li>'+x+'</li>').join('') + '</ul>'
    ].join('');
  }
  if (aboutBtn) aboutBtn.addEventListener('click', () => { renderAbout(); aboutModal.style.display = 'flex'; });
  if (closeAbout) closeAbout.addEventListener('click', () => aboutModal.style.display = 'none');
  if (aboutModal) aboutModal.addEventListener('click', (e)=>{ if (e.target === aboutModal) aboutModal.style.display = 'none'; });

  // Load products.json (cache-busted + network-first by SW)
  function loadProducts(data){
    selectEl.innerHTML = '';
    data.forEach(({name, chlorinated, drops})=>{
      const opt = new Option(name, name);
      opt.dataset.chlorinated = chlorinated;
      opt.dataset.drops = JSON.stringify(drops);
      selectEl.add(opt);
    });
    setHidden(tableWrap, true);
    setHidden(instrEl, true);
    setHidden(warningEl, true);
  }

  fetch('./products.json?_=' + Date.now(), { cache:'no-store' })
    .then(r => (r.ok ? r : Promise.reject(new Error('HTTP ' + r.status))))
    .then(r => r.json())
    .then(loadProducts)
    .catch(err => {
      errorBanner.textContent = 'Failed to load products.json — ' + err.message;
      errorBanner.hidden = false;
    });

  selectEl.addEventListener('change', (e)=>{
    const opt = e.target.selectedOptions[0];
    if (!opt) return;
    const drops = JSON.parse(opt.dataset.drops);
    drops.forEach((val,i)=>{
      const cell = document.getElementById('c'+i);
      if (!cell) return;
      cell.textContent = val ? val : '–';
    });
    setHidden(tableWrap, false);
    setHidden(instrEl, false);
    const chlor = opt.dataset.chlorinated === 'true';
    setHidden(warningEl, !chlor);
    setHidden(chlorineStep, !chlor);
  });

  // Footer stamp
  if (footer) footer.textContent = 'Offline ready • Updated: ' + new Date().toLocaleString();

  // SW register
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();