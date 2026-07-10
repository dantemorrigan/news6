// NEWS 6 Online — retro UI click sounds.
// Generates short square-wave blips with WebAudio (no audio assets),
// in the spirit of late-90s/early-2000s OS interface clicks.
(function () {
  var ctx = null;
  var INTERACTIVE = 'a, button, input, select, textarea, [role="button"], #n6-six';

  function ensureCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }

  function blip(freq, dur, vol, type) {
    var c = ensureCtx();
    if (!c) return;
    var t = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  // Two-tone "clack" like an old mouse button / OS navigation click.
  function playClick() {
    blip(1600, 0.025, 0.12);
    setTimeout(function () { blip(750, 0.03, 0.07); }, 28);
  }

  // Very quiet, very short tick on hover.
  function playHover() {
    blip(2200, 0.01, 0.025);
  }

  // Any explicitly interactive element, or anything styled to look
  // clickable (cursor:pointer), counts — walk up from the click target
  // rather than relying on a fixed tag list.
  function findClickable(start) {
    var el = start;
    while (el && el.nodeType === 1 && el !== document.body) {
      if (el.matches && el.matches(INTERACTIVE)) return el;
      var cursor = window.getComputedStyle ? getComputedStyle(el).cursor : '';
      if (cursor === 'pointer') return el;
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    if (findClickable(e.target)) playClick();
  }, true);

  var hoverLock = null;
  document.addEventListener('mouseover', function (e) {
    var el = e.target && e.target.closest && e.target.closest(INTERACTIVE);
    if (!el || el === hoverLock) return;
    hoverLock = el;
    playHover();
  }, true);
  document.addEventListener('mouseout', function (e) {
    var el = e.target && e.target.closest && e.target.closest(INTERACTIVE);
    if (el === hoverLock) hoverLock = null;
  }, true);
})();
