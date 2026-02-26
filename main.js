// Main Application Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeCharts();
    updateDashboard();
    updateRecentTransactions();
    updateCompanyPerformance();
    updateRecentInvoices();
    updateCurrentDate();
    
    // Add event listeners
    document.getElementById('revenuePeriod').addEventListener('change', function(e) {
        updateCharts(e.target.value);
    });
    
    document.getElementById('companyPeriod').addEventListener('change', function(e) {
        updateCharts(e.target.value);
    });
});

// Update dashboard stats
function updateDashboard() {
    const totals = calculateTotals();
    
    document.getElementById('totalRevenue').textContent = 
        formatCurrency(totals.revenue);
    document.getElementById('totalCompanies').textContent = 
        companies.length;
    document.getElementById('totalTransactions').textContent = 
        transactions.length;
    document.getElementById('netProfit').textContent = 
        formatCurrency(totals.profit);
}

// Update recent transactions table
function updateRecentTransactions() {
    const tbody = document.getElementById('recentTransactions');
    const recent = transactions.slice(0, 5);
    
    tbody.innerHTML = recent.map(t => `
        <tr>
            <td>${formatDate(t.date)}</td>
            <td>${t.company}</td>
            <td>${t.description}</td>
            <td class="${t.type === 'income' ? 'positive' : 'negative'}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(t.amount))}
            </td>
            <td><span class="status-badge ${t.status}">${t.status}</span></td>
        </tr>
    `).join('');
}

// Update company performance list
function updateCompanyPerformance() {
    const container = document.getElementById('companyPerformance');
    const metrics = calculator.getCompanyMetrics();
    
    container.innerHTML = metrics.map((m, index) => `
        <div class="company-item">
            <div class="company-info">
                <div class="company-avatar" style="background: ${companies[index].color}">
                    ${m.company.charAt(0)}
                </div>
                <div class="company-details">
                    <h4>${m.company}</h4>
                    <span>Profit Margin: ${m.margin}%</span>
                </div>
            </div>
            <div class="company-revenue">
                ${formatCurrency(m.profit)}
            </div>
        </div>
    `).join('');
}

// Update recent invoices
function updateRecentInvoices() {
    const tbody = document.getElementById('recentInvoices');
    const recent = invoices.slice(0, 5);
    
    tbody.innerHTML = recent.map(inv => `
        <tr>
            <td><strong>${inv.id}</strong></td>
            <td>${inv.company}</td>
            <td>${inv.client}</td>
            <td>${formatDate(inv.issueDate)}</td>
            <td>${formatDate(inv.dueDate)}</td>
            <td>${formatCurrency(inv.amount)}</td>
            <td><span class="status-badge ${inv.status}">${inv.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewInvoice('${inv.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update current date
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('currentDate').textContent = 
        now.toLocaleDateString('en-US', options);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Export functionality
function exportData() {
    const data = {
        companies: companies,
        transactions: transactions,
        invoices: invoices,
        summary: calculateTotals(),
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-proof-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Financial data exported successfully!');
}

// View invoice function
function viewInvoice(invoiceId) {
    alert(`Viewing invoice: ${invoiceId}\nThis would open the invoice details page.`);
}

// Print function for physical proof
function printFinancialReport() {
    window.print();
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printFinancialReport();
    }
    
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});
