/**
 * Smart Expense Tracker & Budget Manager
 * Production-ready ES6+ Implementation
 */

// ==========================================
// 1. CONSTANTS & DEFINITIONS
// ==========================================

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

const QUICK_TAGS = {
  expense: ['Groceries', 'Dinner', 'Uber Cab', 'Electricity Bill', 'Coffee', 'Pharmacy', 'Movie Tickets'],
  income: ['Monthly Salary', 'Client Project', 'Stock Dividend', 'Bonus', 'Consulting']
};

// Demo sample data for quick start testing
const SAMPLE_TRANSACTIONS = [
  { id: 'tx-1', type: 'income', description: 'Monthly Software Salary', category: 'Salary', amount: 85000, date: getRecentDate(1) },
  { id: 'tx-2', type: 'income', description: 'Freelance Web Design', category: 'Freelance & Gig', amount: 18500, date: getRecentDate(3) },
  { id: 'tx-3', type: 'expense', description: 'Apartment Rent & Maintenance', category: 'Bills & Utilities', amount: 22000, date: getRecentDate(2) },
  { id: 'tx-4', type: 'expense', description: 'Supermarket Groceries', category: 'Groceries', amount: 4850, date: getRecentDate(4) },
  { id: 'tx-5', type: 'expense', description: 'Fine Dining & Cafe', category: 'Food & Dining', amount: 1950, date: getRecentDate(5) },
  { id: 'tx-6', type: 'expense', description: 'Fuel & Metro Recharge', category: 'Transport & Fuel', amount: 2600, date: getRecentDate(7) },
  { id: 'tx-7', type: 'expense', description: 'Streaming & Internet Subscriptions', category: 'Entertainment', amount: 1499, date: getRecentDate(9) },
  { id: 'tx-8', type: 'expense', description: 'Health Insurance Premium', category: 'Health & Medical', amount: 3500, date: getRecentDate(12) }
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
let monthlyBudget = parseFloat(localStorage.getItem('expense_tracker_budget')) || 40000;
let currentChartMode = 'doughnut';
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

// ==========================================
// 3. DOM ELEMENTS
// ==========================================

// Header
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const currentDateDisplay = document.getElementById('currentDateDisplay');

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

// Add Form
const txForm = document.getElementById('txForm');
const typeExpenseRadio = document.getElementById('typeExpense');
const typeIncomeRadio = document.getElementById('typeIncome');
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const quickTagsList = document.getElementById('quickTagsList');
const clearFormBtn = document.getElementById('clearForm');

// Chart
const chartCanvas = document.getElementById('expenseChart');
const chartEmptyState = document.getElementById('chartEmptyState');
const chartTabs = document.querySelectorAll('.chart-tab');
const topCategoryValueEl = document.getElementById('topCategoryValue');

// History & Filters
const txCountBadge = document.getElementById('txCountBadge');
const searchInput = document.getElementById('search');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterCategorySelect = document.getElementById('filterCategory');
const filterTypeSelect = document.getElementById('filterType');
const filterTimeSelect = document.getElementById('filterTime');
const sortBySelect = document.getElementById('sortBy');
const txList = document.getElementById('txList');
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
const editDateInput = document.getElementById('editDate');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Budget Modal
const budgetModal = document.getElementById('budgetModal');
const budgetForm = document.getElementById('budgetForm');
const monthlyBudgetInput = document.getElementById('monthlyBudgetInput');
const closeBudgetModalBtn = document.getElementById('closeBudgetModalBtn');
const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');

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
  initDateDisplay();
  initFormDefaults();
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
    themeToggleBtn.title = 'Switch to Light Mode';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    themeToggleBtn.title = 'Switch to Dark Mode';
  }
  // Re-render chart if active so chart text matches theme colors
  if (chartInstance) {
    updateChart();
  }
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

// ==========================================
// 5. EVENT LISTENERS
// ==========================================

