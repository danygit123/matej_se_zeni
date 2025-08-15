(function() {
  // Svatba: 2025-09-06 (místní čas)
  var target = new Date(2025, 8, 6, 0, 0, 0); // 0-based month -> 8 = září
  var el = document.getElementById('countdown');
  if (!el) return;

  function pad(n){ return n.toString().padStart(2,'0'); }

  function render(){
    var now = new Date();
    var diff = target - now;
    if (diff <= 0) { el.textContent = 'Je to tady! 🎉'; return; }
    var days = Math.floor(diff / (1000*60*60*24));
    var hours = Math.floor((diff / (1000*60*60)) % 24);
    var mins = Math.floor((diff / (1000*60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);
    el.textContent = days + ' dní ' + pad(hours) + ':' + pad(mins) + ':' + pad(secs);
  }

  render();
  setInterval(render, 1000);
})();
