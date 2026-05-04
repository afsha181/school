// Dashboard functionality
class DashboardManager {
    constructor() {
        this.userData = null;
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.updateDashboardStats();
    }
    
    checkAuthentication() {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        
        if (!loggedInUser) {
            // No user logged in, redirect to login page
            window.location.href = 'index.html';
            return;
        }
        
        this.userData = JSON.parse(loggedInUser);
    }
    
    loadUserData() {
        if (!this.userData) return;
        
        // Update user info in header
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole').querySelector('span');
        const welcomeMsgEl = document.getElementById('welcomeMsg');
        
        if (userNameEl) {
            userNameEl.textContent = this.userData.fullName;
        }
        
        if (userRoleEl) {
            userRoleEl.textContent = this.userData.role;
        }
        
        if (welcomeMsgEl) {
            const hour = new Date().getHours();
            let greeting = 'Good morning';
            if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
            if (hour >= 17) greeting = 'Good evening';
            
            welcomeMsgEl.innerHTML = `<i class="fas fa-school"></i> ${greeting}, ${this.userData.fullName}! Welcome to your dashboard.`;
        }
        
        // Update last login time
        const lastLoginSpan = document.getElementById('lastLoginTime');
        if (lastLoginSpan && this.userData.loginTime) {
            const loginDate = new Date(this.userData.loginTime);
            lastLoginSpan.textContent = loginDate.toLocaleString();
        }
    }
    
    updateDashboardStats() {
        // Simulate dynamic stats based on user role
        const coursesCount = document.getElementById('coursesCount');
        const assignmentsCount = document.getElementById('assignmentsCount');
        const attendanceCount = document.getElementById('attendanceCount');
        
        if (!this.userData) return;
        
        switch(this.userData.role) {
            case 'Student':
                coursesCount.textContent = '6';
                assignmentsCount.textContent = '3';
                attendanceCount.textContent = '94%';
                break;
            case 'Teacher':
                coursesCount.textContent = '4';
                assignmentsCount.textContent = '12';
                attendanceCount.textContent = '87%';
                break;
            case 'Administrator':
                coursesCount.textContent = '12';
                assignmentsCount.textContent = '5';
                attendanceCount.textContent = '98%';
                break;
            default:
                coursesCount.textContent = '5';
                assignmentsCount.textContent = '2';
                attendanceCount.textContent = '91%';
        }
    }
    
    handleLogout() {
        // Clear session storage
        sessionStorage.removeItem('loggedInUser');
        
        // Clear any remember me flag that might cause auto-login
        const rememberFlag = localStorage.getItem('school_remember_flag');
        if (rememberFlag === 'true') {
            // Keep remember me data but don't auto-login on next visit
            // User will need to click login again
        }
        
        // Redirect to login page
        window.location.href = 'index.html';
    }
    
    setupEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DashboardManager();
    });
} else {
    new DashboardManager();
}
