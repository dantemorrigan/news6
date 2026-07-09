// NEWS 6 Online — hidden "666" easter egg.
// Double-click the "6" in the masthead logo to reveal a two-digit
// input. Entering "66" (completing 6-6-6) triggers a full-page
// jumpscare.
(function () {
  var TARGET = '66';
  var promptEl = null;

  function closePrompt() {
    if (promptEl) {
      promptEl.remove();
      promptEl = null;
    }
  }

  function openPrompt(anchorEl) {
    if (promptEl) return;

    var box = document.createElement('div');
    box.style.cssText = [
      'position:fixed', 'z-index:999998', 'top:50%', 'left:50%',
      'transform:translate(-50%,-50%)', 'background:#000',
      'border:1px solid #fff', 'padding:18px 20px',
      'font-family:"Courier New",monospace', 'color:#fff',
      'box-shadow:0 0 0 2000px rgba(0,0,0,0.7)', 'text-align:center'
    ].join(';');

    var label = document.createElement('div');
    label.textContent = '6 _ _';
    label.style.cssText = 'font-size:22px; letter-spacing:6px; margin-bottom:10px;';

    var input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 2;
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.style.cssText = [
      'background:#000', 'border:1px solid #fff', 'color:#fff',
      'font-family:"Courier New",monospace', 'font-size:18px',
      'letter-spacing:8px', 'text-align:center', 'width:70px',
      'padding:6px 4px', 'outline:none'
    ].join(';');

    var confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'CONFIRM';
    confirmBtn.style.cssText = [
      'display:block', 'margin:12px auto 0', 'background:#000',
      'color:#fff', 'border:1px solid #fff', 'padding:6px 14px',
      'font-family:"Courier New",monospace', 'font-size:12px',
      'letter-spacing:1px', 'cursor:pointer'
    ].join(';');
    confirmBtn.onmouseenter = function () {
      confirmBtn.style.background = '#fff';
      confirmBtn.style.color = '#000';
    };
    confirmBtn.onmouseleave = function () {
      confirmBtn.style.background = '#000';
      confirmBtn.style.color = '#fff';
    };

    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 2);
      label.textContent = '6 ' + (input.value[0] || '_') + ' ' + (input.value[1] || '_');
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submit();
      if (e.key === 'Escape') closePrompt();
    });

    function submit() {
      if (input.value === TARGET) {
        closePrompt();
        jumpscare();
      } else {
        box.style.transition = 'transform 0.06s';
        var shakes = 0;
        var shakeInt = setInterval(function () {
          box.style.transform = 'translate(-50%,-50%) translateX(' + (shakes % 2 ? '6px' : '-6px') + ')';
          shakes++;
          if (shakes > 5) {
            clearInterval(shakeInt);
            box.style.transform = 'translate(-50%,-50%)';
          }
        }, 40);
        input.value = '';
        label.textContent = '6 _ _';
      }
    }

    confirmBtn.addEventListener('click', submit);
    box.addEventListener('click', function (e) { e.stopPropagation(); });

    box.appendChild(label);
    box.appendChild(input);
    box.appendChild(confirmBtn);
    document.body.appendChild(box);
    promptEl = box;
    input.focus();

    setTimeout(function () {
      document.addEventListener('click', closePrompt, { once: true });
    }, 0);
  }

  function jumpscare() {
    var overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:999999',
      'background:#8b0000', 'display:flex', 'align-items:center',
      'justify-content:center', 'overflow:hidden'
    ].join(';');

    var text = document.createElement('div');
    text.textContent = "IT'S THEIR FAULT";
    text.style.cssText = [
      'font-family:Georgia,"Times New Roman",serif', 'font-weight:900',
      'color:#000', 'text-shadow:0 0 40px rgba(0,0,0,0.6)',
      'font-size:clamp(28px,7vw,90px)', 'text-align:center',
      'letter-spacing:2px', 'padding:0 20px', 'opacity:0'
    ].join(';');

    overlay.appendChild(text);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var styleTag = document.createElement('style');
    styleTag.textContent =
      '@keyframes n6-glitch {' +
      '0%{filter:hue-rotate(0deg) contrast(1);transform:translate(0,0);}' +
      '10%{transform:translate(-8px,3px);}' +
      '20%{transform:translate(6px,-4px);filter:contrast(2);}' +
      '30%{transform:translate(-4px,5px);}' +
      '40%{transform:translate(8px,-2px);filter:hue-rotate(30deg);}' +
      '50%{transform:translate(-6px,-3px);}' +
      '60%{transform:translate(4px,4px);filter:contrast(1.6);}' +
      '70%{transform:translate(-8px,2px);}' +
      '80%{transform:translate(5px,-5px);}' +
      '90%{transform:translate(-2px,3px);}' +
      '100%{transform:translate(0,0);filter:none;}' +
      '}' +
      '.n6-jumpscare-active{animation:n6-glitch 0.7s steps(2) 3;}';
    document.head.appendChild(styleTag);
    overlay.classList.add('n6-jumpscare-active');

    var blip = null;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        var ctx = new AC();
        var t = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.9);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 1.2);
      }
    } catch (e) { /* audio not available, silently continue */ }

    setTimeout(function () {
      overlay.classList.remove('n6-jumpscare-active');
      overlay.style.transition = 'opacity 0.4s';
      text.style.transition = 'opacity 0.6s';
      text.style.opacity = '1';
    }, 750);
  }

  document.addEventListener('dblclick', function (e) {
    var el = e.target && e.target.closest && e.target.closest('#n6-six');
    if (el) {
      e.preventDefault();
      openPrompt(el);
    }
  });
})();
