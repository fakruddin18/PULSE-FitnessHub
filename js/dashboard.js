/**
 * Pulse Fitness Hub - Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  setupQuickActions();
  setupModal();
});

function renderDashboard() {
  const data = pulseStore.getData();

  // Profile & Streak
  document.getElementById('welcomeUser').textContent = `Welcome back, ${data.profile.name} 👋`;
  document.getElementById('streakCount').textContent = data.profile.streak;

  // Goals & Current Values
  const cCurrent = data.today.calories;
  const cGoal = data.goals.calories;
  const sCurrent = data.today.steps;
  const sGoal = data.goals.steps;
  const wCurrent = data.today.water;
  const wGoal = data.goals.water;
  const tCurrent = data.today.activeMins;
  const tGoal = data.goals.activeMins;

  // Numbers display
  document.getElementById('dashCalories').textContent = cCurrent.toLocaleString();
  document.getElementById('goalCaloriesText').textContent = cGoal.toLocaleString();
  document.getElementById('dashSteps').textContent = sCurrent.toLocaleString();
  document.getElementById('goalStepsText').textContent = sGoal.toLocaleString();
  document.getElementById('dashWater').textContent = wCurrent.toLocaleString();
  document.getElementById('goalWaterText').textContent = wGoal.toLocaleString();
  document.getElementById('dashActiveMins').textContent = tCurrent;
  document.getElementById('goalMinsText').textContent = tGoal;

  // Progress Bars
  const pCal = Math.min(100, Math.round((cCurrent / cGoal) * 100));
  const pSteps = Math.min(100, Math.round((sCurrent / sGoal) * 100));
  const pWater = Math.min(100, Math.round((wCurrent / wGoal) * 100));
  const pTime = Math.min(100, Math.round((tCurrent / tGoal) * 100));

  document.getElementById('barCalories').style.width = `${pCal}%`;
  document.getElementById('barSteps').style.width = `${pSteps}%`;
  document.getElementById('barWater').style.width = `${pWater}%`;
  document.getElementById('barTime').style.width = `${pTime}%`;

  // Animated Concentric SVG Rings
  updateRing('ringCalories', 515, pCal);
  updateRing('ringTime', 402, pTime);
  updateRing('ringWater', 289, pWater);

  const overall = Math.round((pCal + pTime + pWater) / 3);
  document.getElementById('overallScore').textContent = `${overall}%`;

  // Render Activity Lists
  renderRecentWorkouts(data.workouts);
  renderRecentMeals(data.meals);
}

function updateRing(elementId, circumference, percent) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const offset = circumference - (percent / 100) * circumference;
  el.style.strokeDashoffset = Math.max(0, offset);
}

function renderRecentWorkouts(workouts) {
  const container = document.getElementById('dashboardWorkoutList');
  if (!workouts || workouts.length === 0) {
    container.innerHTML = '<p style="color: var(--text-subtle); font-size: 0.85rem; padding: 12px 0;">No workouts logged yet today.</p>';
    return;
  }

  container.innerHTML = workouts.slice(0, 3).map(w => `
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

function renderRecentMeals(meals) {
  const container = document.getElementById('dashboardMealList');
  if (!meals || meals.length === 0) {
    container.innerHTML = '<p style="color: var(--text-subtle); font-size: 0.85rem; padding: 12px 0;">No meals logged yet today.</p>';
    return;
  }

  container.innerHTML = meals.slice(0, 3).map(m => `
    <div class="activity-item">
      <div class="activity-meta">
        <div class="activity-icon" style="background: rgba(245, 158, 11, 0.15);">🥣</div>
        <div>
          <div class="activity-title">${m.name}</div>
          <div class="activity-time">${m.time} • ${m.type}</div>
        </div>
      </div>
      <div class="activity-stat" style="color: #f59e0b;">${m.calories} kcal</div>
    </div>
  `).join('');
}

function setupQuickActions() {
  document.getElementById('addWater250').addEventListener('click', () => {
    pulseStore.addWater(250);
    renderDashboard();
    showToast('Added 250ml water 💧');
  });

  document.getElementById('addWater500').addEventListener('click', () => {
    pulseStore.addWater(500);
    renderDashboard();
    showToast('Added 500ml water 💧');
  });

  document.getElementById('addStepsQuick').addEventListener('click', () => {
    pulseStore.addSteps(1000);
    renderDashboard();
    showToast('Logged +1,000 steps! 👟');
  });
}

function setupModal() {
  const modal = document.getElementById('quickLogModal');
  const openBtn = document.getElementById('quickLogBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('quickLogForm');

  openBtn.addEventListener('click', () => modal.classList.add('active'));
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('modalWorkoutName').value;
    const category = document.getElementById('modalCategory').value;
    const duration = document.getElementById('modalDuration').value;
    const calories = document.getElementById('modalCalories').value;

    let icon = '🔥';
    if (category === 'Cardio') icon = '🏃';
    if (category === 'Strength') icon = '🏋️';
    if (category === 'HIIT') icon = '⚡';
    if (category === 'Yoga') icon = '🧘';

    pulseStore.addWorkout({ name, category, duration, calories, icon });
    renderDashboard();
    modal.classList.remove('active');
    form.reset();
    showToast('Workout successfully saved!');
  });
}
