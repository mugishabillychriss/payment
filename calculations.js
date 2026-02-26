// Financial Calculation Functions

class FinancialCalculator {
    constructor(transactions, companies) {
        this.transactions = transactions;
        this.companies = companies;
    }

    // Get total revenue
    getTotalRevenue() {
        return this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    // Get total expenses
    getTotalExpenses() {
        return this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }

    // Get net profit
    getNetProfit() {
        return this.getTotalRevenue() - this.getTotalExpenses();
    }

    // Get profit margin
    getProfitMargin() {
        const revenue = this.getTotalRevenue();
        if (revenue === 0) return 0;
        return ((this.getNetProfit() / revenue) * 100).toFixed(2);
    }

    // Get revenue by company
    getRevenueByCompany() {
        const revenueByCompany = {};
        
        this.companies.forEach(company => {
            revenueByCompany[company.name] = this.transactions
                .filter(t => t.company === company.name && t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
        });
        
        return revenueByCompany;
    }

    // Get daily revenue for the last 7 days
    getDailyRevenue(days = 7) {
        const dailyData = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dailyTotal = this.transactions
                .filter(t => t.date === dateStr && t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            dailyData.push({
                date: dateStr,
                revenue: dailyTotal
            });
        }
        
        return dailyData;
    }

    // Get transaction summary
    getTransactionSummary() {
        return {
            total: this.transactions.length,
            completed: this.transactions.filter(t => t.status === 'completed').length,
            pending: this.transactions.filter(t => t.status === 'pending').length,
            income: this.transactions.filter(t => t.type === 'income').length,
            expenses: this.transactions.filter(t => t.type === 'expense').length
        };
    }

    // Get payment method breakdown
    getPaymentMethodBreakdown() {
        const methods = {};
        
        this.transactions
            .filter(t => t.type === 'income')
            .forEach(t => {
                if (!methods[t.method]) {
                    methods[t.method] = 0;
                }
                methods[t.method] += t.amount;
            });
        
        return methods;
    }

    // Get company performance metrics
    getCompanyMetrics() {
        const metrics = [];
        
        this.companies.forEach(company => {
            const companyTransactions = this.transactions.filter(t => t.company === company.name);
            const revenue = companyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const expenses = companyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            metrics.push({
                company: company.name,
                revenue,
                expenses,
                profit: revenue - expenses,
                margin: revenue > 
