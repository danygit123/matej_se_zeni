(function(){
  function getId(){
    const p = new URLSearchParams(location.search);
    const id = parseInt(p.get('id')||'0', 10);
    return (Number.isInteger(id) && id >= 1) ? id : 1;
  }
  const id = getId();
  const data = window.questionsData || [];
  const item = data[id-1] || { q: 'Otázka '+id, a: '' };

  const title = document.getElementById('q-title');
  const text = document.getElementById('q-text');
  const answer = document.getElementById('q-answer');
  const wrap = document.getElementById('answer-wrap');
  const btn = document.getElementById('toggle-answer');

  if (title) title.textContent = 'Otázka ' + id;
  if (text) text.textContent = item.q;
  if (answer) answer.textContent = item.a || '—';

  // mark as seen (for gallery)
  try {
    const key = 'questionsState';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr[id-1] = true;
    localStorage.setItem(key, JSON.stringify(arr));
  } catch(e){}

  if (btn && wrap) {
    btn.addEventListener('click', () => {
      const visible = wrap.style.display !== 'none';
      wrap.style.display = visible ? 'none' : 'block';
      btn.textContent = visible ? 'Zobrazit odpověď' : 'Skrýt odpověď';
    });
  }
})();