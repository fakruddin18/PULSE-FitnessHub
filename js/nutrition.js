/**
 * Pulse Fitness Hub - Nutrition & Macro Tracker Controller
 * Features: Smart Auto-Calculation, Food Database & Custom Food Memory
 */

// Comprehensive built-in nutrition database (macros at baseQty)
const FOOD_DATABASE = [
  // High Protein Meats & Seafood
  { name: 'Chicken Breast (Cooked)', baseQty: 100, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Chicken Thigh (Cooked)', baseQty: 100, unit: 'g', calories: 209, protein: 26, carbs: 0, fat: 11 },
  { name: 'Eggs (Whole)', baseQty: 1, unit: 'pcs', calories: 72, protein: 6.3, carbs: 0.4, fat: 5 },
  { name: 'Egg Whites', baseQty: 1, unit: 'pcs', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1 },
  { name: 'Boiled Egg (Large)', baseQty: 1, unit: 'pcs', calories: 74, protein: 6.3, carbs: 0.5, fat: 5.3 },
  { name: 'Salmon Fillet (Cooked)', baseQty: 100, unit: 'g', calories: 206, protein: 22, carbs: 0, fat: 12 },
  { name: 'Tuna (Canned in Water)', baseQty: 100, unit: 'g', calories: 116, protein: 26, carbs: 0, fat: 1 },
  { name: 'Shrimp / Prawns (Cooked)', baseQty: 100, unit: 'g', calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: 'Lean Ground Beef (90/10)', baseQty: 100, unit: 'g', calories: 217, protein: 26, carbs: 0, fat: 12 },
  { name: 'Ground Turkey (Lean)', baseQty: 100, unit: 'g', calories: 189, protein: 27, carbs: 0, fat: 8 },

  // Dairy & Vegetarian Protein
  { name: 'Whey Protein Powder', baseQty: 1, unit: 'scoops', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: 'Paneer (Cottage Cheese)', baseQty: 100, unit: 'g', calories: 296, protein: 18, carbs: 4, fat: 22 },
  { name: 'Tofu (Firm)', baseQty: 100, unit: 'g', calories: 144, protein: 17, carbs: 3, fat: 8.5 },
  { name: 'Greek Yogurt (Plain 0%)', baseQty: 100, unit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: 'Cottage Cheese (Low Fat)', baseQty: 100, unit: 'g', calories: 86, protein: 12, carbs: 3.4, fat: 1 },
  { name: 'Whole Milk', baseQty: 100, unit: 'ml', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Skimmed Milk', baseQty: 100, unit: 'ml', calories: 35, protein: 3.4, carbs: 5, fat: 0.1 },
  { name: 'Soy Chunks (Soya Vadi)', baseQty: 100, unit: 'g', calories: 345, protein: 52, carbs: 33, fat: 0.5 },
  { name: 'Cheddar Cheese', baseQty: 100, unit: 'g', calories: 403, protein: 25, carbs: 1.3, fat: 33 },

  // Legumes, Lentils & Dal
  { name: 'Boiled Dal / Yellow Lentils', baseQty: 100, unit: 'g', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: 'Boiled Chickpeas (Chana)', baseQty: 100, unit: 'g', calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  { name: 'Boiled Kidney Beans (Rajma)', baseQty: 100, unit: 'g', calories: 127, protein: 8.7, carbs: 23, fat: 0.5 },
  { name: 'Black Beans (Cooked)', baseQty: 100, unit: 'g', calories: 132, protein: 8.9, carbs: 24, fat: 0.5 },
  { name: 'Edamame (Boiled)', baseQty: 100, unit: 'g', calories: 122, protein: 11, carbs: 10, fat: 5 },

  // Grains & Carbs
  { name: 'Rolled Oats (Dry)', baseQty: 100, unit: 'g', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'White Rice (Cooked)', baseQty: 100, unit: 'g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice (Cooked)', baseQty: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: 'Roti / Chapati (Whole Wheat)', baseQty: 1, unit: 'pcs', calories: 120, protein: 3.5, carbs: 20, fat: 2.5 },
  { name: 'Whole Wheat Bread', baseQty: 1, unit: 'pcs', calories: 75, protein: 3.5, carbs: 13, fat: 1 },
  { name: 'Quinoa (Cooked)', baseQty: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
  { name: 'Sweet Potato (Baked/Boiled)', baseQty: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Potato (Boiled)', baseQty: 100, unit: 'g', calories: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  { name: 'Pasta (Cooked)', baseQty: 100, unit: 'g', calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },

  // Nuts, Seeds & Spreads
  { name: 'Peanut Butter', baseQty: 100, unit: 'g', calories: 588, protein: 25, carbs: 20, fat: 50 },
  { name: 'Almonds (Raw)', baseQty: 100, unit: 'g', calories: 579, protein: 21, carbs: 22, fat: 49 },
  { name: 'Walnuts', baseQty: 100, unit: 'g', calories: 654, protein: 15, carbs: 14, fat: 65 },
  { name: 'Chia Seeds', baseQty: 100, unit: 'g', calories: 486, protein: 16.5, carbs: 42, fat: 31 },
  { name: 'Flax Seeds', baseQty: 100, unit: 'g', calories: 534, protein: 18, carbs: 29, fat: 42 },
  { name: 'Avocado', baseQty: 100, unit: 'g', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },

  // Fruits & Vegetables
  { name: 'Banana', baseQty: 1, unit: 'pcs', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Apple', baseQty: 1, unit: 'pcs', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Broccoli (Cooked)', baseQty: 100, unit: 'g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
  { name: 'Spinach (Cooked)', baseQty: 100, unit: 'g', calories: 23, protein: 3, carbs: 3.8, fat: 0.3 }
];

const CUSTOM_FOODS_KEY = 'pulse_custom_foods_v1';

function getCustomFoods() {
  try {
    const raw = localStorage.getItem(CUSTOM_FOODS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomFood(food) {
  const list = getCustomFoods();
  const existingIdx = list.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase());
  if (existingIdx >= 0) {
    list[existingIdx] = food;
  } else {
    list.unshift(food);
  }
  try {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save custom food to localStorage', e);
  }
}

function getAllFoods() {
  return [...getCustomFoods(), ...FOOD_DATABASE];
}

// Current active food for dynamic scaling
let currentSelectedFood = null;

document.addEventListener('DOMContentLoaded', () => {
  renderNutritionView();
  setupMealForm();
  setupPresetQuickFill();
  setupSmartFoodCalculator();
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

/* ==========================================================================
   Smart Food Database & Live Autocomplete Calculator
   ========================================================================== */
function setupSmartFoodCalculator() {
  const nameInput = document.getElementById('mealNameInput');
  const suggestionsBox = document.getElementById('foodSuggestions');
  const qtyInput = document.getElementById('mealPortionQty');
  const unitSelect = document.getElementById('mealPortionUnit');
  const autoPill = document.getElementById('autoCalcPill');

  const calInput = document.getElementById('mealCalInput');
  const proteinInput = document.getElementById('mealProteinInput');
  const carbsInput = document.getElementById('mealCarbsInput');
  const fatInput = document.getElementById('mealFatInput');

  // Live filter as user types
  nameInput.addEventListener('input', () => {
    const query = nameInput.value.trim().toLowerCase();

    // If query was cleared or doesn't match selected food, clear selection
    if (currentSelectedFood && !currentSelectedFood.name.toLowerCase().includes(query)) {
      currentSelectedFood = null;
      autoPill.style.display = 'none';
    }

    if (!query) {
      suggestionsBox.classList.remove('active');
      suggestionsBox.innerHTML = '';
      return;
    }

    const allFoods = getAllFoods();
    const matches = allFoods.filter(f => f.name.toLowerCase().includes(query)).slice(0, 7);

    renderSuggestions(matches, query);
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!nameInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.remove('active');
    }
  });

  // Re-open if clicking into non-empty input
  nameInput.addEventListener('focus', () => {
    const query = nameInput.value.trim().toLowerCase();
    if (query) {
      const allFoods = getAllFoods();
      const matches = allFoods.filter(f => f.name.toLowerCase().includes(query)).slice(0, 7);
      renderSuggestions(matches, query);
    }
  });

  function renderSuggestions(matches, query) {
    if (matches.length === 0) {
      suggestionsBox.innerHTML = `
        <div class="food-not-found-hint" id="unlistedFoodHint">
          "${escapeHtml(nameInput.value)}" is unlisted — enter macros manually below ✍️
        </div>
      `;
      suggestionsBox.classList.add('active');

      const hintEl = document.getElementById('unlistedFoodHint');
      if (hintEl) {
        hintEl.addEventListener('click', () => {
          suggestionsBox.classList.remove('active');
          calInput.focus();
        });
      }
      return;
    }

    suggestionsBox.innerHTML = matches.map((f, idx) => `
      <div class="food-suggestion-item" data-index="${idx}">
        <div>
          <div class="food-sug-name">${f.name}</div>
          <div class="food-sug-details">${f.calories} kcal • C: ${f.carbs}g • F: ${f.fat}g (per ${f.baseQty}${f.unit})</div>
        </div>
        <div class="food-sug-badge">${f.protein}g P</div>
      </div>
    `).join('') + `
      <div class="food-not-found-hint" style="border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.76rem;">
        Unlisted food? Keep typing to enter macros manually ✍️
      </div>
    `;

    suggestionsBox.classList.add('active');

    // Attach click events
    const items = suggestionsBox.querySelectorAll('.food-suggestion-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        selectFood(matches[idx]);
      });
    });
  }

  function selectFood(food) {
    currentSelectedFood = food;
    nameInput.value = food.name;
    qtyInput.value = food.baseQty;
    unitSelect.value = food.unit;

    calculateAndFillMacros();
    suggestionsBox.classList.remove('active');
    showToast(`Calculated macros for ${food.name} ⚡`);
  }

  function calculateAndFillMacros() {
    if (!currentSelectedFood) return;

    const qty = parseFloat(qtyInput.value) || currentSelectedFood.baseQty;
    const ratio = qty / currentSelectedFood.baseQty;

    const cal = Math.round(currentSelectedFood.calories * ratio);
    const p = Math.round(currentSelectedFood.protein * ratio);
    const c = Math.round(currentSelectedFood.carbs * ratio);
    const f = Math.round(currentSelectedFood.fat * ratio);

    calInput.value = cal;
    proteinInput.value = p;
    carbsInput.value = c;
    fatInput.value = f;

    autoPill.textContent = `⚡ Auto-calculated (${qty}${unitSelect.value})`;
    autoPill.style.display = 'inline-flex';
  }

  // Recalculate if portion changes
  qtyInput.addEventListener('input', calculateAndFillMacros);
  unitSelect.addEventListener('change', calculateAndFillMacros);

  // If user edits any macro input manually, update badge
  [calInput, proteinInput, carbsInput, fatInput].forEach(inp => {
    inp.addEventListener('input', () => {
      if (currentSelectedFood) {
        autoPill.textContent = 'Customized ✍️';
      }
    });
  });
}

function setupMealForm() {
  const form = document.getElementById('addMealForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mealNameInput').value.trim();
    const type = document.getElementById('mealTypeSelect').value;
    const calories = document.getElementById('mealCalInput').value;
    const protein = document.getElementById('mealProteinInput').value || 0;
    const carbs = document.getElementById('mealCarbsInput').value || 0;
    const fat = document.getElementById('mealFatInput').value || 0;

    const qty = parseFloat(document.getElementById('mealPortionQty').value) || 100;
    const unit = document.getElementById('mealPortionUnit').value || 'g';
    const rememberCheck = document.getElementById('saveCustomFoodCheck');

    // If user asked to remember unlisted food or it's a new custom food
    if (rememberCheck && rememberCheck.checked) {
      saveCustomFood({
        name,
        baseQty: qty,
        unit,
        calories: parseInt(calories, 10) || 0,
        protein: parseInt(protein, 10) || 0,
        carbs: parseInt(carbs, 10) || 0,
        fat: parseInt(fat, 10) || 0
      });
      rememberCheck.checked = false;
      showToast(`Saved "${name}" to your custom foods! 💾`);
    }

    pulseStore.addMeal({ name, type, calories, protein, carbs, fat });
    renderNutritionView();
    form.reset();

    // Reset default portion & pills
    document.getElementById('mealPortionQty').value = '100';
    document.getElementById('mealPortionUnit').value = 'g';
    document.getElementById('autoCalcPill').style.display = 'none';
    currentSelectedFood = null;

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

      const autoPill = document.getElementById('autoCalcPill');
      if (autoPill) {
        autoPill.textContent = '⚡ Preset filled';
        autoPill.style.display = 'inline-flex';
      }
      showToast('Form prefilled with suggestion ✨');
    });
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
