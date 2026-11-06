/**
 * Pulse Fitness Hub - Nutrition & Macro Tracker Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  renderNutritionView();
  setupMealForm();
  setupPresetQuickFill();
});

function renderNutritionView() {
  const data = pulseStore.getData();
  const meals = data.meals || [];

  // Calculate totals
  let totalCal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  meals.forEach(m => {
    totalCal += m.calories || 0;
    totalProtein += m.protein || 0;
    totalCarbs += m.carbs || 0;
    totalFat += m.fat || 0;
  });

  // Target macros (based on typical 2,200 kcal split: 150g P, 220g C, 65g F)
  const targetP = 150;
  const targetC = 220;
  const targetF = 65;

  document.getElementById('totalConsumedCalories').textContent = totalCal.toLocaleString();
  document.getElementById('totalProtein').textContent = totalProtein;
  document.getElementById('totalCarbs').textContent = totalCarbs;
  document.getElementById('totalFat').textContent = totalFat;

  document.getElementById('barProtein').style.width = `${Math.min(100, Math.round((totalProtein / targetP) * 100))}%`;
  document.getElementById('barCarbs').style.width = `${Math.min(100, Math.round((totalCarbs / targetC) * 100))}%`;
  document.getElementById('barFat').style.width = `${Math.min(100, Math.round((totalFat / targetF) * 100))}%`;

  renderGroupedDiary(meals);
}

function renderGroupedDiary(meals) {
  const container = document.getElementById('mealDiaryContainer');
  if (meals.length === 0) {
    container.innerHTML = '<p style="color: var(--text-subtle); padding: 16px 0;">No meals logged yet today.</p>';
    return;
  }

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  let html = '';

  categories.forEach(cat => {
    const categoryMeals = meals.filter(m => m.type === cat);
    if (categoryMeals.length > 0) {
      const catCalories = categoryMeals.reduce((acc, cur) => acc + cur.calories, 0);
      let catIcon = '🥐';
      if (cat === 'Lunch') catIcon = '🥗';
      if (cat === 'Dinner') catIcon = '🍲';
      if (cat === 'Snack') catIcon = '🍏';

      html += `
        <div class="meal-category-block">
          <div class="meal-category-title">
            <span>${catIcon} ${cat}</span>
            <span style="font-size: 0.78rem; color: var(--accent-orange); font-family: var(--font-mono); font-weight: 600;">
              ${catCalories} kcal
            </span>
          </div>
          <div class="activity-list">
            ${categoryMeals.map(m => `
              <div class="activity-item">
                <div class="activity-meta">
                  <div>
                    <div class="activity-title">${m.name}</div>
                    <div class="activity-time">
                      ${m.time} • P: ${m.protein}g | C: ${m.carbs}g | F: ${m.fat}g
                    </div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="activity-stat" style="color: #f59e0b;">${m.calories} kcal</span>
                  <button class="delete-meal-btn" onclick="deleteMealItem(${m.id})" title="Remove item">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

window.deleteMealItem = function(id) {
  pulseStore.deleteMeal(id);
  renderNutritionView();
  showToast('Meal item removed');
};

function setupMealForm() {
  const form = document.getElementById('addMealForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mealNameInput').value;
    const type = document.getElementById('mealTypeSelect').value;
    const calories = document.getElementById('mealCalInput').value;
    const protein = document.getElementById('mealProteinInput').value || 0;
    const carbs = document.getElementById('mealCarbsInput').value || 0;
    const fat = document.getElementById('mealFatInput').value || 0;

    pulseStore.addMeal({ name, type, calories, protein, carbs, fat });
    renderNutritionView();
    form.reset();
    showToast(`Added ${name} to ${type}!`);
  });
}

function setupPresetQuickFill() {
  document.querySelectorAll('.meal-preset-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.getElementById('mealNameInput').value = tag.dataset.name;
      document.getElementById('mealTypeSelect').value = tag.dataset.type;
      document.getElementById('mealCalInput').value = tag.dataset.cal;
      document.getElementById('mealProteinInput').value = tag.dataset.p;
      document.getElementById('mealCarbsInput').value = tag.dataset.c;
      document.getElementById('mealFatInput').value = tag.dataset.f;
      showToast('Form prefilled with suggestion ✨');
    });
  });
}
