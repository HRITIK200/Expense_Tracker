/* Expense Tracker - script.js
   Features:
   - Add/Edit/Delete transactions (income & expense)
   - Categories + filter + search
   - Totals: income, expense, net
   - localStorage persistence
   - Export/Import JSON
   - Chart (expense distribution by category) using Chart.js
*/

// ---------- Selectors ----------
const txForm = document.getElementById('txForm');
const typeEl = document.getElementById('type');
const descEl = document.getElementById('description');
const categoryEl = document.getElementById('category');
const amountEl = document.getElementById('amount');
const dateEl = document.getElementById('date');
const addBtn = document.getElementById('addBtn');
const clearFormBtn = document.getElementById('clearForm');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netAmountEl = document.getElementById('netAmount');

const txList = document.getElementById('txList');

const searchEl = document.getElementById('search');
const filterCategoryEl = document.getElementById('filterCategory');
const filterTypeEl = document.getElementById('filterType');

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const clearAllBtn = document.getElementById('clearAll');

const ctx = document.getElementById('expenseChart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Chart instance (global)
let expenseChart = null;

// ---------- Helpers ----------
function saveAndRender() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  render();
}

function formatCurrency(num) {
  return '₹' + Number(num || 0).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

// ---------- Render UI ----------
function render() {
  // Fill category filter options dynamically (unique categories)
  populateCategoryFilter();

  // Apply filters (search, category, type)
  let filtered = [...transactions];

  const searchText = searchEl.value.trim().toLowerCase();
  if (searchText) {
    filtered = filtered.filter(t => t.description.toLowerCase().includes(searchText));
  }

  const selectedCategory = filterCategoryEl.value;
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(t => t.category === selectedCategory);
  }

  const selectedType = filterTypeEl.value;
  if (selectedType !== 'all') {
    filtered = filtered.filter(t => t.type === selectedType);
  }

  // Clear list
  txList.innerHTML = '';

  // Render each transaction
  filtered.forEach(tx => {
    const li = document.createElement('li');
    li.className = 'tx-item';
    li.dataset.id = tx.id;

    // left side
    const left = document.createElement('div'); left.className = 'tx-left';
    const meta = document.createElement('div'); meta.className = 'tx-meta';
    const desc = document.createElement('strong'); desc.textContent = tx.description;
    const small = document.createElement('small'); small.textContent = `${tx.category} • ${tx.date || ''}`;
    meta.appendChild(desc); meta.appendChild(small);

    const badge = document.createElement('span');
    badge.className = 'badge ' + (tx.type === 'income' ? 'income' : 'expense');
    badge.textContent = tx.type === 'income' ? 'Income' : 'Expense';

    left.appendChild(meta);

    // right side
    const right = document.createElement('div'); right.className = 'tx-right';
    const amt = document.createElement('div');
    amt.className = 'tx-amount';
    amt.textContent = (tx.type === 'income' ? '+' : '-') + formatCurrency(tx.amount);

    const actions = document.createElement('div'); actions.className = 'tx-actions';
    // edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.className = 'edit';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', () => editTransaction(tx.id));
    // delete button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.className = 'delete';
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', () => {
      if (confirm('Delete this transaction?')) {
        deleteTransaction(tx.id);
      }
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    right.appendChild(amt);
    right.appendChild(actions);

    li.appendChild(left);
    li.appendChild(badge);
    li.appendChild(right);

    txList.appendChild(li);
  });

  updateSummary();
  updateChart();
}

// ---------- Populate category filter ----------
function populateCategoryFilter() {
  // get unique categories from transactions
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  // keep default "all" + existing options from select (we will rebuild)
  const current = filterCategoryEl.value || 'all';
  filterCategoryEl.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat;
    filterCategoryEl.appendChild(opt);
  });
  // restore previous selection if possible
  filterCategoryEl.value = current;
}

// ---------- Add transaction ----------
txForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = typeEl.value;
  const description = descEl.value.trim();
  const category = categoryEl.value;
  const amountVal = parseFloat(amountEl.value);
  const dateVal = dateEl.value;

  // Basic validation
  if (!description) { alert('Please enter description'); return; }
  if (!amountVal || isNaN(amountVal) || amountVal <= 0) { alert('Please enter a valid amount > 0'); return; }

  const tx = {
    id: uid(),
    type,
    description,
    category,
    amount: Math.round(amountVal * 100) / 100, // store 2 decimal precision
    date: dateVal || (new Date()).toISOString().slice(0,10)
  };

  transactions.push(tx);
  saveAndRender();
  txForm.reset();
});

clearFormBtn.addEventListener('click', () => txForm.reset());

// ---------- Delete ----------
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

// ---------- Edit ----------
function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  // using simple prompts for edit -> you can replace with modal/UI if desired
  const newDesc = prompt('Edit description:', tx.description);
  if (newDesc === null) return;
  const newAmt = prompt('Edit amount (numbers only):', tx.amount);
  if (newAmt === null) return;
  const parsed = parseFloat(newAmt);
  if (isNaN(parsed) || parsed <= 0) { alert('Invalid amount'); return; }
  const newCat = prompt('Edit category:', tx.category) || tx.category;
  const newDate = prompt('Edit date (YYYY-MM-DD):', tx.date) || tx.date;
  const newType = prompt('Type (income/expense):', tx.type) || tx.type;

  tx.description = newDesc.trim();
  tx.amount = Math.round(parsed * 100) / 100;
  tx.category = newCat.trim();
  tx.date = newDate;
  tx.type = (newType === 'income' ? 'income' : 'expense');

  saveAndRender();
}

// ---------- Summary ----------
function updateSummary() {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const net = totalIncome - totalExpense;

  totalIncomeEl.textContent = formatCurrency(totalIncome);
  totalExpenseEl.textContent = formatCurrency(totalExpense);
  netAmountEl.textContent = formatCurrency(net);
}

// ---------- Chart (expense by category) ----------
function updateChart() {
  // compute expense amounts by category
  const expenseTx = transactions.filter(t => t.type === 'expense');
  const totalsByCat = {};
  expenseTx.forEach(t => {
    totalsByCat[t.category] = (totalsByCat[t.category] || 0) + Number(t.amount);
  });

  const labels = Object.keys(totalsByCat);
  const data = labels.map(l => Math.round((totalsByCat[l] || 0) * 100) / 100);

  // If no expense data, show placeholder
  if (!expenseChart) {
    expenseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#10b981','#06b6d4','#60a5fa'
          ],
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    });
  } else {
    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
  }
}

// ---------- Export & Import ----------
exportBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.json';
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (!Array.isArray(imported)) throw new Error('Invalid file format');
      // merge imported transactions (ensure unique ids)
      imported.forEach(itx => {
        if (!itx.id) itx.id = uid();
        transactions.push(itx);
      });
      saveAndRender();
      alert('Import successful');
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };
  reader.readAsText(file);
  // reset input
  fileInput.value = '';
});

// ---------- Filters & search ----------
searchEl.addEventListener('input', render);
filterCategoryEl.addEventListener('change', render);
filterTypeEl.addEventListener('change', render);

// ---------- Clear all ----------
clearAllBtn.addEventListener('click', () => {
  if (confirm('Delete ALL transactions? This cannot be undone.')) {
    transactions = [];
    saveAndRender();
  }
});

// ---------- Initial demo / render ----------
render();
