/**
 * Pulse Fitness Hub - Workouts & Interval Timer Engine
 */

// Predefined Workout Routines Library
const ROUTINES = [
  { id: 1, name: 'Full-Body Core Shred', category: 'HIIT', duration: 25, calories: 280, difficulty: 'Intermediate', icon: '⚡', desc: 'High-intensity bodyweight intervals targeting abs, glutes, and heart rate.' },
  { id: 2, name: 'Upper Body Dumbbell Power', category: 'Strength', duration: 45, calories: 360, difficulty: 'Advanced', icon: '🏋️', desc: 'Chest press, shoulder raises, dumbbell rows, and bicep burnout.' },
  { id: 3, name: '5K Tempo Pace Run', category: 'Cardio', duration: 30, calories: 340, difficulty: 'Intermediate', icon: '🏃', desc: 'Sustained aerobic run with negative split intervals.' },
  { id: 4, name: 'Morning Spine & Hip Mobility', category: 'Mobility', duration: 20, calories: 110, difficulty: 'Beginner', icon: '🧘', desc: 'Gentle flow restoring hip flexor flexibility and lower back decompression.' },
  { id: 5, name: 'Leg Day Hypertrophy', category: 'Strength', duration: 50, calories: 420, difficulty: 'Advanced', icon: '🔥', desc: 'Squats, Romanian deadlifts, walking lunges, and calf raises.' },
  { id: 6, name: 'Tabata Sprint Circuit', category: 'HIIT', duration: 16, calories: 230, difficulty: 'Expert', icon: '⚡', desc: 'Ultra-fast 20s all-out burst followed by 10s recovery across 8 grueling sets.' }
];

// Audio Beeper using Web Audio API (Pure browser synthesizer)
let audioCtx = null;
function playBeep(freq = 660, duration = 0.15) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context may require user interaction
  }
}

// Timer State
let timerConfig = {
  workTime: 30,
  restTime: 15,
  totalSets: 8
};

let currentSet = 1;
let currentPhase = 'WORK'; // 'WORK' or 'REST'
let secondsLeft = 30;
let timerInterval = null;
let isRunning = false;

document.addEventListener('DOMContentLoaded', () => {
  setupTimer();
  renderRoutines('all');
  setupCategoryFilters();
  renderWorkoutLog();
});

/* ==========================================================================
   Interval Timer Logic
   ========================================================================== */
function setupTimer() {
  const toggleBtn = document.getElementById('timerToggleBtn');
  const resetBtn = document.getElementById('timerResetBtn');
  const presetPills = document.querySelectorAll('.preset-pill');

  updateTimerDisplay();

  toggleBtn.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener('click', resetTimer);

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      timerConfig.workTime = parseInt(pill.dataset.work, 10);
      timerConfig.restTime = parseInt(pill.dataset.rest, 10);
      timerConfig.totalSets = parseInt(pill.dataset.sets, 10);

      document.getElementById('workDurationText').textContent = `${timerConfig.workTime}s`;
      document.getElementById('restDurationText').textContent = `${timerConfig.restTime}s`;

      resetTimer();
    });
  });
}

function startTimer() {
  isRunning = true;
  document.getElementById('timerToggleText').textContent = 'Pause';
  playBeep(880, 0.2); // Start chime

  timerInterval = setInterval(() => {
    secondsLeft--;

    if (secondsLeft <= 3 && secondsLeft > 0) {
      playBeep(440, 0.1); // Countdown warning tick
    }

    if (secondsLeft < 0) {
      // Transition Phase
      if (currentPhase === 'WORK') {
        if (currentSet >= timerConfig.totalSets) {
          finishTimerSession();
          return;
        }
        currentPhase = 'REST';
        secondsLeft = timerConfig.restTime;
        playBeep(520, 0.3); // Rest transition sound
      } else {
        currentSet++;
        currentPhase = 'WORK';
        secondsLeft = timerConfig.workTime;
        playBeep(880, 0.3); // Back to work sound
      }
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  document.getElementById('timerToggleText').textContent = 'Resume';
}

function resetTimer() {
  pauseTimer();
  currentSet = 1;
  currentPhase = 'WORK';
  secondsLeft = timerConfig.workTime;
  document.getElementById('timerToggleText').textContent = 'Start Workout';
  updateTimerDisplay();
}

function finishTimerSession() {
  pauseTimer();
  playBeep(987, 0.6); // Finish triumphant chime
  const totalMins = Math.max(1, Math.round(((timerConfig.workTime + timerConfig.restTime) * timerConfig.totalSets) / 60));
  const estCalories = totalMins * 11; // ~11 kcal/min for HIIT

  pulseStore.addWorkout({
    name: 'Completed HIIT Session',
    category: 'HIIT',
    duration: totalMins,
    calories: estCalories,
    icon: '⚡'
  });

  renderWorkoutLog();
  showToast(`Workout finished! +${estCalories} kcal burned 🔥`);
  resetTimer();
}

function updateTimerDisplay() {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  document.getElementById('timerDisplay').textContent = 
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const phaseBadge = document.getElementById('timerPhase');
  phaseBadge.textContent = currentPhase;
  if (currentPhase === 'REST') {
    phaseBadge.classList.add('rest');
  } else {
    phaseBadge.classList.remove('rest');
  }

  document.getElementById('timerSetCount').textContent = `${currentSet} / ${timerConfig.totalSets}`;
}

/* ==========================================================================
   Routines Catalog & Logging
   ========================================================================== */
function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRoutines(btn.dataset.cat);
    });
  });
}

function renderRoutines(category) {
  const grid = document.getElementById('routinesGrid');
  const filtered = category === 'all' 
    ? ROUTINES 
    : ROUTINES.filter(r => r.category === category);

  grid.innerHTML = filtered.map(r => `
    <div class="routine-card">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 1.6rem;">${r.icon}</span>
          <span class="routine-badge">${r.difficulty}</span>
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">${r.name}</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.4;">${r.desc}</p>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-subtle); margin-bottom: 14px;">
          <span>⏱️ ${r.duration} mins</span>
          <span style="color: var(--accent-orange); font-weight: 700;">🔥 ~${r.calories} kcal</span>
        </div>
        <button class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;" onclick="logRoutine(${r.id})">
          Log Completed
        </button>
      </div>
    </div>
  `).join('');
}

window.logRoutine = function(routineId) {
  const routine = ROUTINES.find(r => r.id === routineId);
  if (!routine) return;

  pulseStore.addWorkout({
    name: routine.name,
    category: routine.category,
    duration: routine.duration,
    calories: routine.calories,
    icon: routine.icon
  });

  renderWorkoutLog();
  showToast(`Logged "${routine.name}" (+${routine.calories} kcal)`);
};

function renderWorkoutLog() {
  const container = document.getElementById('fullWorkoutLog');
  const data = pulseStore.getData();

  if (!data.workouts || data.workouts.length === 0) {
    container.innerHTML = '<p style="color: var(--text-subtle); padding: 14px 0;">No workouts in log yet.</p>';
    return;
  }

  container.innerHTML = data.workouts.map(w => `
    <div class="activity-item">
      <div class="activity-meta">
        <div class="activity-icon" style="background: rgba(139, 92, 246, 0.15);">${w.icon || '⚡'}</div>
        <div>
          <div class="activity-title">${w.name}</div>
          <div class="activity-time">${w.time} • ${w.category} • ${w.duration} mins</div>
        </div>
      </div>
      <div class="activity-stat">+${w.calories} kcal</div>
    </div>
  `).join('');
}
