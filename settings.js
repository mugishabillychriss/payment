// Settings Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

function loadSettings() {
    // Load saved settings from localStorage if available
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        applySettings(settings);
    }
}

function saveSettings() {
    const settings = {
        companyName: document.getElementById('companyName').value,
        businessType: document.getElementById('businessType').value,
        fiscalYear: document.getElementById('fiscalYear').value,
        baseCurrency: document.getElementById('baseCurrency').value,
        currencyFormat: document.getElementById('currencyFormat').value,
        decimalPlaces: document.getElementById('decimalPlaces').value,
        taxRate: document.getElementById('taxRate').value,
        taxMethod: document.getElementById('taxMethod').value,
        taxId: document.getElementById('taxId').value
    };
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Update global settings
    window.appSettings = settings;
    
    alert('Settings saved successfully!');
}

function applySettings(settings) {
    document.getElementById('companyName').value = settings.companyName || 'EnterprisePro Financial';
    document.getElementById('businessType').value = settings.businessType || 'LLC';
    document.getElementById('fiscalYear').value = settings.fiscalYear || '2024-01';
    document.getElementById('baseCurrency').value = settings.baseCurrency || 'USD';
    document.getElementById('currencyFormat').value = settings.currencyFormat || '$1,234.56';
    document.getElementById('decimalPlaces').value = settings.decimalPlaces || '2';
    document.getElementById('taxRate').value = settings.taxRate || '10';
    document.getElementById('taxMethod').value = settings.taxMethod || 'Inclusive';
    document.getElementById('taxId').value = settings.taxId || 'TAX-12345-USD';
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        const defaultSettings = {
            companyName: 'EnterprisePro Financial',
            businessType: 'LLC',
            fiscalYear: '2024-01',
            baseCurrency: 'USD',
            currencyFormat: '$1,234.56',
            decimalPlaces: '2',
            taxRate: '10',
            taxMethod: 'Inclusive',
            taxId: 'TAX-12345-USD'
        };
        
        applySettings(defaultSettings);
        localStorage.removeItem('appSettings');
    }
}

function backupData() {
    const allData = {
        companies: companies,
        transactions: transactions,
        invoices: invoices,
        settings: window.appSettings || {},
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Backup created successfully!');
}

function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const backupData = JSON.parse(event.target.result);
                
                // Restore data
                if (backupData.companies) {
                    companies.length = 0;
                    companies.push(...backupData.companies);
                }
                if (backupData.transactions) {
                    transactions.length = 0;
                    transactions.push(...backupData.transactions);
                }
                if (backupData.invoices) {
                    invoices.length = 0;
                    invoices.push(...backupData.invoices);
                }
                if (backupData.settings) {
                    applySettings(backupData.settings);
                }
                
                alert('Data restored successfully! Refresh the page to see changes.');
            } catch (error) {
                alert('Error restoring backup: Invalid file format');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function resetDemoData() {
    if (confirm('This will reset all data to the original demo data. Continue?')) {
        // Reload the page to reset data (since our data arrays are in the original files)
        localStorage.removeItem('appSettings');
        window.location.reload();
    }
}

function exportAllData(format) {
    const allData = {
        companies: companies,
        transactions: transactions,
        invoices: invoices,
        summary: calculateTotals(),
        timestamp: new Date().toISOString()
    };
    
    let content, filename, type;
    
    switch(format) {
        case 'csv':
            // Simple CSV conversion (you'd want a more robust implementation for production)
            content = Object.keys(allData).map(key => {
                return `${key}: ${JSON.stringify(allData[key])}`;
            }).join('\n');
            filename = `export-${new Date().toISOString().split('T')[0]}.csv`;
            type = 'text/csv';
            break;
            
        case 'json':
            content = JSON.stringify(allData, null, 2);
            filename = `export-${new Date().toISOString().split('T')[0]}.json`;
            type = 'application/json';
            break;
            
        case 'pdf':
            alert('PDF export would be implemented with a library like jsPDF');
            return;
    }
    
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Data exported as ${format.toUpperCase()} successfully!`);
}
