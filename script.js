/**
 * Smart Expense Tracker & Financial Suite
 * Full ES6+ Implementation with AI Insights, Command Palette (Ctrl+K),
 * Recurring Subscriptions, Split Bill Calculator, Bulk Actions, and Theme Accents.
 */

// ==========================================
// 1. CONSTANTS & DEFINITIONS
// ==========================================

const CURRENCIES = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
  AED: { symbol: 'AED', locale: 'ar-AE' }
};

const CATEGORIES = {
  expense: [
    { name: 'Food & Dining', icon: 'fa-utensils', color: '#f97316' },
    { name: 'Groceries', icon: 'fa-basket-shopping', color: '#84cc16' },
    { name: 'Transport & Fuel', icon: 'fa-car', color: '#3b82f6' },
    { name: 'Shopping', icon: 'fa-bag-shopping', color: '#ec4899' },
    { name: 'Bills & Utilities', icon: 'fa-file-invoice-dollar', color: '#eab308' },
    { name: 'Entertainment', icon: 'fa-film', color: '#8b5cf6' },
    { name: 'Health & Medical', icon: 'fa-heart-pulse', color: '#ef4444' },
    { name: 'Education', icon: 'fa-graduation-cap', color: '#06b6d4' },
    { name: 'Travel', icon: 'fa-plane', color: '#14b8a6' },
    { name: 'Others', icon: 'fa-shapes', color: '#64748b' }
  ],
  income: [
    { name: 'Salary', icon: 'fa-money-bill-wave', color: '#10b981' },
    { name: 'Freelance & Gig', icon: 'fa-laptop-code', color: '#06b6d4' },
    { name: 'Investments', icon: 'fa-chart-line', color: '#8b5cf6' },
    { name: 'Business', icon: 'fa-briefcase', color: '#f59e0b' },
    { name: 'Gifts & Grants', icon: 'fa-gift', color: '#ec4899' },
    { name: 'Others', icon: 'fa-shapes', color: '#64748b' }
  ]
};

const PAYMENT_ICONS = {
  'UPI / Online': 'fa-qrcode',
  'Credit Card': 'fa-credit-card',
  'Debit Card': 'fa-id-card',
  'Cash': 'fa-money-bill-wave',
  'Net Banking': 'fa-building-columns'
};

const QUICK_TAGS = {
  expense: ['Groceries', 'Dinner', 'Uber Cab', 'Electricity Bill', 'Coffee', 'Pharmacy', 'Movie Tickets'],
  income: ['Monthly Salary', 'Client Project', 'Stock Dividend', 'Bonus', 'Consulting']
};

const DEFAULT_SUBSCRIPTIONS = [
  { id: 'sub-1', name: 'Netflix Premium 4K', amount: 649, category: 'Entertainment', dueDay: 15 },
  { id: 'sub-2', name: 'Spotify Duo Family', amount: 149, category: 'Entertainment', dueDay: 20 },
  { id: 'sub-3', name: 'High-speed Fiber Wifi', amount: 999, category: 'Bills & Utilities', dueDay: 5 },
  { id: 'sub-4', name: 'Fitness Gym Membership', amount: 1800, category: 'Health & Medical', dueDay: 1 }
];

const DEFAULT_SAVINGS_GOALS = [
  { id: 'goal-1', name: 'Emergency Fund (6 Months)', target: 150000, current: 85000 },
  { id: 'goal-2', name: 'New Laptop & Workstation', target: 80000, current: 48000 },
  { id: 'goal-3', name: 'Vacation Trip', target: 45000, current: 15000 }
];

const SAMPLE_TRANSACTIONS = [
  { id: 'tx-1', type: 'income', description: 'Monthly Software Salary', category: 'Salary', amount: 85000, date: getRecentDate(1), paymentMethod: 'Net Banking', notes: '#company' },
  { id: 'tx-2', type: 'income', description: 'Freelance Web Design', category: 'Freelance & Gig', amount: 18500, date: getRecentDate(3), paymentMethod: 'UPI / Online', notes: 'Client invoice #102' },
  { id: 'tx-3', type: 'expense', description: 'Apartment Rent & Maintenance', category: 'Bills & Utilities', amount: 22000, date: getRecentDate(2), paymentMethod: 'Net Banking', notes: '#fixed' },
  { id: 'tx-4', type: 'expense', description: 'Supermarket Groceries', category: 'Groceries', amount: 4850, date: getRecentDate(4), paymentMethod: 'Credit Card', notes: 'Organic store' },
  { id: 'tx-5', type: 'expense', description: 'Fine Dining & Cafe', category: 'Food & Dining', amount: 1950, date: getRecentDate(5), paymentMethod: 'UPI / Online', notes: 'Weekend dinner' },
  { id: 'tx-6', type: 'expense', description: 'Fuel & Metro Recharge', category: 'Transport & Fuel', amount: 2600, date: getRecentDate(7), paymentMethod: 'Debit Card', notes: '' },
  { id: 'tx-7', type: 'expense', description: 'Streaming & Internet Subscriptions', category: 'Entertainment', amount: 1499, date: getRecentDate(9), paymentMethod: 'Credit Card', notes: 'Auto-debit' },
  { id: 'tx-8', type: 'expense', description: 'Health Insurance Premium', category: 'Health & Medical', amount: 3500, date: getRecentDate(12), paymentMethod: 'Net Banking', notes: 'Tax-deductible' }
];

function getRecentDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================

let transactions = loadTransactions();
let savingsGoals = loadSavingsGoals();
let subscriptions = loadSubscriptions();
let selectedTxIds = new Set();
let currentCurrencyCode = localStorage.getItem('expense_tracker_currency') || 'INR';
let currentAccent = localStorage.getItem('expense_tracker_accent') || 'blue';
let monthlyBudget = parseFloat(localStorage.getItem('expense_tracker_budget')) || 40000;
let currentChartMode = 'doughnut';
let currentViewMode = localStorage.getItem('expense_tracker_view_mode') || 'grouped';
let chartInstance = null;
let pendingConfirmAction = null;

