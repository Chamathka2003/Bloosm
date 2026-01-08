// Common navigation and authentication utilities
function initAuth() {
    const userStr = localStorage.getItem('user');
    const authNav = document.getElementById('authNav');
    const heroAuthBtn = document.getElementById('heroAuthBtn');
    
    if (authNav) {
        if (userStr) {
            const user = JSON.parse(userStr);
            authNav.innerHTML = `
                <span style="color: white; margin-right: 10px;">Welcome, ${user.username}</span>
                ${user.role === 'ADMIN' ? '<a href="admin.html" style="margin-right: 10px;">Admin</a>' : ''}
                <a href="#" onclick="logout(); return false;">Logout</a>
            `;
            
            // Hide hero login button if user is logged in
            if (heroAuthBtn) {
                heroAuthBtn.style.display = 'none';
            }
        } else {
            authNav.innerHTML = '<a href="login.html">Login</a>';
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    // Keep customerId for guest shopping, or clear it
    // If you want guest to start fresh, uncomment next line:
    // localStorage.removeItem('customerId');
    window.location.href = 'index.html';
}

// Initialize auth on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
