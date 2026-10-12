/**
 * Smart Expense Tracker & Financial Manager
 * Comprehensive ES6+ Implementation with Multi-Currency,
 * Savings Goals, 3-Way Analytics, and Date Grouping.
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

const DEFAULT_SAVINGS_GOALS = [
  { id: 'goal-1', name: 'Emergency Fund (6 Months)', target: 150000, current: 85000 },
  { id: 'goal-2', name: 'New Laptop & Workstation', target: 80000, current: 48000 },
  { id: 'goal-3', name: 'Vacation Trip', target: 45000, current: 15000 }
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
let currentCurrencyCode = localStorage.getItem('expense_tracker_currency') || 'INR';
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

// ==========================================
// 3. DOM ELEMENTS
// ==========================================

// Header
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const currentDateDisplay = document.getElementById('currentDateDisplay');
const currencySelect = document.getElementById('currencySelect');
const openSavingsGoalsBtn = document.getElementById('openSavingsGoalsBtn');
const printReportBtn = document.getElementById('printReportBtn');
const shortcutsBtn = document.getElementById('shortcutsBtn');

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

// History & Filters
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

// Bulk Actions
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const clearAllBtn = document.getElementById('clearAll');

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

// Toast Container
const toastContainer = document.getElementById('toastContainer');

// ==========================================
// 4. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCurrency();
  initDateDisplay();
  initFormDefaults();
  initViewMode();
  populateCategorySelect(categorySelect, 'expense');
  renderQuickTags('expense');
  bindEvents();
  renderApp();
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

  // Currency select
  currencySelect.addEventListener('change', (e) => {
    currentCurrencyCode = e.target.value;
    localStorage.setItem('expense_tracker_currency', currentCurrencyCode);
    updateCurrencySymbolLabels();
    renderApp();
    showToast(`Currency changed to ${currentCurrencyCode} (${CURRENCIES[currentCurrencyCode].symbol})`, 'info');
  });

  // Savings Goals trigger
  openSavingsGoalsBtn.addEventListener('click', openSavingsModal);
  closeSavingsModalBtn.addEventListener('click', () => toggleModal(savingsModal, false));
  newGoalForm.addEventListener('submit', handleAddSavingsGoal);

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

  // Import / Export / Clear All
  exportCsvBtn.addEventListener('click', exportToCsv);
  exportBtn.addEventListener('click', exportToJson);
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleImportFile);
  clearAllBtn.addEventListener('click', handleClearAll);

  // Sample data button in empty state
  loadSampleDataBtn.addEventListener('click', handleLoadSampleData);

  // Keyboard Shortcuts (N, B, S, P, T, /, ?)
  window.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInputActive = activeTag === 'input' || activeTag === 'select' || activeTag === 'textarea';

    if (e.key === 'Escape') {
      [editModal, budgetModal, savingsModal, shortcutsModal, confirmModal].forEach(m => toggleModal(m, false));
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
  [editModal, budgetModal, savingsModal, shortcutsModal, confirmModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) toggleModal(modal, false);
    });
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
      saveTransactions();
      renderApp();
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
      saveTransactions();
      renderApp();
      showToast('All transaction records cleared.', 'info');
    }
  );
}

function handleLoadSampleData() {
  transactions = [...SAMPLE_TRANSACTIONS];
  saveTransactions();
  renderApp();
  showToast('Loaded demo transactions successfully!', 'success');
}

// ==========================================
// 8. BUDGET & SAVINGS GOALS
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
      budgetStatusText.innerHTML = `<span style="color:var(--expense); font-weight:600;"><i class="fa-solid fa-triangle-exclamation"></i> Budget exceeded by ${formatCurrency(monthlyExpenses - monthlyBudget)}!</span>`;
    } else if (pct >= 80) {
      budgetProgressBar.classList.add('warning');
      budgetStatusText.innerHTML = `<span style="color:var(--warning); font-weight:600;"><i class="fa-solid fa-bell"></i> Warning: ${100 - pct}% remaining this month.</span>`;
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
// 9. RENDERING & UI UPDATES
// ==========================================

function renderApp() {
  updateCategoryFilterDropdown();
  renderSummaryCards();
  renderBudgetStats();
  renderTransactionList();
  updateChart();
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

  if (netBalance >= 0) {
    balanceStatusEl.className = 'stat-sub positive';
    balanceStatusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Positive Cashflow';
  } else {
    balanceStatusEl.className = 'stat-sub negative';
    balanceStatusEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Spending exceeds income';
  }

  // Financial Health Metrics
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
}

function getFilteredTransactions() {
  let result = [...transactions];

  // Search
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    result = result.filter(t =>
      (t.description || '').toLowerCase().includes(query) ||
      (t.category || '').toLowerCase().includes(query) ||
      (t.notes || '').toLowerCase().includes(query)
    );
  }

  // Category
  const cat = filterCategorySelect.value;
  if (cat && cat !== 'all') {
    result = result.filter(t => t.category === cat);
  }

  // Type
  const type = filterTypeSelect.value;
  if (type && type !== 'all') {
    result = result.filter(t => t.type === type);
  }

  // Payment Method
  const payment = filterPaymentMethodSelect.value;
  if (payment && payment !== 'all') {
    result = result.filter(t => (t.paymentMethod || 'UPI / Online') === payment);
  }

  // Time Range
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

  // Sorting
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
}

function renderGroupedTransactionList(items) {
  // Group items by date
  const groups = {};
  items.forEach(t => {
    const d = t.date || 'No Date';
    if (!groups[d]) groups[d] = [];
    groups[d].push(t);
  });

  const dates = Object.keys(groups); // Already sorted if items was sorted by date
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
  const li = document.createElement('li');
  li.className = 'tx-item';
  li.dataset.id = tx.id;

  li.innerHTML = `
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
// 10. CHART.JS 3-WAY ANALYTICS ENGINE
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
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e293b' : '#ffffff',
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
            font: { family: 'Inter', size: 11, weight: '500' }
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
        { label: 'Expenses', data: expenseData, backgroundColor: '#ef4444', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Inter', size: 10 },
            callback: value => CURRENCIES[currentCurrencyCode].symbol + value.toLocaleString()
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, padding: 10, color: textColor, font: { family: 'Inter', size: 11 } }
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
  // Sort all transactions chronologically to calculate cumulative trajectory
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
          ticks: { color: textColor, font: { family: 'Inter', size: 10 }, maxTicksLimit: 7 }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Inter', size: 10 },
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
// 11. IMPORT & EXPORT FEATURES
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
      showToast(`Successfully imported ${importedCount} transactions!`, 'success');
    } catch (err) {
      showToast(`Failed to import: ${err.message}`, 'error');
    }
  };

  reader.readAsText(file);
  fileInput.value = '';
}

// ==========================================
// 12. MODALS & DIALOGS
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
// 13. TOAST NOTIFICATIONS
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
// 14. UTILITY FUNCTIONS
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