function loadTransactions() {
  try {
    const raw = localStorage.getItem('transactions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading transactions:', err);
  }
  return [];
}

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadSavingsGoals() {
  try {
    const raw = localStorage.getItem('expense_tracker_goals');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  return [...DEFAULT_SAVINGS_GOALS];
}

function saveSavingsGoals() {
  localStorage.setItem('expense_tracker_goals', JSON.stringify(savingsGoals));
}

function loadSubscriptions() {
  try {
    const raw = localStorage.getItem('expense_tracker_subs');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  return [...DEFAULT_SUBSCRIPTIONS];
}

function saveSubscriptions() {
  localStorage.setItem('expense_tracker_subs', JSON.stringify(subscriptions));
}

// ==========================================
// 3. DOM ELEMENTS
// ==========================================

// Header & Navigation
const userGreeting = document.getElementById('userGreeting');
const currentDateDisplay = document.getElementById('currentDateDisplay');
const globalSearchTrigger = document.getElementById('globalSearchTrigger');
const currencySelect = document.getElementById('currencySelect');
const accentSelect = document.getElementById('accentSelect');
const openSubscriptionsBtn = document.getElementById('openSubscriptionsBtn');
const openSplitBillBtn = document.getElementById('openSplitBillBtn');
const openSavingsGoalsBtn = document.getElementById('openSavingsGoalsBtn');
const printReportBtn = document.getElementById('printReportBtn');
const shortcutsBtn = document.getElementById('shortcutsBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

// Insights bar
const insightText = document.getElementById('insightText');
const refreshInsightsBtn = document.getElementById('refreshInsightsBtn');

// Stats & Budget
const netAmountEl = document.getElementById('netAmount');
const balanceStatusEl = document.getElementById('balanceStatus');
const totalIncomeEl = document.getElementById('totalIncome');
const incomeCountEl = document.getElementById('incomeCount');
const totalExpenseEl = document.getElementById('totalExpense');
const expenseCountEl = document.getElementById('expenseCount');
const budgetSpentEl = document.getElementById('budgetSpent');
const budgetTotalEl = document.getElementById('budgetTotal');
const budgetPercentageEl = document.getElementById('budgetPercentage');
const budgetProgressBar = document.getElementById('budgetProgressBar');
const budgetStatusText = document.getElementById('budgetStatusText');
const editBudgetBtn = document.getElementById('editBudgetBtn');
const savingsRateValEl = document.getElementById('savingsRateVal');
const dailyAvgSpendValEl = document.getElementById('dailyAvgSpendVal');

// Add Form
const txForm = document.getElementById('txForm');
const formSection = document.getElementById('formSection');
const typeExpenseRadio = document.getElementById('typeExpense');
const typeIncomeRadio = document.getElementById('typeIncome');
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const paymentMethodSelect = document.getElementById('paymentMethod');
const dateInput = document.getElementById('date');
const notesInput = document.getElementById('notes');
const quickTagsList = document.getElementById('quickTagsList');
const clearFormBtn = document.getElementById('clearForm');
const fabAddBtn = document.getElementById('fabAddBtn');

// Charts
const chartCanvas = document.getElementById('expenseChart');
const chartEmptyState = document.getElementById('chartEmptyState');
const chartTabs = document.querySelectorAll('.chart-tab');
const topCategoryValueEl = document.getElementById('topCategoryValue');
const chartSavingsPaceEl = document.getElementById('chartSavingsPace');

// History, Filters & Bulk
const txCountBadge = document.getElementById('txCountBadge');
const viewGroupedBtn = document.getElementById('viewGroupedBtn');
const viewFlatBtn = document.getElementById('viewFlatBtn');
const searchInput = document.getElementById('search');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterCategorySelect = document.getElementById('filterCategory');
const filterTypeSelect = document.getElementById('filterType');
const filterPaymentMethodSelect = document.getElementById('filterPaymentMethod');
const filterTimeSelect = document.getElementById('filterTime');
const sortBySelect = document.getElementById('sortBy');
const txList = document.getElementById('txList');
const txListGrouped = document.getElementById('txListGrouped');
const emptyListState = document.getElementById('emptyListState');
const emptyStateMessage = document.getElementById('emptyStateMessage');
const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');

// Bulk bar
const bulkActionBar = document.getElementById('bulkActionBar');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const selectedCountText = document.getElementById('selectedCountText');
const bulkExportBtn = document.getElementById('bulkExportBtn');
const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

// Bulk Actions Bar buttons
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const clearAllBtn = document.getElementById('clearAll');

// Command Palette Modal
const commandPaletteModal = document.getElementById('commandPaletteModal');
const cmdPaletteInput = document.getElementById('cmdPaletteInput');
const cmdPaletteResults = document.getElementById('cmdPaletteResults');

// Subscriptions Modal
const subscriptionsModal = document.getElementById('subscriptionsModal');
const closeSubscriptionsModalBtn = document.getElementById('closeSubscriptionsModalBtn');
const subMonthlyBurn = document.getElementById('subMonthlyBurn');
const subActiveCount = document.getElementById('subActiveCount');
const newSubForm = document.getElementById('newSubForm');
const subNameInput = document.getElementById('subNameInput');
const subAmountInput = document.getElementById('subAmountInput');
const subCategorySelect = document.getElementById('subCategorySelect');
const subDueDayInput = document.getElementById('subDueDayInput');
const subscriptionsList = document.getElementById('subscriptionsList');

// Split Bill Modal
const splitBillModal = document.getElementById('splitBillModal');
const closeSplitBillModalBtn = document.getElementById('closeSplitBillModalBtn');
const splitTotalAmount = document.getElementById('splitTotalAmount');
const splitPeopleCount = document.getElementById('splitPeopleCount');
const splitTipPercent = document.getElementById('splitTipPercent');
const splitTotalWithTip = document.getElementById('splitTotalWithTip');
const splitPerPersonAmount = document.getElementById('splitPerPersonAmount');
const copySplitSummaryBtn = document.getElementById('copySplitSummaryBtn');
const addSplitAsExpenseBtn = document.getElementById('addSplitAsExpenseBtn');

// Edit Modal
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editIdInput = document.getElementById('editId');
const editTypeExpenseRadio = document.getElementById('editTypeExpense');
const editTypeIncomeRadio = document.getElementById('editTypeIncome');
const editDescriptionInput = document.getElementById('editDescription');
const editCategorySelect = document.getElementById('editCategory');
const editAmountInput = document.getElementById('editAmount');
const editPaymentMethodSelect = document.getElementById('editPaymentMethod');
const editDateInput = document.getElementById('editDate');
const editNotesInput = document.getElementById('editNotes');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Budget Modal
const budgetModal = document.getElementById('budgetModal');
const budgetForm = document.getElementById('budgetForm');
const monthlyBudgetInput = document.getElementById('monthlyBudgetInput');
const closeBudgetModalBtn = document.getElementById('closeBudgetModalBtn');
const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');

// Savings Modal
const savingsModal = document.getElementById('savingsModal');
const closeSavingsModalBtn = document.getElementById('closeSavingsModalBtn');
const newGoalForm = document.getElementById('newGoalForm');
const goalNameInput = document.getElementById('goalNameInput');
const goalTargetInput = document.getElementById('goalTargetInput');
const savingsGoalsList = document.getElementById('savingsGoalsList');

// Shortcuts Modal
const shortcutsModal = document.getElementById('shortcutsModal');
const closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');

// Confirm Modal
const confirmModal = document.getElementById('confirmModal');
const confirmModalTitle = document.getElementById('confirmModalTitle');
const confirmModalMessage = document.getElementById('confirmModalMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmActionBtn = document.getElementById('confirmActionBtn');

// Currency Converter Modal
const converterModal = document.getElementById('converterModal');
const openConverterBtn = document.getElementById('openConverterBtn');
const closeConverterModalBtn = document.getElementById('closeConverterModalBtn');
const convertFromAmount = document.getElementById('convertFromAmount');
const convertFromCurrency = document.getElementById('convertFromCurrency');
const convertToCurrency = document.getElementById('convertToCurrency');
const swapCurrencyBtn = document.getElementById('swapCurrencyBtn');
const converterResultVal = document.getElementById('converterResultVal');
const converterRateLabel = document.getElementById('converterRateLabel');

// Virtual Card & Hero Fintech Hub
const virtualCard = document.getElementById('virtualCard');
const virtualCardWrapper = document.getElementById('virtualCardWrapper');
const cardBalanceVal = document.getElementById('cardBalanceVal');
const cardThemeDots = document.querySelectorAll('.card-theme-dot');

// Financial Wellness Gauge & Dock
const healthScoreNumber = document.getElementById('healthScoreNumber');
const healthScoreFill = document.getElementById('healthScoreFill');
const gaugeBadge = document.getElementById('gaugeBadge');
const gaugeSavingsRatio = document.getElementById('gaugeSavingsRatio');
const gaugeBudgetDiscipline = document.getElementById('gaugeBudgetDiscipline');
const gaugeSafeDailyBurn = document.getElementById('gaugeSafeDailyBurn');

const dockAddExpenseBtn = document.getElementById('dockAddExpenseBtn');
const dockAddIncomeBtn = document.getElementById('dockAddIncomeBtn');
const dockBillsBtn = document.getElementById('dockBillsBtn');
const dockSplitBtn = document.getElementById('dockSplitBtn');
const dockExchangeBtn = document.getElementById('dockExchangeBtn');
const dockGoalsBtn = document.getElementById('dockGoalsBtn');

// Category Spending Distribution Meters
const categoryMetersList = document.getElementById('categoryMetersList');

// Demo Personas
const personaBtns = document.querySelectorAll('.persona-btn');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

// ==========================================
// 4. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccent();
  initCurrency();
  initGreeting();
  initDateDisplay();
  initFormDefaults();
  initViewMode();
  populateCategorySelect(categorySelect, 'expense');
  renderQuickTags('expense');
  bindEvents();
  renderApp();
  renderSmartInsights();
});

function initTheme() {
  const savedTheme = localStorage.getItem('expense_tracker_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('expense_tracker_theme', theme);
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
    themeToggleBtn.title = 'Switch to Light Mode (T)';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    themeToggleBtn.title = 'Switch to Dark Mode (T)';
  }
  if (chartInstance) updateChart();
}

function initAccent() {
  document.documentElement.setAttribute('data-accent', currentAccent);
  if (accentSelect) accentSelect.value = currentAccent;
}

function initCurrency() {
  currencySelect.value = currentCurrencyCode;
  updateCurrencySymbolLabels();
}

function updateCurrencySymbolLabels() {
  const sym = CURRENCIES[currentCurrencyCode]?.symbol || '₹';
  document.querySelectorAll('.currency-symbol').forEach(el => {
    el.textContent = sym;
  });
}

function initGreeting() {
  const hour = new Date().getHours();
  let timeStr = 'Good day';
  let emoji = '👋';
  if (hour < 12) {
    timeStr = 'Good morning';
    emoji = '🌅';
  } else if (hour < 17) {
    timeStr = 'Good afternoon';
    emoji = '☀️';
  } else {
    timeStr = 'Good evening';
    emoji = '🌙';
  }
  userGreeting.textContent = `${timeStr}, Hritik ${emoji}`;
}

function initDateDisplay() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  currentDateDisplay.innerHTML = `<i class="fa-regular fa-calendar"></i> ${now.toLocaleDateString('en-US', options)}`;
}

function initFormDefaults() {
  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;
}

function initViewMode() {
  if (currentViewMode === 'flat') {
    viewFlatBtn.classList.add('active');
    viewGroupedBtn.classList.remove('active');
  } else {
    viewGroupedBtn.classList.add('active');
    viewFlatBtn.classList.remove('active');
  }
}

// ==========================================
// 5. EVENT LISTENERS
// ==========================================

function bindEvents() {
  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Accent Switcher
  accentSelect.addEventListener('change', (e) => {
    currentAccent = e.target.value;
    localStorage.setItem('expense_tracker_accent', currentAccent);
    document.documentElement.setAttribute('data-accent', currentAccent);
    if (chartInstance) updateChart();
    showToast(`Accent theme changed to ${currentAccent.toUpperCase()}`, 'info');
  });

  // Currency select
  currencySelect.addEventListener('change', (e) => {
    currentCurrencyCode = e.target.value;
    localStorage.setItem('expense_tracker_currency', currentCurrencyCode);
    updateCurrencySymbolLabels();
    renderApp();
    renderSmartInsights();
    showToast(`Currency changed to ${currentCurrencyCode} (${CURRENCIES[currentCurrencyCode].symbol})`, 'info');
  });

  // Command Palette
  globalSearchTrigger.addEventListener('click', openCommandPalette);
  cmdPaletteInput.addEventListener('input', handleCmdPaletteSearch);

  // Subscriptions modal
  openSubscriptionsBtn.addEventListener('click', openSubscriptionsModal);
  closeSubscriptionsModalBtn.addEventListener('click', () => toggleModal(subscriptionsModal, false));
  newSubForm.addEventListener('submit', handleAddSubscription);

  // Split Bill modal
  openSplitBillBtn.addEventListener('click', openSplitBillModal);
  closeSplitBillModalBtn.addEventListener('click', () => toggleModal(splitBillModal, false));
  [splitTotalAmount, splitPeopleCount, splitTipPercent].forEach(inp => {
    inp.addEventListener('input', calculateSplitBill);
  });
  copySplitSummaryBtn.addEventListener('click', handleCopySplitSummary);
  addSplitAsExpenseBtn.addEventListener('click', handleAddSplitAsExpense);

  // Savings Goals trigger
  openSavingsGoalsBtn.addEventListener('click', openSavingsModal);
  closeSavingsModalBtn.addEventListener('click', () => toggleModal(savingsModal, false));
  newGoalForm.addEventListener('submit', handleAddSavingsGoal);

  // Smart Insights Refresh
  refreshInsightsBtn.addEventListener('click', renderSmartInsights);

  // Print Report
  printReportBtn.addEventListener('click', () => window.print());

  // Shortcuts Modal
  shortcutsBtn.addEventListener('click', () => toggleModal(shortcutsModal, true));
  closeShortcutsModalBtn.addEventListener('click', () => toggleModal(shortcutsModal, false));

  // Type change in add form
  typeExpenseRadio.addEventListener('change', () => onTypeChange('expense'));
  typeIncomeRadio.addEventListener('change', () => onTypeChange('income'));

  // Edit Modal Type change
  editTypeExpenseRadio.addEventListener('change', () => {
    populateCategorySelect(editCategorySelect, 'expense');
  });
  editTypeIncomeRadio.addEventListener('change', () => {
    populateCategorySelect(editCategorySelect, 'income');
  });

  // Add transaction submit
  txForm.addEventListener('submit', handleAddTransaction);
  clearFormBtn.addEventListener('click', handleResetForm);

  // Mobile FAB
  fabAddBtn.addEventListener('click', () => {
    formSection.scrollIntoView({ behavior: 'smooth' });
    descriptionInput.focus();
  });

  // Edit Modal events
  closeEditModalBtn.addEventListener('click', () => toggleModal(editModal, false));
  cancelEditBtn.addEventListener('click', () => toggleModal(editModal, false));
  editForm.addEventListener('submit', handleSaveEdit);

  // Budget Modal events
  editBudgetBtn.addEventListener('click', openBudgetModal);
  closeBudgetModalBtn.addEventListener('click', () => toggleModal(budgetModal, false));
  cancelBudgetBtn.addEventListener('click', () => toggleModal(budgetModal, false));
  budgetForm.addEventListener('submit', handleSaveBudget);

  // Confirm Modal events
  confirmCancelBtn.addEventListener('click', () => toggleModal(confirmModal, false));
  confirmActionBtn.addEventListener('click', () => {
    if (typeof pendingConfirmAction === 'function') pendingConfirmAction();
    toggleModal(confirmModal, false);
  });

  // View Mode switches (Grouped vs Flat)
  viewGroupedBtn.addEventListener('click', () => {
    currentViewMode = 'grouped';
    localStorage.setItem('expense_tracker_view_mode', 'grouped');
    viewGroupedBtn.classList.add('active');
    viewFlatBtn.classList.remove('active');
    renderTransactionList();
  });

  viewFlatBtn.addEventListener('click', () => {
    currentViewMode = 'flat';
    localStorage.setItem('expense_tracker_view_mode', 'flat');
    viewFlatBtn.classList.add('active');
    viewGroupedBtn.classList.remove('active');
    renderTransactionList();
  });

  // Chart view switch tabs
  chartTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chartTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentChartMode = tab.dataset.chart;
      updateChart();
    });
  });

  // Filter and search events
  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    renderApp();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderApp();
    searchInput.focus();
  });

  filterCategorySelect.addEventListener('change', renderApp);
  filterTypeSelect.addEventListener('change', renderApp);
  filterPaymentMethodSelect.addEventListener('change', renderApp);
  filterTimeSelect.addEventListener('change', renderApp);
  sortBySelect.addEventListener('change', renderApp);

  // Bulk actions
  selectAllCheckbox.addEventListener('change', handleSelectAllToggle);
  bulkDeleteBtn.addEventListener('click', handleBulkDelete);
  bulkExportBtn.addEventListener('click', handleBulkExport);

  // Import / Export / Clear All
  exportCsvBtn.addEventListener('click', exportToCsv);
  exportBtn.addEventListener('click', exportToJson);
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleImportFile);
  clearAllBtn.addEventListener('click', handleClearAll);

  // Sample data button in empty state
  loadSampleDataBtn.addEventListener('click', handleLoadSampleData);

  // Currency Converter modal
  if (openConverterBtn) openConverterBtn.addEventListener('click', openConverterModal);
  if (closeConverterModalBtn) closeConverterModalBtn.addEventListener('click', () => toggleModal(converterModal, false));
  if (convertFromAmount) convertFromAmount.addEventListener('input', calculateCurrencyConversion);
  if (convertFromCurrency) convertFromCurrency.addEventListener('change', calculateCurrencyConversion);
  if (convertToCurrency) convertToCurrency.addEventListener('change', calculateCurrencyConversion);
  if (swapCurrencyBtn) swapCurrencyBtn.addEventListener('click', handleSwapCurrencies);

  // Quick Action Dock buttons
  if (dockAddExpenseBtn) {
    dockAddExpenseBtn.addEventListener('click', () => {
      typeExpenseRadio.checked = true;
      onTypeChange('expense');
      formSection.scrollIntoView({ behavior: 'smooth' });
      descriptionInput.focus();
    });
  }
  if (dockAddIncomeBtn) {
    dockAddIncomeBtn.addEventListener('click', () => {
      typeIncomeRadio.checked = true;
      onTypeChange('income');
      formSection.scrollIntoView({ behavior: 'smooth' });
      descriptionInput.focus();
    });
  }
  if (dockBillsBtn) dockBillsBtn.addEventListener('click', openSubscriptionsModal);
  if (dockSplitBtn) dockSplitBtn.addEventListener('click', openSplitBillModal);
  if (dockExchangeBtn) dockExchangeBtn.addEventListener('click', openConverterModal);
  if (dockGoalsBtn) dockGoalsBtn.addEventListener('click', openSavingsModal);

  // Virtual Card Theme switcher & 3D tilt
  initVirtualCard();

  // Demo Persona buttons
  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const persona = btn.getAttribute('data-persona');
      loadPersonaData(persona);
    });
  });

  // Global Keyboard Shortcuts (Ctrl+K, N, B, S, P, T, /, ?)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
      return;
    }

    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInputActive = activeTag === 'input' || activeTag === 'select' || activeTag === 'textarea';

    if (e.key === 'Escape') {
      [commandPaletteModal, subscriptionsModal, splitBillModal, editModal, budgetModal, savingsModal, shortcutsModal, confirmModal, converterModal].forEach(m => {
        if (m) toggleModal(m, false);
      });
      return;
    }

    if (isInputActive) return;

    if (e.key.toLowerCase() === 'n') {
      e.preventDefault();
      formSection.scrollIntoView({ behavior: 'smooth' });
      descriptionInput.focus();
    } else if (e.key.toLowerCase() === 'b') {
      e.preventDefault();
      openBudgetModal();
    } else if (e.key.toLowerCase() === 's') {
      e.preventDefault();
      openSavingsModal();
    } else if (e.key.toLowerCase() === 'p') {
      e.preventDefault();
      window.print();
    } else if (e.key.toLowerCase() === 't') {
      e.preventDefault();
      themeToggleBtn.click();
    } else if (e.key === '/') {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === '?') {
      e.preventDefault();
      toggleModal(shortcutsModal, true);
    }
  });

  // Modal backdrop click
  [commandPaletteModal, subscriptionsModal, splitBillModal, editModal, budgetModal, savingsModal, shortcutsModal, confirmModal, converterModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(modal, false);
      });
    }
  });
}

