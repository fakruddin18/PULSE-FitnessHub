/**
 * Pulse Fitness Hub - Settings & Preferences Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCurrentSettings();
  setupGoalsForm();
  setupThemePicker();
  setupDataManagement();
});

function loadCurrentSettings() {
  const data = pulseStore.getData();

  document.getElementById('settingProfileName').value = data.profile.name || '';
  document.getElementById('settingCalGoal').value = data.goals.calories || 2200;
  document.getElementById('settingWaterGoal').value = data.goals.water || 2500;
  document.getElementById('settingStepGoal').value = data.goals.steps || 10000;
  document.getElementById('settingMinsGoal').value = data.goals.activeMins || 45;

  // Active theme swatch
  const currentAccent = data.profile.accent || 'emerald';
  document.querySelectorAll('.color-swatch-btn').forEach(btn => {
    if (btn.dataset.color === currentAccent) {
      btn.classList.add('active');
      btn.textContent = '✓';
    } else {
      btn.classList.remove('active');
      btn.textContent = '';
    }
  });
}

function setupGoalsForm() {
  const form = document.getElementById('goalsForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('settingProfileName').value.trim();
    const calories = parseInt(document.getElementById('settingCalGoal').value, 10);
    const water = parseInt(document.getElementById('settingWaterGoal').value, 10);
    const steps = parseInt(document.getElementById('settingStepGoal').value, 10);
    const activeMins = parseInt(document.getElementById('settingMinsGoal').value, 10);

    pulseStore.updateProfile({ name });
    pulseStore.updateGoals({ calories, water, steps, activeMins });

    showToast('Goals and profile saved successfully! ✨');
  });
}

function setupThemePicker() {
  const swatches = document.querySelectorAll('.color-swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(b => {
        b.classList.remove('active');
        b.textContent = '';
      });
      btn.classList.add('active');
      btn.textContent = '✓';

      const color = btn.dataset.color;
      pulseStore.updateProfile({ accent: color });
      showToast(`Switched theme to ${btn.title}`);
    });
  });
}

function setupDataManagement() {
  // Export JSON backup
  document.getElementById('exportJsonBtn').addEventListener('click', () => {
    const data = pulseStore.getData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Exported backup file (JSON) 📁');
  });

  // Reset to default data
  document.getElementById('resetDataBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data back to the demo defaults?')) {
      pulseStore.resetAll();
      loadCurrentSettings();
      showToast('All data reset to initial demo state 🔄');
    }
  });
}
