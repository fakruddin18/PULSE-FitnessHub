# Pulse | Fitness & Wellness Hub

> **Pulse** is a lightweight, responsive 5-page fitness and health tracking web application built with pure **HTML5, CSS3, and modern JavaScript (ES6+)**. It features concentric activity rings, an audio-synthesized HIIT interval timer, food & macro tracking, interactive SVG performance analytics, and dynamic theme customization with local storage persistence.

---

## 🌟 Highlights
- ⚡ **Zero External Dependencies** — Runs completely in the browser without bundlers or heavy frameworks.
- 🎯 **5 Core Hubs** — Dashboard overview, HIIT workouts & timer, nutrition & macros, analytics & heatmaps, and customizable settings.
- 🔊 **Web Audio Synthesizer** — Built-in procedural audio beeps for interval workout transitions.
- 📊 **Pure SVG Visualizations** — Dynamic concentric rings and weekly bar charts with zero chart libraries.
- 🎨 **Glassmorphism Dark UI** — 4 switchable accent themes with persistent user state via `localStorage`.

---

## 🚀 Features Across the 5 Web Pages

### 1. `index.html` (Dashboard Overview)
* **Concentric SVG Activity Rings:** Real-time animated rings for Move (Calories), Exercise (Time), and Hydration (Water).
* **Telemetry Metric Cards:** Displays daily metrics (Calories burned, Steps taken, Hydration level, and Active exercise duration).
* **Quick-Action Buttons:** Instant `+250ml` / `+500ml` water logging and `+1,000` steps loggers.
* **Activity Streams:** Displays today's logged workouts and nutrition entries.
* **Modal Dialog:** Quick workout logger dialog with validation.

### 2. `workouts.html` (Workouts & Interval Training)
* **Live HIIT / Tabata Audio Interval Timer:**
  * Tracks `WORK` vs `REST` phases with color indicators.
  * Web Audio API synthesized sound beeps on countdown transitions.
  * Presets: Classic HIIT (30s/15s), Tabata (20s/10s), Endurance (45s/15s).
  * Auto-logs completed workouts to the store upon timer completion.
* **Workout Routine Library:** Filterable by HIIT, Strength, Cardio, and Yoga/Mobility.
* **One-Click Logging:** Click "Log Completed" on any routine to record it.

### 3. `nutrition.html` (Nutrition & Macro Tracker)
* **Macro Progress Bars:** Real-time visual tracking of Protein, Carbohydrates, and Fats against daily targets.
* **Food Diary:** Grouped breakdown by meal slots (Breakfast, Lunch, Dinner, Snacks) with calculated sub-calories.
* **Item Management:** Add custom meals or use 1-click quick suggestions, with deletion support.

### 4. `analytics.html` (Performance Trends & Visual Charts)
* **Dynamic SVG Bar Chart:** 7-day interactive bar chart switchable between Calories, Steps, and Hydration metrics with hover tooltips.
* **Monthly Intensity Heatmap:** 28-day color-coded activity grid.
* **Weekly Averages:** Daily burn averages, step velocity, and consistency scores.

### 5. `settings.html` (Goals & Customization)
* **Target Preferences:** Configure personalized goals for daily calories, water, steps, and exercise minutes.
* **Accent Theme Switcher:** 4 live theme accents (Emerald Green, Cyan Sky, Royal Purple, Rose Neon) persisted across all pages.
* **Data Management:** Export your entire activity history as a downloadable JSON file, or reset to demo defaults.

---

## 📂 Project Architecture

```text
pulse-fitness-hub/
├── index.html          # Overview Dashboard
├── workouts.html       # Workout routines & audio interval timer
├── nutrition.html      # Food log & macro tracking
├── analytics.html      # Weekly SVG charts & 28-day heatmap
├── settings.html       # Goal configuration & theme accent picker
├── css/
│   └── style.css       # Glassmorphism dark dashboard design system
└── js/
    ├── store.js        # Central state management & localStorage sync
    ├── dashboard.js    # Activity ring controller & overview bindings
    ├── workouts.js     # Web Audio beeper & timer engine
    ├── nutrition.js    # Macro calculator & food diary controller
    ├── analytics.js    # SVG bar chart renderer & metrics switcher
    └── settings.js     # Profile, theme switcher, & JSON export
```

---

## 💻 How to Run

1. Open this folder in **VS Code**.
2. Right-click `index.html` and choose **"Open with Live Server"** or **"Live Preview: Show Preview"**.
3. Or simply double-click `index.html` to run directly in any web browser.
