(() => {
  const $ = s => document.querySelector(s);
  const parseInts = str => [...str.matchAll(/\d+/g)].map(n=>Number(n));
  const setHidden = (el,flag) => flag ? el.setAttribute('hidden','') : el.removeAttribute('hidden');

  const filterInput  = $('#filterInput');
  const selectEl     = $('#productSelect');
  const tableEl      = $('#resultTable');
  const warningEl    = $('#chlorinatedWarning');
  const step2El      = $('#chlorineStep');
  const instrEl      = $('#instructions');
  const dropsLabel   = $('#dropsLabel');
  const dropsInput   = $('#dropsInput');
  const copyBtn      = $('#copyBtn');
  const printBtn     = $('#printBtn');

  const data = [
    {"name":"Bactosol Cabinet Det","drops":["-","-","-","1","2","4"],"chlorinated":false},
    {"name":"Suma Super L1*","drops":["1","3","4","6","9","17"],"chlorinated":true}
  ];

  function populateSelect(list){
    selectEl.innerHTML='';
    list.forEach(({name,chlorinated})=>{
      const opt=new Option(name,name);
      opt.dataset.chlorinated=chlorinated;
      selectEl.add(opt);
    });
  }
  populateSelect(data);

  filterInput.addEventListener('input',()=>{
    const term=filterInput.value.trim().toLowerCase();
    populateSelect(data.filter(d=>d.name.toLowerCase().includes(term)));
  });

  selectEl.addEventListener('change',e=>{
    const product = data.find(d=>d.name===e.target.value);
    if(!product) return;
    product.drops.forEach((val,i)=>{
      const cell=$(`#c${i}`);
      if(!val){cell.textContent='–';return;}
      if(/\(/.test(val)){
        const [main,paren]=val.split(/[\(\)]/);
        cell.innerHTML=`${main}<abbr title="Acid 3">${paren}</abbr>`;
      }else cell.textContent=val;
    });
    [tableEl,instrEl,dropsInput,dropsLabel,copyBtn,printBtn].forEach(el=>setHidden(el,false));
    const isChlor = e.target.selectedOptions[0].dataset.chlorinated==='true';
    setHidden(warningEl,!isChlor);
    setHidden(step2El,!isChlor);
  });

  dropsInput.addEventListener('input',()=>{
    const val=Number(dropsInput.value);
    if(!val){return;}
    [...tableEl.querySelectorAll('td')].forEach(td=>td.classList.remove('selected'));
    [...tableEl.querySelectorAll('#dropRow td:not(:first-child)')].forEach(td=>{
      if (parseInts(td.textContent).includes(val)) td.classList.add('selected');
    });
  });

  copyBtn.addEventListener('click',()=>{
    const product=selectEl.value || '';
    const vals=[...tableEl.querySelectorAll('#dropRow td')].slice(1).map(td=>td.innerText).join('\t');
    navigator.clipboard.writeText(`${product}\t${vals}`);
  });

  printBtn.addEventListener('click',()=>window.print());

  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'));
  }
})();

// ---- Version footer ----
(function() {
  var v = 'detergent-tool-v1.0.1';
  var el = document.getElementById('versionFooter');
  if (el) {
    var stamp = new Date().toLocaleString();
    el.textContent = 'Version: ' + v + ' • Updated: ' + stamp;
  }
})();
