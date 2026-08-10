/* ============================================================
   app.js — Birthday Gift Investigation · Quiz Engine
   ============================================================ */

// 🎂 PASTE YOUR GOOGLE APPS SCRIPT DEPLOYED URL HERE (line 6)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOwWQMnZnilcA1eS1orCfqMW__ZhSob0asLo7cocUhmxJ53gyMGxTqX03-W33R60jgFA/exec"
// 🔐 SECRET TOKEN — must match the one in apps-script.gs
const SUBMIT_SECRET = "gooner-vizag-2025";

// ─────────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────────
let currentIndex = 0;   // index in QUIZ_DATA
let answers = {};  // { questionId: value }
let animating = false;

// Questions only (no round intros) — used for progress counter
const questionItems = QUIZ_DATA.filter(q => q.type !== 'round_intro');
const totalQuestions = questionItems.length;

function getQuestionNumber(item) {
  if (item.type === 'round_intro') return null;
  return questionItems.indexOf(item) + 1;
}

// Round accent colors
const ROUND_COLORS = { 1: '#a855f7', 2: '#3b82f6', 3: '#f59e0b', 4: '#ef4444' };

// ─────────────────────────────────────────────────────────────
//  SOUND ENGINE
// ─────────────────────────────────────────────────────────────
let soundEnabled = true;
let currentAudio = null;

const SOUND_FILES = {
  accha:    'SOUNDS/accha-thik-hai-samjhgya-puneet-superstar.mp3',
  messi:   'SOUNDS/camera-wowo-messi.mp3',
  jhaat:   'SOUNDS/ek-jhaat-bhar-ka-aadmi.mp3',
  hub:     'SOUNDS/hub-intro-sound.mp3',
  takleef: 'SOUNDS/is-sajjan-ko-kya-takleef-hai-bhai.mp3',
  gareeb:  'SOUNDS/jo-gareeb-hove-naa.mp3',
  leteLete:'SOUNDS/kya-aap-lete-lete.mp3',
  rizz:    'SOUNDS/rizz-sound-effect.mp3',
  sochna:  'SOUNDS/sochna-pdta-hai-re-hindustani-bhau.mp3',
  tuSamjha:'SOUNDS/tu-samjha.mp3',
  phone:   'SOUNDS/yo-phone-is-ringing.mp3'
};

const SOUNDS = {};
Object.keys(SOUND_FILES).forEach(key => {
  SOUNDS[key] = new Audio(SOUND_FILES[key]);
  SOUNDS[key].preload = 'auto';
});

function playSound(key, force = false) {
  if (!soundEnabled || !SOUND_FILES[key]) return;
  try {
    // If a sound is currently playing and force is false, let it finish naturally
    if (!force && currentAudio && !currentAudio.paused && !currentAudio.ended) {
      return;
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(SOUND_FILES[key]);
    currentAudio = audio;
    audio.play().catch(e => console.log('Audio playback info:', e));
  } catch (e) {
    console.log('Audio playback error:', e);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle');
  if (soundEnabled) {
    btn.classList.remove('muted');
    btn.innerHTML = '🔊 <span id="sound-toggle-text">SOUND ON</span>';
  } else {
    if (currentAudio) currentAudio.pause();
    btn.classList.add('muted');
    btn.innerHTML = '🔇 <span id="sound-toggle-text">MUTED</span>';
  }
}

// ── AUTOPLAY INTRO ON LOAD ────────────────────────────────────
let hasPlayedIntro = false;

function initAutoplayIntro() {
  if (hasPlayedIntro) return;

  const tryPlay = () => {
    if (hasPlayedIntro) return;
    playSound('hub', true);
    hasPlayedIntro = true;
  };

  // Attempt 1: Immediate on load
  tryPlay();

  // Attempt 2: First interaction anywhere on page (if browser blocked autoplay)
  const onFirstTouch = () => {
    tryPlay();
    document.removeEventListener('click', onFirstTouch);
    document.removeEventListener('touchstart', onFirstTouch);
    document.removeEventListener('keydown', onFirstTouch);
  };

  document.addEventListener('click', onFirstTouch, { once: true });
  document.addEventListener('touchstart', onFirstTouch, { once: true });
  document.addEventListener('keydown', onFirstTouch, { once: true });
}

// ─────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAutoplayIntro();
  document.getElementById('begin-btn').addEventListener('click', startQuiz);
  document.addEventListener('keydown', handleKeydown);
});

