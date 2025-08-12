(() => {
  const PASS = 'apex-admin';
  const $ = s => document.querySelector(s);

  const loginCard = $('#loginCard');
  const pwd = $('#pwd');
  const loginBtn = $('#loginBtn');
  const adminUI = $('#adminUI');
  const grid = $('#grid tbody');
  const loadBtn = $('#loadBtn');
  const addRowBtn = $('#addRowBtn');
  const downloadBtn = $('#downloadBtn');
  const importFile = $('#importFile');
  const importBtn = $('#importBtn');
  const statusBadge = $('#statusBadge');

  function setStatus(t){ if(statusBadge) statusBadge.textContent = t; }

  function addRow(item = {name:'', drops:['','','','','',''], chlorinated:false}){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:left"><input name="name" value="${item.name || ''}" style="width:100%"></td>
      ${[0,1,2,3,4,5].map(i => `<td><input name="c${i}" value="${item.drops?.[i] ?? ''}" style="width:100%"></td>`).join('')}
      <td><input type="checkbox" name="chlor" ${item.chlorinated ? 'checked' : ''}></td>
      <td><button class="chip delBtn" style="border-color:#dc2626;color:#dc2626">Delete</button></td>
    `;
    grid.appendChild(tr);
    tr.querySelector('.delBtn').addEventListener('click', ()=> tr.remove());
  }

  function getModel(){
    const rows = [];
    grid.querySelectorAll('tr').forEach(tr => {
      const name = tr.querySelector('input[name="name"]').value.trim();
      const drops = [0,1,2,3,4,5].map(i => tr.querySelector(`input[name="c${i}"]`).value.trim());
      const chlorinated = tr.querySelector('input[name="chlor"]').checked;
      if (name) rows.push({name, drops, chlorinated});
    });
    return rows;
  }

  async function load(){
    setStatus('Loading…');
    try{
      const res = await fetch('./products.json?_=' + Date.now(), { cache:'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      grid.innerHTML='';
      data.forEach(addRow);
      setStatus('Loaded ' + data.length + ' products');
    }catch(err){
      setStatus('Load failed'); alert('Could not load products.json: ' + err.message);
    }
  }

  function download(){
    const data = getModel();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    setStatus('Downloaded JSON');
  }

  function doImport(){
    const file = importFile.files && importFile.files[0];
    if (!file) { alert('Choose a .json file first'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error('JSON must be an array');
        grid.innerHTML=''; arr.forEach(addRow);
        setStatus('Imported ' + arr.length + ' products');
      }catch(err){ alert('Invalid JSON: ' + err.message); }
    };
    reader.readAsText(file);
  }

  function unlock(){
    if (pwd.value === PASS){
      loginCard.style.display = 'none';
      adminUI.style.display = 'block';
      load();
    } else { alert('Incorrect password'); }
  }

  loginBtn.addEventListener('click', unlock);
  pwd.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });

  loadBtn.addEventListener('click', load);
  addRowBtn.addEventListener('click', () => addRow());
  downloadBtn.addEventListener('click', download);
  importBtn.addEventListener('click', doImport);
})();