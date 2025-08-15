// Clean rebuilt tasks script (no <script> tags)

const tasks = [
// 📸 Fotky & Selfie
    "Coldplay camera s random lidma",
    "Vyfoť selfie s 5 různými cizími ženami",
    "Vyfoť se během víkendu se třemi různými lidmi jménem Matěj",

    // 🖊️ Podpisy & Zápisy
    "Získej 5 podpisů od cizích žen na svoje tričko",
    "Podepiš někomu tričko fixem. Tvý kamarádi se nepočítají",
    "Přesvěč nějakou slečnu ať se podepíše na triko tvého kamaráda",

    // 🍹 Pivo, Drink & Bar
    "Objednej drink pro úplně cizího člověka",
    "Natoč si v hospodě vlastní pivo",
    "Objednej si pití falešným přízvukem (např. Ital, Rus, Francouz)",

    // 💬 Socializace
    "Dostaň číslo od cizí holky",
    "Na chvíli si hraj na číšníka v baru a obsluž někoho cizího",
    "Zazvoň na dveře a požádej o svatební požehnání",
    "Zeptej se kolemjdoucí ženy, jestli se nechce nechat vyšetřit od pana doktora farmacie",
    "Požádej o radu v lásce od staršího páru",
    "Přesvědč někoho, ať tě adoptuje jako svého syna",
    "Buď wingman a dohod jednu slečnu kámošovi",
    "Najdi někoho bez vlasů a zeptej se, jestli by ti nedal tři vlasy děda vševěda",
    "Otevři dveře na toalety, rozepni kalhoty a řekni: 'Chce tady někdo sex?'",

    // 🎭 Zábava
    "Zahraj si pantomimu – ostatní vyberou téma",

    // 🎯 Soutěže
    "Udělej 5 kliků uprostřed baru",
    "Vyměň si jeden kus oblečení s úplně cizím člověkem",

    // 🔄 Výměny
    "Sežeň kondom a vyměň ho s někým za jiný předmět",

    // 🎤 Komunikace
    "Zeptej se tří lidí, jestli se ženíš ze správných důvodů",

    // 🎶 Karaoke
    "Přihlas se do karaoke",

    // 💸 Prodej
    "Prodej fiktivní svatební lístky kolemjdoucím",

    // 🕊️ Symbolické
    "Založ v baru minichvíli ticha na počest tvé svobody"
];

// --- Persistent random order ---
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
let tasksOrder = JSON.parse(localStorage.getItem("tasksOrder"));
if (!Array.isArray(tasksOrder) || tasksOrder.length !== tasks.length) {
  tasksOrder = Array.from({length: tasks.length}, (_, i) => i);
  shuffleArray(tasksOrder);
  localStorage.setItem("tasksOrder", JSON.stringify(tasksOrder));
}
const tasksList = tasksOrder.map(i => tasks[i]);

const totalTasks = tasksList.length;
let tasksState = JSON.parse(localStorage.getItem("tasksState")) || Array(totalTasks).fill("locked");

function saveState() {
  localStorage.setItem("tasksState", JSON.stringify(tasksState));
}

