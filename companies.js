// Companies Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    loadCompanies();
    updateCompanyStats();
});

function loadCompanies() {
    const grid = document.getElementById('companiesGrid');
    
    grid.innerHTML = companies.map(company => `
        <div class="info-card" onclick="showCompanyDetails(${company.id})">
            <div class="card-header">
                <h3>${company.name}</h3>
                <span class="card-badge ${company.status}">${company.status}</span>
            </div>
            <div style="margin: 15px 0;">
                <p><i class="fas fa-industry"></i> ${company.industry}</p>
                <p><i class="fas fa-calendar"></i> Founded: ${formatDate(company.founded)}</p>
                <p><i class="fas fa-users"></i> ${company.employees} Employees</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <small>Revenue</small>
                    <h4 style="color: var(--success);">${formatCurrency(company.revenue)}</h4>
                </div>
                <div>
                    <small>Expenses</small>
                    <h4 style="color: var(--danger);">${formatCurrency(company.expenses)}</h4>
                </div>
                <div>
                    <small>Profit</small>
                    <h4 style="color: var(--primary);">${formatCurrency(company.revenue - company.expenses)}</h4>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCompanyStats() {
    const totals = calculateTotals();
    document.getElementById('totalRevenue').textContent = formatCurrency(totals.revenue);
    
    const totalEmployees = companies.reduce((sum, c) => sum + c.employees, 0);
    document.getElementById('totalEmployees').textContent = totalEmployees;
    
    const avgMargin = companies.reduce((sum, c) => {
        const profit = c.revenue - c.expenses;
        const margin = c.revenue > 0 ? (profit / c.revenue) * 100 : 0;
        return sum + margin;
    }, 0) / companies.length;
    
    document.getElementById('avgMargin').textContent = avgMargin.toFixed(1) + '%';
}

function showCompanyDetails(companyId) {
    const company = companies.find(c => c.id === companyId);
    const modal = document.getElementById('companyModal');
    const body = document.getElementById('companyModalBody');
    
    const companyTransactions = transactions.filter(t => t.company === company.name);
    const revenue = companyTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = companyTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    
    body.innerHTML = `
        <h3>${company.name}</h3>
        <p><strong>Industry:</strong> ${company.industry}</p>
        <p><strong>Founded:</strong> ${formatDate(company.founded)}</p>
        <p><strong>Employees:</strong> ${company.employees}</p>
        
        <h4 style="margin-top: 20px;">Financial Summary</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: var(--light); padding: 10px; border-radius: 8px;">
                <small>Revenue</small>
                <h3 style="color: var(--success);">${formatCurrency(revenue)}</h3>
            </div>
            <div style="background: var(--light); padding: 10px; border-radius: 8px;">
                <small>Expenses</small>
                <h3 style="color: var(--danger);">${formatCurrency(expenses)}</h3>
            </div>
        </div>
        
        <h4 style="margin-top: 20px;">Recent Transactions</h4>
        <div style="max-height: 200px; overflow-y: auto;">
            ${companyTransactions.slice(0, 5).map(t => `
                <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid var(--border);">
                    <span>${t.date}</span>
                    <span>${t.description}</span>
                    <span class="${t.type === 'income' ? 'positive' : 'negative'}">
                        ${t.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(t.amount))}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('active');
}

function showAddCompanyModal() {
    document.getElementById('addCompanyModal').classList.add('active');
}

function closeModal() {
    document.getElementById('companyModal').classList.remove('active');
}

function closeAddModal() {
    document.getElementById('addCompanyModal').classList.remove('active');
}

function addCompany() {
    const name = document.getElementById('companyName').value;
    if (!name) {
        alert('Please enter a company name');
        return;
    }
    
    const newCompany = {
        id: companies.length + 1,
        name: name,
        industry: document.getElementById('companyIndustry').value,
        founded: document.getElementById('companyFounded').value || new Date().toISOString().split('T')[0],
        employees: parseInt(document.getElementById('companyEmployees').value) || 1,
        revenue: parseFloat(document.getElementById('companyRevenue').value) || 0,
        expenses: 0,
        status: 'active',
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    
    companies.push(newCompany);
    loadCompanies();
    updateCompanyStats();
    closeAddModal();
    
    alert(`Company "${name}" added successfully!`);
}

function exportCompanies() {
    const dataStr = JSON.stringify(companies, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