function onTypeChange(type) {
  populateCategorySelect(categorySelect, type);
  renderQuickTags(type);
}

// ==========================================
// 6. CATEGORIES & CHIPS HELPERS
// ==========================================

function populateCategorySelect(selectElement, type, selectedValue = '') {
  selectElement.innerHTML = '';
  const cats = CATEGORIES[type] || [];
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    if (selectedValue && selectedValue === c.name) opt.selected = true;
    selectElement.appendChild(opt);
  });
}

function renderQuickTags(type) {
  quickTagsList.innerHTML = '';
  const tags = QUICK_TAGS[type] || [];
  tags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = tag;
    chip.addEventListener('click', () => {
      descriptionInput.value = tag;
      autoMatchCategory(tag, type);
      amountInput.focus();
    });
    quickTagsList.appendChild(chip);
  });
}

function autoMatchCategory(description, type) {
  const lower = description.toLowerCase();
  const cats = CATEGORIES[type] || [];
  for (const c of cats) {
    if (lower.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(lower)) {
      categorySelect.value = c.name;
      break;
    }
  }
}

function getCategoryMeta(catName, type) {
  const list = CATEGORIES[type] || [...CATEGORIES.expense, ...CATEGORIES.income];
  const found = list.find(c => c.name.toLowerCase() === (catName || '').toLowerCase());
  if (found) return found;
  return { name: catName || 'Other', icon: 'fa-shapes', color: '#64748b' };
}

// ==========================================
// 7. CRUD OPERATIONS
// ==========================================

function handleAddTransaction(e) {
  e.preventDefault();

  const type = typeExpenseRadio.checked ? 'expense' : 'income';
  const description = descriptionInput.value.trim();
  const category = categorySelect.value;
  const amountVal = parseFloat(amountInput.value);
  const paymentMethod = paymentMethodSelect.value;
  const dateVal = dateInput.value;
  const notes = notesInput.value.trim();

  if (!description) {
    showToast('Please enter a description.', 'warning');
    descriptionInput.focus();
    return;
  }

  if (isNaN(amountVal) || amountVal <= 0) {
    showToast('Please enter a valid amount greater than 0.', 'warning');
    amountInput.focus();
    return;
  }

  if (!dateVal) {
    showToast('Please select a valid date.', 'warning');
    dateInput.focus();
    return;
  }

  const newTx = {
    id: generateId(),
    type,
    description,
    category,
    amount: Math.round(amountVal * 100) / 100,
    paymentMethod,
    date: dateVal,
    notes,
    createdAt: Date.now()
  };

  transactions.unshift(newTx);
  saveTransactions();
  renderApp();
  renderSmartInsights();

  showToast(`Added ${type === 'income' ? 'Income' : 'Expense'}: "${description}"`, 'success');
  handleResetForm();
}

function handleResetForm() {
  txForm.reset();
  typeExpenseRadio.checked = true;
  onTypeChange('expense');
  initFormDefaults();
  descriptionInput.focus();
}

function deleteTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  showConfirmDialog(
    'Delete Transaction?',
    `Are you sure you want to delete "${tx.description}" (${formatCurrency(tx.amount)})?`,
    () => {
      transactions = transactions.filter(t => t.id !== id);
      selectedTxIds.delete(id);
      saveTransactions();
      renderApp();
      renderSmartInsights();
      showToast('Transaction deleted successfully.', 'info');
    }
  );
}

function openEditModal(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  editIdInput.value = tx.id;
  if (tx.type === 'income') {
    editTypeIncomeRadio.checked = true;
    populateCategorySelect(editCategorySelect, 'income', tx.category);
  } else {
    editTypeExpenseRadio.checked = true;
    populateCategorySelect(editCategorySelect, 'expense', tx.category);
  }

  editDescriptionInput.value = tx.description;
  editAmountInput.value = tx.amount;
  editPaymentMethodSelect.value = tx.paymentMethod || 'UPI / Online';
  editDateInput.value = tx.date;
  editNotesInput.value = tx.notes || '';

  toggleModal(editModal, true);
}

function handleSaveEdit(e) {
  e.preventDefault();
  const id = editIdInput.value;
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  const type = editTypeExpenseRadio.checked ? 'expense' : 'income';
  const description = editDescriptionInput.value.trim();
  const category = editCategorySelect.value;
  const amountVal = parseFloat(editAmountInput.value);
  const paymentMethod = editPaymentMethodSelect.value;
  const dateVal = editDateInput.value;
  const notes = editNotesInput.value.trim();

  if (!description || isNaN(amountVal) || amountVal <= 0 || !dateVal) {
    showToast('Please check the values entered.', 'warning');
    return;
  }

  tx.type = type;
  tx.description = description;
  tx.category = category;
  tx.amount = Math.round(amountVal * 100) / 100;
  tx.paymentMethod = paymentMethod;
  tx.date = dateVal;
  tx.notes = notes;

  saveTransactions();
  renderApp();
  renderSmartInsights();
  toggleModal(editModal, false);
  showToast('Transaction updated successfully.', 'success');
}

function handleClearAll() {
  if (transactions.length === 0) {
    showToast('There are no transactions to clear.', 'info');
    return;
  }

  showConfirmDialog(
    'Clear All Transactions?',
    'This will permanently delete all records. This action cannot be reversed.',
    () => {
      transactions = [];
      selectedTxIds.clear();
      saveTransactions();
      renderApp();
      renderSmartInsights();
      showToast('All transaction records cleared.', 'info');
    }
  );
}

function handleLoadSampleData() {
  transactions = [...SAMPLE_TRANSACTIONS];
  saveTransactions();
  renderApp();
  renderSmartInsights();
  showToast('Loaded demo transactions successfully!', 'success');
}

// ==========================================
// 8. SMART INSIGHTS ENGINE
// ==========================================

function renderSmartInsights() {
  const expenseTx = transactions.filter(t => t.type === 'expense');
  if (expenseTx.length === 0) {
    insightText.textContent = 'Welcome! Add your first income or expense to generate AI financial insights.';
    return;
  }

  const catTotals = {};
  let totalExpense = 0;
  let maxExpense = expenseTx[0];

  expenseTx.forEach(t => {
    const amt = Number(t.amount);
    catTotals[t.category] = (catTotals[t.category] || 0) + amt;
    totalExpense += amt;
    if (amt > Number(maxExpense.amount)) maxExpense = t;
  });

  let topCat = '';
  let topCatAmt = 0;
  for (const cat in catTotals) {
    if (catTotals[cat] > topCatAmt) {
      topCatAmt = catTotals[cat];
      topCat = cat;
    }
  }

  const topPct = Math.round((topCatAmt / totalExpense) * 100);
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && (t.date || '').startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetPct = monthlyBudget > 0 ? Math.round((currentMonthExpenses / monthlyBudget) * 100) : 0;

  const insightsPool = [
    `Top Spending: ${topCat} accounts for ${topPct}% (${formatCurrency(topCatAmt)}) of your total spending.`,
    budgetPct >= 100
      ? `Budget Alert: You have exceeded this month's budget by ${formatCurrency(currentMonthExpenses - monthlyBudget)}.`
      : `Budget Health: ${100 - budgetPct}% remaining in your monthly budget (${formatCurrency(monthlyBudget - currentMonthExpenses)} available).`,
    `Largest Single Expense: "${maxExpense.description}" (${formatCurrency(maxExpense.amount)}) in ${maxExpense.category}.`,
    savingsGoals.length > 0
      ? `Goal Focus: "${savingsGoals[0].name}" is ${Math.round((savingsGoals[0].current / savingsGoals[0].target) * 100)}% funded.`
      : `Pro Tip: Set a savings goal to start tracking progress toward future milestones.`
  ];

  const randomInsight = insightsPool[Math.floor(Math.random() * insightsPool.length)];
  insightText.textContent = randomInsight;
}

// ==========================================
// 9. COMMAND PALETTE (CTRL + K)
// ==========================================

function openCommandPalette() {
  cmdPaletteInput.value = '';
  renderCmdPaletteItems('');
  toggleModal(commandPaletteModal, true);
  cmdPaletteInput.focus();
}

function handleCmdPaletteSearch() {
  const query = cmdPaletteInput.value.trim().toLowerCase();
  renderCmdPaletteItems(query);
}

function renderCmdPaletteItems(query) {
  cmdPaletteResults.innerHTML = '';

  const staticActions = [
    { title: 'Add New Expense', tag: 'Action', icon: 'fa-arrow-down', run: () => { typeExpenseRadio.checked = true; onTypeChange('expense'); formSection.scrollIntoView({ behavior: 'smooth' }); descriptionInput.focus(); } },
    { title: 'Add New Income', tag: 'Action', icon: 'fa-arrow-up', run: () => { typeIncomeRadio.checked = true; onTypeChange('income'); formSection.scrollIntoView({ behavior: 'smooth' }); descriptionInput.focus(); } },
    { title: 'Set Monthly Budget', tag: 'Settings', icon: 'fa-gear', run: openBudgetModal },
    { title: 'Recurring Bills & Subscriptions', tag: 'Feature', icon: 'fa-arrows-rotate', run: openSubscriptionsModal },
    { title: 'Split Bill Calculator', tag: 'Feature', icon: 'fa-calculator', run: openSplitBillModal },
    { title: 'Savings Goals Manager', tag: 'Feature', icon: 'fa-piggy-bank', run: openSavingsModal },
    { title: 'Print / PDF Financial Statement', tag: 'Export', icon: 'fa-print', run: () => window.print() },
    { title: 'Export Transactions as CSV', tag: 'Export', icon: 'fa-file-csv', run: exportToCsv },
    { title: 'Toggle Dark / Light Theme', tag: 'Appearance', icon: 'fa-circle-half-stroke', run: () => themeToggleBtn.click() }
  ];

  const filteredActions = staticActions.filter(a => a.title.toLowerCase().includes(query) || a.tag.toLowerCase().includes(query));

  filteredActions.forEach(action => {
    const item = document.createElement('div');
    item.className = 'cmd-item';
    item.innerHTML = `
      <div class="cmd-item-left">
        <i class="fa-solid ${action.icon}"></i>
        <span>${escapeHtml(action.title)}</span>
      </div>
      <span class="cmd-tag">${action.tag}</span>
    `;
    item.addEventListener('click', () => {
      toggleModal(commandPaletteModal, false);
      action.run();
    });
    cmdPaletteResults.appendChild(item);
  });

  // Matching transactions
  if (query) {
    const matchedTx = transactions.filter(t =>
      (t.description || '').toLowerCase().includes(query) ||
      (t.category || '').toLowerCase().includes(query)
    ).slice(0, 5);

    matchedTx.forEach(tx => {
      const item = document.createElement('div');
      item.className = 'cmd-item';
      item.innerHTML = `
        <div class="cmd-item-left">
          <i class="fa-solid fa-receipt"></i>
          <span>${escapeHtml(tx.description)} (${formatCurrency(tx.amount)})</span>
        </div>
        <span class="cmd-tag">${tx.category} • ${formatDisplayDate(tx.date)}</span>
      `;
      item.addEventListener('click', () => {
        toggleModal(commandPaletteModal, false);
        openEditModal(tx.id);
      });
      cmdPaletteResults.appendChild(item);
    });
  }
}

// ==========================================
// 10. RECURRING SUBSCRIPTIONS MANAGER
// ==========================================

function openSubscriptionsModal() {
  renderSubscriptions();
  toggleModal(subscriptionsModal, true);
}

function handleAddSubscription(e) {
  e.preventDefault();
  const name = subNameInput.value.trim();
  const amount = parseFloat(subAmountInput.value);
  const category = subCategorySelect.value;
  const dueDay = parseInt(subDueDayInput.value, 10);

  if (!name || isNaN(amount) || amount <= 0 || isNaN(dueDay)) {
    showToast('Please check the subscription details.', 'warning');
    return;
  }

  subscriptions.push({
    id: 'sub_' + Date.now().toString(36),
    name,
    amount: Math.round(amount * 100) / 100,
    category,
    dueDay
  });

  saveSubscriptions();
  renderSubscriptions();
  newSubForm.reset();
  showToast(`Subscription "${name}" added!`, 'success');
}

