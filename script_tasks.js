// Tasks UI with 'Vybrat úkol' first, then completion/skip controls unlocking gallery photos.

const tasks = [
    "Coldplay camera s random lidma",
    "Vyfoť selfie s 5 různými cizími ženami",
    "Vyfoť se během víkendu se třemi různými lidmi jménem Matěj",
    "Získej 5 podpisů od cizích žen na svoje tričko",
    "Podepiš někomu tričko fixem. Tvý kamarádi se nepočítají",
    "Přesvěč nějakou slečnu ať se podepíše na triko tvého kamaráda",
    "Sežeň polaroid (libovolný), vyfoť se v triu s dvěma cizími ženami, a jedna z nich musí napsat na polaroid vzkaz",
    "Požádej slečnu o kreslený portrét tebe (na libovolný papír)",
    "Good morning zvoneček – ráno zazvonit třem cizím ženám a popřát hezký den",
    "Udělej během víkendu radost 3 cizím ženám (zdokumentovat)",
    "Přesvědč cizí ženu, aby tě učila říkat větu ve třech jazycích a natoč to",
    "Získej kontakt na cizí ženu a pozvi ji na kafe (ne nutně přijmout)",
    "Udělej pět přítahů na hrazdě u hřiště – ať to někdo zdokumentuje",
    "Zahraj si s cizími lidmi petanque/šipky/kulečník – fotka důkaz",
    "Vyjednej s barmanem slevu na drink pro vás dva (zdokumentovat)",
    "Zatanči s cizí ženou krátkou choreografii (stačí 10–15 s) – video",
    "Udělej 10 dřepů s cizí ženou na zádech – fotka",
    "Nauč cizí ženu tleskací hru z dětství – video",
    "Přines z baru ubrousek s vzkazem od cizí ženy (ne od kamarádky)",
    "Zahraj si kámen-nůžky-papír s cizí ženou o drobný úkol – foto/video",
    "Vyměň si na 5 minut nějaký kus oblečení s cizí ženou – foto",
    "Napiš na ruku cizí ženě kompliment (její souhlas) – foto",
    "Zazpívej refrén známé písně s cizí ženou – video",
    "Nauč cizí ženu české/slovenské slangové slovo – video",
    "Vytvořte spolu s cizí ženou srdíčko rukama – foto",
    "Najdi tři různé ženy se jménem začínajícím na A, M, K – selfie s každou"
];

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

  // Progress
  const total = tasks.length;
  const done = state.filter(s => s === 'done').length;
  if (progress){
    progress.innerHTML = `<div class="banner"><div class="banner-inner">
      <div class="banner-title">Úkoly: ${done}/${total} odemčených fotek</div>
      <div class="muted">Vyber úkol → zobraz zadání → označ jako splněný nebo přeskoč – fotka se v galerii odemkne.</div>
    </div></div>`;
  }

  // List
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
      // Mark gallery unlock by setting tasksState[i] = "done" (gallery listens for this value)
      state[i] = 'done';
      meta[i] = which; // "completed" | "skipped"
      saveTasksState(state);
      saveTasksMeta(meta);
      status.textContent = which === 'skipped' ? '✔️ Odemčeno (přeskočeno)' : '✔️ Odemčeno (splněno)';
      // let other tabs (gallery) react
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
