// Transactions Page Functionality

let currentPage = 1;
const itemsPerPage = 10;
let filteredTransactions = [...transactions];

document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
    updateTransactionStats();
});

function loadTransactions() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageTransactions = filteredTransactions.slice(start, end);
    
    const tbody = document.getElementById('transactionsTableBody');
    
    if (pageTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--gray); margin-bottom: 10px;"></i>
                    <p>No transactions found</p>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = pageTransactions.map(t => `
            <tr onclick="showTransactionDetails('${t.id}')">
                <td><strong>${t.id}</strong></td>
                <td>${formatDate(t.date)}</td>
                <td>${t.company}</td>
                <td>${t.description}</td>
                <td class="${t.type === 'income' ? 'positive' : 'negative'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(t.amount))}
                </td>
                <td>
                    <span class="status-badge" style="background: ${t.type === 'income' ? '#d1fae5' : '#fee2e2'}; 
                          color: ${t.type === 'income' ? '#065f46' : '#991b1b'}">
                        ${t.type}
                    </span>
                </td>
                <td>${t.method}</td>
                <td><span class="status-badge ${t.status}">${t.status}</span></td>
                <td>
                    <div class="table-actions" onclick="event.stopPropagation()">
                        <button onclick="editTransaction('${t.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete" onclick="deleteTransaction('${t.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    updatePagination();
}

function updateTransactionStats() {
    const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
    
    const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + Math.abs(t.amount), 0);
    
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpenses').textContent = formatCurrency(expenses);
    document.getElementById('netCashFlow').textContent = formatCurrency(income - expenses);
    
    const profitRatio = income > 0 ? ((income - expenses) / income * 100) : 0;
    document.getElementById('profitRatio').textContent = profitRatio.toFixed(1) + '%';
}

function applyFilters() {
    const company = document.getElementById('filterCompany').value;
    const type = document.getElementById('filterType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    filteredTransactions = transactions.filter(t => {
        if (company !== 'all' && t.company !== company) return false;
        if (type !== 'all' && t.type !== type) return false;
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        return true;
    });
    
    currentPage = 1;
    loadTransactions();
    updateTransactionStats();
}

function clearFilters() {
    document.getElementById('filterCompany').value = 'all';
    document.getElementById('filterType').value = 'all';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    filteredTransactions = [...transactions];
    currentPage = 1;
    loadTransactions();
    updateTransactionStats();
}

function updatePagination() {
    const totalPages
