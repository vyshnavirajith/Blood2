// Blood Bank Management System - Main Application Logic & View Controller

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

const App = {
    currentView: 'dashboard-view',
    isDarkMode: false,
    deleteCallback: null,

    init() {
        this.bindEvents();
        this.renderAllViews();
        ChartManager.initAllCharts();
        this.updateStatsCounters();
        console.log('Blood Bank Admin System Initialized');
    },

    // Bind Navigation & UI Events
    bindEvents() {
        // Navigation clicks
        document.querySelectorAll('[data-view-target]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetView = item.getAttribute('data-view-target');
                this.switchView(targetView);
            });
        });

        // Dark mode toggle buttons
        document.querySelectorAll('.btn-dark-mode-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggleDarkMode());
        });

        // Mobile sidebar toggle
        const btnToggleSidebar = document.getElementById('btnToggleSidebar');
        if (btnToggleSidebar) {
            btnToggleSidebar.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('mobile-open');
            });
        }

        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Password visibility toggle
        const togglePasswordBtn = document.getElementById('togglePasswordBtn');
        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', () => {
                const passwordInput = document.getElementById('loginPassword');
                const icon = togglePasswordBtn.querySelector('i');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fa-solid fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fa-solid fa-eye';
                }
            });
        }

        // Logout
        document.querySelectorAll('.btn-logout').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        });

        // Filter events for Donors
        const donorSearch = document.getElementById('donorSearchInput');
        const donorBgFilter = document.getElementById('donorBgFilter');
        const donorCityFilter = document.getElementById('donorCityFilter');
        const donorGenderFilter = document.getElementById('donorGenderFilter');

        [donorSearch, donorBgFilter, donorCityFilter, donorGenderFilter].forEach(el => {
            if (el) el.addEventListener('input', () => this.renderDonorsTable());
        });

        // Filter events for Recipients
        const recipientSearch = document.getElementById('recipientSearchInput');
        const recipientBgFilter = document.getElementById('recipientBgFilter');
        if (recipientSearch) recipientSearch.addEventListener('input', () => this.renderRecipientsTable());
        if (recipientBgFilter) recipientBgFilter.addEventListener('change', () => this.renderRecipientsTable());

        // Filter events for Requests Tabs
        document.querySelectorAll('#requestStatusTabs button').forEach(tabBtn => {
            tabBtn.addEventListener('click', (e) => {
                document.querySelectorAll('#requestStatusTabs button').forEach(b => b.classList.remove('active', 'btn-primary'));
                document.querySelectorAll('#requestStatusTabs button').forEach(b => b.classList.add('btn-outline-secondary'));
                tabBtn.classList.remove('btn-outline-secondary');
                tabBtn.classList.add('active', 'btn-primary');
                const filter = tabBtn.getAttribute('data-filter');
                this.renderRequestsTable(filter);
            });
        });

        // Confirmation Modal Confirm Action
        const btnConfirmAction = document.getElementById('btnConfirmAction');
        if (btnConfirmAction) {
            btnConfirmAction.addEventListener('click', () => {
                if (typeof this.deleteCallback === 'function') {
                    this.deleteCallback();
                    this.deleteCallback = null;
                }
                const modalEl = document.getElementById('confirmModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            });
        }
    },

    // Switch active view
    switchView(viewId) {
        document.querySelectorAll('.view-section').forEach(view => {
            view.classList.remove('active-view');
        });

        const targetEl = document.getElementById(viewId);
        if (targetEl) {
            targetEl.classList.add('active-view');
            this.currentView = viewId;
        }

        // Update sidebar nav active highlight
        document.querySelectorAll('.nav-link-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view-target') === viewId) {
                item.classList.add('active');
            }
        });

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');

        // Refresh charts on view change
        setTimeout(() => {
            ChartManager.initAllCharts();
        }, 100);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Toggle Dark / Light Theme
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            document.querySelectorAll('.btn-dark-mode-toggle i').forEach(i => i.className = 'fa-solid fa-sun');
            this.showToast('Theme Updated', 'Switched to Healthcare Dark Mode', 'info');
        } else {
            document.body.classList.remove('dark-mode');
            document.querySelectorAll('.btn-dark-mode-toggle i').forEach(i => i.className = 'fa-solid fa-moon');
            this.showToast('Theme Updated', 'Switched to Clean Light Mode', 'info');
        }
        ChartManager.initAllCharts();
    },

    // Login Handler
    handleLogin() {
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');

        if (!usernameInput.value || !passwordInput.value) {
            this.showToast('Authentication Error', 'Please enter valid staff credentials', 'danger');
            return;
        }

        // Simulate successful login transition
        const loginBtn = document.getElementById('btnLoginSubmit');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Authenticating...';

        setTimeout(() => {
            document.getElementById('login-view').style.display = 'none';
            document.getElementById('app-wrapper').style.display = 'flex';
            this.switchView('dashboard-view');
            this.showToast('Welcome Back!', 'Logged in as Chief Blood Bank Manager', 'success');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket me-2"></i> Sign In to Dashboard';
        }, 800);
    },

    // Logout Handler
    handleLogout() {
        document.getElementById('app-wrapper').style.display = 'none';
        document.getElementById('login-view').style.display = 'flex';
        this.showToast('Logged Out', 'You have been safely logged out', 'info');
    },

    // Update Top Counters & Stats Cards
    updateStatsCounters() {
        const totalDonors = BloodBankData.donors.length;
        const totalUnits = BloodBankData.stock.reduce((sum, item) => sum + item.units, 0);
        const pendingReqs = BloodBankData.requests.filter(r => r.status === 'Pending').length;
        const approvedReqs = BloodBankData.requests.filter(r => r.status === 'Approved').length;
        const totalHospitals = BloodBankData.hospitals.length;

        // Render counts into DOM
        const elTotalDonors = document.getElementById('statTotalDonors');
        const elTotalUnits = document.getElementById('statTotalUnits');
        const elPendingReqs = document.getElementById('statPendingReqs');
        const elApprovedReqs = document.getElementById('statApprovedReqs');
        const elTotalHospitals = document.getElementById('statTotalHospitals');
        const elNavPendingBadge = document.getElementById('navPendingBadge');

        if (elTotalDonors) elTotalDonors.textContent = totalDonors;
        if (elTotalUnits) elTotalUnits.textContent = `${totalUnits} Units`;
        if (elPendingReqs) elPendingReqs.textContent = pendingReqs;
        if (elApprovedReqs) elApprovedReqs.textContent = approvedReqs;
        if (elTotalHospitals) elTotalHospitals.textContent = totalHospitals;
        if (elNavPendingBadge) elNavPendingBadge.textContent = pendingReqs;
    },

    // Render All Views
    renderAllViews() {
        this.renderStockCards();
        this.renderDonorsTable();
        this.renderRecipientsTable();
        this.renderRequestsTable('All');
        this.renderDonationsTable();
        this.renderHospitalsGrid();
        this.renderRecentActivities();
        this.renderLatestDashboardRequests();
    },

    async renderStockCards() {
    const container = document.getElementById('stockCardsContainer');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:5000/api/blood-stock');

        if (!response.ok) {
            throw new Error('Failed to fetch blood stock');
        }

        const stockData = await response.json();

        BloodBankData.stock = stockData.map(item => ({
            id:Number(item.stock_id),
            hospitalId: item.hospital_id,
            hospitalName: item.name,
            group: item.blood_group_code,
            units: Number(item.units_available),
            capacity: Number(item.target_capacity),
            lastUpdated: item.last_updated
        }));

        let html = '';

        BloodBankData.stock.forEach(item => {
            const isLow = item.units < 15;

            const percentage = item.capacity > 0
                ? Math.round((item.units / item.capacity) * 100)
                : 0;

            let statusBadge =
                `<span class="badge-soft badge-soft-success">Optimal</span>`;

            if (isLow) {
                statusBadge =
                    `<span class="badge-soft badge-soft-danger pulse-danger">
                        <i class="fa-solid fa-triangle-exclamation"></i> Low Stock
                    </span>`;
            } else if (item.units < 25) {
                statusBadge =
                    `<span class="badge-soft badge-soft-warning">Moderate</span>`;
            }

            let updatedTime = item.lastUpdated
                ? new Date(item.lastUpdated).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : '-';

            html += `
                <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <div class="stock-card ${isLow ? 'critical-stock' : ''}">

                        <div class="stock-header">
                            <span class="badge-blood-group fs-5">
                                ${item.group}
                            </span>
                            ${statusBadge}
                        </div>
                        <div class="text-muted small mt-2 mb-3">
                        <i class="fa-solid fa-hospital me-1"></i>
                        ${item.hospitalName || `Hospital ID: ${item.hospitalId}`}
                        </div>

                        <div class="d-flex align-items-baseline gap-2 mb-2">
                            <span class="stock-number">${item.units}</span>
                            <span class="stock-unit-label">
                                / ${item.capacity} Units Target
                            </span>
                        </div>

                        <div class="progress mb-3" style="height: 8px;">
                            <div
                                class="progress-bar ${isLow ? 'bg-danger' : 'bg-success'}"
                                role="progressbar"
                                style="width: ${Math.min(percentage, 100)}%"
                                aria-valuenow="${percentage}"
                                aria-valuemin="0"
                                aria-valuemax="100">
                            </div>
                        </div>

                        <div class="d-flex align-items-center justify-content-between text-muted fs-7 mb-3">
                            <span>
                                <i class="fa-regular fa-clock me-1"></i>
                                Updated: ${updatedTime}
                            </span>

                            <span>${percentage}% Capacity</span>
                        </div>

                        <div class="d-flex gap-2">

                            <button
                                class="btn btn-sm btn-outline-danger flex-fill"
                                onclick="App.adjustStock('${item.id}', 1)">
                                <i class="fa-solid fa-plus me-1"></i>
                                Add
                            </button>

                            <button
                                class="btn btn-sm btn-outline-secondary flex-fill"
                                onclick="App.adjustStock('${item.id}', -1)">
                                <i class="fa-solid fa-minus me-1"></i>
                                Deduct
                            </button>

                            <button
                                class="btn btn-sm btn-light"
                                onclick="App.openUpdateStockModal('${item.id}')"
                                title="Update Stock">
                                <i class="fa-solid fa-sliders"></i>
                            </button>

                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (error) {
        console.error('Error loading blood stock:', error);

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Failed to load blood stock from database.
                </div>
            </div>
        `;
    }
},



// Quick Adjust Stock
async adjustStock(stockId, delta) {
    stockId = Number(stockId);

    const item = BloodBankData.stock.find(
        s => Number(s.id) === stockId
    );

    if (!item) {
        console.log("Stock ID received:", stockId);
        console.log("Available stock records:", BloodBankData.stock);

        this.showToast(
            'Error',
            'Stock record not found.',
            'danger'
        );
        return;
    }

    const newUnits = Math.max(0, item.units + delta);

    try {
        const response = await fetch(
            `http://localhost:5000/api/blood-stock/${stockId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    units_available: newUnits,
                    target_capacity: item.capacity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Failed to update blood stock'
            );
        }

        await this.renderStockCards();

        this.updateStatsCounters();

        ChartManager.initDashboardBloodGroupChart();

        this.showToast(
            'Stock Updated',
            `Stock updated to ${newUnits} units.`,
            'success'
        );

    } catch (error) {
        console.error('Error updating blood stock:', error);

        this.showToast(
            'Update Failed',
            error.message,
            'danger'
        );
    }
},
openUpdateStockModal(stockId) {
    const item = BloodBankData.stock.find(
        s => Number(s.id) === Number(stockId)
    );

    if (!item) {
        this.showToast('Error', 'Stock record not found.', 'danger');
        return;
    }

    this.editingStockId = Number(item.id);

    document.getElementById('modalStockGroup').value = item.group;
    document.getElementById('modalStockUnits').value = item.units;
    document.getElementById('modalStockTarget').value = item.capacity;

    const modal = new bootstrap.Modal(
        document.getElementById('updateStockModal')
    );

    modal.show();
},
    
async saveStockModal() {
    const stockId = Number(this.editingStockId);
    const newUnits = Number(
        document.getElementById('modalStockUnits').value
    );
    const newTarget = Number(
        document.getElementById('modalStockTarget').value
    );

    if (
        !Number.isInteger(stockId) ||
        !Number.isInteger(newUnits) ||
        !Number.isInteger(newTarget) ||
        newUnits < 0 ||
        newTarget <= 0
    ) {
        this.showToast(
            'Invalid Values',
            'Enter valid non-negative units and a target greater than zero.',
            'danger'
        );
        return;
    }

    const item = BloodBankData.stock.find(
        s => Number(s.id) === stockId
    );

    if (!item) {
        this.showToast('Error', 'Stock record not found.', 'danger');
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/blood-stock/${stockId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    units_available: newUnits,
                    target_capacity: newTarget
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Failed to update blood stock'
            );
        }

        const modalEl = document.getElementById('updateStockModal');
        const modal = bootstrap.Modal.getInstance(modalEl);

        if (modal) {
            modal.hide();
        }

        await this.renderStockCards();
        this.updateStatsCounters();
        ChartManager.initDashboardBloodGroupChart();

        this.showToast(
            'Stock Updated',
            `Inventory for ${item.group} saved successfully!`,
            'success'
        );

    } catch (error) {
        console.error('Error saving blood stock:', error);

        this.showToast(
            'Update Failed',
            error.message,
            'danger'
        );
    }
},
    


    // 2. Render Donors Table
async renderDonorsTable() {
    const tbody = document.getElementById('donorsTableBody');
    if (!tbody) return;

    const search = (document.getElementById('donorSearchInput')?.value || '').toLowerCase();
    const bgFilter = document.getElementById('donorBgFilter')?.value || '';
    const cityFilter = document.getElementById('donorCityFilter')?.value || '';
    const genderFilter = document.getElementById('donorGenderFilter')?.value || '';

    try {
        const response = await fetch('http://localhost:5000/api/donors');

        if (!response.ok) {
            throw new Error('Failed to fetch donors');
        }

        const donors = await response.json();

        BloodBankData.donors = donors.map(d => ({
            id: String(d.donor_id),
            name: d.name,
            photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            age: d.age,
            gender: d.gender,
            bloodGroup: d.blood_group_code,
            phone: d.phone || '',
            email: d.email || '',
            address: d.address || '',
            city: d.address || '',
            lastDonationDate: d.last_donation_date || '',
            eligibility: d.eligibility_status || '',
            totalDonations: 0
        }));

        const filtered = BloodBankData.donors.filter(d => {
            const matchesSearch =
                d.name.toLowerCase().includes(search) ||
                d.id.toLowerCase().includes(search) ||
                d.phone.toLowerCase().includes(search);

            const matchesBg = !bgFilter || d.bloodGroup === bgFilter;
            const matchesCity = !cityFilter || d.city === cityFilter;
            const matchesGender = !genderFilter || d.gender === genderFilter;

            return matchesSearch && matchesBg && matchesCity && matchesGender;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No donors found matching criteria.</td></tr>`;
            return;
        }

        let html = '';

        filtered.forEach(d => {
            let statusBadge = '';

            if (d.eligibility === 'Eligible') {
                statusBadge = `<span class="badge-soft badge-soft-success"><i class="fa-solid fa-circle-check"></i> Eligible</span>`;
            } else if (d.eligibility === 'Resting') {
                statusBadge = `<span class="badge-soft badge-soft-warning"><i class="fa-solid fa-clock"></i> Resting</span>`;
            } else {
                statusBadge = `<span class="badge-soft badge-soft-danger"><i class="fa-solid fa-ban"></i> Ineligible</span>`;
            }

            html += `
                <tr>
                    <td><strong class="text-dark">${d.id}</strong></td>

                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <img src="${d.photo}" class="rounded-circle" width="36" height="36" alt="${d.name}">
                            <div>
                                <div class="fw-bold">${d.name}</div>
                                <div class="fs-7 text-muted">${d.email}</div>
                            </div>
                        </div>
                    </td>

                    <td>${d.age} / ${d.gender}</td>

                    <td>
                        <span class="badge-blood-group">${d.bloodGroup}</span>
                    </td>

                    <td>${d.phone}</td>

                    <td>${d.city}</td>

                    <td>${d.lastDonationDate}</td>

                    <td>${statusBadge}</td>

                    <td>
                        <div class="d-flex gap-1">

                            <button class="btn btn-sm btn-light"
                                onclick="App.viewDonorDetails('${d.id}')"
                                title="View Details">
                                <i class="fa-solid fa-eye text-primary"></i>
                            </button>

                            <button class="btn btn-sm btn-light"
                                onclick="App.openEditDonorModal('${d.id}')"
                                title="Edit">
                                <i class="fa-solid fa-pen-to-square text-secondary"></i>
                            </button>

                            <button class="btn btn-sm btn-light"
                                onclick="App.confirmDeleteDonor('${d.id}')"
                                title="Delete">
                                <i class="fa-solid fa-trash text-danger"></i>
                            </button>

                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (error) {
        console.error('Error loading donors:', error);

        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4 text-danger">
                    Failed to load donors from database.
                </td>
            </tr>
        `;
    }
},

openAddDonorModal() {
    document.getElementById('donorForm').reset();

    document.getElementById('donorModalTitle').textContent = 'Register New Donor';

    document.getElementById('donorEditId').value = '';

    const modal = new bootstrap.Modal(
        document.getElementById('donorModal')
    );

    modal.show();
},

async openEditDonorModal(id) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/donors/${id}`
        );

        if (!response.ok) {
            throw new Error('Donor not found');
        }

        const d = await response.json();

        document.getElementById('donorModalTitle').textContent =
            'Edit Donor Information';

        document.getElementById('donorEditId').value = d.donor_id;

        document.getElementById('donorNameInput').value =
            d.name || '';

        document.getElementById('donorAgeInput').value =
            d.age || '';

        document.getElementById('donorGenderInput').value =
            d.gender || '';

        document.getElementById('donorBgInput').value =
            d.blood_group_code || '';

        document.getElementById('donorPhoneInput').value =
            d.phone || '';

        document.getElementById('donorEmailInput').value =
            d.email || '';

        document.getElementById('donorCityInput').value =
            d.address || '';

        document.getElementById('donorStatusInput').value =
            d.eligibility_status || '';

        const modal = new bootstrap.Modal(
            document.getElementById('donorModal')
        );

        modal.show();

    } catch (error) {
        console.error(error);

        this.showToast(
            'Error',
            'Unable to load donor details',
            'danger'
        );
    }
},

async saveDonorForm() {

    const editId =
        document.getElementById('donorEditId').value;

    const name =
        document.getElementById('donorNameInput').value.trim();

    const age =
        parseInt(
            document.getElementById('donorAgeInput').value
        ) || 25;

    const gender =
        document.getElementById('donorGenderInput').value;

    const bloodGroup =
        document.getElementById('donorBgInput').value;

    const phone =
        document.getElementById('donorPhoneInput').value.trim();

    const email =
        document.getElementById('donorEmailInput').value.trim();

    const city =
        document.getElementById('donorCityInput').value.trim();

    const status =
        document.getElementById('donorStatusInput').value;

    if (!name || !phone) {
        this.showToast(
            'Validation Error',
            'Please complete all required fields',
            'warning'
        );

        return;
    }

    const donorData = {
        name: name,
        age: age,
        gender: gender,
        blood_group_code: bloodGroup,
        phone: phone,
        email: email,
        address: city,
        last_donation_date: new Date()
            .toISOString()
            .split('T')[0],
        eligibility_status: status
    };

    try {

        let response;

        if (editId) {

            response = await fetch(
                `http://localhost:5000/api/donors/${editId}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(donorData)
                }
            );

        } else {

            const donorId = Math.floor(
                1000 + Math.random() * 9000
            );

            donorData.donor_id = donorId;

            response = await fetch(
                'http://localhost:5000/api/donors',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(donorData)
                }
            );
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || result.message || 'Database operation failed'
            );
        }

        if (editId) {

            this.showToast(
                'Donor Updated',
                `Details for ${name} updated successfully`,
                'success'
            );

        } else {

            this.showToast(
                'Donor Registered',
                `New donor ${name} added successfully`,
                'success'
            );
        }

        await this.renderDonorsTable();

        this.updateStatsCounters();

        const modalEl =
            document.getElementById('donorModal');

        const modal =
            bootstrap.Modal.getInstance(modalEl);

        if (modal) {
            modal.hide();
        }

    } catch (error) {

        console.error(error);

        this.showToast(
            'Database Error',
            error.message,
            'danger'
        );
    }
},

