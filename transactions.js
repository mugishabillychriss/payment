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
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    document.getElementById('paginationInfo').textContent = `Page ${currentPage} of ${totalPages || 1}`;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTransactions();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadTransactions();
    }
}

function showAddTransactionModal() {
    document.getElementById('addTransactionModal').classList.add('active');
    document.getElementById('transactionDate').valueAsDate = new Date();
}

function closeTransactionModal() {
    document.getElementById('addTransactionModal').classList.remove('active');
    document.getElementById('addTransactionForm').reset();
}

function addTransaction() {
    const newTransaction = {
        id: 'T' + String(transactions.length + 1).padStart(3, '0'),
        date: document.getElementById('transactionDate').value,
        company: document.getElementById('transactionCompany').value,
        description: document.getElementById('transactionDesc').value,
        amount: parseFloat(document.getElementById('transactionAmount').value) * 
                (document.getElementById('transactionType').value === 'expense' ? -1 : 1),
        type: document.getElementById('transactionType').value,
        method: document.getElementById('transactionMethod').value,
        status: document.getElementById('transactionStatus').value
    };
    
    if (!newTransaction.company || !newTransaction.description || !newTransaction.amount) {
        alert('Please fill all required fields');
        return;
    }
    
    transactions.push(newTransaction);
    filteredTransactions = [...transactions];
    loadTransactions();
    updateTransactionStats();
    closeTransactionModal();
    
    alert('Transaction added successfully!');
}

function showTransactionDetails(id) {
    const transaction = transactions.find(t => t.id === id);
    const modal = document.getElementById('transactionDetailModal');
    const body = document.getElementById('transactionDetailBody');
    
    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 36px; color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--danger)'}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
            </h2>
            <span class="status-badge ${transaction.status}" style="font-size: 14px;">
                ${transaction.status}
            </span>
        </div>
        
        <div style="display: grid; gap: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--light); border-radius: 8px;">
                <strong>Transaction ID:</strong>
                <span>${transaction.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--light); border-radius: 8px;">
                <strong>Date:</strong>
                <span>${formatDate(transaction.date)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--light); border-radius: 8px;">
                <strong>Company:</strong>
                <span>${transaction.company}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--light); border-radius: 8px;">
                <strong>Description:</strong>
                <span>${transaction.description}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--light); border-radius: 8px;">
                <strong>Payment Method:</strong>
                <span>${transaction.method}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Store current transaction ID for edit/delete
    window.currentTransactionId = id;
}

function closeDetailModal() {
    document.getElementById('transactionDetailModal').classList.remove('active');
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions.splice(index, 1);
            filteredTransactions = [...transactions];
            loadTransactions();
            updateTransactionStats();
            closeDetailModal();
            alert('Transaction deleted successfully!');
        }
    }
}

function exportTransactions() {
    const csv = [
        ['ID', 'Date', 'Company', 'Description', 'Amount', 'Type', 'Method', 'Status'],
        ...filteredTransactions.map(t => [
            t.id,
            t.date,
            t.company,
            t.description,
            t.amount,
            t.type,
            t.method,
            t.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function printTransactions() {
    window.print();
}