function renderSubscriptions() {
  subscriptionsList.innerHTML = '';
  let monthlyTotal = 0;

  subscriptions.forEach(s => {
    monthlyTotal += Number(s.amount);
    const card = document.createElement('div');
    card.className = 'sub-card';
    card.innerHTML = `
      <div class="sub-left">
        <span class="sub-name">${escapeHtml(s.name)}</span>
        <span class="sub-meta">${escapeHtml(s.category)} • Renews on ${s.dueDay}th of month</span>
      </div>
      <div class="sub-right">
        <span class="sub-price">${formatCurrency(s.amount)}</span>
        <button class="btn btn-sm btn-outline pay-sub-btn" title="Add as paid expense today"><i class="fa-solid fa-check"></i> Mark Paid</button>
        <button class="action-icon-btn delete del-sub-btn" title="Remove"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    // Mark paid button logs transaction directly
    card.querySelector('.pay-sub-btn').addEventListener('click', () => {
      const newTx = {
        id: generateId(),
        type: 'expense',
        description: s.name,
        category: s.category,
        amount: s.amount,
        paymentMethod: 'UPI / Online',
        date: new Date().toISOString().slice(0, 10),
        notes: '#subscription renewal',
        createdAt: Date.now()
      };
      transactions.unshift(newTx);
      saveTransactions();
      renderApp();
      renderSmartInsights();
      showToast(`Logged "${s.name}" as paid expense today!`, 'success');
    });

    card.querySelector('.del-sub-btn').addEventListener('click', () => {
      subscriptions = subscriptions.filter(sub => sub.id !== s.id);
      saveSubscriptions();
      renderSubscriptions();
      showToast('Subscription removed.', 'info');
    });

    subscriptionsList.appendChild(card);
  });

  subMonthlyBurn.textContent = formatCurrency(monthlyTotal);
  subActiveCount.textContent = subscriptions.length;
}

// ==========================================
// 11. SPLIT BILL CALCULATOR
// ==========================================

function openSplitBillModal() {
  calculateSplitBill();
  toggleModal(splitBillModal, true);
}

function calculateSplitBill() {
  const total = parseFloat(splitTotalAmount.value) || 0;
  const people = parseInt(splitPeopleCount.value, 10) || 1;
  const tipPct = parseFloat(splitTipPercent.value) || 0;

  const totalWithTip = total * (1 + tipPct / 100);
  const perPerson = people > 0 ? totalWithTip / people : 0;

  splitTotalWithTip.textContent = formatCurrency(totalWithTip);
  splitPerPersonAmount.textContent = formatCurrency(perPerson);
}

function handleCopySplitSummary() {
  const total = parseFloat(splitTotalAmount.value) || 0;
  const people = parseInt(splitPeopleCount.value, 10) || 1;
  const tipPct = parseFloat(splitTipPercent.value) || 0;
  const totalWithTip = total * (1 + tipPct / 100);
  const perPerson = people > 0 ? totalWithTip / people : 0;

  const text = `Hey! The bill was ${formatCurrency(total)} + ${tipPct}% tip = ${formatCurrency(totalWithTip)}. Split across ${people} people is ${formatCurrency(perPerson)} each. Please UPI/transfer when free! 🙏`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied split bill share text to clipboard!', 'success');
  }).catch(() => {
    prompt('Copy bill text:', text);
  });
}

function handleAddSplitAsExpense() {
  const total = parseFloat(splitTotalAmount.value) || 0;
  const people = parseInt(splitPeopleCount.value, 10) || 1;
  const tipPct = parseFloat(splitTipPercent.value) || 0;
  const totalWithTip = total * (1 + tipPct / 100);
  const perPerson = people > 0 ? totalWithTip / people : 0;

  if (perPerson <= 0) {
    showToast('Please enter a valid bill amount.', 'warning');
    return;
  }

  const newTx = {
    id: generateId(),
    type: 'expense',
    description: `Split Bill (${people} people)`,
    category: 'Food & Dining',
    amount: Math.round(perPerson * 100) / 100,
    paymentMethod: 'UPI / Online',
    date: new Date().toISOString().slice(0, 10),
    notes: `Total bill ${formatCurrency(totalWithTip)} split among ${people}`,
    createdAt: Date.now()
  };

  transactions.unshift(newTx);
  saveTransactions();
  renderApp();
  renderSmartInsights();
  toggleModal(splitBillModal, false);
  showToast(`Added your share (${formatCurrency(perPerson)}) as expense!`, 'success');
}

// ==========================================
// 12. BUDGET & SAVINGS GOALS
// ==========================================

function openBudgetModal() {
  monthlyBudgetInput.value = monthlyBudget || '';
  toggleModal(budgetModal, true);
  monthlyBudgetInput.focus();
}

function handleSaveBudget(e) {
  e.preventDefault();
  const val = parseFloat(monthlyBudgetInput.value);
  if (isNaN(val) || val < 0) {
    showToast('Please enter a valid budget amount.', 'warning');
    return;
  }

  monthlyBudget = Math.round(val);
  localStorage.setItem('expense_tracker_budget', monthlyBudget);
  renderBudgetStats();
  toggleModal(budgetModal, false);
  showToast(`Monthly budget set to ${formatCurrency(monthlyBudget)}`, 'success');
}

function renderBudgetStats() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && (t.date || '').startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  budgetSpentEl.textContent = formatCurrency(monthlyExpenses);
  budgetTotalEl.textContent = formatCurrency(monthlyBudget);

  if (monthlyBudget > 0) {
    const pct = Math.min(Math.round((monthlyExpenses / monthlyBudget) * 100), 999);
    budgetPercentageEl.textContent = `${pct}%`;
    budgetProgressBar.style.width = `${Math.min(pct, 100)}%`;

    budgetProgressBar.classList.remove('warning', 'danger');
    if (pct >= 100) {
      budgetProgressBar.classList.add('danger');
      budgetStatusText.innerHTML = `<span style="color:var(--expense); font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Budget exceeded by ${formatCurrency(monthlyExpenses - monthlyBudget)}!</span>`;
    } else if (pct >= 80) {
      budgetProgressBar.classList.add('warning');
      budgetStatusText.innerHTML = `<span style="color:var(--warning); font-weight:700;"><i class="fa-solid fa-bell"></i> Warning: ${100 - pct}% remaining this month.</span>`;
    } else {
      budgetStatusText.textContent = `${formatCurrency(monthlyBudget - monthlyExpenses)} remaining for this month.`;
    }
  } else {
    budgetPercentageEl.textContent = '0%';
    budgetProgressBar.style.width = '0%';
    budgetStatusText.textContent = 'Click "Set Limit" to track your monthly budget.';
  }
}

// Savings Goals
function openSavingsModal() {
  renderSavingsGoals();
  toggleModal(savingsModal, true);
}

function handleAddSavingsGoal(e) {
  e.preventDefault();
  const name = goalNameInput.value.trim();
  const target = parseFloat(goalTargetInput.value);

  if (!name || isNaN(target) || target <= 0) {
    showToast('Please enter a valid goal name and target.', 'warning');
    return;
  }

  savingsGoals.push({
    id: 'goal_' + Date.now().toString(36),
    name,
    target: Math.round(target),
    current: 0
  });

  saveSavingsGoals();
  renderSavingsGoals();
  newGoalForm.reset();
  showToast(`Goal "${name}" added!`, 'success');
}

function renderSavingsGoals() {
  savingsGoalsList.innerHTML = '';
  if (savingsGoals.length === 0) {
    savingsGoalsList.innerHTML = '<p class="empty-text">No active savings goals yet. Create one above!</p>';
    return;
  }

  savingsGoals.forEach(g => {
    const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
    const card = document.createElement('div');
    card.className = 'goal-item-card';
    card.innerHTML = `
      <div class="goal-card-top">
        <span class="goal-name">${escapeHtml(g.name)}</span>
        <span class="goal-amounts">${formatCurrency(g.current)} / ${formatCurrency(g.target)} (${pct}%)</span>
      </div>
      <div class="goal-progress-wrap">
        <div class="goal-progress-fill" style="width: ${pct}%;"></div>
      </div>
      <div class="goal-card-actions">
        <button class="btn btn-sm btn-outline add-funds-btn"><i class="fa-solid fa-plus"></i> Add Funds</button>
        <button class="btn btn-sm btn-danger delete-goal-btn"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    `;

    card.querySelector('.add-funds-btn').addEventListener('click', () => {
      const addAmt = prompt(`Add saved funds to "${g.name}":`, '5000');
      if (addAmt !== null) {
        const parsed = parseFloat(addAmt);
        if (!isNaN(parsed) && parsed > 0) {
          g.current += Math.round(parsed);
          saveSavingsGoals();
          renderSavingsGoals();
          renderSmartInsights();
          showToast(`Added ${formatCurrency(parsed)} to "${g.name}"!`, 'success');
        }
      }
    });

    card.querySelector('.delete-goal-btn').addEventListener('click', () => {
      if (confirm(`Delete savings goal "${g.name}"?`)) {
        savingsGoals = savingsGoals.filter(item => item.id !== g.id);
        saveSavingsGoals();
        renderSavingsGoals();
        showToast('Goal removed.', 'info');
      }
    });

    savingsGoalsList.appendChild(card);
  });
}

// ==========================================
// 13. BULK ACTIONS
// ==========================================

function handleSelectAllToggle(e) {
  const isChecked = e.target.checked;
  const visibleTx = getFilteredTransactions();

  if (isChecked) {
    visibleTx.forEach(t => selectedTxIds.add(t.id));
  } else {
    selectedTxIds.clear();
  }

  updateBulkBar();
  document.querySelectorAll('.tx-checkbox').forEach(cb => {
    cb.checked = isChecked;
  });
}

function handleTxCheckboxChange(id, isChecked) {
  if (isChecked) selectedTxIds.add(id);
  else selectedTxIds.delete(id);
  updateBulkBar();
}

function updateBulkBar() {
  const count = selectedTxIds.size;
  if (count > 0) {
    bulkActionBar.style.display = 'flex';
    selectedCountText.textContent = `${count} item${count > 1 ? 's' : ''} selected`;
  } else {
    bulkActionBar.style.display = 'none';
    selectAllCheckbox.checked = false;
  }
}

function handleBulkDelete() {
  const count = selectedTxIds.size;
  if (count === 0) return;

  showConfirmDialog(
    `Delete ${count} Transactions?`,
    `Are you sure you want to delete the ${count} selected transactions?`,
    () => {
      transactions = transactions.filter(t => !selectedTxIds.has(t.id));
      selectedTxIds.clear();
      saveTransactions();
      renderApp();
      renderSmartInsights();
      showToast(`Deleted ${count} transactions.`, 'info');
    }
  );
}

