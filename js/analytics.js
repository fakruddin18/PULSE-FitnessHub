/**
 * Pulse Fitness Hub - Analytics & SVG Chart Engine
 */

let activeMetric = 'calories'; // 'calories', 'steps', 'water'

document.addEventListener('DOMContentLoaded', () => {
  renderChart();
  renderHeatmap();
  setupChartToggles();
});

function setupChartToggles() {
  const toggleBtns = document.querySelectorAll('.chart-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMetric = btn.dataset.metric;

      const titleMap = {
        calories: 'Weekly Active Calories Burned (kcal)',
        steps: 'Weekly Step Count (Steps)',
        water: 'Weekly Hydration Intake (ml)'
      };
      document.getElementById('chartTitle').textContent = titleMap[activeMetric];

      renderChart();
      showToast(`Viewing ${btn.textContent} trend`);
    });
  });
}

function renderChart() {
  const data = pulseStore.getData();
  const history = data.weeklyHistory || [];
  const svg = document.getElementById('weeklyChartSvg');

  // Find max value for scaling
  const values = history.map(d => d[activeMetric] || 0);
  const maxVal = Math.max(...values, 100);

  // SVG Dimension Constants
  const svgWidth = 700;
  const svgHeight = 220;
  const chartHeight = 170;
  const barWidth = 46;
  const spacing = svgWidth / history.length;

  // Colors per metric
  const colorMap = {
    calories: { fill: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
    steps: { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    water: { fill: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' }
  };
  const currentTheme = colorMap[activeMetric];

  let svgInner = '';

  // Background Grid horizontal lines
  for (let i = 0; i <= 3; i++) {
    const y = 20 + i * (chartHeight / 3);
    svgInner += `<line x1="0" y1="${y}" x2="${svgWidth}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />`;
  }

  // Draw Bars & Labels
  history.forEach((d, idx) => {
    const val = d[activeMetric] || 0;
    const barH = (val / maxVal) * chartHeight;
    const x = idx * spacing + (spacing - barWidth) / 2;
    const y = svgHeight - 40 - barH;

    // Bar Rect
    svgInner += `
      <g class="chart-col">
        <rect class="bar-rect" x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="${currentTheme.fill}">
          <title>${d.day}: ${val.toLocaleString()} ${activeMetric === 'calories' ? 'kcal' : activeMetric === 'steps' ? 'steps' : 'ml'}</title>
        </rect>
        <!-- Bar Value Label -->
        <text x="${x + barWidth / 2}" y="${y - 8}" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="middle" font-weight="600">
          ${val > 999 ? (val / 1000).toFixed(1) + 'k' : val}
        </text>
        <!-- Day of Week Label -->
        <text x="${x + barWidth / 2}" y="${svgHeight - 14}" fill="#64748b" font-size="12" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" font-weight="600">
          ${d.day.split(' ')[0]}
        </text>
      </g>
    `;
  });

  svg.innerHTML = svgInner;
}

function renderHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  // Generate 28 mock days with realistic distribution
  const intensities = [
    2, 3, 1, 4, 3, 2, 4,
    3, 4, 2, 1, 3, 4, 2,
    4, 3, 4, 2, 3, 4, 1,
    2, 4, 3, 4, 4, 3, 4
  ];

  grid.innerHTML = intensities.map((lvl, index) => {
    const dayNum = index + 1;
    return `
      <div class="heat-cell heat-lvl-${lvl}" title="Day ${dayNum}: Intensity Level ${lvl}/4"></div>
    `;
  }).join('');
}
