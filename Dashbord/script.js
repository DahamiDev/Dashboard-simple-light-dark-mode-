// ---------- DARK MODE + LOCALSTORAGE ----------
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('dashboard_theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

const saved = localStorage.getItem('dashboard_theme') || 'light';
setTheme(saved);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  updateChartsTheme();
});

// ---------- SIDEBAR COLLAPSE + mobile detection ----------
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggleBtn');
let isCollapsed = false;

function updateSidebarState() {
  if (window.innerWidth > 900) {
    if (isCollapsed) sidebar.classList.add('collapsed');
    else sidebar.classList.remove('collapsed');
    sidebar.classList.remove('mobile-open');
  } else {
    sidebar.classList.remove('collapsed');
    if (!sidebar.classList.contains('mobile-open')) sidebar.classList.remove('mobile-open');
  }
}

toggleBtn.addEventListener('click', (e) => {
  if (window.innerWidth > 900) {
    isCollapsed = !isCollapsed;
    updateSidebarState();
  } else {
    sidebar.classList.toggle('mobile-open');
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
  }
  updateSidebarState();
});
updateSidebarState();

// ---------- ACTIVE NAV LINK HANDLER ----------
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const section = link.getAttribute('data-nav');
    console.log(`Navigating to ${section}`);
  });
});

// ---------- STATS DATA & RENDER ----------
const statsData = [
  { title: "Total Revenue", value: "$48,231", icon: "fas fa-chart-line", trend: "+12.5%", trendUp: true },
  { title: "New Customers", value: "1,482", icon: "fas fa-user-plus", trend: "+8.2%", trendUp: true },
  { title: "Total Orders", value: "3,912", icon: "fas fa-shopping-cart", trend: "-2.1%", trendUp: false },
  { title: "Conversion Rate", value: "4.12%", icon: "fas fa-percent", trend: "+0.6%", trendUp: true }
];

function renderStats() {
  const statsContainer = document.getElementById('statsGrid');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = statsData.map(stat => `
    <div class="stat-block">
      <div class="stat-head">
        <span>${stat.title}</span>
        <div class="stat-icon"><i class="${stat.icon}"></i></div>
      </div>
      <div class="stat-value">${stat.value}</div>
      <div class="trend ${stat.trendUp ? 'up' : 'down'}">
        ${stat.trendUp ? '↑' : '↓'} ${stat.trend} from last month
      </div>
    </div>
  `).join('');
}
renderStats();

// ---------- ORDERS DATA ----------
const ordersDataset = [
  { id: "#ORD-001", customer: "John Smith", product: "Premium Package", amount: 299, status: "Completed", date: "Apr 11, 2026", statusType: "success" },
  { id: "#ORD-002", customer: "Emma Wilson", product: "Basic Plan", amount: 99, status: "Processing", date: "Apr 11, 2026", statusType: "warning" },
  { id: "#ORD-003", customer: "Michael Brown", product: "Enterprise Suite", amount: 799, status: "Completed", date: "Apr 10, 2026", statusType: "success" },
  { id: "#ORD-004", customer: "Sarah Davis", product: "Starter Kit", amount: 49, status: "Cancelled", date: "Apr 10, 2026", statusType: "danger" },
  { id: "#ORD-005", customer: "James Miller", product: "Pro Package", amount: 199, status: "Completed", date: "Apr 9, 2026", statusType: "success" },
  { id: "#ORD-006", customer: "Olivia Chen", product: "Analytics Addon", amount: 149, status: "Processing", date: "Apr 8, 2026", statusType: "warning" }
];

function renderOrdersTable(filterText = "") {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;
  
  const filtered = ordersDataset.filter(order => 
    order.customer.toLowerCase().includes(filterText) || 
    order.id.toLowerCase().includes(filterText) ||
    order.product.toLowerCase().includes(filterText)
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No matching orders found</td></tr>';
    return;
  }
  
  tbody.innerHTML = filtered.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.product}</td>
      <td>$${order.amount.toFixed(2)}</td>
      <td><span class="badge badge-${order.statusType}">${order.status}</span></td>
      <td>${order.date}</td>
    </tr>
  `).join('');
}

renderOrdersTable();

// Search functionality
const searchInput = document.getElementById('globalSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => renderOrdersTable(e.target.value.toLowerCase()));
}

// ---------- CHART.JS INTEGRATION ----------
let revenueChart, trafficChart;

function initCharts() {
  const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
  const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
  
  // Revenue line chart
  revenueChart = new Chart(ctxRevenue, {
    type: 'line',
    data: {
      labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Revenue (USD)',
        data: [32450, 37820, 41200, 38900, 45600, 48231],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { 
          position: 'top', 
          labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') } 
        }
      }
    }
  });
  
  // Traffic doughnut chart
  trafficChart = new Chart(ctxTraffic, {
    type: 'doughnut',
    data: {
      labels: ['Direct', 'Organic Search', 'Social Media', 'Referral'],
      datasets: [{
        data: [28, 42, 18, 12],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { 
          position: 'bottom', 
          labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') } 
        }
      }
    }
  });
}

function updateChartsTheme() {
  if (revenueChart) {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary');
    revenueChart.options.plugins.legend.labels.color = textColor;
    revenueChart.update();
  }
  if (trafficChart) {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary');
    trafficChart.options.plugins.legend.labels.color = textColor;
    trafficChart.update();
  }
}

// Initialize charts when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  initCharts();
  updateChartsTheme();
});

// Watch theme changes
const observer = new MutationObserver(() => updateChartsTheme());
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
