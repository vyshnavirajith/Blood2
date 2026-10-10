// Blood Bank Management System - Chart.js Initializations & Managers

const ChartManager = {
    instances: {},

    // Initialize all charts
    initAllCharts() {
        this.initDashboardBloodGroupChart();
        this.initReportsMonthlyChart();
        this.initReportsDistributionChart();
        this.initReportsUrgencyChart();
        this.initReportsHospitalChart();
        this.initDonationsTrendChart();
    },

    // 1. Main Dashboard Blood Group Inventory Bar Chart
    initDashboardBloodGroupChart() {
        const ctx = document.getElementById('dashboardBloodGroupChart');
        if (!ctx) return;

        if (this.instances.dashboardBloodGroup) {
            this.instances.dashboardBloodGroup.destroy();
        }

        const labels = BloodBankData.stock.map(s => s.group);
        const dataValues = BloodBankData.stock.map(s => s.units);
        const backgroundColors = BloodBankData.stock.map(s => s.units < 15 ? '#EF4444' : (s.units < 25 ? '#F59E0B' : '#C62828'));

        this.instances.dashboardBloodGroup = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Available Units',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 28
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Units Available: ${context.parsed.y} Units`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    // 2. Reports: Monthly Donations vs Requests Line Chart
    initReportsMonthlyChart() {
        const ctx = document.getElementById('reportsMonthlyChart');
        if (!ctx) return;

        if (this.instances.reportsMonthly) {
            this.instances.reportsMonthly.destroy();
        }

        this.instances.reportsMonthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Blood Donations',
                        data: [95, 110, 105, 140, 130, 124],
                        borderColor: '#C62828',
                        backgroundColor: 'rgba(198, 40, 40, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#C62828',
                        pointRadius: 5
                    },
                    {
                        label: 'Blood Requests',
                        data: [80, 95, 120, 115, 135, 142],
                        borderColor: '#06B6D4',
                        backgroundColor: 'rgba(6, 182, 212, 0.05)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#06B6D4',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    // 3. Reports: Blood Group Distribution Doughnut Chart
    initReportsDistributionChart() {
        const ctx = document.getElementById('reportsDistributionChart');
        if (!ctx) return;

        if (this.instances.reportsDistribution) {
            this.instances.reportsDistribution.destroy();
        }

        const labels = BloodBankData.stock.map(s => s.group);
        const dataValues = BloodBankData.stock.map(s => s.units);

        this.instances.reportsDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: [
                        '#C62828', '#E53935', '#EF5350', '#E57373',
                        '#06B6D4', '#0284C7', '#10B981', '#F59E0B'
                    ],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                },
                cutout: '68%'
            }
        });
    },

    // 4. Reports: Request Urgency Breakdown Bar Chart
    initReportsUrgencyChart() {
        const ctx = document.getElementById('reportsUrgencyChart');
        if (!ctx) return;

        if (this.instances.reportsUrgency) {
            this.instances.reportsUrgency.destroy();
        }

        this.instances.reportsUrgency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Emergency', 'High Priority', 'Normal / Elective'],
                datasets: [{
                    label: 'Number of Requests',
                    data: [42, 68, 32],
                    backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
                    borderRadius: 8,
                    barThickness: 36
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    // 5. Reports: Hospital Requests Horizontal Bar Chart
    initReportsHospitalChart() {
        const ctx = document.getElementById('reportsHospitalChart');
        if (!ctx) return;

        if (this.instances.reportsHospital) {
            this.instances.reportsHospital.destroy();
        }

        const hospitalNames = BloodBankData.hospitals.map(h => h.name.replace(' Hospital', ''));
        const requestCounts = [38, 26, 19, 14, 8];

        this.instances.reportsHospital = new Chart(ctx, {
            type: 'bar',
            indexAxis: 'y',
            data: {
                labels: hospitalNames,
                datasets: [{
                    label: 'Units Dispatched',
                    data: requestCounts,
                    backgroundColor: '#C62828',
                    borderRadius: 6,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    y: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    // 6. Donation History View Monthly Chart
    initDonationsTrendChart() {
        const ctx = document.getElementById('donationsTrendChart');
        if (!ctx) return;

        if (this.instances.donationsTrend) {
            this.instances.donationsTrend.destroy();
        }

        this.instances.donationsTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Units Collected',
                    data: [28, 34, 45, 31],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#10B981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }
};
