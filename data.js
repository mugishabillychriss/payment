// Comprehensive Financial Data for School Project

const companies = [
    {
        id: 1,
        name: "TechStart Solutions",
        industry: "Technology",
        founded: "2023-01-15",
        revenue: 157890,
        expenses: 98750,
        employees: 12,
        status: "active",
        color: "#4361ee"
    },
    {
        id: 2,
        name: "GreenEats Cafe",
        industry: "Food & Beverage",
        founded: "2023-03-20",
        revenue: 89230,
        expenses: 52340,
        employees: 8,
        status: "active",
        color: "#10b981"
    },
    {
        id: 3,
        name: "StudySmart Tutors",
        industry: "Education",
        founded: "2023-06-10",
        revenue: 45670,
        expenses: 18900,
        employees: 15,
        status: "active",
        color: "#f59e0b"
    }
];

const transactions = [
    // TechStart Solutions Transactions
    { id: "T001", date: "2024-03-01", company: "TechStart Solutions", description: "Software License Sale", amount: 5499.99, type: "income", method: "Credit Card", status: "completed" },
    { id: "T002", date: "2024-03-02", company: "TechStart Solutions", description: "Consulting Services", amount: 3500.00, type: "income", method: "Bank Transfer", status: "completed" },
    { id: "T003", date: "2024-03-03", company: "TechStart Solutions", description: "AWS Hosting Bill", amount: -899.50, type: "expense", method: "Credit Card", status: "completed" },
    { id: "T004", date: "2024-03-04", company: "TechStart Solutions", description: "Office Rent", amount: -2500.00, type: "expense", method: "Bank Transfer", status: "completed" },
    { id: "T005", date: "2024-03-05", company: "TechStart Solutions", description: "Hardware Sale", amount: 2345.67, type: "income", method: "PayPal", status: "completed" },
    { id: "T006", date: "2024-03-06", company: "TechStart Solutions", description: "Employee Salaries", amount: -8500.00, type: "expense", method: "Bank Transfer", status: "completed" },
    { id: "T007", date: "2024-03-07", company: "TechStart Solutions", description: "Software Subscription", amount: -299.99, type: "expense", method: "Credit Card", status: "completed" },
    
    // GreenEats Cafe Transactions
    { id: "T008", date: "2024-03-01", company: "GreenEats Cafe", description: "Daily Sales", amount: 1250.50, type: "income", method: "Cash", status: "completed" },
    { id: "T009", date: "2024-03-02", company: "GreenEats Cafe", description: "Daily Sales", amount: 1432.75, type: "income", method: "Credit Card", status: "completed" },
    { id: "T010", date: "2024-03-02", company: "GreenEats Cafe", description: "Inventory Purchase", amount: -890.00, type: "expense", method: "Credit Card", status: "completed" },
    { id: "T011", date: "2024-03-03", company: "GreenEats Cafe", description: "Daily Sales", amount: 1120.25, type: "income", method: "Mixed", status: "completed" },
    { id: "T012", date: "2024-03-04", company: "GreenEats Cafe", description: "Equipment Maintenance", amount: -350.00, type: "expense", method: "Cash", status: "completed" },
    { id: "T013", date: "2024-03-05", company: "GreenEats Cafe", description: "Catering Service", amount: 2750.00, type: "income", method: "Bank Transfer", status: "completed" },
    
    // StudySmart Tutors Transactions
    { id: "T014", date: "2024-03-01", company: "StudySmart Tutors", description: "Math Tutoring Package", amount: 1200.00, type: "income", method: "Credit Card", status: "completed" },
    { id: "T015", date: "2024-03-02", company: "StudySmart Tutors", description: "Science Tutoring", amount: 450.00, type: "income", method: "PayPal", status: "completed" },
    { id: "T016", date: "2024-03-03", company: "StudySmart Tutors", description: "Marketing Expense", amount: -200.00, type: "expense", method: "Credit Card", status: "completed" },
    { id: "T017", date: "2024-03-04", company: "StudySmart Tutors", description: "Tutor Payments", amount: -1800.00, type: "expense", method: "Bank Transfer", status: "pending" },
    { id: "T018", date: "2024-03-05", company: "StudySmart Tutors", description: "Study Guide Sales", amount: 675.50, type: "income", method: "Credit Card", status: "completed" },
    
    // More transactions for completeness
    { id: "T019", date: "2024-03-06", company: "TechStart Solutions", description: "Mobile App Development", amount: 8000.00, type: "income", method: "Bank Transfer", status: "completed" },
    { id: "T020", date: "2024-03-07", company: "GreenEats Cafe", description: "Weekly Sales", amount: 3450.25, type: "income", method: "Mixed", status: "completed" },
    { id: "T021", date: "2024-03-08", company: "StudySmart Tutors", description: "SAT Prep Course", amount: 3200.00, type: "income", method: "Credit Card", status: "completed" },
    { id: "T022", date: "2024-03-08", company: "TechStart Solutions", description: "Office Supplies", amount: -145.30, type: "expense", method: "Credit Card", status: "completed" },
    { id: "T023", date: "2024-03-09", company: "GreenEats Cafe", description: "Utility Bill", amount: -420.00, type: "expense", method: "Bank Transfer", status: "completed" },
    { id: "T024", date: "2024-03-10", company: "StudySmart Tutors", description: "Online Advertising", amount: -150.00, type: "expense", method: "Credit Card", status: "completed" }
];

