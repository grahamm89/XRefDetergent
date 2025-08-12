fetch('products.json?_=' + Date.now())
  .then(r=>r.json())
  .then(data=>{
    const select = document.getElementById('productSelect');
    const warning = document.getElementById('chlorinatedWarning');
    const tableWrapper = document.getElementById('tableWrapper');
    const instr = document.getElementById('instructions');
    const step2 = document.getElementById('chlorineStep');

    data.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = p.name;
      opt.dataset.chlorinated = p.chlorinated;
      select.appendChild(opt);
    });

    select.addEventListener('change', e=>{
      const p = data.find(x=>x.name === e.target.value);
      if(!p) return;
      p.drops.forEach((val,i)=>{
        const cell = document.getElementById('c'+i);
        cell.textContent = val || '–';
      });
      tableWrapper.hidden = false;
      instr.hidden = false;
      warning.hidden = !p.chlorinated;
      step2.hidden = !p.chlorinated;
    });
  });

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js');
  });
}