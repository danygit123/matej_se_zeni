(function() {
  const info = document.getElementById("gallery-info");
  const wrapTasks = document.getElementById("gallery-tasks");
  const wrapQuestions = document.getElementById("gallery-questions");

  const TASK_PHOTOS = 26;
  const QUESTION_PHOTOS = 17;

  const tasksState = JSON.parse(localStorage.getItem("tasksState")) || [];
  const questionsState = JSON.parse(localStorage.getItem("questionsState")) || [];
  const unlockAll = localStorage.getItem("galleryUnlockAll") === "true";

  const doneCount = tasksState.filter(s => s === "done").length;           // kolik úkolů je splněno
  const seenCount = questionsState.filter(Boolean).length;                  // kolik otázek bylo otevřeno

  const total = TASK_PHOTOS + QUESTION_PHOTOS; // 43

  function createCard(globalIndex, unlocked) {
    const card = document.createElement("div");
    card.className = "gallery-card " + (unlocked ? "unlocked" : "locked");

    const figure = document.createElement("figure");
    figure.className = "photo";

    const img = document.createElement("img");
    img.alt = `Fotka ${globalIndex}`;
    img.loading = "lazy";

    // Prefer "(n).jpg" naming; fallback to .jpeg/.webp/.png; then plain "n.jpg/.."
    const exts = ["jpg","jpeg","webp","png"];
    let extIdx = 0;
    let variant = 0; // 0 => "(n).ext", 1 => "n.ext"

    const setSrc = () => {
      const name = variant === 0 ? `(${globalIndex})` : `${globalIndex}`;
      img.src = `galerie/${name}.${exts[extIdx]}`;
    };

    img.onerror = () => {
      extIdx++;
      if (extIdx < exts.length) {
        setSrc();
      } else if (variant === 0) {
        variant = 1;
        extIdx = 0;
        setSrc();
      } else {
        img.style.display = "none"; // neukazuj prázdný rozbitý obrázek
      }
    };

    setSrc();

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = `#${globalIndex}`;

    const caption = document.createElement("figcaption");
    caption.textContent = unlocked ? "Odemčeno" : "Zamčeno";

    figure.appendChild(img);
    figure.appendChild(badge);
    figure.appendChild(caption);
    card.appendChild(figure);
    return card;
  }

  function render() {
    if (info) {
      const unlockedTotal = Math.min(total, doneCount + seenCount);
      info.textContent = unlockAll
        ? `Galerie je plně odemčená (${total}/${total} fotek).`
        : `Odemčeno ${unlockedTotal} z ${total} fotek (26 za úkoly, 17 za otázky).`;
    }

    if (wrapTasks) {
      wrapTasks.innerHTML = "";
      for (let i = 1; i <= TASK_PHOTOS; i++) {
        const unlocked = unlockAll || i <= doneCount;
        wrapTasks.appendChild(createCard(i, unlocked));
      }
    }

    if (wrapQuestions) {
      wrapQuestions.innerHTML = "";
      for (let i = 1; i <= QUESTION_PHOTOS; i++) {
        const globalIdx = TASK_PHOTOS + i; // 27..43
        const unlocked = unlockAll || i <= seenCount;
        wrapQuestions.appendChild(createCard(globalIdx, unlocked));
      }
    }
  }

  render();

  // Live update when localStorage changes (if user completes tasks/questions in other tab)
  window.addEventListener("storage", (e) => {
    if (e.key === "tasksState" || e.key === "questionsState" || e.key === "galleryUnlockAll") {
      location.reload();
    }
  });
})();
