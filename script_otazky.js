// Render list of questions from window.questionsData
(function(){
  function renderQuestions(){
    const data = (window.questionsData || []);
    const root = document.getElementById('questions-container');
    if (!root) return;
    root.innerHTML = '';

    // ensure questionsTotal in localStorage
    try { localStorage.setItem('questionsTotal', String(data.length)); } catch(e){}

    // read seen state
    const seen = JSON.parse(localStorage.getItem('questionsState')||'[]');

    data.forEach((item, i) => {
      const idx = i + 1;
      const card = document.createElement('article');
      card.className = 'question';
      card.setAttribute('data-question-index', String(i));

      const title = document.createElement('h2');
      title.textContent = `Otázka ${idx}`;

      const text = document.createElement('p');
      text.className = 'q-text';
      text.textContent = item.q;

      const btn = document.createElement('a');
      btn.className = 'btn';
      btn.href = `otazka.html?id=${idx}`;
      btn.textContent = 'Otevřít';

      const status = document.createElement('div');
      status.className = 'muted';
      status.style.marginTop = '6px';
      status.textContent = seen[i] ? '✔️ Už jsi otevřel' : '—';

      card.appendChild(title);
      card.appendChild(text);
      card.appendChild(btn);
      card.appendChild(status);
      root.appendChild(card);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderQuestions);
  } else {
    renderQuestions();
  }
})();