const invoices = [
    { id: "INV-001", company: "TechStart Solutions", client: "ABC Corp", issueDate: "2024-03-01", dueDate: "2024-03-15", amount: 5499.99, status: "paid" },
    { id: "INV-002", company: "TechStart Solutions", client: "XYZ Ltd", issueDate: "2024-03-02", dueDate: "2024-03-16", amount: 3500.00, status: "paid" },
    { id: "INV-003", company: "GreenEats Cafe", client: "City Events", issueDate: "2024-03-03", dueDate: "2024-03-17", amount: 2750.00, status: "pending" },
    { id: "INV-004", company: "StudySmart Tutors", client: "Parent Association", issueDate: "2024-03-04", dueDate: "2024-03-18", amount: 1200.00, status: "paid" },
    { id: "INV-005", company: "StudySmart Tutors", client: "School District", issueDate: "2024-03-05", dueDate: "2024-03-19", amount: 3200.00, status: "overdue" },
    { id: "INV-006", company: "TechStart Solutions", client: "Startup Inc", issueDate: "2024-03-06", dueDate: "2024-03-20", amount: 8000.00, status: "pending" },
    { id: "INV-007", company: "GreenEats Cafe", client: "Wedding Planning", issueDate: "2024-03-07", dueDate: "2024-03-21", amount: 1850.00, status: "paid" },
    { id: "INV-008", company: "TechStart Solutions", client: "Tech Giants", issueDate: "2024-03-08", dueDate: "2024-03-22", amount: 12500.00, status: "draft" }
];

const expenses = [
    { id: "E001", company: "TechStart Solutions", category: "Rent", amount: 2500, date: "2024-03-01", recurring: true },
    { id: "E002", company: "TechStart Solutions", category: "Salaries", amount: 8500, date: "2024-03-05", recurring: true },
    { id: "E003", company: "GreenEats Cafe", category: "Inventory", amount: 890, date: "2024-03-02", recurring: false },
    { id: "E004", company: "StudySmart Tutors", category: "Marketing", amount: 200, date: "2024-03-03", recurring: false }
];

// Helper function to calculate totals
function calculateTotals() {
    let totalRevenue = 0;
    let totalExpenses = 0;
    
    transactions.forEach(t => {
        if (t.type === 'income') {
            totalRevenue += t.amount;
        } else {
            totalExpenses += Math.abs(t.amount);
        }
    });
    
    return {
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: totalRevenue - totalExpenses
    };
}