// ─────────────────────────────────────────────────────────────
//  PARTICLES
// ─────────────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    a: Math.random() * 0.45 + 0.08,
    color: ['#a855f7', '#3b82f6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)]
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `,${p.a})`).replace('rgb', 'rgba').replace('#', '');
      // simple hex → rgba shortcut
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─────────────────────────────────────────────────────────────
//  SCREEN MANAGEMENT
// ─────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─────────────────────────────────────────────────────────────
//  START QUIZ
// ─────────────────────────────────────────────────────────────
function startQuiz() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  playSound('rizz', true);
  const landing = document.getElementById('landing');
  landing.style.animation = 'fadeOut 0.55s ease forwards';
  setTimeout(() => {
    showScreen('quiz-screen');
    renderCurrent();
  }, 560);
}

// ─────────────────────────────────────────────────────────────
//  KEYBOARD
// ─────────────────────────────────────────────────────────────
function handleKeydown(e) {
  if (animating) return;
  const active = document.querySelector('.screen.active');
  if (!active || active.id !== 'quiz-screen') return;

  if (e.key === 'ArrowRight' || (e.key === 'Enter' && !isTextFocused())) nextQuestion();
  if (e.key === 'ArrowLeft') prevQuestion();
}

function isTextFocused() {
  const t = document.activeElement && document.activeElement.tagName;
  return t === 'INPUT' || t === 'TEXTAREA';
}

// ─────────────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────────────
function nextQuestion() {
  if (animating) return;
  const item = QUIZ_DATA[currentIndex];

  // Validate before advancing (skip for intros)
  if (item.type !== 'round_intro' && !validateCurrent()) return;

  if (currentIndex >= QUIZ_DATA.length - 1) {
    goToAnalysis();
    return;
  }
  transition(1);
}

function prevQuestion() {
  if (animating || currentIndex === 0) return;
  transition(-1);
}

function transition(dir) {
  if (animating) return;
  animating = true;

  const card = document.getElementById('question-card');
  const outClass = dir === 1 ? 'slide-out-left' : 'slide-out-right';

  card.classList.add(outClass);
  setTimeout(() => {
    card.classList.remove(outClass);
    currentIndex += dir;
    renderCurrent(dir);
    animating = false;
  }, 280);
}

// ─────────────────────────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────────────────────────
function renderCurrent(dir = 1) {
  const item = QUIZ_DATA[currentIndex];
  const card = document.getElementById('question-card');

  // Inject HTML
  if (item.type === 'round_intro') {
    card.innerHTML = buildRoundIntro(item);
  } else {
    card.innerHTML = buildQuestion(item);
    restoreAnswer(item);
    attachOptionListeners(item);
  }

  // Slide-in animation
  const inClass = dir >= 0 ? 'slide-in-right' : 'slide-in-left';
  card.classList.add(inClass);
  setTimeout(() => card.classList.remove(inClass), 400);

  updateProgress(item);
  updateNavButtons(item);

  // Trigger contextual sounds on screen enter
  if (item.type === 'round_intro') {
    if (item.round === 1) playSound('rizz');
    else if (item.round === 2) playSound('messi');
    else if (item.round === 3) playSound('leteLete');
    else if (item.round === 4) playSound('tuSamjha');
  } else {
    if (item.id === 'q8') playSound('gareeb');
    else if (item.id === 'q11') playSound('takleef');
  }
}

// ─────────────────────────────────────────────────────────────
//  PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function updateProgress(item) {
  const header = document.getElementById('progress-header');
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  const badge = document.getElementById('round-badge');

  if (item.type === 'round_intro') {
    header.style.opacity = '0';
    return;
  }

  header.style.opacity = '1';
  const qNum = getQuestionNumber(item);
  text.textContent = `Question ${qNum} / ${totalQuestions}`;
  bar.style.width = `${(qNum / totalQuestions) * 100}%`;
  badge.textContent = `ROUND ${item.round}`;
  badge.style.color = ROUND_COLORS[item.round];
  badge.style.borderColor = ROUND_COLORS[item.round] + '55';
  badge.style.background = ROUND_COLORS[item.round] + '18';
}

// ─────────────────────────────────────────────────────────────
//  NAV BUTTONS
// ─────────────────────────────────────────────────────────────
function updateNavButtons(item) {
  const nav = document.getElementById('nav-buttons');
  const prev = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');

  if (item.type === 'round_intro') {
    nav.style.justifyContent = 'center';
    prev.style.display = 'none';
    next.textContent = "LET'S GO →";
  } else {
    nav.style.justifyContent = 'space-between';
    prev.style.display = currentIndex === 0 ? 'none' : 'inline-flex';
    const isLast = currentIndex === QUIZ_DATA.length - 1;
    next.textContent = isLast ? 'SEE ANALYSIS →' : 'NEXT →';
  }
}

