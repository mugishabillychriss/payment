// Invoices Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    loadInvoices();
    updateInvoiceStats();
});

function loadInvoices() {
    const tbody = document.getElementById('invoicesTableBody');
    
    tbody.innerHTML = invoices.map(inv => `
        <tr onclick="showInvoicePreview('${inv.id}')">
            <td><strong>${inv.id}</strong></td>
            <td>${inv.company}</td>
            <td>${inv.client}</td>
            <td>${formatDate(inv.issueDate)}</td>
            <td>${formatDate(inv.dueDate)}</td>
            <td>${formatCurrency(inv.amount)}</td>
            <td><span class="status-badge ${inv.status}">${inv.status}</span></td>
            <td>
                <div class="table-actions" onclick="event.stopPropagation()">
                    <button onclick="editInvoice('${inv.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" onclick="deleteInvoice('${inv.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateInvoiceStats() {
    document.getElementById('paidCount').textContent = invoices.filter(i => i.status === 'paid').length;
    document.getElementById('pendingCount').textContent = invoices.filter(i => i.status === 'pending').length;
    document.getElementById('overdueCount').textContent = invoices.filter(i => i.status === 'overdue').length;
    document.getElementById('draftCount').textContent = invoices.filter(i => i.status === 'draft').length;
}

function applyInvoiceFilters() {
    const status = document.getElementById('invoiceStatus').value;
    const company = document.getElementById('invoiceCompany').value;
    const search = document.getElementById('invoiceSearch').value.toLowerCase();
    
    const filtered = invoices.filter(inv => {
        if (status !== 'all' && inv.status !== status) return false;
        if (company !== 'all' && inv.company !== company) return false;
        if (search && !inv.id.toLowerCase().includes(search) && !inv.client.toLowerCase().includes(search)) return false;
        return true;
    });
    
    const tbody = document.getElementById('invoicesTableBody');
    tbody.innerHTML = filtered.map(inv => `
        <tr onclick="showInvoicePreview('${inv.id}')">
            <td><strong>${inv.id}</strong></td>
            <td>${inv.company}</td>
            <td>${inv.client}</td>
            <td>${formatDate(inv.issueDate)}</td>
            <td>${formatDate(inv.dueDate)}</td>
            <td>${formatCurrency(inv.amount)}</td>
            <td><span class="status-badge ${inv.status}">${inv.status}</span></td>
            <td>
                <div class="table-actions" onclick="event.stopPropagation()">
                    <button onclick="editInvoice('${inv.id}')"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteInvoice('${inv.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showCreateInvoiceModal() {
    document.getElementById('createInvoiceModal').classList.add('active');
    document.getElementById('invoiceIssueDate').valueAsDate = new Date();
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('invoiceDueDate').valueAsDate = dueDate;
}

function closeInvoiceModal() {
    document.getElementById('createInvoiceModal').classList.remove('active');
    document.getElementById('createInvoiceForm').reset();
    document.getElementById('lineItems').innerHTML = `
        <div class="form-row line-item">
            <div class="form-group" style="flex: 2;">
                <label>Description</label>
                <input type="text" class="itemDesc" placeholder="Item description">
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Quantity</label>
                <input type="number" class="itemQty" value="1" min="1">
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Unit Price</label>
                <input type="number" class="itemPrice" value="0.00" step="0.01">
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Total</label>
                <input type="text" class="itemTotal" readonly>
            </div>
            <button type="button" class="btn-secondary" style="align-self: flex-end;" onclick="removeLineItem(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function addLineItem() {
    const lineItems = document.getElementById('lineItems');
    const newItem = document.createElement('div');
    newItem.className = 'form-row line-item';
    newItem.innerHTML = `
        <div class="form-group" style="flex: 2;">
            <label>Description</label>
            <input type="text" class="itemDesc" placeholder="Item description">
        </div>
        <div class="form-group" style="flex: 1;">
            <label>Quantity</label>
            <input type="number" class="itemQty" value="1" min="1">
        </div>
        <div class="form-group" style="flex: 1;">
            <label>Unit Price</label>
            <input type="number" class="itemPrice" value="0.00" step="0.01">
        </div>
        <div class="form-group" style="flex: 1;">
            <label>Total</label>
            <input type="text" class="itemTotal" readonly>
        </div>
        <button type="button" class="btn-secondary" style="align-self: flex-end;" onclick="removeLineItem(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    lineItems.appendChild(newItem);
    
    // Add event listeners to new inputs
    const qty = newItem.querySelector('.itemQty');
    const price = newItem.querySelector('.itemPrice');
    const total = newItem.querySelector('.itemTotal');
    
    qty.addEventListener('input', () => updateLineItemTotal(qty, price, total));
    price.addEventListener('input', () => updateLineItemTotal(qty, price, total));
}

function removeLineItem(button) {
    const lineItems = document.getElementById('lineItems');
    if (lineItems.children.length > 1) {
        button.closest('.line-item').remove();
        calculateInvoiceTotals();
    } else {
        alert('At least one line item is required');
    }
}

function updateLineItemTotal(qty, price, total) {
    const qtyVal = parseFloat(qty.value) || 0;
    const priceVal = parseFloat(price.value) || 0;
    total.value = formatCurrency(qtyVal * priceVal);
    calculateInvoiceTotals();
}

function calculateInvoiceTotals() {
    const items = document.querySelectorAll('.line-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const qty = parseFloat(item.querySelector('.itemQty').value) || 0;
        const price = parseFloat(item.querySelector('.itemPrice').value) || 0;
        subtotal += qty * price;
    });
    
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    document.getElementById('invoiceSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('invoiceTax').textContent = formatCurrency(tax);
    document.getElementById('invoiceTotal').textContent = formatCurrency(total);
}

function createInvoice() {
    const company = document.getElementById('invoiceCompanySelect').value;
    const client = document.getElementById('invoiceClient').value;
    
    if (!company || !client) {
        alert('Please fill in company and client information');
        return;
    }
    
    const items = document.querySelectorAll('.line-item');
    if (items.length === 0) {
        alert('Please add at least one line item');
        return;
    }
    
    // Calculate total
    let total = 0;
    items.forEach(item => {
        const qty = parseFloat(item.querySelector('.itemQty').value) || 0;
        const price = parseFloat(item.querySelector('.itemPrice').value) || 0;
        total += qty * price;
    });
    total = total * 1.10; // Add tax
    
    const newInvoice = {
        id: 'INV-' + String(invoices.length + 1).padStart(3, '0'),
        company: company,
        client: client,
        issueDate: document.getElementById('invoiceIssueDate').value,
        dueDate: document.getElementById('invoiceDueDate').value,
        amount: total,
        status: 'pending'
    };
    
    invoices.push(newInvoice);
    loadInvoices();
    updateInvoiceStats();
    closeInvoiceModal();
    
    alert(`Invoice ${newInvoice.id} created successfully!`);
}

function showInvoicePreview(id) {
    const invoice = invoices.find(i => i.id === id);
    const modal = document.getElementById('invoicePreviewModal');
    const body = document.getElementById('invoicePreviewBody');
    
    const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status === 'pending';
    const statusClass = isOverdue ? 'overdue' : invoice.status;
    
    body.innerHTML = `
        <div style="padding: 20px; border: 1px solid var(--border); border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div>
                    <h2 style="color: var(--primary);">${invoice.company}</h2>
                    <p>123 Business St.<br>City, State 12345</p>
                </div>
                <div style="text-align: right;">
                    <h1 style="color: var(--dark);">INVOICE</h1>
                    <p><strong>Invoice #:</strong> ${invoice.id}</p>
                    <p><strong>Date:</strong> ${formatDate(invoice.issueDate)}</p>
                    <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3>Bill To:</h3>
                <p>${invoice.client}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; text-align: left;">Description</th>
                        <th style="padding: 10px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px;">Services rendered</td>
                        <td style="padding: 10px; text-align: right;">${formatCurrency(invoice.amount / 1.1)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">Tax (10%)</td>
                        <td style="padding: 10px; text-align: right;">${formatCurrency(invoice.amount - (invoice.amount / 1.1))}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="border-top: 2px solid var(--border);">
                        <td style="padding: 10px; font-weight: bold;">Total</td>
                        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">
                            ${formatCurrency(invoice.amount)}
                        </td>
                    </tr>
                </tfoot>
            </table>
            
            <div style="text-align: center; padding: 20px; background: var(--light); border-radius: 8px;">
                <span class="status-badge ${statusClass}" style="font-size: 16px; padding: 8px 20px;">
                    ${statusClass.toUpperCase()}
                </span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    window.currentInvoiceId = id;
}

function closePreviewModal() {
    document.getElementById('invoicePreviewModal').classList.remove('active');
}

function deleteInvoice(id) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        const index = invoices.findIndex(i => i.id === id);
        if (index !== -1) {
            invoices.splice(index, 1);
            loadInvoices();
            updateInvoiceStats();
            closePreviewModal();
            alert('Invoice deleted successfully!');
        }
    }
}

function markInvoiceAsPaid() {
    if (window.currentInvoiceId) {
        const invoice = invoices.find(i => i.id === window.currentInvoiceId);
        if (invoice) {
            invoice.status = 'paid';
            loadInvoices();
            updateInvoiceStats();
            closePreviewModal();
            
            // Create a transaction from this invoice
            const transaction = {
                id: 'T' + String(transactions.length + 1).padStart(3, '0'),
                date: new Date().toISOString().split('T')[0],
                company: invoice.company,
                description: `Payment for Invoice ${invoice.id} - ${invoice.client}`,
                amount: invoice.amount,
                type: 'income',
                method: 'Bank Transfer',
                status: 'completed'
            };
            transactions.push(transaction);
            
            alert(`Invoice marked as paid and transaction recorded!`);
        }
    }
}

function exportInvoices() {
    const dataStr = JSON.stringify(invoices, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadInvoicePDF() {
    alert('PDF download would be implemented here with a library like jsPDF');
    // In a real implementation, you would use a library like jsPDF
}
