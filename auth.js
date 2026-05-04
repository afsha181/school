// User Database with roles
const USERS = [
    // Admin Users
    { username: "admin", password: "admin123", role: "admin", fullName: "James Wilson", email: "admin@school.com" },
    { username: "principal", password: "principal123", role: "admin", fullName: "Dr. Sarah Johnson", email: "principal@school.com" },
    
    // Teacher Users
    { username: "teacher", password: "teach123", role: "teacher", fullName: "Dr. Emily Chen", subject: "Mathematics", department: "Science" },
    { username: "ms.smith", password: "smith123", role: "teacher", fullName: "Ms. Jennifer Smith", subject: "Physics", department: "Science" },
    { username: "mr.davis", password: "davis123", role: "teacher", fullName: "Mr. Robert Davis", subject: "Chemistry", department: "Science" },
    
    // Student Users
    { username: "student", password: "student123", role: "student", fullName: "Alex Morgan", grade: "10", section: "A" },
    { username: "emma.watson", password: "emma123", role: "student", fullName: "Emma Watson", grade: "10", section: "A" },
    { username: "james.wilson", password: "james123", role: "student", fullName: "James Wilson", grade: "11", section: "B" }
];

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const adminDashboard = document.getElementById('adminDashboard');
const teacherDashboard = document.getElementById('teacherDashboard');
const studentDashboard = document.getElementById('studentDashboard');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberCheck = document.getElementById('rememberCheck');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('loginMessage');