// ─────────────────────────────────────────────────────────────
//  VALIDATION
// ─────────────────────────────────────────────────────────────
function validateCurrent() {
  const item = QUIZ_DATA[currentIndex];
  if (!item.required) return true;

  const errEl = document.getElementById('q-err');

  if (item.type === 'choice' || item.type === 'final_choice') {
    if (!answers[item.id]) {
      if (errEl) { errEl.classList.add('visible'); errEl.textContent = '⚠ Please select an option to continue.'; }
      shakeCard();
      return false;
    }
  }

  if (item.type === 'multiselect') {
    const sel = answers[item.id];
    if (!sel || sel.length === 0) {
      if (errEl) { errEl.classList.add('visible'); errEl.textContent = '⚠ Pick at least one option.'; }
      shakeCard();
      return false;
    }
  }

  if (item.type === 'textarea' || item.type === 'text') {
    const inp = document.getElementById(`input-${item.id}`);
    if (!inp || !inp.value.trim()) {
      if (errEl) { errEl.classList.add('visible'); errEl.textContent = '⚠ Please type something here.'; }
      if (inp) inp.focus();
      shakeCard();
      return false;
    }
    answers[item.id] = inp.value.trim();
  }

  if (errEl) errEl.classList.remove('visible');
  return true;
}

function shakeCard() {
  const card = document.getElementById('question-card');
  card.style.animation = 'none';
  card.style.transform = 'translateX(-8px)';
  setTimeout(() => { card.style.transform = 'translateX(8px)'; }, 80);
  setTimeout(() => { card.style.transform = 'translateX(-4px)'; }, 160);
  setTimeout(() => { card.style.transform = 'translateX(0)'; }, 240);
}

// ─────────────────────────────────────────────────────────────
//  RESTORE SAVED ANSWER
// ─────────────────────────────────────────────────────────────
function restoreAnswer(item) {
  const saved = answers[item.id];
  if (!saved) return;

  if (item.type === 'choice' || item.type === 'final_choice') {
    document.querySelectorAll('.option-card').forEach(c => {
      if (c.dataset.value === saved) c.classList.add('selected');
    });
  }
  if (item.type === 'multiselect') {
    document.querySelectorAll('.option-card').forEach(c => {
      if (saved.includes(c.dataset.value)) c.classList.add('selected');
    });
  }
  if (item.type === 'text' || item.type === 'textarea') {
    const inp = document.getElementById(`input-${item.id}`);
    if (inp) inp.value = saved;
  }
  if (item.type === 'sizes') {
    item.fields.forEach(f => {
      const inp = document.getElementById(`input-${f.id}`);
      if (inp && answers[f.id]) inp.value = answers[f.id];
    });
  }
}

// ─────────────────────────────────────────────────────────────
//  OPTION CLICK LISTENERS
// ─────────────────────────────────────────────────────────────
function playOptionSound(val) {
  const str = String(val).toLowerCase();
  if (str.includes('messi') || str.includes('barcelona') || str.includes('yamal') || str.includes('argentina')) {
    playSound('messi', true);
  } else if (str.includes('gawk') || str.includes('illegal')) {
    playSound('jhaat', true);
  } else if (str.includes('hot wheels') || str.includes('jdm') || str.includes('supercars')) {
    playSound('leteLete', true);
  } else if (str.includes('zoro') || str.includes('itachi') || str.includes('luffy') || str.includes('anime figure')) {
    playSound('rizz', true);
  } else if (str.includes('lawyer') || str.includes('trap') || str.includes('planning something')) {
    playSound('tuSamjha', true);
  } else {
    playSound('accha', true);
  }
}

function attachOptionListeners(item) {
  if (item.type === 'choice' || item.type === 'final_choice') {
    document.querySelectorAll('.option-card').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.option-card').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        answers[item.id] = c.dataset.value;
        document.getElementById('q-err')?.classList.remove('visible');
        playOptionSound(c.dataset.value);
      });
    });
  }

  if (item.type === 'multiselect') {
    if (!answers[item.id]) answers[item.id] = [];
    document.querySelectorAll('.option-card').forEach(c => {
      c.addEventListener('click', () => {
        const val = c.dataset.value;
        const idx = answers[item.id].indexOf(val);
        if (idx === -1) { answers[item.id].push(val); c.classList.add('selected'); }
        else { answers[item.id].splice(idx, 1); c.classList.remove('selected'); }
        document.getElementById('q-err')?.classList.remove('visible');
        playOptionSound(val);
      });
    });
  }

  if (item.type === 'text' || item.type === 'textarea') {
    const inp = document.getElementById(`input-${item.id}`);
    if (inp) {
      inp.addEventListener('focus', () => {
        if (item.id === 'q8' || item.id === 'q9') playSound('sochna');
      });
      inp.addEventListener('input', () => { answers[item.id] = inp.value; });
    }
  }

  if (item.type === 'sizes') {
    item.fields.forEach(f => {
      const inp = document.getElementById(`input-${f.id}`);
      if (inp) inp.addEventListener('input', () => { answers[f.id] = inp.value; });
    });
  }
}