function handleBulkExport() {
  const count = selectedTxIds.size;
  if (count === 0) return;

  const selectedList = transactions.filter(t => selectedTxIds.has(t.id));
  const headers = ['ID', 'Type', 'Description', 'Category', 'Payment Method', `Amount (${currentCurrencyCode})`, 'Date', 'Notes'];
  const rows = selectedList.map(t => [
    `"${t.id || ''}"`,
    `"${t.type || ''}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.paymentMethod || 'UPI / Online').replace(/"/g, '""')}"`,
    t.amount,
    `"${t.date || ''}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(csvContent, `selected_expenses_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  showToast(`Exported ${count} selected transactions to CSV!`, 'success');
}

// ==========================================
// 14. RENDERING & UI UPDATES
// ==========================================

function renderApp() {
  updateCategoryFilterDropdown();
  renderSummaryCards();
  renderBudgetStats();
  renderTransactionList();
  updateChart();
  renderCategoryMeters();
}

function renderSummaryCards() {
  let incomeTotal = 0;
  let incomeCount = 0;
  let expenseTotal = 0;
  let expenseCount = 0;

  transactions.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      incomeTotal += amt;
      incomeCount++;
    } else {
      expenseTotal += amt;
      expenseCount++;
    }
  });

  const netBalance = incomeTotal - expenseTotal;

  totalIncomeEl.textContent = formatCurrency(incomeTotal);
  incomeCountEl.textContent = incomeCount;

  totalExpenseEl.textContent = formatCurrency(expenseTotal);
  expenseCountEl.textContent = expenseCount;

  netAmountEl.textContent = formatCurrency(netBalance);

  // Update Virtual Card Balance
  if (cardBalanceVal) {
    cardBalanceVal.textContent = formatCurrency(netBalance);
  }

  if (netBalance >= 0) {
    balanceStatusEl.className = 'stat-sub positive';
    balanceStatusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Positive Cashflow';
  } else {
    balanceStatusEl.className = 'stat-sub negative';
    balanceStatusEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Spending exceeds income';
  }

  const savingsRate = incomeTotal > 0 ? Math.max(0, Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100)) : 0;
  savingsRateValEl.textContent = `${savingsRate}%`;

  const todayDate = new Date();
  const currentDayOfMonth = todayDate.getDate() || 1;
  const currentMonthPrefix = todayDate.toISOString().slice(0, 7);
  const thisMonthExpenses = transactions
    .filter(t => t.type === 'expense' && (t.date || '').startsWith(currentMonthPrefix))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const dailyAvg = thisMonthExpenses / currentDayOfMonth;
  dailyAvgSpendValEl.textContent = formatCurrency(dailyAvg);
  chartSavingsPaceEl.textContent = `${savingsRate}% Saved`;

  // Update Financial Health Wellness Score
  renderHealthScoreGauge(incomeTotal, expenseTotal, thisMonthExpenses, savingsRate);
}

function getFilteredTransactions() {
  let result = [...transactions];

  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    result = result.filter(t =>
      (t.description || '').toLowerCase().includes(query) ||
      (t.category || '').toLowerCase().includes(query) ||
      (t.notes || '').toLowerCase().includes(query)
    );
  }

  const cat = filterCategorySelect.value;
  if (cat && cat !== 'all') {
    result = result.filter(t => t.category === cat);
  }

  const type = filterTypeSelect.value;
  if (type && type !== 'all') {
    result = result.filter(t => t.type === type);
  }

  const payment = filterPaymentMethodSelect.value;
  if (payment && payment !== 'all') {
    result = result.filter(t => (t.paymentMethod || 'UPI / Online') === payment);
  }

  const time = filterTimeSelect.value;
  if (time && time !== 'all') {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (time === 'today') {
      result = result.filter(t => t.date === todayStr);
    } else if (time === 'this_week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekStr = oneWeekAgo.toISOString().slice(0, 10);
      result = result.filter(t => t.date >= weekStr && t.date <= todayStr);
    } else if (time === 'this_month') {
      const monthPrefix = todayStr.slice(0, 7);
      result = result.filter(t => (t.date || '').startsWith(monthPrefix));
    } else if (time === 'this_year') {
      const yearPrefix = todayStr.slice(0, 4);
      result = result.filter(t => (t.date || '').startsWith(yearPrefix));
    }
  }

  const sort = sortBySelect.value;
  result.sort((a, b) => {
    if (sort === 'date_desc') {
      return (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0);
    } else if (sort === 'date_asc') {
      return (a.date || '').localeCompare(b.date || '') || (a.createdAt || 0) - (b.createdAt || 0);
    } else if (sort === 'amount_desc') {
      return Number(b.amount) - Number(a.amount);
    } else if (sort === 'amount_asc') {
      return Number(a.amount) - Number(b.amount);
    }
    return 0;
  });

  return result;
}

function renderTransactionList() {
  const filtered = getFilteredTransactions();

  txCountBadge.textContent = `${filtered.length} of ${transactions.length}`;
  txList.innerHTML = '';
  txListGrouped.innerHTML = '';

  if (filtered.length === 0) {
    emptyListState.style.display = 'flex';
    txList.style.display = 'none';
    txListGrouped.style.display = 'none';
    bulkActionBar.style.display = 'none';
    if (transactions.length === 0) {
      emptyStateMessage.textContent = "You haven't added any transactions yet. Start tracking your expenses today!";
      loadSampleDataBtn.style.display = 'inline-flex';
    } else {
      emptyStateMessage.textContent = 'No transactions match your current search and filters.';
      loadSampleDataBtn.style.display = 'none';
    }
    return;
  }

  emptyListState.style.display = 'none';

  if (currentViewMode === 'grouped') {
    txList.style.display = 'none';
    txListGrouped.style.display = 'flex';
    renderGroupedTransactionList(filtered);
  } else {
    txList.style.display = 'flex';
    txListGrouped.style.display = 'none';
    filtered.forEach(tx => txList.appendChild(createTxElement(tx)));
  }

  updateBulkBar();
}

function renderGroupedTransactionList(items) {
  const groups = {};
  items.forEach(t => {
    const d = t.date || 'No Date';
    if (!groups[d]) groups[d] = [];
    groups[d].push(t);
  });

  const dates = Object.keys(groups);
  dates.forEach(dateStr => {
    const txGroup = groups[dateStr];
    let dayIncome = 0;
    let dayExpense = 0;
    txGroup.forEach(t => {
      if (t.type === 'income') dayIncome += Number(t.amount);
      else dayExpense += Number(t.amount);
    });
    const dayNet = dayIncome - dayExpense;

    const groupWrap = document.createElement('div');
    groupWrap.className = 'tx-date-group';

    const header = document.createElement('div');
    header.className = 'tx-date-header';
    header.innerHTML = `
      <span><i class="fa-regular fa-calendar-check"></i> ${formatFriendlyDate(dateStr)} (${txGroup.length} items)</span>
      <span class="day-subtotal ${dayNet >= 0 ? 'pos' : 'neg'}">
        Day Net: ${dayNet >= 0 ? '+' : ''}${formatCurrency(dayNet)}
      </span>
    `;

    const ul = document.createElement('ul');
    ul.className = 'tx-list';
    txGroup.forEach(tx => ul.appendChild(createTxElement(tx)));

    groupWrap.appendChild(header);
    groupWrap.appendChild(ul);
    txListGrouped.appendChild(groupWrap);
  });
}

function createTxElement(tx) {
  const meta = getCategoryMeta(tx.category, tx.type);
  const paymentIcon = PAYMENT_ICONS[tx.paymentMethod] || 'fa-credit-card';
  const isSelected = selectedTxIds.has(tx.id);

  const li = document.createElement('li');
  li.className = 'tx-item';
  li.dataset.id = tx.id;

  li.innerHTML = `
    <input type="checkbox" class="tx-checkbox" ${isSelected ? 'checked' : ''} aria-label="Select transaction" />
    <div class="tx-left">
      <div class="tx-category-icon" style="background: ${meta.color}1a; color: ${meta.color};" title="${tx.category}">
        <i class="fa-solid ${meta.icon}"></i>
      </div>
      <div class="tx-info">
        <span class="tx-description" title="${escapeHtml(tx.description)}">${escapeHtml(tx.description)}</span>
        <div class="tx-meta">
          <span class="tx-category-tag">${escapeHtml(tx.category)}</span>
          <span class="tx-payment-tag"><i class="fa-solid ${paymentIcon}"></i> ${escapeHtml(tx.paymentMethod || 'UPI / Online')}</span>
          <span>•</span>
          <span>${formatDisplayDate(tx.date)}</span>
          ${tx.notes ? `<span class="tx-notes-tag">• ${escapeHtml(tx.notes)}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="tx-right">
      <span class="tx-amount ${tx.type}">
        ${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}
      </span>
      <div class="tx-actions">
        <button class="action-icon-btn edit" title="Edit transaction" aria-label="Edit transaction">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="action-icon-btn delete" title="Delete transaction" aria-label="Delete transaction">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  const cb = li.querySelector('.tx-checkbox');
  cb.addEventListener('change', (e) => handleTxCheckboxChange(tx.id, e.target.checked));
  li.querySelector('.edit').addEventListener('click', () => openEditModal(tx.id));
  li.querySelector('.delete').addEventListener('click', () => deleteTransaction(tx.id));

  return li;
}

function updateCategoryFilterDropdown() {
  const currentVal = filterCategorySelect.value || 'all';
  const uniqueCats = Array.from(new Set(transactions.map(t => t.category).filter(Boolean))).sort();

  filterCategorySelect.innerHTML = '<option value="all">All Categories</option>';
  uniqueCats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === currentVal) opt.selected = true;
    filterCategorySelect.appendChild(opt);
  });
}

// ==========================================
// 15. CHART.JS 3-WAY ANALYTICS ENGINE
// ==========================================

