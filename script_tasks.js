// Clean rebuilt tasks script (explicit UI with 'Vybrat úkol' first)

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

function saveTaskSeen(idx){
  try{
    const key = 'tasksState';
    const arr = JSON.parse(localStorage.getItem(key)||'[]');
    arr[idx] = true;
    localStorage.setItem(key, JSON.stringify(arr));
  }catch(e){}
}
function isTaskSeen(idx){
  try{
    const arr = JSON.parse(localStorage.getItem('tasksState')||'[]');
    return !!arr[idx];
  }catch(e){ return false; }
}

function renderTasks(){
  const container = document.getElementById('tasks-container');
  const progress = document.getElementById('progress');
  if (!container) return;

  // Progress
  const total = tasks.length;
  const done = (JSON.parse(localStorage.getItem('tasksState')||'[]')).filter(Boolean).length || 0;
  if (progress){
    progress.innerHTML = `<div class="banner"><div class="banner-inner">
      <div class="banner-title">Úkoly: ${done}/${total} otevřených</div>
      <div class="muted">Nejdřív vyber úkol, pak se ukáže zadání.</div>
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

    const status = document.createElement('div');
    status.className = 'muted';
    status.textContent = isTaskSeen(i) ? '✔️ Otevřený' : '—';

    pickBtn.addEventListener('click', () => {
      const visible = body.style.display !== 'none';
      body.style.display = visible ? 'none' : 'block';
      pickBtn.textContent = visible ? 'Vybrat úkol' : 'Skrýt úkol';
      if (!visible){ saveTaskSeen(i); status.textContent = '✔️ Otevřený'; }
    });

    actions.appendChild(pickBtn);
    body.appendChild(text);

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