async viewDonorDetails(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/donors/${id}`
        );

        if (!response.ok) {
            throw new Error('Donor not found');
        }

        const d = await response.json();

        const content = `
            <div class="text-center mb-4">

                <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    class="rounded-circle mb-2 border border-3 border-danger"
                    width="90"
                    height="90"
                    alt="${d.name}"
                >

                <h5 class="fw-bold mb-1">
                    ${d.name}
                </h5>

                <span class="badge-blood-group me-2">
                    ${d.blood_group_code}
                </span>

                <span class="badge-soft badge-soft-success">
                    ${d.eligibility_status}
                </span>

            </div>

            <div class="row g-3 fs-7">

                <div class="col-6">
                    <strong>Donor ID:</strong>
                    ${d.donor_id}
                </div>

                <div class="col-6">
                    <strong>Age/Gender:</strong>
                    ${d.age} yrs / ${d.gender}
                </div>

                <div class="col-6">
                    <strong>Phone:</strong>
                    ${d.phone || '-'}
                </div>

                <div class="col-6">
                    <strong>Email:</strong>
                    ${d.email || '-'}
                </div>

                <div class="col-6">
                    <strong>City:</strong>
                    ${d.address || '-'}
                </div>

                <div class="col-6">
                    <strong>Total Donations:</strong>
                    Available through Donation History
                </div>

                <div class="col-12">
                    <strong>Address:</strong>
                    ${d.address || '-'}
                </div>

                <div class="col-12">
                    <strong>Last Donation Date:</strong>
                    ${d.last_donation_date || '-'}
                </div>

            </div>
        `;

        document.getElementById(
            'donorDetailsModalContent'
        ).innerHTML = content;

        const modal = new bootstrap.Modal(
            document.getElementById('donorDetailsModal')
        );

        modal.show();

    } catch (error) {

        console.error(error);

        this.showToast(
            'Error',
            'Unable to load donor details',
            'danger'
        );
    }
},
    confirmDeleteDonor(id) {
    this.showConfirmModal(
        "Delete Donor",
        "Are you sure you want to delete this donor?",
        async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/donors/${id}`,
                    {
                        method: "DELETE"
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error || "Failed to delete donor"
                    );
                }

                this.showToast(
                    "Donor Deleted",
                    "Donor deleted successfully",
                    "success"
                );

                await this.renderDonorsTable();
                this.updateStatsCounters();

            } catch (error) {
                console.error("Delete donor error:", error);

                this.showToast(
                    "Delete Failed",
                    error.message,
                    "danger"
                );
            }
        }
    );

},



    // 3. Render Recipients Table