function updateChart() {
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  if (currentChartMode === 'doughnut') {
    renderCategoryDoughnutChart(textColor);
  } else if (currentChartMode === 'bar') {
    renderCashflowBarChart(textColor, gridColor);
  } else {
    renderBalanceTrendChart(textColor, gridColor);
  }
}

function renderCategoryDoughnutChart(textColor) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const catTotals = {};

  expenseTransactions.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
  });

  const categories = Object.keys(catTotals);
  const dataValues = categories.map(c => Math.round(catTotals[c] * 100) / 100);

  if (categories.length > 0) {
    let topCat = categories[0];
    let maxVal = catTotals[topCat];
    categories.forEach(c => {
      if (catTotals[c] > maxVal) {
        maxVal = catTotals[c];
        topCat = c;
      }
    });
    topCategoryValueEl.textContent = `${topCat} (${formatCurrency(maxVal)})`;
  } else {
    topCategoryValueEl.textContent = '—';
  }

  if (categories.length === 0) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    chartCanvas.style.display = 'none';
    chartEmptyState.style.display = 'flex';
    return;
  }

  chartCanvas.style.display = 'block';
  chartEmptyState.style.display = 'none';

  const colors = categories.map(c => getCategoryMeta(c, 'expense').color);

  if (chartInstance) chartInstance.destroy();

  const ctx = chartCanvas.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: dataValues,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#121826' : '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 10,
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${label}: ${formatCurrency(value)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '62%'
    }
  });
}

function renderCashflowBarChart(textColor, gridColor) {
  const monthlyData = {};

  transactions.forEach(t => {
    if (!t.date) return;
    const month = t.date.slice(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
    if (t.type === 'income') monthlyData[month].income += Number(t.amount);
    else monthlyData[month].expense += Number(t.amount);
  });

  const months = Object.keys(monthlyData).sort().slice(-6);

  if (months.length === 0) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    chartCanvas.style.display = 'none';
    chartEmptyState.style.display = 'flex';
    return;
  }

  chartCanvas.style.display = 'block';
  chartEmptyState.style.display = 'none';

  const labels = months.map(m => {
    const parts = m.split('-');
    const date = new Date(parts[0], parts[1] - 1);
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
  });

  const incomeData = months.map(m => monthlyData[m].income);
  const expenseData = months.map(m => monthlyData[m].expense);

  if (chartInstance) chartInstance.destroy();

  const ctx = chartCanvas.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Income', data: incomeData, backgroundColor: '#10b981', borderRadius: 6 },
        { label: 'Expenses', data: expenseData, backgroundColor: '#f43f5e', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 10 },
            callback: value => CURRENCIES[currentCurrencyCode].symbol + value.toLocaleString()
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, padding: 10, color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
        },
        tooltip: {
          callbacks: {
            label: context => ` ${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          }
        }
      }
    }
  });
}

function renderBalanceTrendChart(textColor, gridColor) {
  const chronological = [...transactions].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  if (chronological.length === 0) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    chartCanvas.style.display = 'none';
    chartEmptyState.style.display = 'flex';
    return;
  }

  chartCanvas.style.display = 'block';
  chartEmptyState.style.display = 'none';

  const labels = [];
  const balancePoints = [];
  let currentBalance = 0;

  chronological.forEach(t => {
    currentBalance += (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
    labels.push(formatDisplayDate(t.date));
    balancePoints.push(currentBalance);
  });

  if (chartInstance) chartInstance.destroy();

  const ctx = chartCanvas.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Cumulative Balance',
        data: balancePoints,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 }, maxTicksLimit: 7 }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 10 },
            callback: value => CURRENCIES[currentCurrencyCode].symbol + value.toLocaleString()
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` Net: ${formatCurrency(context.parsed.y)}`
          }
        }
      }
    }
  });
}

// ==========================================
// 16. IMPORT & EXPORT FEATURES
// ==========================================

function exportToCsv() {
  if (transactions.length === 0) {
    showToast('No transactions to export.', 'info');
    return;
  }

  const headers = ['ID', 'Type', 'Description', 'Category', 'Payment Method', `Amount (${currentCurrencyCode})`, 'Date', 'Notes'];
  const rows = transactions.map(t => [
    `"${t.id || ''}"`,
    `"${t.type || ''}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.paymentMethod || 'UPI / Online').replace(/"/g, '""')}"`,
    t.amount,
    `"${t.date || ''}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(csvContent, `expense_report_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  showToast('Exported transactions to CSV!', 'success');
}

