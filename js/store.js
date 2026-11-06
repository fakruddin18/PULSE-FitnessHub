/**
 * Pulse Fitness Hub - Unified Data Store & LocalStorage Layer
 * Shares state seamlessly across all 5 HTML pages
 */

const STORAGE_KEY = 'pulse_fitness_data_v1';

// Default initial dataset
const DEFAULT_DATA = {
  profile: {
    name: 'Alex Rivera',
    streak: 6,
    accent: 'emerald' // emerald, cyan, purple, rose
  },
  goals: {
    calories: 2200, // kcal burn goal
    water: 2500,    // ml
    steps: 10000,
    activeMins: 45
  },
  today: {
    calories: 1480,
    water: 1750,
    steps: 7650,
    activeMins: 35
  },
  meals: [
    { id: 1, name: 'Greek Yogurt with Blueberries & Honey', type: 'Breakfast', calories: 340, protein: 22, carbs: 45, fat: 6, time: '08:15 AM' },
    { id: 2, name: 'Grilled Chicken & Quinoa Salad Bowl', type: 'Lunch', calories: 620, protein: 48, carbs: 55, fat: 18, time: '01:00 PM' },
    { id: 3, name: 'Almonds & Whey Protein Shake', type: 'Snack', calories: 280, protein: 26, carbs: 12, fat: 14, time: '04:30 PM' }
  ],
  workouts: [
    { id: 1, name: 'Morning Outdoor Run', category: 'Cardio', duration: 30, calories: 320, time: '07:00 AM', icon: '🏃' },
    { id: 2, name: 'Full-Body Dumbbell HIIT', category: 'Strength', duration: 40, calories: 410, time: '11:30 AM', icon: '⚡' }
  ],
  weeklyHistory: [
    { day: 'Mon', calories: 2150, steps: 10200, water: 2500, activeMins: 50 },
    { day: 'Tue', calories: 1980, steps: 8900, water: 2200, activeMins: 40 },
    { day: 'Wed', calories: 2400, steps: 11400, water: 2800, activeMins: 60 },
    { day: 'Thu', calories: 1850, steps: 7800, water: 2000, activeMins: 35 },
    { day: 'Fri', calories: 2300, steps: 10800, water: 2600, activeMins: 55 },
    { day: 'Sat', calories: 2650, steps: 13200, water: 3000, activeMins: 70 },
    { day: 'Sun (Today)', calories: 1480, steps: 7650, water: 1750, activeMins: 35 }
  ]
};

class PulseStore {
  constructor() {
    this.data = this.load();
    this.applyAccent();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default data', e);
    }
    this.save(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  save(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.data = data;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  getData() {
    return this.data;
  }

  // Quick Water Logging
  addWater(amountMl) {
    this.data.today.water = Math.max(0, this.data.today.water + amountMl);
    this.save();
    return this.data.today.water;
  }

  // Quick Steps Logging
  addSteps(steps) {
    this.data.today.steps += steps;
    // Estimate calories burned (approx 0.04 kcal per step)
    const burned = Math.round(steps * 0.04);
    this.data.today.calories += burned;
    this.save();
  }

  // Add a Workout
  addWorkout(workout) {
    const newEntry = {
      id: Date.now(),
      name: workout.name || 'Custom Session',
      category: workout.category || 'Fitness',
      duration: parseInt(workout.duration, 10) || 20,
      calories: parseInt(workout.calories, 10) || 180,
      time: workout.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: workout.icon || '🔥'
    };

    this.data.workouts.unshift(newEntry);
    this.data.today.calories += newEntry.calories;
    this.data.today.activeMins += newEntry.duration;
    this.save();
    return newEntry;
  }

  // Add a Meal
  addMeal(meal) {
    const newEntry = {
      id: Date.now(),
      name: meal.name,
      type: meal.type,
      calories: parseInt(meal.calories, 10) || 0,
      protein: parseInt(meal.protein, 10) || 0,
      carbs: parseInt(meal.carbs, 10) || 0,
      fat: parseInt(meal.fat, 10) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.data.meals.unshift(newEntry);
    this.save();
    return newEntry;
  }

  // Delete Meal
  deleteMeal(id) {
    this.data.meals = this.data.meals.filter(m => m.id !== id);
    this.save();
  }

  // Update Goals
  updateGoals(goals) {
    this.data.goals = { ...this.data.goals, ...goals };
    this.save();
  }

  // Update Profile & Accent
  updateProfile(profile) {
    this.data.profile = { ...this.data.profile, ...profile };
    this.save();
    this.applyAccent();
  }

  applyAccent() {
    if (this.data.profile && this.data.profile.accent) {
      document.documentElement.setAttribute('data-accent', this.data.profile.accent);
    }
  }

  // Reset to Factory Default
  resetAll() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
    this.applyAccent();
  }
}

// Global Store Instance
window.pulseStore = new PulseStore();

// Utility Toast Notification Function for all pages
window.showToast = function(msg) {
  let toast = document.getElementById('pulseToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pulseToast';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
};
