// Tasks UI with 'Vybrat úkol' first, then completion/skip controls unlocking gallery photos.

const tasks = ['Coldplay camera s random lidma', 'Vyfoť selfie s 5 různými cizími ženami', 'Předstírej, že jsi slavná osoba – přesvědč někoho, ať se s tebou vyfotí', 'Vyfoť se během víkendu se třemi různými lidmi jménem Matěj', 'Získej 5 podpisů od cizích žen na svoje tričko', 'Podepiš někomu tričko fixem. Tvý kamarádi se nepočítají', 'Presvěč nějakou slečnu ať se podepíše na triko tvého kamaráda', 'Objednej drink pro úplně cizího člověka', 'Natoč si v hospodě vlastní pivo', 'Objednej si pití falešným přízvukem (např. Ital, Rus, Francouz)', 'Dostaň číslo od cizí holky', 'Na chvíli si hraj na číšníka v baru a obsluž někoho cizího', 'Zazvoň na dveře a požádej o svatební požehnání', 'Zeptej se kolemjdoucí ženy, jestli se nechce nechat vyšetřit od pana doktora farmacie', 'Požádej o radu v lásce od staršího páru', 'Přesvěč někoho, ať tě adoptuje jako svého syna', 'Vyber si „družičku večera“ z cizích lidí a doprovoď ji 15 minut', 'Buď wingman a dohod jednu slecnu kamosovi (třeba na hlasku: krátké má jenom vlasy)', 'Najdi někoho bez vlasů a zeptej se, jestli by ti nedal tři vlasy děda vševěda. Případně mu je vytrhni bez ptaní', 'Otevři dveře na toalety, rozepni si kalhoty a zandej: "che tady někdo sex?"', '#Zazpívej část milostné písně někomu cizímu', 'Zahraj si pantomimu – ostatní vyberou téma', 'Předveď improvizovaný striptýz (ale s mírou)', 'Udělej 5 kliků uprostřed baru', 'Vyměň si jeden kus oblečení s úplně cizím člověkem'];

function loadTasksState(){
  try{ return JSON.parse(localStorage.getItem('tasksState')||'[]'); }catch(e){ return []; }
}
function saveTasksState(arr){
  try{ localStorage.setItem('tasksState', JSON.stringify(arr)); }catch(e){}
}
function loadTasksMeta(){
  try{ return JSON.parse(localStorage.getItem('tasksMeta')||'[]'); }catch(e){ return []; }
}
function saveTasksMeta(arr){
  try{ localStorage.setItem('tasksMeta', JSON.stringify(arr)); }catch(e){}
}

function renderTasks(){
  const container = document.getElementById('tasks-container');
  const progress = document.getElementById('progress');
  if (!container) return;

  const state = loadTasksState();
  const meta = loadTasksMeta();

  const total = tasks.length;
  const done = state.filter(s => s === 'done').length;
  if (progress){
    progress.innerHTML = `<div class="banner"><div class="banner-inner">
      <div class="banner-title">Úkoly: ${done}/${total} odemčených fotek</div>
      <div class="muted">Vyber úkol → zobraz zadání → označ jako splněný nebo přeskoč – fotka se v galerii odemkne.</div>
    </div></div>`;
  }

  container.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'cards';

  tasks.forEach((t, i) => {
    const idx = i + 1;
    const card = document.createElement('article');
    card.className = 'card';

    const title = document.createElement('h2');
    title.textContent = 'Úkol ' + idx;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const pickBtn = document.createElement('button');
    pickBtn.className = 'btn';
    pickBtn.textContent = 'Vybrat úkol';

    const body = document.createElement('div');
    body.style.display = 'none';

    const text = document.createElement('p');
    text.className = 'q-text';
    text.textContent = t;

    const controls = document.createElement('div');
    controls.className = 'actions';
    const doneBtn = document.createElement('button');
    doneBtn.className = 'btn success';
    doneBtn.textContent = 'Úkol splněn';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn secondary';
    skipBtn.textContent = 'Přeskočit';

    const status = document.createElement('div');
    status.className = 'muted';
    const current = meta[i];
    if (state[i] === 'done'){
      status.textContent = current === 'skipped' ? '✔️ Odemčeno (přeskočeno)' : '✔️ Odemčeno (splněno)';
    } else {
      status.textContent = '—';
    }

    function unlock(which){
      state[i] = 'done';
      meta[i] = which;
      saveTasksState(state);
      saveTasksMeta(meta);
      status.textContent = which === 'skipped' ? '✔️ Odemčeno (přeskočeno)' : '✔️ Odemčeno (splněno)';
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'tasksState' })); } catch(e){}
    }

    doneBtn.addEventListener('click', () => unlock('completed'));
    skipBtn.addEventListener('click', () => unlock('skipped'));

    pickBtn.addEventListener('click', () => {
      const visible = body.style.display !== 'none';
      body.style.display = visible ? 'none' : 'block';
      pickBtn.textContent = visible ? 'Vybrat úkol' : 'Skrýt úkol';
    });

    actions.appendChild(pickBtn);
    controls.appendChild(doneBtn);
    controls.appendChild(skipBtn);
    body.appendChild(text);
    body.appendChild(controls);

    card.appendChild(title);
    card.appendChild(actions);
    card.appendChild(body);
    card.appendChild(status);
    list.appendChild(card);
  });

  container.appendChild(list);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderTasks);
} else {
  renderTasks();
}
