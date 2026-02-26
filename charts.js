// Chart Initialization and Updates

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const dailyRevenue = calculator.getDailyRevenue(7);
    
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: dailyRevenue.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('en-US', { weekday: 'short' });
            }),
            datasets: [{
                label: 'Daily Revenue',
                data: dailyRevenue.map(d => d.revenue),
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4361ee',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Revenue: $${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });

    // Company Revenue Chart
    const companyCtx = document.getElementById('companyChart').getContext('2d');
    const revenueByCompany = calculator.getRevenueByCompany();
    
    new Chart(companyCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(revenueByCompany),
            datasets: [{
                data: Object.values(revenueByCompany),
                backgroundColor: [
                    '#4361ee',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
                borderColor: 'white',
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Update charts with new data
function updateCharts(period) {
    // This function can be called when period selectors change
    console.log(`Updating charts for period: ${period}`);
    // Reinitialize charts with new data based on period
}