// Helper: Show notification
window.showNotification = function(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

// Helper: Display message
function setMessage(text, isError = false) {
    if (!messageDiv) return;
    messageDiv.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-shield-alt'}"></i> ${text}`;
    messageDiv.classList.remove('error-message', 'success-message');
    messageDiv.classList.add(isError ? 'error-message' : 'success-message');
    if (!isError) setTimeout(() => {
        if (messageDiv && loginContainer.style.display !== 'none')
            setMessage("🏫 Please sign in using demo credentials below", false);
    }, 3000);
}

// Load remembered credentials
function loadRememberedCredentials() {
    const savedUser = localStorage.getItem('school_remember_user');
    const savedPass = localStorage.getItem('school_remember_pass');
    const savedCheck = localStorage.getItem('school_remember_flag');
    if (savedCheck === 'true' && savedUser && savedPass) {
        usernameInput.value = savedUser;
        passwordInput.value = savedPass;
        rememberCheck.checked = true;
    }
}

// Save credentials
function persistCredentials(username, password, remember) {
    if (remember) {
        localStorage.setItem('school_remember_user', username);
        localStorage.setItem('school_remember_pass', password);
        localStorage.setItem('school_remember_flag', 'true');
    } else {
        localStorage.removeItem('school_remember_user');
        localStorage.removeItem('school_remember_pass');
        localStorage.setItem('school_remember_flag', 'false');
    }
}

// Hide all dashboards
function hideAllDashboards() {
    adminDashboard.style.display = 'none';
    teacherDashboard.style.display = 'none';
    studentDashboard.style.display = 'none';
    loginContainer.style.display = 'block';
}

// Show Admin Dashboard
function showAdminDashboard(user) {
    document.getElementById('adminName').textContent = user.fullName;
    document.getElementById('adminWelcomeName').textContent = user.fullName.split(' ')[0];
    document.getElementById('totalStudents').textContent = '450';
    document.getElementById('totalTeachers').textContent = '32';
    document.getElementById('totalCourses').textContent = '48';
    document.getElementById('totalRevenue').textContent = '$185K';
    
    loginContainer.style.display = 'none';
    adminDashboard.style.display = 'block';
    sessionStorage.setItem('loggedInUser', JSON.stringify({ ...user, role: 'admin', loginTime: new Date().toISOString() }));
}

// Show Teacher Dashboard
function showTeacherDashboard(user) {
    document.getElementById('teacherName').textContent = user.fullName;
    document.getElementById('teacherWelcomeName').textContent = user.fullName.split(' ')[0];
    document.getElementById('totalStudentsTeacher').textContent = '85';
    document.getElementById('pendingAssignments').textContent = '6';
    document.getElementById('todayClasses').textContent = '3';
    
    loginContainer.style.display = 'none';
    teacherDashboard.style.display = 'block';
    sessionStorage.setItem('loggedInUser', JSON.stringify({ ...user, role: 'teacher', loginTime: new Date().toISOString() }));
}

// Show Student Dashboard
function showStudentDashboard(user) {
    document.getElementById('studentName').textContent = user.fullName;
    document.getElementById('studentWelcomeName').textContent = user.fullName.split(' ')[0];
    document.getElementById('enrolledCourses').textContent = '6';
    document.getElementById('pendingTasks').textContent = '3';
    document.getElementById('avgGrade').textContent = '86%';
    document.getElementById('attendanceRate').textContent = '92%';
    
    loginContainer.style.display = 'none';
    studentDashboard.style.display = 'block';
    sessionStorage.setItem('loggedInUser', JSON.stringify({ ...user, role: 'student', loginTime: new Date().toISOString() }));
}

// Handle successful login
function handleSuccessfulLogin(user) {
    persistCredentials(usernameInput.value.trim(), passwordInput.value, rememberCheck.checked);
    setMessage(`✅ Welcome ${user.fullName}! Redirecting to ${user.role} dashboard...`, false);
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Loading Dashboard...';
    
    setTimeout(() => {
        if (user.role === 'admin') showAdminDashboard(user);
        else if (user.role === 'teacher') showTeacherDashboard(user);
        else if (user.role === 'student') showStudentDashboard(user);
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span>Access Dashboard</span> <i class="fas fa-arrow-right"></i>';
    }, 800);
}

// Handle login attempt
function handleLogin(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (username === "") {
        setMessage("❌ Please enter your username.", true);
        usernameInput.focus();
        return;
    }
    if (password === "") {
        setMessage("❌ Password cannot be empty.", true);
        passwordInput.focus();
        return;
    }
    
    const matchedUser = USERS.find(user => user.username === username && user.password === password);
    
    if (matchedUser) {
        handleSuccessfulLogin(matchedUser);
    } else {
        setMessage("⚠️ Invalid username or password. Please check your credentials.", true);
        passwordInput.value = "";
        passwordInput.focus();
    }
}

// Logout function
window.logout = function() {
    sessionStorage.removeItem('loggedInUser');
    hideAllDashboards();
    if (loginForm) loginForm.reset();
    setMessage("🔐 You have been logged out. Sign in again.", false);
};

// Tab navigation functions
window.showAdminTab = function(tabName) {
    document.querySelectorAll('#adminDashboard .tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).style.display = 'block';
    document.querySelectorAll('#adminDashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

window.showTeacherTab = function(tabName) {
    document.querySelectorAll('#teacherDashboard .tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(`teacher${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).style.display = 'block';
    document.querySelectorAll('#teacherDashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

window.showStudentTab = function(tabName) {
    document.querySelectorAll('#studentDashboard .tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(`student${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).style.display = 'block';
    document.querySelectorAll('#studentDashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

// Check existing session
function checkExistingSession() {
    const loggedIn = sessionStorage.getItem('loggedInUser');
    if (loggedIn) {
        const user = JSON.parse(loggedIn);
        if (user.role === 'admin') showAdminDashboard(user);
        else if (user.role === 'teacher') showTeacherDashboard(user);
        else if (user.role === 'student') showStudentDashboard(user);
    }
}

// Forgot password handler
function handleForgotPassword(e) {
    e.preventDefault();
    setMessage("📧 Password reset link sent to your registered email. (Demo feature)", false);
}

// Initialize
function init() {
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    const forgotLink = document.getElementById('forgotPwdLink');
    if (forgotLink) forgotLink.addEventListener('click', handleForgotPassword);
    loadRememberedCredentials();
    checkExistingSession();
    if (loginContainer.style.display !== 'none') {
        setMessage("🏫 Please sign in using demo credentials below", false);
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
