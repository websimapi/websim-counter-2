const display = document.getElementById('display');
const incr = document.getElementById('incr');
const decr = document.getElementById('decr');
const reset = document.getElementById('reset');
const stepRange = document.getElementById('step');
const stepVal = document.getElementById('stepVal');

let value = 0;
let step = Number(stepRange.value);
const formatter = new Intl.NumberFormat();

/** render formatted value and step, with color feedback */
function render() {
  display.textContent = formatter.format(value);
  stepVal.textContent = String(step);
  display.style.color = value === 0 ? '#6b7280' : (value > 0 ? '#0a7a66' : '#b91c1c');
}

function changeBy(n) {
  value += n;
  render();
}

// button events
incr.addEventListener('click', () => changeBy(step));
decr.addEventListener('click', () => changeBy(-step));
reset.addEventListener('click', () => { value = 0; render(); });

// long-press repeat for better mobile UX (added pointerleave for more reliable stop)
function attachHold(btn, fn){
  let timer = null;
  let interval = null;
  const start = (e) => {
    // prevent accidental text selection / default gestures
    e.preventDefault?.();
    fn();
    timer = setTimeout(()=> {
      interval = setInterval(fn, 120);
    }, 300);
  };
  const stop = () => { clearTimeout(timer); clearInterval(interval); timer = interval = null; };
  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointercancel', stop);
  btn.addEventListener('pointerout', stop);
  btn.addEventListener('pointerleave', stop);
}
attachHold(incr, () => changeBy(step));
attachHold(decr, () => changeBy(-step));

// step control
stepRange.addEventListener('input', (e) => {
  step = Number(e.target.value);
  render();
});

// keyboard support (desktop) — allow 'r' for reset too
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === '+') changeBy(step);
  if (e.key === 'ArrowDown' || e.key === '-') changeBy(-step);
  if (e.key === '0' || e.key.toLowerCase() === 'r') { value = 0; render(); }
});

// initial render
render();