async renderRecipientsTable() {
    const tbody = document.getElementById('recipientsTableBody');
    if (!tbody) return;

    try {
        const response = await fetch('http://localhost:5000/api/recipients');

        if (!response.ok) {
            throw new Error('Failed to fetch recipients');
        }

        const data = await response.json();

        BloodBankData.recipients = data.map(r => ({
            id: String(r.recipient_id),
            name: r.name,
            age: r.age,
            gender: r.gender,
            bloodGroupNeeded: r.blood_group_needed,
            hospital: `Hospital ID: ${r.hospital_id}`,
            doctor: `Doctor ID: ${r.attending_doctor_id}`,
            dateRegistered: r.date_registered
        }));

        const search = (
            document.getElementById('recipientSearchInput')?.value || ''
        ).toLowerCase();

        const bgFilter =
            document.getElementById('recipientBgFilter')?.value || '';

        const filtered = BloodBankData.recipients.filter(r => {
            const matchesSearch =
                r.name.toLowerCase().includes(search) ||
                r.id.toLowerCase().includes(search) ||
                r.hospital.toLowerCase().includes(search);

            const matchesBg =
                !bgFilter || r.bloodGroupNeeded === bgFilter;

            return matchesSearch && matchesBg;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-4 text-muted">
                        No recipients found.
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';

        filtered.forEach(r => {
            html += `
                <tr>
                    <td><strong>${r.id}</strong></td>
                    <td class="fw-bold">${r.name}</td>
                    <td>${r.age} / ${r.gender}</td>
                    <td>
                        <span class="badge-blood-group">
                            ${r.bloodGroupNeeded}
                        </span>
                    </td>
                    <td>${r.hospital}</td>
                    <td>${r.doctor}</td>
                    <td>${r.dateRegistered || '-'}</td>
                    <td><span class="text-muted">Not recorded</span></td>
                    <td><span class="text-muted">Not recorded</span></td>
                    <td>
                        <div class="d-flex gap-1">
                            <button
                                class="btn btn-sm btn-light"
                                onclick="App.confirmDeleteRecipient('${r.id}')"
                                title="Delete">
                                <i class="fa-solid fa-trash text-danger"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (error) {
        console.error('Error loading recipients:', error);

        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-4 text-danger">
                    Failed to load recipients from database.
                </td>
            </tr>
        `;
    }
},

async openAddRecipientModal() {
    try {
        const response = await fetch(
            'http://localhost:5000/api/recipient-form-options'
        );

        if (!response.ok) {
            throw new Error('Failed to load hospitals and doctors');
        }

        const data = await response.json();

        const hospitalSelect = document.getElementById('rcpHospitalInput');
        const doctorSelect = document.getElementById('rcpDoctorInput');

        hospitalSelect.innerHTML =
            '<option value="">Select Hospital</option>';

        doctorSelect.innerHTML =
            '<option value="">Select Doctor</option>';

        data.hospitals.forEach(hospital => {
            hospitalSelect.add(new Option(
                hospital.name,
                hospital.hospital_id
            ));
        });

        data.doctors.forEach(doctor => {
            doctorSelect.add(new Option(
                doctor.name,
                doctor.staff_id
            ));
        });

        const modal = new bootstrap.Modal(
            document.getElementById('recipientModal')
        );

        modal.show();

    } catch (error) {
        console.error(error);

        this.showToast(
            'Error',
            'Could not load hospitals and doctors.',
            'danger'
        );
    }
}, 

    
async saveRecipientForm() {
    const name = document.getElementById('rcpNameInput').value.trim();
    const age = parseInt(document.getElementById('rcpAgeInput').value);
    const gender = document.getElementById('rcpGenderInput').value;
    const bloodGroup = document.getElementById('rcpBgInput').value;
    const hospital = document.getElementById('rcpHospitalInput').value;
    const doctor = document.getElementById('rcpDoctorInput').value;

    const units = parseInt(document.getElementById('rcpUnitsInput').value) || 1;
    const priority = document.getElementById('rcpPriorityInput').value;

    if (!name || !age || !gender || !bloodGroup || !hospital || !doctor) {
        this.showToast(
            'Validation Error',
            'Please fill in all required recipient details.',
            'warning'
        );
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/recipients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                age: age,
                gender: gender,
                blood_group_needed: bloodGroup,
                hospital_id: Number(hospital),
                attending_doctor_id: Number(doctor),
                date_registered: new Date().toISOString().split('T')[0]
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to register recipient');
        }

        await this.renderRecipientsTable();

        const modalEl = document.getElementById('recipientModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        this.showToast(
            'Recipient Registered',
            `${name} has been saved to the database.`,
            'success'
        );

    } catch (error) {
        console.error('Error registering recipient:', error);

        this.showToast(
            'Registration Failed',
            error.message || 'Could not save recipient to database.',
            'danger'
        );
    }
},


    confirmDeleteRecipient(id) {
    this.showConfirmModal(
        'Delete Recipient Record',
        `Are you sure you want to delete recipient ${id}?`,
        async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/recipients/${id}`,
                    {
                        method: 'DELETE'
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || 'Failed to delete recipient'
                    );
                }

                await this.renderRecipientsTable();

                this.showToast(
                    'Deleted',
                    'Recipient record removed from database',
                    'danger'
                );

            } catch (error) {
                console.error('Error deleting recipient:', error);

                this.showToast(
                    'Error',
                    error.message || 'Could not delete recipient',
                    'danger'
                );
            }
        }
    );
},

    // 4. Render Blood Requests Table
    renderRequestsTable(filterCategory) {
        const tbody = document.getElementById('requestsTableBody');
        if (!tbody) return;

        let filtered = BloodBankData.requests;
        if (filterCategory && filterCategory !== 'All') {
            if (filterCategory === 'Pending' || filterCategory === 'Approved' || filterCategory === 'Rejected') {
                filtered = BloodBankData.requests.filter(r => r.status === filterCategory);
            } else if (filterCategory === 'Emergency' || filterCategory === 'High Priority') {
                const priorityKey = filterCategory === 'Emergency' ? 'Emergency' : 'High';
                filtered = BloodBankData.requests.filter(r => r.priority === priorityKey);
            }
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No blood requests match filter.</td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach(r => {
            let priorityBadge = `<span class="badge-soft badge-soft-info">${r.priority}</span>`;
            if (r.priority === 'Emergency') {
                priorityBadge = `<span class="badge-soft badge-soft-danger pulse-danger"><i class="fa-solid fa-bolt"></i> Emergency</span>`;
            } else if (r.priority === 'High') {
                priorityBadge = `<span class="badge-soft badge-soft-warning">High</span>`;
            }

            let statusBadge = `<span class="badge-soft badge-soft-warning">Pending</span>`;
            if (r.status === 'Approved') statusBadge = `<span class="badge-soft badge-soft-success"><i class="fa-solid fa-check"></i> Approved</span>`;
            if (r.status === 'Rejected') statusBadge = `<span class="badge-soft badge-soft-danger"><i class="fa-solid fa-xmark"></i> Rejected</span>`;

            let actionBtns = '';
            if (r.status === 'Pending') {
                actionBtns = `
                    <button class="btn btn-sm btn-success text-white" onclick="App.approveRequest('${r.id}')" title="Approve & Allocate">
                        <i class="fa-solid fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="App.rejectRequest('${r.id}')" title="Reject">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;
            } else {
                actionBtns = `<span class="text-muted fs-7">Processed</span>`;
            }

            html += `
                <tr>
                    <td><strong>${r.id}</strong></td>
                    <td class="fw-bold">${r.recipient}</td>
                    <td>${r.hospital}</td>
                    <td><span class="badge-blood-group">${r.bloodGroup}</span></td>
                    <td><strong class="text-danger">${r.units} Units</strong></td>
                    <td>${priorityBadge}</td>
                    <td class="fs-7 text-muted">${r.date}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="d-flex gap-1 align-items-center">
                            ${actionBtns}
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    approveRequest(reqId) {
        const req = BloodBankData.requests.find(r => r.id === reqId);
        if (!req) return;

        // Check stock availability
        const stockItem = BloodBankData.stock.find(s => s.group === req.bloodGroup);
        if (stockItem && stockItem.units < req.units) {
            this.showToast('Stock Deficit Alert', `Insufficient units of ${req.bloodGroup}. Available: ${stockItem.units}, Required: ${req.units}`, 'danger');
            return;
        }

        // Deduct stock and approve
        if (stockItem) {
            stockItem.units -= req.units;
            stockItem.lastUpdated = new Date().toLocaleString();
        }

        req.status = 'Approved';
        this.renderRequestsTable('All');
        this.renderStockCards();
        this.updateStatsCounters();
        ChartManager.initDashboardBloodGroupChart();

        this.showToast('Request Approved', `Approved ${req.units} units of ${req.bloodGroup} for ${req.hospital}`, 'success');
    },

    rejectRequest(reqId) {
        const req = BloodBankData.requests.find(r => r.id === reqId);
        if (!req) return;

        req.status = 'Rejected';
        this.renderRequestsTable('All');
        this.updateStatsCounters();
        this.showToast('Request Rejected', `Blood Request ${reqId} set to Rejected`, 'warning');
    },

    // 5. Render Donation History View
    renderDonationsTable() {
        const tbody = document.getElementById('donationsTableBody');
        if (!tbody) return;

        let html = '';
        BloodBankData.donations.forEach(d => {
            html += `
                <tr>
                    <td><strong>${d.id}</strong></td>
                    <td class="fw-bold">${d.donorName}</td>
                    <td><span class="badge-blood-group">${d.bloodGroup}</span></td>
                    <td>${d.units} Unit</td>
                    <td>${d.date}</td>
                    <td>${d.camp}</td>
                    <td>${d.hospital}</td>
                    <td><span class="badge-soft badge-soft-success"><i class="fa-solid fa-circle-check"></i> ${d.status}</span></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // 6. Render Hospital Cards Grid
    renderHospitalsGrid() {
        const container = document.getElementById('hospitalsContainer');
        if (!container) return;

        let html = '';
        BloodBankData.hospitals.forEach(h => {
            html += `
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="card-custom h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <span class="badge-soft badge-soft-primary"><i class="fa-solid fa-hospital me-1"></i> ${h.status}</span>
                                <span class="fs-7 text-muted">Beds: ${h.availableBeds}/${h.totalBeds}</span>
                            </div>
                            <h5 class="fw-bold mb-2">${h.name}</h5>
                            <p class="fs-7 text-muted mb-3"><i class="fa-solid fa-location-dot me-1 text-danger"></i> ${h.address}</p>
                            
                            <div class="p-3 bg-light rounded-3 mb-3 fs-7">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Phone:</span>
                                    <strong>${h.phone}</strong>
                                </div>
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Emergency Support:</span>
                                    <strong class="text-danger">${h.emergencySupport}</strong>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Active Requests:</span>
                                    <span class="badge bg-danger">${h.activeRequests} Requests</span>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-danger flex-fill" onclick="App.showToast('Hospital Contact', 'Dialing ${h.phone}...', 'info')">
                                <i class="fa-solid fa-phone me-1"></i> Call
                            </button>
                            <button class="btn btn-sm btn-light" onclick="App.confirmDeleteHospital('${h.id}')" title="Delete">
                                <i class="fa-solid fa-trash text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    openAddHospitalModal() {
        const modal = new bootstrap.Modal(document.getElementById('hospitalModal'));
        modal.show();
    },

    saveHospitalForm() {
        const name = document.getElementById('hspNameInput').value;
        const address = document.getElementById('hspAddressInput').value;
        const phone = document.getElementById('hspPhoneInput').value;
        const beds = parseInt(document.getElementById('hspBedsInput').value) || 100;

        if (!name || !phone) {
            this.showToast('Validation Error', 'Hospital name and phone are required.', 'warning');
            return;
        }

        const newId = `HSP-${Math.floor(100 + Math.random() * 900)}`;
        BloodBankData.hospitals.unshift({
            id: newId,
            name: name,
            address: address || "City Medical District",
            phone: phone,
            email: "info@hospital.org",
            activeRequests: 0,
            availableBeds: Math.round(beds * 0.3),
            totalBeds: beds,
            status: "Active Partner",
            emergencySupport: "24/7 Trauma Care"
        });

        this.renderHospitalsGrid();
        this.updateStatsCounters();

        const modalEl = document.getElementById('hospitalModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        this.showToast('Hospital Added', `Registered partner hospital ${name}`, 'success');
    },

    confirmDeleteHospital(id) {
        this.showConfirmModal('Delete Hospital', `Are you sure you want to remove hospital ${id}?`, () => {
            BloodBankData.hospitals = BloodBankData.hospitals.filter(h => h.id !== id);
            this.renderHospitalsGrid();
            this.updateStatsCounters();
            this.showToast('Hospital Removed', `Partner record removed`, 'danger');
        });
    },

    // 7. Render Recent Activities List on Dashboard
    renderRecentActivities() {
        const container = document.getElementById('recentActivitiesContainer');
        if (!container) return;

        let html = '';
        BloodBankData.activities.forEach(act => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-dot ${act.color}">
                        <i class="${act.icon}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-title">${act.title}</div>
                        <div class="text-muted fs-7 mb-1">${act.desc}</div>
                        <div class="timeline-time">${act.time}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // 8. Render Latest Dashboard Requests Table
    renderLatestDashboardRequests() {
        const tbody = document.getElementById('dashboardRequestsTableBody');
        if (!tbody) return;

        let html = '';
        BloodBankData.requests.slice(0, 4).forEach(r => {
            let badge = `<span class="badge-soft badge-soft-warning">Pending</span>`;
            if (r.status === 'Approved') badge = `<span class="badge-soft badge-soft-success">Approved</span>`;

            html += `
                <tr>
                    <td><strong>${r.id}</strong></td>
                    <td>${r.recipient}</td>
                    <td><span class="badge-blood-group">${r.bloodGroup}</span></td>
                    <td>${r.units} Units</td>
                    <td>${r.hospital}</td>
                    <td>${badge}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // Reports Export Simulation Triggers
    triggerExport(format) {
        this.showToast('Export Initiated', `Generating ${format.toUpperCase()} report document...`, 'info');
        setTimeout(() => {
            this.showToast('Export Complete', `${format.toUpperCase()} report ready for download.`, 'success');
        }, 1200);
    },

    // Confirm Modal Utility
    showConfirmModal(title, text, onConfirm) {
        document.getElementById('confirmModalTitle').textContent = title;
        document.getElementById('confirmModalText').textContent = text;
        this.deleteCallback = onConfirm;
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    },

    // Toast Notification System
    showToast(title, message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastId = 'toast-' + Date.now();
        let borderClass = 'border-info';
        let iconClass = 'fa-solid fa-circle-info text-info';

        if (type === 'success') {
            borderClass = 'border-success';
            iconClass = 'fa-solid fa-circle-check text-success';
        } else if (type === 'danger') {
            borderClass = 'border-danger';
            iconClass = 'fa-solid fa-circle-exclamation text-danger';
        } else if (type === 'warning') {
            borderClass = 'border-warning';
            iconClass = 'fa-solid fa-triangle-exclamation text-warning';
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast-custom ${borderClass}`;
        toastEl.id = toastId;
        toastEl.innerHTML = `
            <i class="${iconClass} fs-4"></i>
            <div class="flex-fill">
                <div class="fw-bold fs-7">${title}</div>
                <div class="fs-7 text-muted">${message}</div>
            </div>
            <button type="button" class="btn-close ms-2" onclick="document.getElementById('${toastId}').remove()"></button>
        `;

        toastContainer.appendChild(toastEl);

        setTimeout(() => {
            if (document.getElementById(toastId)) {
                document.getElementById(toastId).remove();
            }
        }, 4000);
    }
};