function exportToJson() {
  if (transactions.length === 0) {
    showToast('No transactions to export.', 'info');
    return;
  }

  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, `expense_backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  showToast('Exported backup to JSON!', 'success');
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (!Array.isArray(imported)) throw new Error('Data format must be a JSON array.');

      let importedCount = 0;
      imported.forEach(item => {
        if (item.description && !isNaN(Number(item.amount))) {
          transactions.push({
            id: item.id || generateId(),
            type: item.type === 'income' ? 'income' : 'expense',
            description: String(item.description).trim(),
            category: item.category || 'Others',
            paymentMethod: item.paymentMethod || 'UPI / Online',
            amount: Math.round(Number(item.amount) * 100) / 100,
            date: item.date || new Date().toISOString().slice(0, 10),
            notes: item.notes || '',
            createdAt: item.createdAt || Date.now()
          });
          importedCount++;
        }
      });

      saveTransactions();
      renderApp();
      renderSmartInsights();
      showToast(`Successfully imported ${importedCount} transactions!`, 'success');
    } catch (err) {
      showToast(`Failed to import: ${err.message}`, 'error');
    }
  };

  reader.readAsText(file);
  fileInput.value = '';
}

// ==========================================
// 17. MODALS & DIALOGS
// ==========================================

function toggleModal(modal, show) {
  if (show) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function showConfirmDialog(title, message, onConfirm) {
  confirmModalTitle.textContent = title;
  confirmModalMessage.textContent = message;
  pendingConfirmAction = onConfirm;
  toggleModal(confirmModal, true);
}

// ==========================================
// 18. TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || 'fa-bell'} toast-icon"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 250);
  }, 3200);
}

// ==========================================
// 19. UTILITY FUNCTIONS
// ==========================================

function formatCurrency(num) {
  const n = Number(num) || 0;
  const curr = CURRENCIES[currentCurrencyCode] || CURRENCIES.INR;
  return curr.symbol + n.toLocaleString(curr.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch (e) {}
  return dateStr;
}

function formatFriendlyDate(dateStr) {
  if (!dateStr) return 'No Date';
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  return formatDisplayDate(dateStr);
}

function generateId() {
  return 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==========================================
// 20. VIRTUAL CARD & 3D INTERACTION
// ==========================================

function initVirtualCard() {
  if (!virtualCard) return;

  // Restore saved card theme
  const savedCardTheme = localStorage.getItem('expense_tracker_card_theme') || 'obsidian';
  setCardTheme(savedCardTheme);

  // Card theme buttons
  cardThemeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-card-theme');
      setCardTheme(theme);
    });
  });

  // 3D Tilt on mousemove
  if (virtualCardWrapper) {
    virtualCardWrapper.addEventListener('mousemove', (e) => {
      const rect = virtualCardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      virtualCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    virtualCardWrapper.addEventListener('mouseleave', () => {
      virtualCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

function setCardTheme(theme) {
  if (!virtualCard) return;
  virtualCard.classList.remove('card-theme-obsidian', 'card-theme-indigo', 'card-theme-emerald', 'card-theme-rose');
  virtualCard.classList.add(`card-theme-${theme}`);
  localStorage.setItem('expense_tracker_card_theme', theme);

  cardThemeDots.forEach(dot => {
    dot.classList.toggle('active', dot.getAttribute('data-card-theme') === theme);
  });
}

// ==========================================
// 21. FINANCIAL WELLNESS SCORE GAUGE
// ==========================================

function renderHealthScoreGauge(incomeTotal, expenseTotal, thisMonthExpenses, savingsRate) {
  if (!healthScoreNumber) return;

  let score = 50; // base score

  // Savings ratio component (up to +30 points)
  if (incomeTotal > 0) {
    const savingsRatio = Math.max(0, (incomeTotal - expenseTotal) / incomeTotal);
    score += Math.min(30, Math.round(savingsRatio * 40));
  } else if (expenseTotal > 0) {
    score -= 20;
  }

  // Budget discipline component (up to +20 points)
  let budgetDisciplinePercent = 100;
  if (monthlyBudget > 0) {
    const budgetBurn = (thisMonthExpenses / monthlyBudget);
    if (budgetBurn <= 0.8) {
      score += 20;
      budgetDisciplinePercent = 95;
    } else if (budgetBurn <= 1) {
      score += 10;
      budgetDisciplinePercent = Math.round((1 - budgetBurn) * 100) + 70;
    } else {
      score -= Math.min(30, Math.round((budgetBurn - 1) * 35));
      budgetDisciplinePercent = Math.max(20, Math.round((1 / budgetBurn) * 60));
    }
  }

  // Transaction logging consistency component (+5 bonus if > 3 tx)
  if (transactions.length >= 3) {
    score += 5;
  }

  score = Math.max(10, Math.min(99, Math.round(score)));

  // Update UI Elements
  healthScoreNumber.innerHTML = `${score}<small>/100</small>`;
  if (healthScoreFill) {
    healthScoreFill.style.width = `${score}%`;
    if (score >= 80) {
      healthScoreFill.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
    } else if (score >= 60) {
      healthScoreFill.style.background = 'linear-gradient(90deg, #f59e0b, #3b82f6)';
    } else {
      healthScoreFill.style.background = 'linear-gradient(90deg, #f43f5e, #f97316)';
    }
  }

  if (gaugeBadge) {
    if (score >= 80) {
      gaugeBadge.textContent = 'Excellent';
      gaugeBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      gaugeBadge.style.color = '#10b981';
    } else if (score >= 65) {
      gaugeBadge.textContent = 'Good';
      gaugeBadge.style.background = 'rgba(59, 130, 246, 0.15)';
      gaugeBadge.style.color = '#3b82f6';
    } else if (score >= 45) {
      gaugeBadge.textContent = 'Moderate';
      gaugeBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      gaugeBadge.style.color = '#f59e0b';
    } else {
      gaugeBadge.textContent = 'Attention';
      gaugeBadge.style.background = 'rgba(244, 63, 94, 0.15)';
      gaugeBadge.style.color = '#f43f5e';
    }
  }

  if (gaugeSavingsRatio) {
    gaugeSavingsRatio.textContent = `${savingsRate}%`;
  }

  if (gaugeBudgetDiscipline) {
    gaugeBudgetDiscipline.textContent = `${budgetDisciplinePercent}%`;
  }

  if (gaugeSafeDailyBurn) {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const remainingDays = Math.max(1, daysInMonth - today.getDate() + 1);
    const remainingBudget = Math.max(0, monthlyBudget - thisMonthExpenses);
    const safeDaily = remainingBudget / remainingDays;
    gaugeSafeDailyBurn.textContent = formatCurrency(safeDaily);
  }
}

// ==========================================
// 22. CATEGORY SPENDING DISTRIBUTION METERS
// ==========================================

function renderCategoryMeters() {
  if (!categoryMetersList) return;

  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const monthExpenses = transactions.filter(t => t.type === 'expense' && (t.date || '').startsWith(currentMonthPrefix));

  if (monthExpenses.length === 0) {
    categoryMetersList.innerHTML = '<p class="text-muted" style="font-size:0.8rem; text-align:center; padding:0.5rem 0;">No category spending recorded this month.</p>';
    return;
  }

  const totals = {};
  let totalSpending = 0;
  monthExpenses.forEach(t => {
    const amt = Number(t.amount) || 0;
    totals[t.category] = (totals[t.category] || 0) + amt;
    totalSpending += amt;
  });

  const sortedCategories = Object.keys(totals)
    .sort((a, b) => totals[b] - totals[a])
    .slice(0, 4);

  categoryMetersList.innerHTML = '';

  sortedCategories.forEach(catName => {
    const amount = totals[catName];
    const pct = totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0;
    const meta = getCategoryMeta(catName, 'expense');

    const meterItem = document.createElement('div');
    meterItem.className = 'cat-meter-item';
    meterItem.innerHTML = `
      <div class="cat-meter-info">
        <span class="cat-meter-name"><i class="fa-solid ${meta.icon}" style="color:${meta.color}; margin-right:4px;"></i> ${escapeHtml(catName)}</span>
        <span class="cat-meter-amt">${formatCurrency(amount)} (${pct}%)</span>
      </div>
      <div class="cat-meter-bar">
        <div class="cat-meter-fill" style="width: ${pct}%; background-color: ${meta.color};"></div>
      </div>
    `;
    categoryMetersList.appendChild(meterItem);
  });
}

// ==========================================
// 23. LIVE CURRENCY CONVERTER
// ==========================================

const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  JPY: 1.82,
  CAD: 0.016,
  AUD: 0.018,
  AED: 0.044
};

function openConverterModal() {
  if (!converterModal) return;
  toggleModal(converterModal, true);
  calculateCurrencyConversion();
  if (convertFromAmount) convertFromAmount.focus();
}

function calculateCurrencyConversion() {
  if (!convertFromAmount || !converterResultVal) return;

  const amt = parseFloat(convertFromAmount.value);
  if (isNaN(amt) || amt <= 0) {
    converterResultVal.textContent = '—';
    return;
  }

  const fromCurr = convertFromCurrency ? convertFromCurrency.value : 'INR';
  const toCurr = convertToCurrency ? convertToCurrency.value : 'USD';

  // Base is INR
  const inINR = amt / (EXCHANGE_RATES[fromCurr] || 1);
  const converted = inINR * (EXCHANGE_RATES[toCurr] || 1);

  const toMeta = CURRENCIES[toCurr] || { symbol: toCurr, locale: 'en-US' };
  const fromMeta = CURRENCIES[fromCurr] || { symbol: fromCurr, locale: 'en-US' };

  converterResultVal.textContent = `${toMeta.symbol} ${converted.toLocaleString(toMeta.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (converterRateLabel) {
    const singleRate = (1 / (EXCHANGE_RATES[fromCurr] || 1)) * (EXCHANGE_RATES[toCurr] || 1);
    converterRateLabel.textContent = `1 ${fromCurr} = ${singleRate.toFixed(4)} ${toCurr}`;
  }
}

function handleSwapCurrencies() {
  if (!convertFromCurrency || !convertToCurrency) return;
  const temp = convertFromCurrency.value;
  convertFromCurrency.value = convertToCurrency.value;
  convertToCurrency.value = temp;
  calculateCurrencyConversion();
}

// ==========================================
// 24. DEMO PERSONAS ENGINE
// ==========================================

const DEMO_PERSONAS = {
  tech: [
    { type: 'income', description: 'Tech Lead Salary', category: 'Salary', amount: 125000, daysAgo: 1, method: 'Net Banking', notes: '#stripe' },
    { type: 'income', description: 'Open Source Consulting', category: 'Freelance & Gig', amount: 28000, daysAgo: 4, method: 'UPI / Online', notes: 'API Audit' },
    { type: 'expense', description: 'Luxury 2BHK Apartment Rent', category: 'Bills & Utilities', amount: 32000, daysAgo: 2, method: 'Net Banking', notes: '#rent' },
    { type: 'expense', description: 'Whole Foods & Gourmet Market', category: 'Groceries', amount: 8400, daysAgo: 3, method: 'Credit Card', notes: 'Weekly pantry' },
    { type: 'expense', description: 'AWS Cloud & Server Hosting', category: 'Others', amount: 4600, daysAgo: 5, method: 'Credit Card', notes: 'Dev infrastructure' },
    { type: 'expense', description: 'High-End Espresso Cafe', category: 'Food & Dining', amount: 2400, daysAgo: 6, method: 'UPI / Online', notes: 'Team coffee' },
    { type: 'expense', description: 'Uber Premier Rides', category: 'Transport & Fuel', amount: 3100, daysAgo: 8, method: 'UPI / Online', notes: 'Airport transit' },
    { type: 'expense', description: 'Gym & Crossfit Membership', category: 'Health & Medical', amount: 3500, daysAgo: 11, method: 'Credit Card', notes: 'Annual plan' }
  ],
  freelance: [
    { type: 'income', description: 'UI/UX Redesign Contract', category: 'Freelance & Gig', amount: 65000, daysAgo: 2, method: 'Net Banking', notes: 'Milestone 2' },
    { type: 'income', description: 'Logo & Brand Identity Kit', category: 'Freelance & Gig', amount: 22000, daysAgo: 6, method: 'UPI / Online', notes: 'E-commerce client' },
    { type: 'expense', description: 'Co-working Space Desk', category: 'Bills & Utilities', amount: 9500, daysAgo: 3, method: 'Net Banking', notes: 'WeWork monthly' },
    { type: 'expense', description: 'Adobe Creative Cloud', category: 'Entertainment', amount: 4230, daysAgo: 5, method: 'Credit Card', notes: 'Design suite' },
    { type: 'expense', description: 'Supermarket Groceries', category: 'Groceries', amount: 4800, daysAgo: 7, method: 'UPI / Online', notes: 'Weekly basics' },
    { type: 'expense', description: 'Figma Pro Team Subscription', category: 'Bills & Utilities', amount: 1800, daysAgo: 9, method: 'Credit Card', notes: '' },
    { type: 'expense', description: 'Dinner with Client', category: 'Food & Dining', amount: 3600, daysAgo: 12, method: 'Credit Card', notes: 'Business dinner' }
  ],
  student: [
    { type: 'income', description: 'Campus Teaching Assistantship', category: 'Salary', amount: 18000, daysAgo: 1, method: 'Net Banking', notes: 'Lab TA' },
    { type: 'income', description: 'Monthly Family Allowance', category: 'Gifts & Grants', amount: 12000, daysAgo: 3, method: 'UPI / Online', notes: '#parents' },
    { type: 'expense', description: 'Hostel Room & Mess Fee', category: 'Bills & Utilities', amount: 11000, daysAgo: 2, method: 'Net Banking', notes: '#fixed' },
    { type: 'expense', description: 'University Textbooks & Notes', category: 'Education', amount: 2200, daysAgo: 4, method: 'UPI / Online', notes: 'Semester 5 books' },
    { type: 'expense', description: 'Campus Cafeteria & Snacks', category: 'Food & Dining', amount: 1850, daysAgo: 5, method: 'Cash', notes: 'Evening snacks' },
    { type: 'expense', description: 'Metro Pass Monthly Recharge', category: 'Transport & Fuel', amount: 1200, daysAgo: 8, method: 'UPI / Online', notes: 'Student pass' },
    { type: 'expense', description: 'Spotify Student Discount', category: 'Entertainment', amount: 69, daysAgo: 10, method: 'Debit Card', notes: '' }
  ]
};

function loadPersonaData(personaKey) {
  const items = DEMO_PERSONAS[personaKey];
  if (!items || items.length === 0) return;

  transactions = items.map((item, idx) => ({
    id: `demo_${personaKey}_${Date.now()}_${idx}`,
    type: item.type,
    description: item.description,
    category: item.category,
    amount: item.amount,
    date: getRecentDate(item.daysAgo),
    paymentMethod: item.method,
    notes: item.notes,
    createdAt: Date.now() - (item.daysAgo * 86400000)
  }));

  selectedTxIds.clear();
  saveTransactions();
  renderApp();
  renderSmartInsights();

  const labels = {
    tech: 'Tech Professional (High Income & Investments)',
    freelance: 'Freelance Designer (Variable Income & Tools)',
    student: 'Student (Budget-conscious & Grants)'
  };

  showToast(`Loaded ${labels[personaKey] || 'scenario'}!`, 'success');
}
