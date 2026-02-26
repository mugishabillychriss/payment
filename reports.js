// Reports Page Functionality

let reportCharts = [];

document.addEventListener('DOMContentLoaded', function() {
    generateReport();
    
    document.getElementById('reportPeriod').addEventListener('change', function(e) {
        if (e.target.value === 'custom') {
            document.getElementById('customDateRange').style.display = 'flex';
        } else {
            document.getElementById('customDateRange').style.display = 'none';
        }
    });
});

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportContent = document.getElementById('reportContent');
    
    switch(reportType) {
        case 'pnl':
            reportContent.innerHTML = generatePNLReport();
            break;
        case 'balance':
            reportContent.innerHTML = generateBalanceSheet();
            break;
        case 'cashflow':
            reportContent.innerHTML = generateCashFlow();
            break;
        case 'tax':
            reportContent.innerHTML = generateTaxSummary();
            break;
        case 'metrics':
            reportContent.innerHTML = generateMetricsDashboard();
            break;
    }
    
    // Update charts
    updateReportCharts(reportType);
}

function generatePNLReport() {
    const totals = calculateTotals();
    const revenue = calculator.getTotalRevenue();
    const expenses = calculator.getTotalExpenses();
    const profit = revenue - expenses;
    const margin = revenue > 0 ? (profit / revenue * 100) : 0;
    
    // Group expenses by category
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const category = t.description.split(' ')[0]; // Simple categorization
        expensesByCategory[category] = (expensesByCategory[category] || 0) + Math.abs(t.amount);
    });
    
    return `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px;">Profit & Loss Statement</h2>
            <p>Period: ${getReportPeriodText()}</p>
            
            <div style="display: grid; gap: 20px; margin: 30px 0;">
                <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                    <h3 style="color: var(--success); margin-bottom: 10px;">Revenue</h3>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Total Revenue</span>
                        <span style="font-weight: bold;">${formatCurrency(revenue)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <span>Number of Transactions</span>
                        <span>${transactions.filter(t => t.type === 'income').length}</span>
                    </div>
                </div>
                
                <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                    <h3 style="color: var(--danger); margin-bottom: 10px;">Expenses</h3>
                    ${Object.entries(expensesByCategory).map(([cat, amt]) => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>${cat}</span>
                            <span>${formatCurrency(amt)}</span>
                        </div>
                    `).join('')}
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; border-top: 1px solid var(--border); padding-top: 10px;">
                        <span>Total Expenses</span>
                        <span>${formatCurrency(expenses)}</span>
                    </div>
                </div>
                
                <div style="background: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; padding: 20px; border-radius: 8px; color: white;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3>Net Profit</h3>
                            <p style="opacity: 0.9;">Profit Margin: ${margin.toFixed(2)}%</p>
                        </div>
                        <span style="font-size: 32px; font-weight: bold;">${formatCurrency(profit)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateBalanceSheet() {
    const assets = calculator.getTotalRevenue(); // Simplified
    const liabilities = calculator.getTotalExpenses(); // Simplified
    const equity = assets - liabilities;
    
    return `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px;">Balance Sheet</h2>
            <p>As of ${new Date().toLocaleDateString()}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                    <h3 style="color: var(--success); margin-bottom: 20px;">Assets</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Cash</span>
                        <span>${formatCurrency(assets * 0.6)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Accounts Receivable</span>
                        <span>${formatCurrency(assets * 0.3)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Inventory</span>
                        <span>${formatCurrency(assets * 0.1)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; border-top: 1px solid var(--border); padding-top: 10px;">
                        <span>Total Assets</span>
                        <span>${formatCurrency(assets)}</span>
                    </div>
                </div>
                
                <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                    <h3 style="color: var(--danger); margin-bottom: 20px;">Liabilities & Equity</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Accounts Payable</span>
                        <span>${formatCurrency(liabilities * 0.5)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Short-term Debt</span>
                        <span>${formatCurrency(liabilities * 0.3)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Long-term Debt</span>
                        <span>${formatCurrency(liabilities * 0.2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border);">
                        <span><strong>Total Liabilities</strong></span>
                        <span><strong>${formatCurrency(liabilities)}</strong></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; color: var(--primary); font-weight: bold;">
                        <span>Owner's Equity</span>
                        <span>${formatCurrency(equity)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCashFlow() {
    const operating = calculator.getTotalRevenue() - calculator.getTotalExpenses();
    
    return `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px;">Cash Flow Statement</h2>
            <p>Period: ${getReportPeriodText()}</p>
            
            <div style="margin-top: 30px;">
                <div style="background: var(--light); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">Operating Activities</h3>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Net Income</span>
                        <span>${formatCurrency(operating)}</span>
                    </div>
                </div>
                
                <div style="background: var(--light); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">Investing Activities</h3>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Equipment Purchases</span>
                        <span>${formatCurrency(-2000)}</span>
                    </div>
                </div>
                
                <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">Financing Activities</h3>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Owner Investment</span>
                        <span>${formatCurrency(5000)}</span>
                    </div>
                </div>
                
                <div style="background: var(--dark); padding: 20px; border-radius: 8px; margin-top: 15px; color: white;">
                    <div style="display: flex; justify-content: space-between;">
                        <span><strong>Net Cash Flow</strong></span>
                        <span><strong>${formatCurrency(operating - 2000 + 5000)}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateTaxSummary() {
    const revenue = calculator.getTotalRevenue();
    const expenses = calculator.getTotalExpenses();
    const taxableIncome = revenue - expenses;
    const taxRate = 0.21; // 21% corporate tax rate
    const taxDue = taxableIncome * taxRate;
    
    return `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px;">Tax Summary</h2>
            <p>Tax Year: ${new Date().getFullYear()}</p>
            
            <div style="display: grid; gap: 20px; margin-top: 30px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                        <h3 style="color: var(--primary);">Gross Revenue</h3>
                        <p style="font-size: 24px;">${formatCurrency(revenue)}</p>
                    </div>
                    <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                        <h3 style="color: var(--primary);">Deductible Expenses</h3>
                        <p style="font-size: 24px;">${formatCurrency(expenses)}</p>
                    </div>
                </div>
                
                <div style="background: var(--warning); padding: 20px; border-radius: 8px; color: white;">
                    <h3>Taxable Income</h3>
                    <p style="font-size: 28px;">${formatCurrency(taxableIncome)}</p>
                </div>
                
                <div style="background: var(--danger); padding: 20px; border-radius: 8px; color: white;">
                    <h3>Estimated Tax Due (${taxRate * 100}%)</h3>
                    <p style="font-size: 32px;">${formatCurrency(taxDue)}</p>
                </div>
            </div>
        </div>
    `;
}

function generateMetricsDashboard() {
    const metrics = calculator.getCompanyMetrics();
    
    return `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px;">Key Metrics Dashboard</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                ${metrics.map(m => `
                    <div style="background: var(--light); padding: 20px; border-radius: 8px;">
                        <h3 style="color: var(--primary);">${m.company}</h3>
                        <div style="margin-top: 15px;">
                            <p>Revenue: ${formatCurrency(m.revenue)}</p>
                            <p>Profit: ${formatCurrency(m.profit)}</p>
                            <p>Margin: ${m.margin}%</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function updateReportCharts(reportType) {
    // Destroy existing charts
    reportCharts.forEach(chart => chart.destroy());
    reportCharts = [];
    
    // Create revenue breakdown chart
    const ctx1 = document.getElementById('reportChart1').getContext('2d');
    const revenueByCompany = calculator.getRevenueByCompany();
    
    reportCharts.push(new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: Object.keys(revenueByCompany),
            datasets: [{
                label: 'Revenue by Company',
                data: Object.values(revenueByCompany),
                backgroundColor: ['#4361ee', '#10b981', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }));
    
    // Create expense breakdown chart
    const ctx2 = document.getElementById('reportChart2').getContext('2d');
    const expenses = transactions.filter(t => t.type === 'expense');
    const expenseCategories = {};
    expenses.forEach(e => {
        const cat = e.description.split(' ')[0];
        expenseCategories[cat] = (expenseCategories[cat] || 0) + Math.abs(e.amount);
    });
    
    reportCharts.push(new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.keys(expenseCategories),
            datasets: [{
                data: Object.values(expenseCategories),
                backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }));
}

function getReportPeriodText() {
    const period = document.getElementById('reportPeriod').value;
    switch(period) {
        case 'month':
            return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        case 'quarter':
            const quarter = Math.floor((new Date().getMonth() / 3)) + 1;
            return `Q${quarter} ${new Date().getFullYear()}`;
        case 'year':
            return new Date().getFullYear().toString();
        case 'custom':
            const start = document.getElementById('customStart').value;
            const end = document.getElementById('customEnd').value;
            return `${start} to ${end}`;
        default:
            return 'Current Period';
    }
}

function changeReportType() {
    generateReport();
}

function exportReport() {
    const reportType = document.getElementById('reportType').value;
    const reportContent = document.getElementById('reportContent').innerText;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function printReport() {
    window.print();
}