// ─────────────────────────────────────────────────────────────
//  BUILD HTML — ROUND INTRO
// ─────────────────────────────────────────────────────────────
function buildRoundIntro(item) {
  const memeHtml = item.meme
    ? `<div class="meme-container" style="margin-top:20px">
        <img src="${item.meme}" alt="${item.memeAlt || 'meme'}" class="meme-img meme-round" />
       </div>`
    : '';

  return `
    <div class="round-intro-card" style="--accent:${item.accent}">
      <style>
        .round-intro-card::before { background: ${item.accent}; }
      </style>
      <span class="round-intro-emoji">${item.emoji}</span>
      <div class="round-intro-label" style="color:${item.accent}">ROUND ${item.round}</div>
      <h2 class="round-intro-title">${item.title}</h2>
      <p class="round-intro-text">${item.subtitle}</p>
      <p class="round-intro-text"><strong>${item.text}</strong></p>
      ${memeHtml}
    </div>`;
}

// ─────────────────────────────────────────────────────────────
//  BUILD HTML — QUESTION TYPES
// ─────────────────────────────────────────────────────────────
function buildQuestion(item) {
  const accent = ROUND_COLORS[item.round] || '#3b82f6';
  let html = `<div class="q-section-label" style="color:${accent}">ROUND ${item.round} · QUESTION ${getQuestionNumber(item)} OF ${totalQuestions}</div>`;

  // Special section label (sizes / final)
  if (item.sectionLabel) {
    html += `<div class="q-section-label" style="color:${accent};font-size:0.9rem;margin-bottom:8px;">${item.sectionLabel}</div>`;
  }

  if (item.question) {
    html += `<h2 class="q-text">${item.question}</h2>`;
  }
  if (item.helpText) {
    html += `<p class="q-help">${item.helpText}</p>`;
  }

  // ── CHOICE ──
  if (item.type === 'choice' || item.type === 'final_choice') {
    const cls = item.type === 'final_choice' ? 'final-options' : '';
    html += `<div class="options-grid ${cls}">`;
    item.options.forEach(opt => {
      html += `<div class="option-card" data-value="${escHtml(opt.value)}" tabindex="0" role="button" aria-pressed="false">${opt.label}</div>`;
    });
    html += `</div>`;
  }

  // ── MULTI-SELECT ──
  if (item.type === 'multiselect') {
    if (!item.helpText) html += `<p class="q-help">Select all that apply</p>`;
    html += `<div class="options-grid">`;
    item.options.forEach(opt => {
      html += `<div class="option-card" data-value="${escHtml(opt.value)}" tabindex="0" role="checkbox" aria-checked="false">${opt.label}</div>`;
    });
    html += `</div>`;
  }

  // ── TEXT ──
  if (item.type === 'text') {
    html += `<input id="input-${item.id}" class="q-input" type="text" placeholder="${escHtml(item.placeholder || '')}" autocomplete="off" />`;
  }

  // ── TEXTAREA ──
  if (item.type === 'textarea') {
    html += `<textarea id="input-${item.id}" class="q-textarea" placeholder="${escHtml(item.placeholder || '')}"></textarea>`;
  }

  // ── SIZES ──
  if (item.type === 'sizes') {
    html += `<div class="sizes-card">
      <div class="sizes-section-label">⚠️ ${item.sectionLabel}</div>
      <div class="sizes-row">`;
    item.fields.forEach(f => {
      html += `<div class="size-field">
        <label for="input-${f.id}">${f.label}</label>
        <input id="input-${f.id}" class="q-input" type="text" placeholder="${escHtml(f.placeholder || '')}" autocomplete="off" />
      </div>`;
    });
    html += `</div></div>`;
  }

  // Error message
  html += `<div id="q-err" class="q-required-err"></div>`;

  return html;
}