function bindEvents() {
  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

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
    if (typeof pendingConfirmAction === 'function') {
      pendingConfirmAction();
    }
    toggleModal(confirmModal, false);
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

  // Close modals with Escape key or clicking outside backdrop
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [editModal, budgetModal, confirmModal].forEach(m => toggleModal(m, false));
    }
  });

  [editModal, budgetModal, confirmModal].forEach(modal => {
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
    if (selectedValue && selectedValue === c.name) {
      opt.selected = true;
    }
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
      // Also automatically match category if reasonable
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
  const dateVal = dateInput.value;

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
    date: dateVal,
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
  editDateInput.value = tx.date;

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
  const dateVal = editDateInput.value;

  if (!description || isNaN(amountVal) || amountVal <= 0 || !dateVal) {
    showToast('Please check the values entered.', 'warning');
    return;
  }

  tx.type = type;
  tx.description = description;
  tx.category = category;
  tx.amount = Math.round(amountVal * 100) / 100;
  tx.date = dateVal;

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
// 8. BUDGET MANAGEMENT
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
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
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
}

function getFilteredTransactions() {
  let result = [...transactions];

  // Search filter
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    result = result.filter(t =>
      (t.description || '').toLowerCase().includes(query) ||
      (t.category || '').toLowerCase().includes(query)
    );
  }

  // Category filter
  const cat = filterCategorySelect.value;
  if (cat && cat !== 'all') {
    result = result.filter(t => t.category === cat);
  }

  // Type filter
  const type = filterTypeSelect.value;
  if (type && type !== 'all') {
    result = result.filter(t => t.type === type);
  }

  // Time range filter
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

  if (filtered.length === 0) {
    emptyListState.style.display = 'flex';
    if (transactions.length === 0) {
      emptyStateMessage.textContent = "You haven't added any transactions yet. Start tracking your expenses today!";
      loadSampleDataBtn.style.display = 'inline-flex';
    } else {
      emptyStateMessage.textContent = 'No transactions match your current search and filter filters.';
      loadSampleDataBtn.style.display = 'none';
    }
    return;
  }

  emptyListState.style.display = 'none';

  filtered.forEach(tx => {
    const meta = getCategoryMeta(tx.category, tx.type);
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
            <span>•</span>
            <span><i class="fa-regular fa-calendar"></i> ${formatDisplayDate(tx.date)}</span>
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

    // Event handlers for actions
    li.querySelector('.edit').addEventListener('click', () => openEditModal(tx.id));
    li.querySelector('.delete').addEventListener('click', () => deleteTransaction(tx.id));

    txList.appendChild(li);
  });
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
// 10. CHART.JS ANALYTICS ENGINE
// ==========================================

function updateChart() {
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  if (currentChartMode === 'doughnut') {
    renderCategoryDoughnutChart(textColor);
  } else {
    renderCashflowBarChart(textColor, gridColor);
  }
}

function renderCategoryDoughnutChart(textColor) {
  // Aggregate expenses by category
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const catTotals = {};

  expenseTransactions.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
  });

  const categories = Object.keys(catTotals);
  const dataValues = categories.map(c => Math.round(catTotals[c] * 100) / 100);

  // Top category display
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
            padding: 12,
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
  // Aggregate income and expense by last 6 months or all months
  const monthlyData = {};

  transactions.forEach(t => {
    if (!t.date) return;
    const month = t.date.slice(0, 7); // 'YYYY-MM'
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += Number(t.amount);
    } else {
      monthlyData[month].expense += Number(t.amount);
    }
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
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#ef4444',
          borderRadius: 6
        }
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
            callback: value => '₹' + value.toLocaleString('en-IN')
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 10,
            color: textColor,
            font: { family: 'Inter', size: 11 }
          }
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

// ==========================================
// 11. IMPORT & EXPORT FEATURES
// ==========================================

function exportToCsv() {
  if (transactions.length === 0) {
    showToast('No transactions to export.', 'info');
    return;
  }

  const headers = ['ID', 'Type', 'Description', 'Category', 'Amount (INR)', 'Date'];
  const rows = transactions.map(t => [
    `"${t.id || ''}"`,
    `"${t.type || ''}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${t.date || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(csvContent, `expense_tracker_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  showToast('Exported transactions to CSV!', 'success');
}

function exportToJson() {
  if (transactions.length === 0) {
    showToast('No transactions to export.', 'info');
    return;
  }

  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, `expense_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
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
            amount: Math.round(Number(item.amount) * 100) / 100,
            date: item.date || new Date().toISOString().slice(0, 10),
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
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch (e) {}
  return dateStr;
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