function renderTasks() {
  try {
    const container = document.getElementById("tasks-container");
    if (!container) return;
    container.innerHTML = "";

    const unlocked = tasksState.filter(t => t !== "locked").length;
    const progressEl = document.getElementById("progress");
    if (progressEl) progressEl.textContent = `Úkol ${unlocked} z ${totalTasks}`;

    const bar = document.getElementById("progress-bar");
    const percentEl = document.getElementById("progress-percent");
    const percent = Math.round((unlocked / totalTasks) * 100);
    if (bar) bar.style.width = percent + "%";
    if (percentEl) percentEl.textContent = percent + "%";

    for (let i = 0; i < totalTasks; i++) {
      const state = tasksState[i];
      const taskDiv = document.createElement("div");
      taskDiv.className = `task ${state}`;
      taskDiv.innerHTML = `
        <h2>Úkol ${i + 1}</h2>
        <p>${tasksList[i]}</p>
        ${
          state === "done" 
            ? `<span class="done-label">Splněno ✅</span>` 
            : state === "skipped" 
              ? `<span class="skip-label">Přeskočeno ⏭️</span> <button onclick="markDone(${i})" class="btn btn-secondary">Dodatečně splněno</button>`
              : `<button onclick="completeTask(${i})" class="btn">Splněno</button>
                 <button onclick="skipTask(${i})" class="btn btn-secondary">Přeskočit</button>`
        }`;
      if (state === "locked") taskDiv.style.display = "none";
      container.appendChild(taskDiv);
    }
  } catch (e) {
    let err = document.getElementById("error-banner");
    if (!err) {
      err = document.createElement("div");
      err.id = "error-banner";
      err.style.cssText = "color:#b91c1c;background:#fee2e2;padding:12px;border-radius:8px;margin:8px 0;";
      document.body.prepend(err);
    }
    err.textContent = "Chyba ve skriptu: " + e.message;
    console.error(e);
  }
}

function completeTask(index) {
  if (tasksState[index] !== "locked") {
    tasksState[index] = "done";
    if (index + 1 < totalTasks && tasksState[index + 1] === "locked") {
      tasksState[index + 1] = "active";
    }
    saveState();
    renderTasks();
  }
}

function skipTask(index) {
  if (tasksState[index] !== "locked") {
    tasksState[index] = "skipped";
    if (index + 1 < totalTasks && tasksState[index + 1] === "locked") {
      tasksState[index + 1] = "active";
    }
    saveState();
    renderTasks();
  }
}

function markDone(index) {
  if (tasksState[index] === "skipped" || tasksState[index] === "active") {
    tasksState[index] = "done";
    saveState();
    renderTasks();
  }
}

// Init: ensure state length matches, ensure first task active, render after DOM ready
(function() {
  if (!Array.isArray(tasksState) || tasksState.length !== totalTasks) {
    tasksState = Array(totalTasks).fill("locked");
  }
  if (tasksState[0] === "locked") tasksState[0] = "active";
  saveState();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderTasks);
  } else {
    renderTasks();
  }
  wireTaskControls();
})();


function openTaskByNumber(n) {
  const idx = parseInt(n, 10) - 1;
  const feedback = document.getElementById("task-open-feedback");
  if (isNaN(idx) || idx < 0 || idx >= totalTasks) {
    if (feedback) feedback.textContent = "Neplatné číslo úkolu.";
    return;
  }
  if (tasksState[idx] === "locked") {
    tasksState[idx] = "active";
  }
  saveState();
  renderTasks();
  const cards = document.querySelectorAll("#tasks-container .task");
  if (cards[idx]) cards[idx].scrollIntoView({ behavior: "smooth", block: "start" });
  if (feedback) feedback.textContent = `Otevřen úkol ${idx + 1}.`;
}

function wireTaskControls() {
  const input = document.getElementById("task-number");
  const openBtn = document.getElementById("btn-open-task");
  const rndBtn = document.getElementById("btn-random-task");
  if (openBtn && input) openBtn.addEventListener("click", () => openTaskByNumber(input.value));
  if (rndBtn && input) rndBtn.addEventListener("click", () => {
    const n = getRandomTaskFromPool();
    input.value = n;
    openTaskByNumber(n);
  });
}


function getRandomTaskFromPool() {
  // Persistent pool of remaining task numbers (1..totalTasks), shuffled
  let pool = JSON.parse(localStorage.getItem("tasksRandomPool"));
  const valid = Array.isArray(pool) && pool.every(n => Number.isInteger(n) && n >= 1 && n <= totalTasks);
  if (!valid) {
    pool = Array.from({length: totalTasks}, (_, i) => i + 1);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }
  if (pool.length === 0) {
    pool = Array.from({length: totalTasks}, (_, i) => i + 1);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }
  const n = pool.pop();
  localStorage.setItem("tasksRandomPool", JSON.stringify(pool));
  return n;
}