// ─────────────────────────────────────────────────────────────
//  ANALYSIS SCREEN
// ─────────────────────────────────────────────────────────────
function goToAnalysis() {
  playSound('phone', true);
  showScreen('analysis-screen');

  const phase1 = document.getElementById('analysis-phase1');
  const statsEl = document.getElementById('stats-container');
  const complete = document.getElementById('analysis-complete');

  // Animated title cycling
  const titles = [
    'ANALYZING SUBJECT…',
    'CROSS-REFERENCING DATA…',
    'CALCULATING ANIME LEVEL…',
    'ASSESSING GAWK GAWK FACTOR…',
    'CONSULTING THE COMMITTEE…',
    'ALMOST THERE…'
  ];
  let ti = 0;
  const titleEl = document.getElementById('analysis-title');
  const titleInterval = setInterval(() => {
    ti++;
    if (ti < titles.length) titleEl.textContent = titles[ti];
    else clearInterval(titleInterval);
  }, 800);

  // After 5s show stats
  setTimeout(() => {
    phase1.style.opacity = '0';
    phase1.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      phase1.style.display = 'none';
      statsEl.style.display = 'block';
      buildStatBars(statsEl);

      // After bars animate, show complete
      setTimeout(() => {
        complete.style.display = 'block';
        complete.style.animation = 'fadeInUp 0.6s ease both';
      }, ANALYSIS_STATS.length * 300 + 1400);
    }, 500);
  }, 5000);
}

function buildStatBars(container) {
  container.innerHTML = ANALYSIS_STATS.map(s => `
    <div class="stat-row">
      <div class="stat-header">
        <span>${s.label}</span>
        <span class="stat-pct" style="color:${s.color}">${s.value}%</span>
      </div>
      <div class="stat-track">
        <div class="stat-fill" id="fill-${s.label.replace(/\s/g, '_')}" style="background:${s.color};box-shadow:0 0 8px ${s.color}"></div>
      </div>
    </div>`).join('');

  // Stagger bar fills
  ANALYSIS_STATS.forEach((s, i) => {
    setTimeout(() => {
      const el = document.getElementById('fill-' + s.label.replace(/\s/g, '_'));
      if (el) el.style.width = s.value + '%';
    }, i * 300 + 200);
  });
}

// ─────────────────────────────────────────────────────────────
//  SUBMISSION
// ─────────────────────────────────────────────────────────────
async function submitAnswers() {
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'SUBMITTING…';

  const payload = buildPayload();

  // If URL not configured, still go to success (offline mode)
  if (APPS_SCRIPT_URL === 'YOUR_DEPLOYED_URL_HERE') {
    console.log('📋 Submission payload (no URL set):', payload);
    goToSuccess();
    return;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',        // Apps Script CORS workaround
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // no-cors means we can't read response — assume success
    goToSuccess();
  } catch (err) {
    console.error('Submission error:', err);
    btn.disabled = false;
    btn.textContent = 'RETRY SUBMISSION ↺';
    showToast('⚠ Submission failed. Check your connection and retry.');
  }
}

function buildPayload() {
  // Map internal IDs to readable column names
  return {
    secret: SUBMIT_SECRET,          // 🔐 validated by Apps Script
    timestamp: new Date().toISOString(),
    Q1_GiftCategory: answers['q1'] || '',
    Q2_Character: answers['q2'] || '',
    Q3_IllegalOther: answers['q3'] || '',
    Q4_GiftType: answers['q4'] || '',
    Q5_FootballPrefs: (answers['q5'] || []).join(', '),
    Q6_GiftStructure: answers['q6'] || '',
    Q7_HotWheels: answers['q7'] || '',
    Q8_MoneyQuestion: answers['q8'] || '',
    Q9_Wishlist: answers['q9'] || '',
    Q10_BROOO: answers['q10'] || '',
    Q11_DontWant: answers['q11'] || '',
    Q12_TshirtSize: answers['tshirt_size'] || '',
    Q12_JerseySize: answers['jersey_size'] || '',
    Q12_ShoeSize: answers['shoe_size'] || '',
    Q13_FinalAnswer: answers['q13'] || ''
  };
}

// ─────────────────────────────────────────────────────────────
//  SUCCESS + CONFETTI
// ─────────────────────────────────────────────────────────────
function goToSuccess() {
  playSound('hub', true);
  showScreen('success-screen');
  launchConfetti();
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const colors = ['#a855f7', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#22c55e', '#fff'];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: Math.random() * 10 + 5,
    h: Math.random() * 5 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    drot: (Math.random() - 0.5) * 0.12,
    dy: Math.random() * 3 + 2,
    dx: (Math.random() - 0.5) * 1.5
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 200);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.dx; p.y += p.dy; p.rot += p.drot;
    });
    frame++;
    if (frame < 220) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ─────────────────────────────────────────────────────────────
//  ERROR TOAST
// ─────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('error-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

// ─────────────────────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
